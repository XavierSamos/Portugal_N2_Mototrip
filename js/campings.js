// Tab 6: comparador de campings de invierno + plan de pernoctas

let campingFilter = 'all';

const campingStatusInfo = {
  verified: { label: '✅ Abierto verificado', tag: 'tag-green' },
  check:    { label: '📞 Confirmar apertura', tag: 'tag-amber' },
  closed:   { label: '⛔ Cerrado en diciembre', tag: 'tag-red' }
};

function filterCampings(f) {
  campingFilter = f;
  setActivePill('camping-filters', 'cf', f);
  renderCampings();
}

function campingPrice(c) {
  if (c.status === 'closed') return '—';
  return c.priceMin === c.priceMax ? `~${c.priceMin} €` : `~${c.priceMin} – ${c.priceMax} €`;
}

function renderCampings() {
  const grid = document.getElementById('campings-grid');
  if (!grid) return;
  const list = campingsData
    .filter(c => campingFilter === 'all' || c.status === campingFilter)
    .sort((a, b) => (a.day - b.day) || (a.pref - b.pref));
  grid.innerHTML = list.map(c => {
    const st = campingStatusInfo[c.status];
    const pref = c.pref === 1 ? '<span class="tag tag-blue">1ª preferencia</span>' : c.pref === 2 ? '<span class="tag tag-slate">2ª preferencia</span>' : '';
    return `
      <article class="card p-4 space-y-3 ${c.status === 'closed' ? 'opacity-80' : ''}">
        <div class="flex flex-wrap gap-1.5"><span class="tag ${st.tag}">${st.label}</span>${pref}<span class="tag tag-slate">Día ${c.day}</span></div>
        <div>
          <h3 class="font-bold t-main leading-snug">${escapeHtml(c.name)}</h3>
          <p class="text-xs t-subtle">${escapeHtml(c.zone)}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="inset p-2.5"><span class="t-subtle block">Estado</span><strong class="t-main">${escapeHtml(c.open)}</strong></div>
          <div class="inset p-2.5"><span class="t-subtle block">Precio / noche</span><strong class="t-main">${campingPrice(c)}</strong><span class="t-subtle block text-[10px]">${escapeHtml(c.priceDetail)}</span></div>
        </div>
        <ul class="text-xs t-muted list-disc pl-5 space-y-0.5">${c.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
        ${c.note ? `<p class="text-xs t-muted"><strong class="t-main">Nota:</strong> ${escapeHtml(c.note)}</p>` : ''}
        ${c.status !== 'closed' ? `<a class="btn" href="${gmapsPoint(c.lat, c.lng)}" target="_blank" rel="noopener">🗺️ Abrir en Maps</a>` : ''}
      </article>`;
  }).join('');
}

function renderNightsTable() {
  const body = document.getElementById('nights-table');
  if (!body) return;
  body.innerHTML = stagesData.map(s => {
    const c = s.night.campingId ? campingsData.find(x => x.id === s.night.campingId) : null;
    let status;
    if (s.night.type === 'home') status = '<span class="tag tag-slate">🏠 Casa</span>';
    else if (s.night.type === 'hotel') status = '<span class="tag tag-red">🏨 Hotel (camping cerrado)</span>';
    else status = c ? `<span class="tag ${campingStatusInfo[c.status].tag}">${campingStatusInfo[c.status].label}</span>` : '';
    return `<tr class="border-b divider">
      <td class="py-2 pr-3 font-bold t-main whitespace-nowrap">Día ${s.day} · ${escapeHtml(s.dateShort)}</td>
      <td class="py-2 pr-3">${escapeHtml(s.night.name)}</td>
      <td class="py-2 pr-3 whitespace-nowrap">${s.night.type === 'hotel' ? 'Hotel' : s.night.type === 'home' ? 'Casa' : 'Tienda'}</td>
      <td class="py-2">${status}</td></tr>`;
  }).join('');
}
