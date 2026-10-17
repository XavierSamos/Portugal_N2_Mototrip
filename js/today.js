// Pestaña "Hoy": vista pensada para el móvil durante el viaje.
// Persistencia: n2_done (etapas completadas), n2_today (km desde el último repostaje), n2_weather (caché de previsión)

const TRIP_START_ISO = '2026-12-04';
const stageTzOffset = { 0: 1, 1: 1, 9: 1 }; // España UTC+1; Portugal UTC+0 en diciembre
let todayStageDay = 0;

// ---------- Etapas completadas ----------
function getDoneStages() {
  const saved = storageGet(STORAGE_KEYS.done, []);
  return Array.isArray(saved) ? saved.filter(d => stagesData.some(s => s.day === d)) : [];
}
function toggleStageDone(day) {
  const list = getDoneStages();
  storageSet(STORAGE_KEYS.done, list.includes(day) ? list.filter(d => d !== day) : [...list, day]);
  renderItineraryCards();
  renderToday();
  renderStageProgress();
}
function renderStageProgress() {
  const el = document.getElementById('stage-progress');
  if (el) el.textContent = `✅ ${getDoneStages().length}/${stagesData.length} etapas`;
}

// ---------- Fechas ----------
// Día del viaje (0..9) según la fecha en España; fuera de rango devuelve < 0 o > 9
function tripDayOffset(now = new Date()) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now);
  return Math.round((Date.parse(ymd) - Date.parse(TRIP_START_ISO)) / 86400000);
}
function isTripOngoing(now = new Date()) {
  const o = tripDayOffset(now);
  return o >= 0 && o <= 9;
}
function stageIsoDate(day) {
  return new Date(Date.parse(TRIP_START_ISO) + day * 86400000).toISOString().slice(0, 10);
}
function stageSun(stage) {
  const iso = stageIsoDate(stage.day);
  const [y, m, d] = iso.split('-').map(Number);
  return sunTimes(y, m, d, stage.night.lat, stage.night.lng, stageTzOffset[stage.day] ?? 0);
}
// Hora local (decimal) en la zona del tramo de la etapa
function nowLocalHour(stage) {
  const tz = stageTzOffset[stage.day] ?? 0;
  const n = new Date();
  return ((n.getUTCHours() + n.getUTCMinutes() / 60 + tz) % 24 + 24) % 24;
}

// ---------- Repostaje ----------
function getFuelKm() {
  const t = storageGet(STORAGE_KEYS.today, {});
  return t && Number.isFinite(t.fuelKm) ? t.fuelKm : 0;
}
function setFuelKm(v) {
  const km = Math.max(0, Number(v) || 0);
  storageSet(STORAGE_KEYS.today, { fuelKm: km });
  renderFuelStatus();
}
function fuelStatusHtml(km) {
  const cons = budgetDefaults ? budgetDefaults.consumption : 9;
  const total = 18.8 / cons * 100;
  const remaining = Math.max(0, Math.round(total * 0.85 - km));
  let cls = 'alert-green', msg = 'Sin problema de autonomía.';
  if (km >= REFUEL_ALERT_KM) { cls = 'alert-red'; msg = '⛽ Repostaje YA: has superado los 180 km desde el último.'; }
  else if (km >= REFUEL_ALERT_KM - 40) { cls = 'alert-amber'; msg = '⛽ Repostar en la próxima gasolinera.'; }
  return `<div class="alert ${cls}"><strong>${formatNum(km)} km</strong> desde el último repostaje · autonomía segura restante ≈ <strong>${formatNum(remaining)} km</strong> (depósito 18,8 L a ${formatNum(cons, 1)} L/100 km). ${msg}</div>`;
}
function renderFuelStatus() {
  const box = document.getElementById('today-fuel-status');
  if (box) box.innerHTML = fuelStatusHtml(getFuelKm());
}

