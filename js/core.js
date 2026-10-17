// Navegación por pestañas, modales, tema claro/oscuro y utilidades comunes

const STORAGE_KEYS = {
  theme: 'n2_theme',
  stamps: 'n2_stamps',
  packing: 'n2_packing',
  favorites: 'n2_favorites',
  done: 'n2_done',       // etapas completadas
  today: 'n2_today',     // km desde el último repostaje
  weather: 'n2_weather'  // caché de previsión
};

// localStorage protegido (modo privado, file:// con almacenamiento bloqueado, etc.)
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin persistencia */ }
}

function formatEuro(value, decimals = 0) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  }).format(value);
}
function formatNum(value, decimals = 0) {
  return Number(value).toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: 'always' });
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function gmapsPoint(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

// Pestañas
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => { el.classList.remove('active'); el.setAttribute('aria-selected', 'false'); });
  const view = document.getElementById('view-' + tabId);
  const btn = document.getElementById('tab-' + tabId);
  if (view) view.classList.remove('hidden');
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
  if (tabId === 'map' && window.n2Map) {
    setTimeout(() => window.n2Map.invalidateSize(), 150);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modales
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal('detail-modal'); closeModal('hourly-modal'); }
});

// Tema claro / oscuro
function applyTheme(theme) {
  const body = document.body;
  const btn = document.getElementById('theme-toggle-btn');
  body.classList.toggle('light-theme', theme === 'light');
  body.classList.toggle('dark-theme', theme === 'dark');
  if (btn) btn.innerHTML = theme === 'light' ? '☀️ <span>Modo claro</span>' : '🌙 <span>Modo oscuro</span>';
}
function toggleTheme() {
  const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem(STORAGE_KEYS.theme, next); } catch (e) { /* */ }
}
function initTheme() {
  let saved = 'light';
  try { saved = localStorage.getItem(STORAGE_KEYS.theme) || 'light'; } catch (e) { /* */ }
  applyTheme(saved === 'dark' ? 'dark' : 'light');
}

// Favoritos compartidos (lugares y tramos): array de claves "sight:id" / "pass:id"
let favorites = [];
function initFavorites() {
  const saved = storageGet(STORAGE_KEYS.favorites, []);
  favorites = Array.isArray(saved) ? saved : [];
}
function isFavorite(key) { return favorites.includes(key); }
function toggleFavorite(key) {
  favorites = isFavorite(key) ? favorites.filter(k => k !== key) : [...favorites, key];
  storageSet(STORAGE_KEYS.favorites, favorites);
  if (typeof renderSights === 'function') renderSights();
  if (typeof renderPasses === 'function') renderPasses();
}

// Pills: marca activa la que coincida con data-attr = value dentro de un contenedor
function setActivePill(containerId, attr, value) {
  document.querySelectorAll(`#${containerId} .pill`).forEach(p => {
    p.classList.toggle('active', String(p.dataset[attr]) === String(value));
  });
}

// Enlace de Google Maps por coordenadas pidiendo evitar autopistas (no se genera en el regreso, que es por autovía)
function gmapsAvoidUrl(stage) {
  const w = stage.waypoints;
  if (!w || w.length < 2 || stage.phase === 'regreso') return null;
  const pt = p => `${p.lat},${p.lng}`;
  const mids = w.slice(1, -1).map(pt).join('|');
  return `https://www.google.com/maps/dir/?api=1&travelmode=driving&avoid=highways&origin=${pt(w[0])}&destination=${pt(w[w.length - 1])}` +
    (mids ? `&waypoints=${encodeURIComponent(mids)}` : '');
}

function planBHtml(day) {
  const p = typeof planBData !== 'undefined' ? planBData[day] : null;
  if (!p) return '';
  return `<div class="inset p-3 space-y-1.5 text-xs">
    <div class="font-bold t-main">🛟 Plan B <span class="t-subtle font-normal">(orientativo)</span></div>
    <div><strong class="t-main">🛏️ Dormir bajo techo:</strong> ${escapeHtml(p.bail)}</div>
    <div><strong class="t-main">✂️ Recortar:</strong> ${escapeHtml(p.shortcut)}</div>
    <div><strong class="t-main">🌧️ Mal tiempo:</strong> ${escapeHtml(p.weather)}</div>
  </div>`;
}
