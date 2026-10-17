// Motor cartográfico multicapa (Leaflet): ruta completa, filtro por etapa, 35 checkpoints N2 y sellos por día

let mapMode = 'full';          // 'full' | 'stage' | 'stamps'
let currentMapStage = 0;       // 0..9
let stampDayFilter = 'all';    // 'all' | 5 | 6 | 7 | 8
let routeLayer = null;
let markerLayer = null;
const stampMarkers = {};       // id -> L.marker

function stageLatLngs(stage) {
  return stage.waypoints.map(w => [w.lat, w.lng]);
}

function initMap() {
  const el = document.getElementById('map');
  if (!el) return;
  if (typeof L === 'undefined') {
    el.innerHTML = '<div class="h-full flex items-center justify-center text-sm t-muted p-6 text-center">No se ha podido cargar Leaflet (¿sin conexión?). El resto del planificador funciona igual.</div>';
    renderMapInfo();
    return;
  }

  const map = L.map('map', { scrollWheelZoom: true }).setView([39.3, -7.0], 6);
  window.n2Map = map;

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  routeLayer = L.layerGroup().addTo(map);
  markerLayer = L.layerGroup().addTo(map);

  // Leyenda
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div><i style="background:${phaseInfo.sierras.color}"></i>Fase 1 · Sierras</div>
      <div><i style="background:${phaseInfo.n2.color}"></i>Fase 2 · N2</div>
      <div><i style="background:${phaseInfo.regreso.color}"></i>Fase 3 · Regreso</div>`;
    return div;
  };
  legend.addTo(map);

  // Selector de etapa
  const select = document.getElementById('map-stage-select');
  if (select) {
    select.innerHTML = stagesData.map(s => `<option value="${s.day}">Día ${s.day} · ${escapeHtml(s.dateShort)} · ${s.km} km</option>`).join('');
  }

  renderMapView();
}

function setMapMode(mode) {
  mapMode = mode;
  setActivePill('map-mode-pills', 'mode', mode);
  document.getElementById('map-stage-controls').classList.toggle('hidden', mode !== 'stage');
  document.getElementById('map-stamp-controls').classList.toggle('hidden', mode !== 'stamps');
  renderMapView();
  if (window.n2Map) setTimeout(() => window.n2Map.invalidateSize(), 100);
}

function setMapStage(day) {
  currentMapStage = Math.max(0, Math.min(stagesData.length - 1, day));
  const select = document.getElementById('map-stage-select');
  if (select) select.value = String(currentMapStage);
  renderMapView();
}
function stepMapStage(delta) { setMapStage(currentMapStage + delta); }

function showStageOnMap(day) {
  switchTab('map');
  setMapMode('stage');
  setMapStage(day);
}

function setStampDayFilter(value) {
  stampDayFilter = value;
  setActivePill('map-stamp-controls', 'sday', value);
  renderMapView();
}

function pinIcon(label, color, size = 24, extraClass = '') {
  return L.divIcon({
    className: '',
    html: `<div class="map-pin ${extraClass}" style="background:${color};width:${size}px;height:${size}px">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

function nightPopup(stage) {
  return `
    <div class="space-y-1 min-w-[200px]">
      <strong class="block text-sm">Día ${stage.day} · ${escapeHtml(stage.dateShort)}</strong>
      <span class="block">${stage.night.type === 'hotel' ? '🏨' : stage.night.type === 'home' ? '🏠' : '⛺'} ${escapeHtml(stage.night.name)}</span>
      <span class="block text-[11px]" style="color:#334155">${stage.km} km · ${escapeHtml(stage.time)}</span>
      <div class="flex gap-1 pt-1">
        <button onclick="openStageModal(${stage.day})" style="background:#1d4ed8;color:#fff" class="px-2 py-1 rounded text-[11px] font-bold">📋 Cronograma</button>
        <a href="${stage.gmaps}" target="_blank" rel="noopener" style="background:#e2e8f0;color:#0f172a" class="px-2 py-1 rounded text-[11px] font-bold">🗺️ Google Maps</a>
      </div>
    </div>`;
}

function stampPopup(s) {
  const done = getStamps().includes(s.id);
  const info = stampDayInfo[s.day];
  return `
    <div class="space-y-1 min-w-[220px] max-w-[260px]">
      <div style="color:#334155" class="text-[10px] font-bold uppercase">Sello ${s.n}/35 · ${info.label}</div>
      <strong class="block text-sm">${escapeHtml(s.name)} · Km ${s.km}</strong>
      <div><b>📍 Sellado rápido:</b> ${escapeHtml(s.stamp)}</div>
      <div><b>🚒 24h / alternativa:</b> ${escapeHtml(s.backup)}</div>
      ${s.note ? `<div style="background:#fef3c7;color:#78350f" class="rounded p-1 text-[11px]">⚠️ ${escapeHtml(s.note)}</div>` : ''}
      <div class="flex flex-wrap gap-1 pt-1">
        <button onclick="toggleStamp('${s.id}')" style="background:${done ? '#dcfce7' : '#1d4ed8'};color:${done ? '#14532d' : '#fff'}" class="px-2 py-1 rounded text-[11px] font-bold">${done ? '✅ Sellado (deshacer)' : '🛂 Marcar como sellado'}</button>
        <a href="${gmapsPoint(s.lat, s.lng)}" target="_blank" rel="noopener" style="background:#e2e8f0;color:#0f172a" class="px-2 py-1 rounded text-[11px] font-bold">🗺️ Maps</a>
      </div>
    </div>`;
}

function addStampMarker(s) {
  const done = getStamps().includes(s.id);
  const marker = L.marker([s.lat, s.lng], {
    icon: pinIcon(done ? '✓' : s.n, stampDayInfo[s.day].color, 24, done ? 'stamped' : ''),
    title: `${s.n}. ${s.name} (Km ${s.km})`,
    zIndexOffset: 500
  }).bindPopup(() => stampPopup(s));
  marker.addTo(markerLayer);
  stampMarkers[s.id] = marker;
}

// Llamado desde passport.js al marcar/desmarcar
function refreshStampMarker(id) {
  const marker = stampMarkers[id];
  const s = stampsData.find(x => x.id === id);
  if (!marker || !s || typeof L === 'undefined') return;
  const done = getStamps().includes(id);
  marker.setIcon(pinIcon(done ? '✓' : s.n, stampDayInfo[s.day].color, 24, done ? 'stamped' : ''));
  if (marker.isPopupOpen && marker.isPopupOpen()) marker.setPopupContent(stampPopup(s));
}

function addSightMarkers() {
  const show = document.getElementById('map-show-sights');
  if (!show || !show.checked) return;
  sightsData.forEach(sg => {
    L.marker([sg.lat, sg.lng], { icon: pinIcon(sg.icon, '#ffffff', 28), title: sg.name, zIndexOffset: 800 })
      .bindPopup(`<div class="min-w-[200px] space-y-1"><strong class="block text-sm">${sg.icon} ${escapeHtml(sg.name)}</strong><span class="block">${escapeHtml(sg.desc)}</span><button onclick="openSightModal('${sg.id}')" style="background:#1d4ed8;color:#fff" class="px-2 py-1 rounded text-[11px] font-bold mt-1">Ver ficha ➔</button></div>`)
      .addTo(markerLayer);
  });
}

function renderMapView() {
  renderMapInfo();
  if (!window.n2Map || !routeLayer) return;
  routeLayer.clearLayers();
  markerLayer.clearLayers();
  Object.keys(stampMarkers).forEach(k => delete stampMarkers[k]);

  let bounds = [];

  if (mapMode === 'full') {
    stagesData.forEach(stage => {
      const ll = stageLatLngs(stage);
      L.polyline(ll, { color: phaseInfo[stage.phase].color, weight: 5, opacity: 0.9 })
        .bindTooltip(`Día ${stage.day}: ${stage.title}`, { sticky: true })
        .on('click', () => showStageOnMap(stage.day))
        .addTo(routeLayer);
      bounds = bounds.concat(ll);
      if (stage.night.type !== 'home') {
        const icon = stage.night.type === 'hotel' ? '🏨' : '⛺';
        L.marker([stage.night.lat, stage.night.lng], { icon: pinIcon(icon, '#ffffff', 26), title: stage.night.name })
          .bindPopup(nightPopup(stage)).addTo(markerLayer);
      }
    });
    L.marker([36.7213, -4.4214], { icon: pinIcon('🏠', '#ffffff', 28), title: 'Málaga · salida y llegada' })
      .bindPopup('<strong>Málaga</strong><br>Salida (Día 0) y llegada (Día 9)').addTo(markerLayer);
    L.marker([41.7410, -7.4700], { icon: pinIcon('0', '#1d4ed8', 30), title: 'Km 0 Chaves', zIndexOffset: 900 })
      .bindPopup('<strong>Marco Km 0 · Chaves</strong><br>Inicio de la Estrada Nacional 2 y compra del pasaporte.').addTo(markerLayer);
    L.marker([37.0194, -7.9322], { icon: pinIcon('🏁', '#ffffff', 30), title: 'Km 738 Faro', zIndexOffset: 900 })
      .bindPopup('<strong>Marco Km 738 · Faro</strong><br>Fin de la N2 y recogida del diploma.').addTo(markerLayer);
  }

  if (mapMode === 'stage') {
    const stage = stagesData.find(s => s.day === currentMapStage);
    stagesData.forEach(s => {
      if (s.day !== stage.day) L.polyline(stageLatLngs(s), { color: '#64748b', weight: 2, opacity: 0.45, dashArray: '4 6' }).addTo(routeLayer);
    });
    const ll = stageLatLngs(stage);
    L.polyline(ll, { color: '#ffffff', weight: 9, opacity: 0.9 }).addTo(routeLayer);
    L.polyline(ll, { color: phaseInfo[stage.phase].color, weight: 6, opacity: 1 }).addTo(routeLayer);
    bounds = ll.slice();
    stage.waypoints.forEach((w, i) => {
      const isEnd = i === stage.waypoints.length - 1;
      L.marker([w.lat, w.lng], { icon: pinIcon(isEnd ? '🏁' : i + 1, isEnd ? '#ffffff' : phaseInfo[stage.phase].color, isEnd ? 28 : 22), title: w.name })
        .bindPopup(`<strong>${escapeHtml(w.name)}</strong><br><span style="color:#334155">Día ${stage.day} · waypoint ${i + 1}/${stage.waypoints.length}</span>`)
        .addTo(markerLayer);
    });
    if (stage.night.type !== 'home') {
      L.marker([stage.night.lat, stage.night.lng], { icon: pinIcon(stage.night.type === 'hotel' ? '🏨' : '⛺', '#ffffff', 28), title: stage.night.name, zIndexOffset: 700 })
        .bindPopup(nightPopup(stage)).addTo(markerLayer);
      bounds.push([stage.night.lat, stage.night.lng]);
    }
    stampsData.filter(s => s.day === stage.day).forEach(addStampMarker);
  }

  if (mapMode === 'stamps') {
    const n2 = stagesData.filter(s => s.phase === 'n2');
    n2.forEach(s => L.polyline(stageLatLngs(s), { color: phaseInfo.n2.color, weight: 4, opacity: 0.5 }).addTo(routeLayer));
    const visible = stampsData.filter(s => stampDayFilter === 'all' || s.day === Number(stampDayFilter));
    visible.forEach(addStampMarker);
    bounds = visible.map(s => [s.lat, s.lng]);
  }

  addSightMarkers();

  if (bounds.length) window.n2Map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30], maxZoom: 11 });
}

