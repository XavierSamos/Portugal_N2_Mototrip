// Cálculo de salida y puesta de sol (algoritmo "Almanac for Computers"), sin dependencias ni red.
// Devuelve horas locales decimales para una fecha y coordenadas dadas.

const SUN_RAD = Math.PI / 180;

function sunEventUT(year, month, day, lat, lng, rising) {
  const sin = d => Math.sin(d * SUN_RAD), cos = d => Math.cos(d * SUN_RAD), tan = d => Math.tan(d * SUN_RAD);
  const N1 = Math.floor(275 * month / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const N = N1 - N2 * N3 + day - 30;
  const lngHour = lng / 15;
  const t = N + ((rising ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = (M + 1.916 * sin(M) + 0.020 * sin(2 * M) + 282.634) % 360;
  if (L < 0) L += 360;
  let RA = (Math.atan(0.91764 * tan(L)) / SUN_RAD);
  RA = ((RA % 360) + 360) % 360;
  RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;
  RA /= 15;
  const sinDec = 0.39782 * sin(L);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (cos(90.833) - sinDec * sin(lat)) / (cosDec * cos(lat));
  if (cosH > 1 || cosH < -1) return null;
  let H = Math.acos(cosH) / SUN_RAD;
  if (rising) H = 360 - H;
  H /= 15;
  const T = H + RA - 0.06571 * t - 6.622;
  return (((T - lngHour) % 24) + 24) % 24;
}

// tz = desfase horario local respecto a UTC (Portugal en diciembre: 0, España: +1)
function sunTimes(year, month, day, lat, lng, tz) {
  const rise = sunEventUT(year, month, day, lat, lng, true);
  const set = sunEventUT(year, month, day, lat, lng, false);
  return {
    sunrise: rise === null ? null : (rise + tz + 24) % 24,
    sunset: set === null ? null : (set + tz + 24) % 24
  };
}

function formatHour(h) {
  if (h === null || h === undefined) return '—';
  const total = Math.round(h * 60);
  return String(Math.floor(total / 60) % 24).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}
