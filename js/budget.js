// Tab 5: calculadora de presupuesto en solitario con la Africa Twin

const budgetDefaults = {
  consumption: 9.0,   // L/100 km
  fuelPrice: 1.90,    // €/L
  km: 2650,
  campingNight: 15,   // €/noche
  foodPerDay: 28,     // €/día
  tolls: 25,          // € EasyToll
  maint: 20,          // € lubricante + lavados
  hotel: 45,          // € noche en hotel de Chaves
  campingNights: 8,   // noches de tienda
  hotelNights: 1,     // Chaves (camping cerrado)
  days: 9.5
};

function budgetValues() {
  const num = (id, fallback) => {
    const el = document.getElementById(id);
    const v = el ? Number(el.value) : NaN;
    return Number.isFinite(v) ? v : fallback;
  };
  return {
    consumption: num('b-consumption', budgetDefaults.consumption),
    fuelPrice: num('b-fuel-price', budgetDefaults.fuelPrice),
    km: num('b-km', budgetDefaults.km),
    campingNight: num('b-camping', budgetDefaults.campingNight),
    foodPerDay: num('b-food', budgetDefaults.foodPerDay),
    tolls: num('b-tolls', budgetDefaults.tolls),
    maint: num('b-maint', budgetDefaults.maint),
    hotel: num('b-hotel', budgetDefaults.hotel)
  };
}

function computeBudget(v) {
  const liters = v.km / 100 * v.consumption;
  const fuel = liters * v.fuelPrice;
  const camping = budgetDefaults.campingNights * v.campingNight;
  const hotel = budgetDefaults.hotelNights * v.hotel;
  const lodging = camping + hotel;
  const food = budgetDefaults.days * v.foodPerDay;
  const tollsMaint = v.tolls + v.maint;
  const total = fuel + lodging + food + tollsMaint;
  return { liters, fuel, camping, hotel, lodging, food, tollsMaint, total, perKm: v.km ? total / v.km : 0, perDay: total / budgetDefaults.days };
}

function updateBudget() {
  if (!document.getElementById('b-consumption')) return;
  const v = budgetValues();
  const r = computeBudget(v);
  const set = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };

  set('b-consumption-label', `${formatNum(v.consumption, 1)} L/100 km`);
  set('b-fuel-price-label', `${formatNum(v.fuelPrice, 2)} €/L`);
  set('b-km-label', `${formatNum(v.km)} km`);
  set('b-km-hint', `Planificado: ${formatNum(routeTotals.plannedKm)} km`);
  set('b-camping-label', `${formatEuro(v.campingNight)} / noche`);
  set('b-food-label', `${formatEuro(v.foodPerDay)} / día`);

  set('b-total', formatEuro(r.total));
  set('b-per-km', `${formatNum(r.perKm, 2)} €/km`);
  set('b-per-day', formatEuro(r.perDay));

  set('b-fuel', formatEuro(r.fuel));
  set('b-fuel-detail', `${formatNum(r.liters, 1)} L totales × ${formatNum(v.fuelPrice, 2)} €/L`);
  set('b-lodging', formatEuro(r.lodging));
  set('b-lodging-detail', `${budgetDefaults.campingNights} noches × ${formatEuro(v.campingNight)} + ${budgetDefaults.hotelNights} hotel ${formatEuro(v.hotel)}`);
  set('b-food-total', formatEuro(r.food));
  set('b-food-detail', `${formatNum(budgetDefaults.days, 1)} días × ${formatEuro(v.foodPerDay)}`);
  set('b-tolls-total', formatEuro(r.tollsMaint));
  set('b-tolls-detail', `EasyToll ${formatEuro(v.tolls)} + lubricante/lavado ${formatEuro(v.maint)}`);

  if (r.total > 0) {
    const pct = x => (x / r.total * 100);
    const widths = { 'bar-fuel': pct(r.fuel), 'bar-lodging': pct(r.lodging), 'bar-food': pct(r.food), 'bar-tolls': pct(r.tollsMaint) };
    Object.keys(widths).forEach(id => { const el = document.getElementById(id); if (el) el.style.width = widths[id].toFixed(1) + '%'; });
  }
}

function resetBudget() {
  const map = {
    'b-consumption': budgetDefaults.consumption, 'b-fuel-price': budgetDefaults.fuelPrice, 'b-km': budgetDefaults.km,
    'b-camping': budgetDefaults.campingNight, 'b-food': budgetDefaults.foodPerDay, 'b-tolls': budgetDefaults.tolls,
    'b-maint': budgetDefaults.maint, 'b-hotel': budgetDefaults.hotel
  };
  Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) el.value = map[id]; });
  updateBudget();
}

function copyBudgetSummary() {
  const v = budgetValues();
  const r = computeBudget(v);
  const text = `🏍️ *PORTUGAL N2 & IBERIAN MOUNTAIN LOOPS*
📅 4–13 de diciembre de 2026 (9,5 días · 10 etapas)
🏍️ Honda CRF1100L Africa Twin · en solitario
🛣️ ${formatNum(v.km)} km · Málaga ➔ Chaves ➔ EN2 completa ➔ Faro ➔ Málaga
⛽ Combustible: ${formatEuro(r.fuel)} (${formatNum(r.liters, 1)} L a ${formatNum(v.consumption, 1)} L/100 km)
⛺ Alojamiento: ${formatEuro(r.lodging)}
🍽️ Manutención: ${formatEuro(r.food)}
🛣️ Peajes y mantenimiento: ${formatEuro(r.tollsMaint)}
💰 *Total: ${formatEuro(r.total)}* (${formatNum(r.perKm, 2)} €/km)`;
  const btn = document.getElementById('btn-share');
  const done = () => {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ ¡Copiado!';
    setTimeout(() => { btn.innerHTML = orig; }, 2200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => window.prompt('Copia el resumen:', text));
  } else {
    window.prompt('Copia el resumen:', text);
  }
}
