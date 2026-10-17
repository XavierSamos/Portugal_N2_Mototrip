// Tab 2: tarjetas de las 10 etapas + modal de cronograma

let currentPhaseFilter = 'all';

function filterItinerary(phase) {
  currentPhaseFilter = phase;
  setActivePill('itinerary-filters', 'phase', phase);
  renderItineraryCards();
}

function stageAlerts(stage) {
  const out = [];
  if (stage.km > 180) out.push(`<span class="tag tag-amber" title="Etapa de más de 180 km">⛽ Repostaje a mitad (${stage.km} km)</span>`);
  if (stage.maxAlt >= 1000) out.push(`<span class="tag tag-blue" title="${escapeHtml(stage.altPass || '')}">❄️ Puerto &gt;1.000 m (${formatNum(stage.maxAlt)} m)</span>`);
  if (stage.stamps) out.push(`<span class="tag ${stampDayInfo[stage.day].tag}">🛂 ${stage.stamps} sellos</span>`);
  if (stage.winterAlert) out.push(`<span class="tag tag-red">⚠️ Posible cierre por nieve</span>`);
  return out.join(' ');
}

function renderItineraryCards() {
  const container = document.getElementById('itinerary-cards');
  if (!container) return;
  const list = stagesData.filter(s => currentPhaseFilter === 'all' || s.phase === currentPhaseFilter);
  container.innerHTML = list.map(s => {
    const ph = phaseInfo[s.phase];
    const doneNow = getDoneStages().includes(s.day);
    const sights = (s.sightIds || []).map(id => sightsData.find(x => x.id === id)).filter(Boolean);
    const sightChips = sights.length ? `
      <div class="flex flex-wrap gap-1.5 pt-2 border-t divider no-print">
        ${sights.map(sg => `<button type="button" class="tag tag-slate" onclick="event.stopPropagation(); openSightModal('${sg.id}')">${sg.icon} ${escapeHtml(sg.name)}</button>`).join('')}
      </div>` : '';
    return `
      <article class="card clickable p-5 flex flex-col justify-between gap-4" onclick="openStageModal(${s.day})" tabindex="0" onkeydown="if(event.key==='Enter')openStageModal(${s.day})">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-black t-accent text-sm">DÍA ${s.day}</span>
              <span class="tag tag-slate">${escapeHtml(s.dateShort)}</span>
              <span class="tag ${ph.tag}">${ph.short}</span>
              ${doneNow ? '<span class="tag tag-green">✅ Completada</span>' : ''}
            </div>
            <div class="flex items-center gap-1.5">
              <span class="tag tag-slate font-mono">${formatNum(s.km)} km</span>
              <span class="tag tag-slate font-mono">⏱️ ${escapeHtml(s.time)}</span>
            </div>
          </div>
          <h3 class="font-bold t-main leading-snug">${escapeHtml(s.title)}</h3>
          <p class="text-xs t-muted leading-relaxed">${escapeHtml(s.summary)}</p>
          <div class="flex flex-wrap gap-1.5">${stageAlerts(s)}</div>
          <div class="inset p-2.5 text-xs flex flex-wrap justify-between gap-2">
            <span class="t-muted"><strong class="t-main">${s.night.type === 'hotel' ? '🏨' : s.night.type === 'home' ? '🏠' : '⛺'} Noche:</strong> ${escapeHtml(s.night.name)}</span>
            <span class="t-subtle">${escapeHtml(s.timezone)}</span>
          </div>
          <div class="text-xs t-muted"><strong class="t-main">🍽️ Comida:</strong> ${escapeHtml(s.lunch)}</div>
          ${sightChips}
        </div>
        <div class="pt-3 border-t divider flex flex-wrap justify-between items-center gap-2 no-print">
          <a href="${s.gmaps}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn btn-primary">🗺️ Ruta en Google Maps</a>
          ${gmapsAvoidUrl(s) ? `<a href="${gmapsAvoidUrl(s)}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn" title="Misma ruta pidiendo evitar autopistas">🚫🛣️ Sin autopistas</a>` : ''}
          <div class="flex gap-2">
            <button type="button" class="btn" onclick="event.stopPropagation(); showStageOnMap(${s.day})">📍 En el mapa</button>
            <button type="button" class="btn" onclick="event.stopPropagation(); toggleStageDone(${s.day})" title="Marcar etapa como completada">${doneNow ? '✅' : '☐'}</button>
            <span class="btn btn-ghost">📋 Cronograma ➔</span>
          </div>
        </div>
        <div class="print-timeline text-xs">
          ${s.timeline.map(t => `<div><strong>${escapeHtml(t.time)}</strong> — ${escapeHtml(t.act)}</div>`).join('')}
        </div>
      </article>`;
  }).join('');
}

