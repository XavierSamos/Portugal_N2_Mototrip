// Service worker: la app funciona sin conexión tras abrirla una vez con internet.
// - Archivos propios: "stale-while-revalidate" (carga rápida y se actualiza en segundo plano).
// - CDN (Tailwind, Leaflet): caché primero.
// - Teselas del mapa: caché primero, con límite de tamaño.
// Sube VERSION al desplegar cambios para forzar la renovación de la caché.

const VERSION = 'v1';
const APP_CACHE = `n2-app-${VERSION}`;
const CDN_CACHE = `n2-cdn-${VERSION}`;
const TILE_CACHE = 'n2-tiles-v1';
const MAX_TILES = 2500;

const APP_SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'icons/icon-192.png', 'icons/icon-512.png',
  'js/data/stages.js', 'js/data/stamps.js', 'js/data/sights.js', 'js/data/campings.js', 'js/data/passes.js',
  'js/sun.js', 'js/core.js', 'js/map.js', 'js/itinerary.js', 'js/passport.js', 'js/sights.js',
  'js/campings.js', 'js/passes.js', 'js/budget.js', 'js/packing.js', 'js/today.js', 'js/offline.js', 'js/main.js'
];
const CDN_URLS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const app = await caches.open(APP_CACHE);
    await Promise.allSettled(APP_SHELL.map(u => app.add(u)));
    const cdn = await caches.open(CDN_CACHE);
    await Promise.allSettled(CDN_URLS.map(async u => {
      const res = await fetchCors(u);
      if (res && (res.ok || res.type === 'opaque')) await cdn.put(u, res);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [APP_CACHE, CDN_CACHE, TILE_CACHE];
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('n2-') && !keep.includes(n)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

// Pide con CORS (respuesta legible y sin el recargo de cuota de las opacas); si falla, vuelve a la petición normal
async function fetchCors(url, original) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) return res;
  } catch (e) { /* sigue */ }
  try { return await fetch(original || url); } catch (e) { return null; }
}

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map(k => cache.delete(k)));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Teselas del mapa
  if (url.hostname === 'server.arcgisonline.com') {
    event.respondWith((async () => {
      const cache = await caches.open(TILE_CACHE);
      const hit = await cache.match(req.url);
      if (hit) return hit;
      const res = await fetchCors(req.url, req);
      if (res && res.ok) {
        cache.put(req.url, res.clone());
        trimCache(TILE_CACHE, MAX_TILES);
        return res;
      }
      return res || Response.error();
    })());
    return;
  }

  // CDN
  if (CDN_URLS.some(c => req.url.startsWith(c)) || url.hostname === 'unpkg.com' || url.hostname === 'cdn.tailwindcss.com') {
    event.respondWith((async () => {
      const cache = await caches.open(CDN_CACHE);
      const hit = await cache.match(req.url);
      if (hit) return hit;
      const res = await fetchCors(req.url, req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req.url, res.clone());
      return res || Response.error();
    })());
    return;
  }

  // Archivos propios
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      const isNav = req.mode === 'navigate';
      const hit = await cache.match(req, { ignoreSearch: true }) || (isNav ? await cache.match('index.html') : undefined);
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      if (hit) { event.waitUntil(network); return hit; }
      return (await network) || (isNav ? await cache.match('index.html') : Response.error());
    })());
  }
  // El resto (API de previsión, etc.) va directo a la red
});
