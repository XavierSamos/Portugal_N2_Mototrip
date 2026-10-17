// Tab 3: pasaporte interactivo de la EN2 (35 sellos). Persistencia: n2_stamps

function getStamps() {
  const saved = storageGet(STORAGE_KEYS.stamps, []);
  return Array.isArray(saved) ? saved.filter(id => stampsData.some(s => s.id === id)) : [];
}
function saveStamps(list) { storageSet(STORAGE_KEYS.stamps, list); }

function toggleStamp(id) {
  const list = getStamps();
  const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  saveStamps(next);
  renderPassport();
  refreshStampMarker(id);
  if (typeof renderMapInfo === 'function') renderMapInfo();
}

function resetStamps() {
  if (!confirm('¿Reiniciar el pasaporte? Se desmarcarán los 35 sellos.')) return;
  saveStamps([]);
  renderPassport();
  stampsData.forEach(s => refreshStampMarker(s.id));
  renderMapInfo();
}

function renderPassport() {
  const stamps = getStamps();
  const total = stampsData.length;
  const pct = Math.round(stamps.length / total * 100);

  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  setText('passport-progress-text', `${stamps.length} de ${total} sellos`);
  setText('passport-progress-pct', `${pct}%`);
  setText('header-stamps-badge', `🛂 ${stamps.length}/${total} sellos`);
  const bar = document.getElementById('passport-progress-bar');
  if (bar) bar.style.width = pct + '%';
  const dip = document.getElementById('passport-diploma');
  if (dip) dip.classList.toggle('hidden', stamps.length !== total);

  const dayBox = document.getElementById('passport-day-progress');
  if (dayBox) {
    dayBox.innerHTML = Object.keys(stampDayInfo).map(d => {
      const all = stampsData.filter(s => s.day === Number(d));
      const done = all.filter(s => stamps.includes(s.id)).length;
      return `<div class="inset p-2.5 text-xs"><span class="tag ${stampDayInfo[d].tag}">Día ${d}</span><div class="font-bold t-main mt-1.5">${done} / ${all.length}</div></div>`;
    }).join('');
  }

  const offices = document.getElementById('passport-offices');
  if (offices && !offices.dataset.ready) {
    offices.innerHTML = ['start', 'end'].map(k => {
      const o = passportOffices[k];
      return `
        <div class="inset p-4 space-y-2 text-xs">
          <h3 class="font-bold t-main text-sm">${k === 'start' ? '📘' : '🎓'} ${escapeHtml(o.title)}</h3>
          <div><strong class="t-main">Punto principal</strong><ul class="list-disc pl-5 t-muted">${o.main.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul></div>
          <div><strong class="t-main">Backups 24/7</strong><ul class="list-disc pl-5 t-muted">${o.backup.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul></div>
          <a class="btn" href="${gmapsPoint(o.lat, o.lng)}" target="_blank" rel="noopener">🗺️ Abrir en Maps</a>
        </div>`;
    }).join('');
    offices.dataset.ready = '1';
  }

  const groups = document.getElementById('passport-groups');
  if (groups) {
    groups.innerHTML = Object.keys(stampDayInfo).map(d => {
      const info = stampDayInfo[d];
      const items = stampsData.filter(s => s.day === Number(d));
      const stage = stagesData.find(x => x.day === Number(d));
      return `
        <div class="panel p-5 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2"><span class="tag ${info.tag}">${info.label}</span><span class="text-sm font-bold t-main">${info.range}</span></div>
            <div class="flex gap-2"><button class="btn" onclick="openStageModal(${d})">📋 Cronograma</button><button class="btn" onclick="showStageOnMap(${d})">📍 Etapa en el mapa</button></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${items.map(s => {
              const done = stamps.includes(s.id);
              return `
                <div class="stamp-cell ${done ? 'done' : ''}" onclick="toggleStamp('${s.id}')" role="checkbox" aria-checked="${done}" tabindex="0" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleStamp('${s.id}')}">
                  <span class="stamp-num" style="background:${info.color}">${done ? '✓' : s.n}</span>
                  <div class="text-xs space-y-0.5 min-w-0">
                    <div class="font-bold t-main">${escapeHtml(s.name)} <span class="t-subtle font-mono font-normal">· Km ${s.km}</span></div>
                    <div class="t-muted"><strong>📍</strong> ${escapeHtml(s.stamp)}</div>
                    <div class="t-subtle"><strong>🚒</strong> ${escapeHtml(s.backup)}</div>
                    ${s.note ? `<div class="t-amber font-semibold">⚠️ ${escapeHtml(s.note)}</div>` : ''}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');
  }
}