function renderMapInfo() {
  const box = document.getElementById('map-info');
  if (!box) return;

  if (mapMode === 'stage') {
    const s = stagesData.find(x => x.day === currentMapStage);
    const ph = phaseInfo[s.phase];
    box.innerHTML = `
      <div class="flex flex-wrap gap-1.5"><span class="tag ${ph.tag}">${ph.label}</span><span class="tag tag-slate">${s.km} km · ${escapeHtml(s.time)}</span></div>
      <h3 class="font-bold t-main">Día ${s.day} · ${escapeHtml(s.dateShort)}</h3>
      <p class="text-sm font-semibold t-main">${escapeHtml(s.title)}</p>
      <p class="text-xs t-muted">${escapeHtml(s.summary)}</p>
      <p class="text-xs t-muted"><strong class="t-main">Carreteras:</strong> ${escapeHtml(s.roads)}</p>
      <p class="text-xs t-muted"><strong class="t-main">Noche:</strong> ${escapeHtml(s.night.name)}</p>
      ${s.stamps ? `<p class="text-xs"><span class="tag ${stampDayInfo[s.day].tag}">🛂 ${s.stamps} sellos hoy</span></p>` : ''}
      <div class="flex flex-wrap gap-2 pt-1">
        <a class="btn btn-primary" href="${s.gmaps}" target="_blank" rel="noopener">🗺️ Abrir en Google Maps</a>
        <button class="btn" onclick="openStageModal(${s.day})">📋 Cronograma</button>
      </div>`;
    return;
  }

  if (mapMode === 'stamps') {
    const stamps = getStamps();
    const list = stampsData.filter(s => stampDayFilter === 'all' || s.day === Number(stampDayFilter));
    const done = list.filter(s => stamps.includes(s.id)).length;
    const title = stampDayFilter === 'all' ? 'Los 35 municipios de la N2' : `${stampDayInfo[stampDayFilter].label} · ${stampDayInfo[stampDayFilter].range}`;
    box.innerHTML = `
      <h3 class="font-bold t-main">📌 ${escapeHtml(title)}</h3>
      <p class="text-xs t-muted">Toca un marcador para ver el punto de sellado rápido, la alternativa 24h y marcarlo como sellado.</p>
      <div class="text-sm font-bold t-main">${done} / ${list.length} sellados</div>
      <div class="progress"><div style="width:${list.length ? Math.round(done / list.length * 100) : 0}%"></div></div>
      <div class="flex flex-wrap gap-1.5 pt-1">
        ${Object.keys(stampDayInfo).map(d => `<span class="tag ${stampDayInfo[d].tag}">● Día ${d} · ${stampDayInfo[d].name}</span>`).join('')}
      </div>
      <button class="btn" onclick="switchTab('passport')">🛂 Abrir pasaporte</button>`;
    return;
  }

  box.innerHTML = `
    <h3 class="font-bold t-main">🌐 Gran Bucle Ibérico</h3>
    <p class="text-xs t-muted">Subida a Chaves por sierras y fronteras, la EN2 completa de norte a sur y regreso por el Algarve. Toca un tramo para ver esa etapa.</p>
    <ul class="text-xs space-y-1.5">
      ${Object.keys(phaseInfo).map(k => {
        const days = stagesData.filter(s => s.phase === k);
        const km = days.reduce((a, s) => a + s.km, 0);
        return `<li class="flex justify-between gap-2"><span class="tag ${phaseInfo[k].tag}">${phaseInfo[k].label}</span><strong class="t-main font-mono">${formatNum(km)} km</strong></li>`;
      }).join('')}
    </ul>`;
}