function openStageModal(day) {
  const s = stagesData.find(x => x.day === day);
  if (!s) return;
  const ph = phaseInfo[s.phase];
  document.getElementById('modal-day-badge').textContent = `DÍA ${s.day} • ${s.date} • ${formatNum(s.km)} km • ⏱️ ${s.time}`;
  document.getElementById('modal-title').textContent = s.title;

  const winter = s.winterAlert ? `<div class="alert alert-red"><strong>❄️ Alerta invernal:</strong> ${escapeHtml(s.winterAlert)}</div>` : '';
  const alt = s.maxAlt >= 1000 ? `<div class="alert alert-blue"><strong>Aviso de altitud:</strong> ${escapeHtml(s.altPass || 'Puerto >1.000 m')}. En diciembre hay riesgo de hielo, sal y gravilla: modo Gravel, ropa térmica y guantes de invierno a mano.</div>` : '';
  const fuel = s.km > 180 ? `<div class="alert alert-amber"><strong>⛽ Gestión de autonomía:</strong> etapa de ${s.km} km. Con 9,0 L/100 km la Africa Twin gasta ~${formatNum(s.km * 0.09, 1)} L. Repostaje obligatorio como mínimo cada 180 km.</div>` : '';
  const time = `<div class="alert alert-amber"><strong>🕒 ${escapeHtml(s.timezone)}.</strong> Llegada al camping/hotel antes de las 16:45.</div>`;
  const sights = (s.sightIds || []).map(id => sightsData.find(x => x.id === id)).filter(Boolean);
  const passes = (s.passIds || []).map(id => passesData.find(x => x.id === id)).filter(Boolean);

  document.getElementById('modal-body').innerHTML = `
    <div class="flex flex-wrap gap-2">
      <a href="${s.gmaps}" target="_blank" rel="noopener" class="btn btn-primary flex-1">🗺️ Abrir ruta del Día ${s.day} en Google Maps ➔</a>
      <button class="btn" onclick="closeModal('hourly-modal'); showStageOnMap(${s.day})">📍 Ver en el mapa</button>
      ${gmapsAvoidUrl(s) ? `<a class="btn" href="${gmapsAvoidUrl(s)}" target="_blank" rel="noopener">🚫🛣️ Sin autopistas</a>` : ''}
    </div>
    <div class="flex flex-wrap gap-1.5"><span class="tag ${ph.tag}">${ph.label}</span><span class="tag tag-slate">${escapeHtml(s.roads)}</span></div>
    ${winter}${alt}${fuel}${time}
    ${planBHtml(s.day)}
    <div class="inset p-3 flex justify-between gap-2 flex-wrap"><span><strong class="t-main">${s.night.type === 'hotel' ? '🏨' : s.night.type === 'home' ? '🏠' : '⛺'}</strong> ${escapeHtml(s.night.name)}</span><span><strong class="t-main">🍽️</strong> ${escapeHtml(s.lunch)}</span></div>
    ${sights.length || passes.length ? `<div class="flex flex-wrap gap-1.5">
      ${sights.map(sg => `<button class="tag tag-slate" onclick="openSightModal('${sg.id}')">${sg.icon} ${escapeHtml(sg.name)} ➔</button>`).join('')}
      ${passes.map(p => `<span class="tag tag-slate">🏔️ ${escapeHtml(p.name)}</span>`).join('')}
    </div>` : ''}
    ${s.stamps ? `<div class="alert alert-blue"><strong>🛂 ${s.stamps} sellos hoy.</strong> Pasaporte siempre a mano y paradas exprés de 5 minutos. <button class="underline font-bold" onclick="closeModal('hourly-modal'); switchTab('passport')">Abrir pasaporte</button></div>` : ''}
    <div class="space-y-2 pt-2 border-t divider">
      <div class="text-[11px] font-bold uppercase tracking-wider t-subtle">⏱️ Cronograma estimado de la jornada</div>
      ${s.timeline.map(t => `
        <div class="inset flex gap-3 p-2.5">
          <span class="font-mono t-accent font-bold w-32 shrink-0">${escapeHtml(t.time)}</span>
          <span class="t-muted leading-relaxed">${escapeHtml(t.act)}</span>
        </div>`).join('')}
    </div>`;
  openModal('hourly-modal');
}