// ---------- Previsión (Open-Meteo, solo si hay conexión y la fecha está en rango) ----------
function weatherCodeText(c) {
  if (c === 0) return '☀️ Despejado';
  if (c <= 3) return '⛅ Nubes y claros';
  if (c <= 48) return '🌫️ Niebla';
  if (c <= 57) return '🌦️ Llovizna';
  if (c <= 67) return '🌧️ Lluvia';
  if (c <= 77) return '❄️ Nieve';
  if (c <= 82) return '🌧️ Chubascos';
  if (c <= 86) return '❄️ Chubascos de nieve';
  return '⛈️ Tormenta';
}
async function loadWeather(day) {
  const box = document.getElementById('today-weather');
  const stage = stagesData.find(s => s.day === day);
  if (!box || !stage) return;
  const iso = stageIsoDate(day);
  const cacheKey = `${day}`;
  const cache = storageGet(STORAGE_KEYS.weather, {});
  const render = (w, stale) => {
    box.innerHTML = `<div class="inset p-3 text-xs space-y-1">
      <div class="font-bold t-main">${weatherCodeText(w.code)} · ${formatNum(w.tmin)}° / ${formatNum(w.tmax)}° en ${escapeHtml(stage.night.name.split('(')[0].trim())}</div>
      <div class="t-muted">Lluvia: ${w.pop}% (${formatNum(w.rain, 1)} mm) · Viento máx. ${formatNum(w.wind)} km/h (rachas ${formatNum(w.gust)})</div>
      ${stale ? '<div class="t-amber font-semibold">Previsión guardada (sin conexión)</div>' : ''}
    </div>`;
  };
  const daysAhead = Math.round((Date.parse(iso) - Date.now()) / 86400000);
  if (daysAhead > 15) {
    box.innerHTML = `<div class="inset p-3 text-xs t-muted">Previsión disponible a partir del ${formatDateEs(new Date(Date.parse(iso) - 15 * 86400000))}.</div>`;
    return;
  }
  if (cache[cacheKey]) render(cache[cacheKey], !navigator.onLine);
  else box.innerHTML = '<div class="inset p-3 text-xs t-muted">Cargando previsión…</div>';
  if (!navigator.onLine) {
    if (!cache[cacheKey]) box.innerHTML = '<div class="inset p-3 text-xs t-muted">Sin conexión: no se puede cargar la previsión.</div>';
    return;
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${stage.night.lat}&longitude=${stage.night.lng}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max` +
      `&timezone=auto&start_date=${iso}&end_date=${iso}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('http ' + res.status);
    const j = await res.json();
    const d = j.daily;
    const w = { code: d.weather_code[0], tmax: d.temperature_2m_max[0], tmin: d.temperature_2m_min[0],
      pop: d.precipitation_probability_max[0] ?? 0, rain: d.precipitation_sum[0] ?? 0,
      wind: d.wind_speed_10m_max[0], gust: d.wind_gusts_10m_max[0] };
    cache[cacheKey] = w;
    storageSet(STORAGE_KEYS.weather, cache);
    if (todayStageDay === day) render(w, false);
  } catch (e) {
    if (!cache[cacheKey]) box.innerHTML = '<div class="inset p-3 text-xs t-muted">No se pudo cargar la previsión ahora.</div>';
  }
}
function formatDateEs(d) {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

// ---------- Enlaces útiles ----------
function mapsDirToName(name) {
  return `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(name)}`;
}
function usefulLinks(stage) {
  const { lat, lng } = stage.night;
  const links = [
    ['🌬️ Viento y lluvia (Windy)', `https://www.windy.com/${lat}/${lng}?${lat},${lng},9`],
    [stageTzOffset[stage.day] === 1 ? '🇪🇸 Avisos AEMET' : '🇵🇹 Avisos IPMA', stageTzOffset[stage.day] === 1 ? 'https://www.aemet.es/es/eltiempo/prediccion/avisos' : 'https://www.ipma.pt/pt/otempo/prev.significativo/']
  ];
  if (stage.winterAlert) links.push(['❄️ Estado carreteras Serra da Estrela', 'https://www.google.com/search?q=N339+Serra+da+Estrela+estrada+cortada+neve']);
  return links;
}

// ---------- Vista ----------
function setTodayStage(day) {
  todayStageDay = Math.max(0, Math.min(stagesData.length - 1, Number(day)));
  renderToday();
}
function stepTodayStage(delta) { setTodayStage(todayStageDay + delta); }

function renderToday() {
  const root = document.getElementById('today-content');
  if (!root) return;
  const s = stagesData.find(x => x.day === todayStageDay);
  if (!s) return;
  const offset = tripDayOffset();
  const ongoing = offset >= 0 && offset <= 9;
  const isToday = ongoing && offset === s.day;
  const done = getDoneStages().includes(s.day);
  const sun = stageSun(s);
  const nowH = nowLocalHour(s);
  const lightLeft = isToday && sun.sunset !== null ? sun.sunset - nowH : null;
  const tentBy = sun.sunset === null ? null : Math.min(16.75, sun.sunset - 0.5); // 16:45 o 30 min antes del ocaso
  const ph = phaseInfo[s.phase];
  const stamps = stampsData.filter(x => x.day === s.day);
  const gotStamps = getStamps();
  const nightQuery = s.night.type === 'home' ? null : s.night.name.replace(/\s*\(.*?\)\s*/g, ' ').trim();

  let banner = '';
  if (offset < 0) banner = `<div class="alert alert-blue"><strong>Faltan ${-offset} día${-offset === 1 ? '' : 's'} para la salida</strong> (viernes 4 de diciembre). Mientras tanto puedes repasar cada etapa aquí.</div>`;
  else if (offset > 9) banner = '<div class="alert alert-green"><strong>Viaje terminado.</strong> Aquí queda el recuerdo de cada etapa.</div>';
  else if (!isToday) banner = `<div class="alert alert-amber">Hoy es el <strong>Día ${offset}</strong>. <button class="underline font-bold" onclick="setTodayStage(${offset})">Ir a hoy</button></div>`;

  const lightCls = lightLeft !== null && lightLeft < 1.5 ? 'alert-red' : 'alert-amber';
  const lightLine = lightLeft !== null
    ? `<div class="alert ${lightCls}"><strong>Luz restante: ${lightLeft > 0 ? Math.floor(lightLeft) + ' h ' + String(Math.round((lightLeft % 1) * 60)).padStart(2, '0') + ' min' : 'ya anochecido'}</strong> · hora local ${formatHour(nowH)}</div>` : '';

  root.innerHTML = `
    ${banner}
    <div class="panel p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <button class="btn" onclick="stepTodayStage(-1)" aria-label="Etapa anterior" ${s.day === 0 ? 'disabled' : ''}>◀</button>
          <select id="today-stage-select" onchange="setTodayStage(this.value)" aria-label="Elegir etapa">
            ${stagesData.map(x => `<option value="${x.day}" ${x.day === s.day ? 'selected' : ''}>Día ${x.day} · ${escapeHtml(x.dateShort)}</option>`).join('')}
          </select>
          <button class="btn" onclick="stepTodayStage(1)" aria-label="Etapa siguiente" ${s.day === stagesData.length - 1 ? 'disabled' : ''}>▶</button>
        </div>
        <div class="flex flex-wrap gap-1.5"><span class="tag ${ph.tag}">${ph.short}</span><span class="tag tag-slate font-mono">${formatNum(s.km)} km</span><span class="tag tag-slate font-mono">⏱️ ${escapeHtml(s.time)}</span>${done ? '<span class="tag tag-green">✅ Completada</span>' : ''}</div>
      </div>
      <div>
        <h2 class="font-bold text-lg t-main leading-snug">${escapeHtml(s.title)}</h2>
        <p class="text-xs t-muted mt-1">${escapeHtml(s.roads)}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="inset p-3"><span class="t-subtle block">🌅 Amanece</span><strong class="t-main text-base">${formatHour(sun.sunrise)}</strong></div>
        <div class="inset p-3"><span class="t-subtle block">🌇 Anochece</span><strong class="t-red text-base">${formatHour(sun.sunset)}</strong></div>
        <div class="inset p-3"><span class="t-subtle block">⛺ Tienda montada</span><strong class="t-main text-base">${tentBy === null ? '—' : 'antes de ' + formatHour(tentBy)}</strong></div>
        <div class="inset p-3"><span class="t-subtle block">🕒 Huso</span><strong class="t-main text-base">${(stageTzOffset[s.day] ?? 0) === 1 ? 'UTC+1 (ES)' : 'UTC+0 (PT)'}</strong></div>
      </div>
      ${lightLine}
      ${s.winterAlert ? `<div class="alert alert-red"><strong>❄️ Alerta invernal:</strong> ${escapeHtml(s.winterAlert)}</div>` : ''}

      <div class="flex flex-col sm:flex-row gap-2">
        <a class="btn btn-primary flex-1 py-3 text-sm" href="${s.gmaps}" target="_blank" rel="noopener">🗺️ Ruta del día en Google Maps</a>
        ${nightQuery ? `<a class="btn flex-1 py-3 text-sm" href="${mapsDirToName(nightQuery)}" target="_blank" rel="noopener">🏕️ Ir a la pernocta</a>` : ''}
      </div>
      <p class="text-[11px] t-subtle">“Ir a la pernocta” busca el nombre en Google Maps: comprueba que es el sitio correcto antes de salir. Abre los enlaces desde el móvil para que los envíe a Android Auto.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="panel p-5 space-y-3">
        <h3 class="font-bold t-main">⛽ Control de repostaje</h3>
        <label class="flex flex-wrap items-center gap-2 text-xs t-muted">Km desde el último repostaje:
          <input type="number" min="0" step="5" value="${getFuelKm()}" class="w-24" oninput="setFuelKm(this.value)" aria-label="Kilómetros desde el último repostaje">
          <button class="btn" onclick="document.querySelector('#today-content input[type=number]').value = 0; setFuelKm(0)">⛽ Acabo de repostar</button>
        </label>
        <div id="today-fuel-status">${fuelStatusHtml(getFuelKm())}</div>
        <p class="text-[11px] t-subtle">Apunta los km del cuentakilómetros parcial (TRIP). La alerta salta a 140 km (aviso) y 180 km (rojo).</p>
      </div>

      <div class="panel p-5 space-y-3">
        <h3 class="font-bold t-main">🌦️ Tiempo y estado de carreteras</h3>
        <div id="today-weather"></div>
        <div class="flex flex-wrap gap-2">${usefulLinks(s).map(([t, u]) => `<a class="btn" href="${u}" target="_blank" rel="noopener">${t}</a>`).join('')}</div>
      </div>
    </div>

    ${stamps.length ? `
    <div class="panel p-5 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="font-bold t-main">🛂 Sellos de hoy · ${stamps.filter(x => gotStamps.includes(x.id)).length}/${stamps.length}</h3>
        <span class="tag ${stampDayInfo[s.day].tag}">${stampDayInfo[s.day].range}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        ${stamps.map(x => {
          const dn = gotStamps.includes(x.id);
          return `<div class="stamp-cell ${dn ? 'done' : ''}" onclick="toggleStamp('${x.id}')" role="checkbox" aria-checked="${dn}" tabindex="0" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleStamp('${x.id}')}">
            <span class="stamp-num" style="background:${stampDayInfo[s.day].color}">${dn ? '✓' : x.n}</span>
            <div class="text-xs space-y-0.5 min-w-0"><div class="font-bold t-main">${escapeHtml(x.name)} <span class="t-subtle font-mono font-normal">· Km ${x.km}</span></div><div class="t-muted">📍 ${escapeHtml(x.stamp)}</div></div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    <div class="panel p-5 space-y-3">
      <h3 class="font-bold t-main">⏱️ Cronograma</h3>
      <div class="space-y-2">
        ${s.timeline.map(t => `<div class="inset flex gap-3 p-2.5 text-xs"><span class="font-mono t-accent font-bold w-28 shrink-0">${escapeHtml(t.time)}</span><span class="t-muted leading-relaxed">${escapeHtml(t.act)}</span></div>`).join('')}
      </div>
      <div class="flex flex-wrap gap-2 pt-2 border-t divider">
        <button class="btn ${done ? '' : 'btn-primary'}" onclick="toggleStageDone(${s.day})">${done ? '↺ Marcar como no completada' : '✅ Marcar etapa como completada'}</button>
        <button class="btn" onclick="showStageOnMap(${s.day})">📍 Ver en el mapa</button>
        <button class="btn" onclick="openStageModal(${s.day})">📋 Ficha completa</button>
      </div>
    </div>`;

  loadWeather(s.day);
}

function initToday() {
  const o = tripDayOffset();
  todayStageDay = o >= 0 && o <= 9 ? o : (o > 9 ? 9 : 0);
  renderToday();
  renderStageProgress();
}
