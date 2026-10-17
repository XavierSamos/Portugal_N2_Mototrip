// Modo sin conexión: service worker, instalación como app, indicador de red y descarga de teselas del mapa.
// En file:// no hay service worker (el navegador no lo permite): la app sigue funcionando con conexión.

let deferredInstallPrompt = null;

function initOffline() {
  updateOnlineBadge();
  window.addEventListener('online', () => { updateOnlineBadge(); if (typeof renderToday === 'function') renderToday(); });
  window.addEventListener('offline', updateOnlineBadge);

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('btn-install');
    if (btn) btn.classList.remove('hidden');
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('btn-install');
    if (btn) btn.classList.add('hidden');
  });

  renderOfflineBox();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      setOfflineStatus('Modo sin conexión activado: la app se guarda al abrirla con internet.', 'ok');
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (nw) nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) setOfflineStatus('Hay una versión nueva: recarga la página para usarla.', 'warn');
        });
      });
    }).catch(() => setOfflineStatus('No se pudo activar el modo sin conexión en este navegador.', 'warn'));
  } else {
    setOfflineStatus('El modo sin conexión solo funciona desde la web publicada (https), no abriendo el archivo directamente.', 'warn');
  }
}

function updateOnlineBadge() {
  const b = document.getElementById('offline-badge');
  if (b) b.classList.toggle('hidden', navigator.onLine);
}

function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; });
}

function setOfflineStatus(text, kind) {
  const el = document.getElementById('offline-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'text-xs ' + (kind === 'ok' ? 't-green' : kind === 'warn' ? 't-amber' : 't-muted');
}

function renderOfflineBox() {
  const box = document.getElementById('offline-box');
  if (!box) return;
  box.innerHTML = `
    <div class="flex flex-wrap items-center gap-2">
      <button class="btn" id="btn-save-tiles" onclick="saveMapOffline()">💾 Guardar mapa para usar sin conexión</button>
      <span id="offline-status" class="text-xs t-muted"></span>
    </div>
    <div id="offline-progress" class="progress hidden mt-2"><div style="width:0%"></div></div>`;
}

// ---- Descarga de teselas (zoom 6–10: zona completa a baja resolución y corredor de la ruta a mayor detalle) ----
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';

function lngToTileX(lng, z) { return Math.floor((lng + 180) / 360 * Math.pow(2, z)); }
function latToTileY(lat, z) {
  const r = lat * Math.PI / 180;
  return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z));
}

function tileListForRoute() {
  const set = new Set();
  const add = (z, x, y) => set.add(`${z}/${y}/${x}`);
  const pts = [];
  stagesData.forEach(s => s.waypoints.forEach(w => pts.push([w.lat, w.lng])));
  // interpolar entre waypoints para no dejar huecos en el corredor
  const dense = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.1));
    for (let k = 0; k <= steps; k++) dense.push([a[0] + (b[0] - a[0]) * k / steps, a[1] + (b[1] - a[1]) * k / steps]);
  }
  // zoom bajos: caja completa
  const lats = pts.map(p => p[0]), lngs = pts.map(p => p[1]);
  const box = { n: Math.max(...lats) + 0.3, s: Math.min(...lats) - 0.3, w: Math.min(...lngs) - 0.3, e: Math.max(...lngs) + 0.3 };
  for (let z = 6; z <= 8; z++) {
    for (let x = lngToTileX(box.w, z); x <= lngToTileX(box.e, z); x++)
      for (let y = latToTileY(box.n, z); y <= latToTileY(box.s, z); y++) add(z, x, y);
  }
  // zoom 9–10: corredor de ±1 tesela alrededor de la ruta
  for (let z = 9; z <= 10; z++) {
    dense.forEach(([lat, lng]) => {
      const cx = lngToTileX(lng, z), cy = latToTileY(lat, z);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) add(z, cx + dx, cy + dy);
    });
  }
  return Array.from(set).map(k => {
    const [z, y, x] = k.split('/');
    return TILE_URL.replace('{z}', z).replace('{y}', y).replace('{x}', x);
  });
}

async function saveMapOffline() {
  if (!('caches' in window)) { setOfflineStatus('Este navegador no permite guardar el mapa.', 'warn'); return; }
  if (!navigator.onLine) { setOfflineStatus('Necesitas conexión para descargar el mapa.', 'warn'); return; }
  const btn = document.getElementById('btn-save-tiles');
  const prog = document.getElementById('offline-progress');
  const bar = prog ? prog.firstElementChild : null;
  const urls = tileListForRoute();
  if (!confirm(`Se descargarán ~${urls.length} teselas del mapa (unos ${Math.round(urls.length * 0.02)} MB). ¿Continuar?`)) return;
  if (btn) btn.disabled = true;
  if (prog) prog.classList.remove('hidden');
  const cache = await caches.open('n2-tiles-v1');
  let done = 0, failed = 0;
  const queue = urls.slice();
  const worker = async () => {
    while (queue.length) {
      const url = queue.pop();
      try {
        if (!(await cache.match(url))) {
          const res = await fetch(url, { mode: 'cors' });
          if (res.ok) await cache.put(url, res); else failed++;
        }
      } catch (e) { failed++; }
      done++;
      if (bar && done % 5 === 0) bar.style.width = Math.round(done / urls.length * 100) + '%';
      if (done % 20 === 0) setOfflineStatus(`Descargando… ${done}/${urls.length}`, 'info');
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  if (bar) bar.style.width = '100%';
  if (btn) btn.disabled = false;
  setOfflineStatus(failed ? `Mapa guardado con ${failed} teselas que fallaron. Puedes reintentar.` : `Mapa guardado (${urls.length} teselas).`, failed ? 'warn' : 'ok');
}