// Resumen rápido (sidebar del mapa)
function renderQuickSummary() {
  const ul = document.getElementById('quick-summary');
  if (!ul) return;
  const byPhase = k => stagesData.filter(s => s.phase === k).reduce((a, s) => a + s.km, 0);
  const rows = [
    ['Distancia total planificada', `~${formatNum(routeTotals.plannedKm)} km`],
    ['Suma de las 10 etapas', `${formatNum(routeTotals.stagesKm)} km`],
    ['Desvíos, miradores y bucles de sellos', `~${formatNum(routeTotals.plannedKm - routeTotals.stagesKm)} km`],
    ['Fase 1 · Sierras hasta Chaves', `${formatNum(byPhase('sierras'))} km`],
    ['Fase 2 · EN2 Chaves ➔ Faro', `${formatNum(byPhase('n2'))} km`],
    ['Fase 3 · Regreso', `${formatNum(byPhase('regreso'))} km`],
    ['Sellos de la N2', '35 municipios'],
    ['Noches', '8 tienda + 1 hotel (Chaves) + casa']
  ];
  ul.innerHTML = rows.map(([a, b]) => `<li class="flex justify-between gap-3 border-b divider pb-1.5"><span>${a}</span><strong class="t-main font-mono text-right">${b}</strong></li>`).join('');
}
