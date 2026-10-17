// Tab 8: checklist de equipaje de moto y acampada invernal. Persistencia: n2_packing (ids pack-*)

const packingData = [
  { title: '🏍️ Moto y mecánica', items: [
    ['pack-compresor', 'Mini-compresor 12V bajo el asiento'],
    ['pack-antipinch', 'Kit antipinchazos tubeless (mechas + CO₂)'],
    ['pack-teflon', 'Spray de cadena (teflón) para uso diario'],
    ['pack-herramientas', 'Kit de herramientas y llaves de las maletas'],
    ['pack-cinchas', 'Cinchas / pulpos de repuesto'],
    ['pack-presiones', 'Manómetro de bolsillo (presiones en frío)'],
    ['pack-candado', 'Candado de disco / alarma portátil'],
    ['pack-fusibles', 'Fusibles y bombillas de repuesto']
  ]},
  { title: '🧥 Ropa técnica de invierno', items: [
    ['pack-chaqueta', 'Chaqueta con membrana y protecciones'],
    ['pack-pantalon', 'Pantalón con membrana y protecciones'],
    ['pack-lluvia', 'Mono de lluvia encima'],
    ['pack-guantes-inv', 'Guantes de invierno + guantes de repuesto'],
    ['pack-sotocasco', 'Sotocasco / braga y gorro térmico'],
    ['pack-termica', '2 camisetas térmicas de manga larga'],
    ['pack-botas', 'Botas impermeables'],
    ['pack-calcetines', 'Calcetines técnicos (3 pares)'],
    ['pack-visor', 'Visor limpio + antivaho (Pinlock)']
  ]},
  { title: '⛺ Acampada invernal', items: [
    ['pack-tienda', 'Tienda de 4 estaciones con piquetas de refuerzo'],
    ['pack-saco', 'Saco de confort −5 °C'],
    ['pack-esterilla', 'Esterilla aislante (R ≥ 4)'],
    ['pack-almohada', 'Almohada hinchable'],
    ['pack-placa', 'Placa de apoyo para la pata (suelo arenoso/blando)'],
    ['pack-frontal', 'Linterna frontal + pilas de repuesto'],
    ['pack-hornillo', 'Hornillo, gas y cazo'],
    ['pack-manta', 'Manta térmica de emergencia']
  ]},
  { title: '📄 Documentación y dinero', items: [
    ['pack-dni', 'DNI / pasaporte'],
    ['pack-carnet', 'Carnet de conducir'],
    ['pack-docs-moto', 'Permiso de circulación e ITV'],
    ['pack-seguro', 'Seguro de la moto y tarjeta sanitaria europea'],
    ['pack-pasaporte-n2', 'Funda impermeable para el Pasaporte EN2'],
    ['pack-efectivo', 'Efectivo para peajes y cafés (monedas)'],
    ['pack-easytoll', 'Tarjeta asociada a EasyToll / Toll Card']
  ]},
  { title: '📱 Tecnología', items: [
    ['pack-movil', 'Móvil con mapas offline (Portugal y Andalucía)'],
    ['pack-soporte', 'Soporte de manillar y cable de carga'],
    ['pack-powerbank', 'Powerbank'],
    ['pack-intercom', 'Intercomunicador / auriculares'],
    ['pack-roadbook', 'Roadbook impreso para la bolsa sobredepósito']
  ]},
  { title: '🩹 Seguridad y varios', items: [
    ['pack-botiquin', 'Botiquín básico'],
    ['pack-chaleco', 'Chaleco reflectante y triángulos'],
    ['pack-tapones', 'Tapones para los oídos'],
    ['pack-aseo', 'Neceser y toalla de microfibra'],
    ['pack-bolsas', 'Bolsas estancas para ropa mojada'],
    ['pack-comida', 'Reserva de comida y agua de emergencia']
  ]}
];

function renderPackingList() {
  const grid = document.getElementById('packing-grid');
  if (!grid) return;
  const saved = storageGet(STORAGE_KEYS.packing, {});
  grid.innerHTML = packingData.map(g => `
    <div class="inset p-4 space-y-2">
      <h3 class="font-bold t-main text-sm">${g.title}</h3>
      <ul class="space-y-1.5">
        ${g.items.map(([id, label]) => `
          <li><label class="flex items-start gap-2 text-xs t-muted cursor-pointer"><input type="checkbox" id="${id}" ${saved && saved[id] ? 'checked' : ''}><span>${escapeHtml(label)}</span></label></li>`).join('')}
      </ul>
    </div>`).join('');
  grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => { savePacking(); updatePackingProgress(); });
  });
  updatePackingProgress();
}

function savePacking() {
  const state = {};
  document.querySelectorAll('#packing-grid input[type="checkbox"]').forEach(cb => { state[cb.id] = cb.checked; });
  storageSet(STORAGE_KEYS.packing, state);
}

function updatePackingProgress() {
  const boxes = document.querySelectorAll('#packing-grid input[type="checkbox"]');
  const total = boxes.length;
  const checked = Array.from(boxes).filter(b => b.checked).length;
  const pct = total ? Math.round(checked / total * 100) : 0;
  const t = document.getElementById('packing-progress-text');
  if (t) t.textContent = `${checked} de ${total} elementos`;
  const p = document.getElementById('packing-progress-pct');
  if (p) p.textContent = pct + '%';
  const bar = document.getElementById('packing-progress-bar');
  if (bar) bar.style.width = pct + '%';
}

function resetPacking() {
  if (!confirm('¿Desmarcar toda la lista de equipaje?')) return;
  document.querySelectorAll('#packing-grid input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  savePacking();
  updatePackingProgress();
}
