// Tab 4: catálogo de lugares de interés con filtros por tipo, búsqueda y favoritos

let sightsTypeFilter = 'all';

function renderSightsFilters() {
  const box = document.getElementById('sights-filters');
  if (!box) return;
  const types = ['all', 'fav', ...new Set(sightsData.map(s => s.type))];
  box.innerHTML = types.map(t => {
    const label = t === 'all' ? 'Todos' : t === 'fav' ? '⭐ Favoritos' : t;
    return `<button class="pill ${sightsTypeFilter === t ? 'active' : ''}" data-st="${escapeHtml(t)}" onclick="setSightsFilter(this.dataset.st)">${escapeHtml(label)}</button>`;
  }).join('');
}

function setSightsFilter(t) {
  sightsTypeFilter = t;
  renderSightsFilters();
  renderSights();
}

function renderSights() {
  const grid = document.getElementById('sights-grid');
  if (!grid) return;
  const q = (document.getElementById('sights-search')?.value || '').trim().toLowerCase();
  const list = sightsData.filter(s => {
    if (sightsTypeFilter === 'fav' && !isFavorite('sight:' + s.id)) return false;
    if (sightsTypeFilter !== 'all' && sightsTypeFilter !== 'fav' && s.type !== sightsTypeFilter) return false;
    if (q && !(s.name + ' ' + s.desc + ' ' + s.type).toLowerCase().includes(q)) return false;
    return true;
  });
  if (!list.length) {
    grid.innerHTML = '<p class="text-sm t-muted col-span-full">Ningún lugar coincide con el filtro.</p>';
    return;
  }
  grid.innerHTML = list.map(s => {
    const fav = isFavorite('sight:' + s.id);
    return `
      <article class="card clickable p-4 flex flex-col gap-3" onclick="openSightModal('${s.id}')" tabindex="0" onkeydown="if(event.key==='Enter')openSightModal('${s.id}')">
        <div class="flex justify-between items-start gap-2">
          <span class="text-3xl" aria-hidden="true">${s.icon}</span>
          <button class="btn btn-ghost" aria-label="${fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" onclick="event.stopPropagation(); toggleFavorite('sight:${s.id}')">${fav ? '⭐' : '☆'}</button>
        </div>
        <h3 class="font-bold t-main leading-snug">${escapeHtml(s.name)}</h3>
        <div class="flex flex-wrap gap-1.5"><span class="tag tag-slate">${escapeHtml(s.type)}</span><span class="tag tag-slate">⛰️ ${formatNum(s.alt)} m</span><span class="tag tag-blue">Día ${s.day}</span></div>
        <p class="text-xs t-muted leading-relaxed">${escapeHtml(s.desc)}</p>
      </article>`;
  }).join('');
}

function openSightModal(id) {
  const s = sightsData.find(x => x.id === id);
  if (!s) return;
  const fav = isFavorite('sight:' + s.id);
  document.getElementById('detail-badges').innerHTML = `<span class="tag tag-slate">${escapeHtml(s.type)}</span><span class="tag tag-blue">Día ${s.day}</span><span class="tag tag-slate">⛰️ ${formatNum(s.alt)} m</span>`;
  document.getElementById('detail-title').textContent = `${s.icon} ${s.name}`;
  document.getElementById('detail-body').innerHTML = `
    <div class="inset p-3"><strong class="t-main block">Qué es</strong><p class="leading-relaxed">${escapeHtml(s.desc)}</p></div>
    <div class="alert alert-amber"><strong>🏍️ Consejo para la Africa Twin:</strong> ${escapeHtml(s.tip)}</div>
    <div class="flex flex-wrap gap-2">
      <a class="btn btn-primary" href="${gmapsPoint(s.lat, s.lng)}" target="_blank" rel="noopener">🗺️ Abrir en Google Maps</a>
      <button class="btn" onclick="closeModal('detail-modal'); showStageOnMap(${s.day})">📍 Etapa en el mapa</button>
      <button class="btn" onclick="toggleFavorite('sight:${s.id}'); closeModal('detail-modal'); openSightModal('${s.id}')">${fav ? '⭐ Quitar de favoritos' : '☆ Añadir a favoritos'}</button>
    </div>`;
  openModal('detail-modal');
}
