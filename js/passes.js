// Tab 7: tramos míticos, ficha de la Africa Twin y planificador de autonomía/repostajes

function renderPasses() {
  const grid = document.getElementById('passes-grid');
  if (!grid) return;
  grid.innerHTML = passesData.map(p => {
    const fav = isFavorite('pass:' + p.id);
    return `
      <article class="card p-4 flex flex-col gap-3">
        <div class="flex justify-between items-start gap-2">
          <div class="flex flex-wrap gap-1.5"><span class="tag tag-blue">Día ${p.day}</span><span class="tag tag-slate">${escapeHtml(p.road)}</span></div>
          <button class="btn btn-ghost" aria-label="${fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" onclick="toggleFavorite('pass:${p.id}')">${fav ? '⭐' : '☆'}</button>
        </div>
        <h3 class="font-bold t-main leading-snug">${escapeHtml(p.name)}</h3>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="inset p-2"><span class="t-subtle block">Longitud</span><strong class="t-main">${p.lengthKm} km</strong></div>
          <div class="inset p-2"><span class="t-subtle block">Cota máx.</span><strong class="t-main">${formatNum(p.maxAlt)} m</strong></div>
          <div class="inset p-2"><span class="t-subtle block">Curvas</span><strong class="t-main">${p.curves}</strong></div>
        </div>
        <ul class="text-xs t-muted space-y-1">
          <li><strong class="t-main">Firme:</strong> ${escapeHtml(p.surface)}</li>
          <li><strong class="t-main">Invierno:</strong> ${escapeHtml(p.winter)}</li>
          <li><strong class="t-main">Consejo:</strong> ${escapeHtml(p.tip)}</li>
        </ul>
        <div class="flex flex-wrap gap-2 mt-auto">
          <a class="btn btn-primary" href="${p.gmaps}" target="_blank" rel="noopener">🗺️ Google Maps</a>
          <button class="btn" onclick="showStageOnMap(${p.day})">📍 En el mapa</button>
        </div>
      </article>`;
  }).join('');
}

// Autonomía según consumo y depósito; alertas de repostaje cada 180 km
const REFUEL_ALERT_KM = 180;

function renderRangePlanner() {
  const consEl = document.getElementById('range-consumption');
  const tankEl = document.getElementById('range-tank');
  if (!consEl || !tankEl) return;
  const cons = Number(consEl.value);
  const tank = Number(tankEl.value);
  const total = tank / cons * 100;
  const safe = total * 0.85;
  document.getElementById('range-consumption-label').textContent = `${formatNum(cons, 1)} L/100 km`;
  document.getElementById('range-total').textContent = `${formatNum(total)} km`;
  document.getElementById('range-safe').textContent = `${formatNum(safe)} km`;

  const table = document.getElementById('range-table');
  if (!table) return;
  table.innerHTML = stagesData.map(s => {
    const liters = s.km / 100 * cons;
    const stops = Math.max(0, Math.ceil(s.km / REFUEL_ALERT_KM) - 1);
    const ok = REFUEL_ALERT_KM <= safe;
    const flag = stops > 0
      ? `<span class="tag tag-amber">⛽ ${stops} parada${stops > 1 ? 's' : ''} de repostaje</span>`
      : '<span class="tag tag-green">Sin repostaje extra</span>';
    return `
      <div class="inset p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="min-w-0">
          <strong class="t-main">Día ${s.day}</strong> <span class="t-subtle">· ${escapeHtml(s.cities[0])} ➔ ${escapeHtml(s.cities[s.cities.length - 1])}</span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="tag tag-slate font-mono">${s.km} km</span>
          <span class="tag tag-slate font-mono">${formatNum(liters, 1)} L</span>
          ${flag}
        </div>
      </div>
      ${!ok && s.km > safe ? '' : ''}`;
  }).join('');
}
