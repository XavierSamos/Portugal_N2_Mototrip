// Las 10 etapas (Día 0 a Día 9) del Gran Bucle Ibérico · Diciembre 2026
// Fuente principal del itinerario, del mapa por etapas y del roadbook imprimible.
// phase: 'sierras' (Fase 1, verde) · 'n2' (Fase 2, azul) · 'regreso' (Fase 3, naranja)

const phaseInfo = {
  sierras: { label: 'Fase 1 · Sierras hasta Chaves', short: 'Sierras', color: '#047857', tag: 'tag-green' },
  n2:      { label: 'Fase 2 · Estrada Nacional 2',   short: 'N2',      color: '#1d4ed8', tag: 'tag-blue' },
  regreso: { label: 'Fase 3 · Regreso a casa',        short: 'Regreso', color: '#c2410c', tag: 'tag-orange' }
};

const stagesData = [
  {
    day: 0, date: 'Viernes 4 Diciembre 2026', dateShort: 'Vie 4 Dic', phase: 'sierras',
    title: 'Málaga ➔ San Pedro ➔ Serranía de Ronda (A-397)',
    km: 130, time: '2,5 h', roads: 'A-7 (enlace) · A-397',
    cities: ['Málaga', 'San Pedro Alcántara', 'Ronda'],
    waypoints: [
      { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
      { name: 'Marbella', lat: 36.5101, lng: -4.8825 },
      { name: 'San Pedro Alcántara', lat: 36.4880, lng: -4.9910 },
      { name: 'Puerto del Madroño (A-397)', lat: 36.5990, lng: -5.0610 },
      { name: 'Ronda', lat: 36.7423, lng: -5.1671 }
    ],
    night: { name: 'Camping El Sur (Ronda)', type: 'camping', campingId: 'ronda', lat: 36.7270, lng: -5.1730 },
    maxAlt: 1050, altPass: 'Puerto del Madroño · A-397 (~1.050 m)',
    stamps: 0, timezone: 'España (UTC+1) · Puesta de sol 18:04',
    lunch: 'Comida en casa antes de cargar; tapa rápida en Ronda al llegar',
    summary: 'Salida de tarde tras el trabajo. Enlace corto por la costa y subida por la A-397: 40 km de curvas enlazadas con firme excelente desde San Pedro hasta la Serranía. Montaje de tienda en Ronda con la última luz.',
    gmaps: 'https://www.google.com/maps/dir/Malaga/San+Pedro+Alcantara/Ronda',
    timeline: [
      { time: '13:30 - 14:30', act: 'Carga final de la Africa Twin: maletas, saco, tienda y kit tubeless. Presiones en frío (2,25 / 2,50 bar con carga).' },
      { time: '14:30 - 15:30', act: 'Enlace por la costa hasta San Pedro Alcántara evitando la hora punta de Marbella.' },
      { time: '15:30 - 16:30', act: '🏍️ A-397 San Pedro ➔ Ronda: el primer gran tramo de curvas del viaje. Modo Tour, ritmo fluido.' },
      { time: '16:45', act: '⛺ Llegada al Camping El Sur: montaje de la tienda con luz (sol hasta ~18:05 en España).' },
      { time: '19:30', act: 'Paseo al Puente Nuevo y cena de rabo de toro en Ronda.' }
    ],
    sightIds: [], passIds: ['a397']
  },
  {
    day: 1, date: 'Sábado 5 Diciembre 2026', dateShort: 'Sáb 5 Dic', phase: 'sierras',
    title: 'Ronda ➔ Grazalema ➔ Puerto de las Palomas (1.357 m) ➔ Arcos ➔ Aracena',
    km: 290, time: '5,5 h', roads: 'A-372 · CA-9104 · A-372 · A-375 · N-433',
    cities: ['Ronda', 'Grazalema', 'Puerto de las Palomas', 'Zahara de la Sierra', 'Arcos de la Frontera', 'Aracena'],
    waypoints: [
      { name: 'Ronda', lat: 36.7423, lng: -5.1671 },
      { name: 'Grazalema', lat: 36.7590, lng: -5.3670 },
      { name: 'Puerto de las Palomas', lat: 36.7860, lng: -5.3840 },
      { name: 'Zahara de la Sierra', lat: 36.8400, lng: -5.3910 },
      { name: 'Arcos de la Frontera', lat: 36.7500, lng: -5.8060 },
      { name: 'Utrera', lat: 37.1850, lng: -5.7810 },
      { name: 'Castilblanco de los Arroyos', lat: 37.6750, lng: -5.9880 },
      { name: 'Aracena', lat: 37.8920, lng: -6.5610 }
    ],
    night: { name: 'Camping El Madroñal (Fuenteheridos, Sierra de Aracena)', type: 'camping', campingId: 'aracena', lat: 37.9050, lng: -6.6600 },
    maxAlt: 1357, altPass: 'Puerto de las Palomas (1.357 m)',
    stamps: 0, timezone: 'España (UTC+1) · Puesta de sol 18:07',
    lunch: 'Venta en Arcos: chicharrones, ajo campero y café',
    summary: 'La gran jornada de puertos andaluces: Grazalema, la subida en zigzag al Puerto de las Palomas y la bajada vertiginosa a Zahara con el embalse a tus pies. Enlace por la campiña y llegada a la Sierra de Aracena entre castaños.',
    gmaps: 'https://www.google.com/maps/dir/Ronda/Grazalema/Puerto+de+las+Palomas/Zahara+de+la+Sierra/Arcos+de+la+Frontera/Aracena',
    timeline: [
      { time: '08:30 - 08:45', act: 'Desmontaje de la tienda (escarcha probable). Café y salida a las 08:45 con la primera luz útil.' },
      { time: '08:45 - 10:00', act: '🏍️ A-372 hasta Grazalema y subida al Puerto de las Palomas (1.357 m). Modo Gravel si hay humedad o hielo en sombras.' },
      { time: '10:00 - 10:30', act: '📸 Mirador de Zahara y café en el pueblo.' },
      { time: '10:30 - 12:00', act: 'Bajada hacia Arcos de la Frontera por la A-372.' },
      { time: '12:00', act: '⛽ Repostaje en Arcos (km ~110). Siguiente repostaje obligatorio antes del km 290.' },
      { time: '12:15 - 13:15', act: 'Comida corta en venta de carretera.' },
      { time: '13:15 - 16:15', act: 'Enlace por secundarias de la campiña sevillana y subida a la Sierra Norte por la A-8002 / N-433.' },
      { time: '15:30', act: '⛽ Repostaje de seguridad en Castilblanco / Aracena (alerta 180 km).' },
      { time: '16:30', act: '⛺ Llegada al camping y montaje de la tienda antes de las 16:45.' },
      { time: '19:30', act: 'Cena ibérica en Aracena: jamón de Jabugo y setas de temporada.' }
    ],
    sightIds: [], passIds: ['palomas']
  },
  {
    day: 2, date: 'Domingo 6 Diciembre 2026 (Día de la Constitución)', dateShort: 'Dom 6 Dic', phase: 'sierras',
    title: 'Aracena ➔ Rosal ➔ Mértola (N122) ➔ Monsaraz ➔ Marvão',
    km: 310, time: '6 h', roads: 'N-433 · IP8 · N122 · N255 · N256 · N246-1',
    cities: ['Aracena', 'Rosal de la Frontera', 'Mértola', 'Monsaraz', 'Elvas', 'Marvão'],
    waypoints: [
      { name: 'Aracena', lat: 37.8920, lng: -6.5610 },
      { name: 'Rosal de la Frontera', lat: 37.9670, lng: -7.2190 },
      { name: 'Serpa', lat: 37.9440, lng: -7.5980 },
      { name: 'Mértola', lat: 37.6420, lng: -7.6620 },
      { name: 'Moura', lat: 38.1400, lng: -7.4490 },
      { name: 'Monsaraz', lat: 38.4430, lng: -7.3800 },
      { name: 'Elvas', lat: 38.8810, lng: -7.1630 },
      { name: 'Portalegre', lat: 39.2930, lng: -7.4310 },
      { name: 'Marvão', lat: 39.3940, lng: -7.3770 }
    ],
    night: { name: 'Quinta do Pomarinho (Castelo de Vide · N246) · confirmar', type: 'camping', campingId: 'pomarinho', lat: 39.4028, lng: -7.4856 },
    maxAlt: 860, altPass: 'Castillo de Marvão (850 m)',
    stamps: 0, timezone: '⏰ Cruce a Portugal: retrasa el reloj 1 h (UTC+0) · Puesta de sol 17:06',
    lunch: 'Mértola: migas alentejanas y carne de porco preto',
    summary: 'Cruce de frontera por Rosal y la N122 en el valle del Guadiana hasta la Mértola islámica. Llanuras del Alentejo hasta el pueblo amurallado de Monsaraz sobre el Alqueva y final colgado en el nido de águilas de Marvão. Ganas una hora al cruzar.',
    gmaps: 'https://www.google.com/maps/dir/Aracena/Rosal+de+la+Frontera/Mertola/Monsaraz/Marvao',
    timeline: [
      { time: '08:30 (ES)', act: 'Salida de Aracena (08:30 hora española = 07:30 hora portuguesa).' },
      { time: '08:15 - 09:15 (PT)', act: 'N-433 hasta Rosal y frontera. Desde aquí, reloj en hora portuguesa.' },
      { time: '09:15 - 10:15', act: '🏍️ N122 por el valle del Guadiana hasta Mértola. Asfalto ondulado, mucho ganado suelto.' },
      { time: '10:15 - 11:00', act: '📸 Mértola: castillo e iglesia-mezquita. ⛽ Repostaje (km ~130).' },
      { time: '11:00 - 12:30', act: 'Moura y orilla del Alqueva hasta Monsaraz.' },
      { time: '12:30 - 13:30', act: 'Comida en Monsaraz con vistas al embalse.' },
      { time: '13:30 - 16:00', act: 'Enlace por Elvas y Portalegre (N246) hacia la Serra de São Mamede.' },
      { time: '14:45', act: '⛽ Repostaje de seguridad en Elvas o Portalegre (alerta 180 km desde Mértola).' },
      { time: '16:15', act: '⛺ Llegada a Quinta do Pomarinho (a ~10 km de Marvão; el Camping Asseiceira cierra en invierno) y montaje con luz (anochece a las 17:06).' },
      { time: '17:00', act: 'Atardecer frío en la muralla de Marvão antes de volver a la tienda.' }
    ],
    sightIds: ['marvao'], passIds: ['n122']
  },
  {
    day: 3, date: 'Lunes 7 Diciembre 2026 (Puente)', dateShort: 'Lun 7 Dic', phase: 'sierras',
    title: 'Marvão ➔ Castelo Branco ➔ Covilhã ➔ Torre (1.993 m) ➔ Manteigas',
    km: 220, time: '5 h', roads: 'N246 · N18 · N339 · N338',
    cities: ['Marvão', 'Castelo de Vide', 'Castelo Branco', 'Covilhã', 'Torre', 'Manteigas'],
    waypoints: [
      { name: 'Marvão', lat: 39.3940, lng: -7.3770 },
      { name: 'Castelo de Vide', lat: 39.4160, lng: -7.4560 },
      { name: 'Nisa', lat: 39.5180, lng: -7.6480 },
      { name: 'Castelo Branco', lat: 39.8220, lng: -7.4910 },
      { name: 'Fundão', lat: 40.1390, lng: -7.5010 },
      { name: 'Covilhã', lat: 40.2810, lng: -7.5040 },
      { name: 'Penhas da Saúde', lat: 40.2950, lng: -7.5470 },
      { name: 'Torre (1.993 m)', lat: 40.3217, lng: -7.6114 },
      { name: 'Manteigas', lat: 40.4020, lng: -7.5390 }
    ],
    night: { name: 'Parque de Campismo Relva da Reboleira (Manteigas)', type: 'camping', campingId: 'manteigas', lat: 40.3920, lng: -7.5330 },
    maxAlt: 1993, altPass: 'Torre · Serra da Estrela (1.993 m)',
    stamps: 0, timezone: 'Portugal (UTC+0) · Puesta de sol 17:04',
    lunch: 'Covilhã: queijo da Serra amanteigado y sopa de feijão',
    summary: 'Etapa reina de altura: subida desde Covilhã por la N339 hasta la Torre, el techo de Portugal continental, y bajada por el valle glaciar del Zêzere (N338) hasta Manteigas. En diciembre la N339 puede cerrarse por nieve: consulta el estado antes de salir.',
    gmaps: 'https://www.google.com/maps/dir/Marvao/Castelo+Branco/Covilha/Torre,+Serra+da+Estrela/Manteigas',
    winterAlert: 'Si la N339 está cerrada por nieve o hielo (frecuente en diciembre), plan B: Covilhã ➔ N18 Belmonte ➔ Valhelhas ➔ N232 Manteigas por el valle (sin pasar de 900 m). Consulta el estado de las carreteras de la Serra da Estrela a primera hora.',
    timeline: [
      { time: '08:30', act: 'Desayuno y desmontaje (posible tienda húmeda: secar en Covilhã si hay sol).' },
      { time: '08:45 - 10:45', act: 'Enlace por Castelo de Vide, Nisa y Castelo Branco por la N18.' },
      { time: '10:45', act: '⛽ Repostaje en Castelo Branco o Fundão (lleno obligatorio antes de subir a la Serra).' },
      { time: '11:15 - 12:00', act: 'Llegada a Covilhã y comprobación del estado de la N339 (Penhas da Saúde ➔ Torre).' },
      { time: '12:00 - 13:00', act: '🏔️ Subida a la Torre (1.993 m). Modo Gravel, ojo a placas de hielo en curvas en sombra y gravilla de las quitanieves.' },
      { time: '13:00 - 14:00', act: 'Comida caliente en la zona de la Torre o en Penhas da Saúde.' },
      { time: '14:00 - 15:00', act: '🏍️ Bajada por el Valle Glaciar del Zêzere (N338): la garganta en U más espectacular del país.' },
      { time: '15:15', act: '⛺ Llegada a Manteigas y montaje en la Relva da Reboleira. Noche muy fría (−3 °C posible): saco de confort −5 °C.' },
      { time: '19:00', act: 'Cena de cabrito y vino de la Beira en Manteigas.' }
    ],
    sightIds: ['torre', 'zezere'], passIds: ['n338']
  },
  {
    day: 4, date: 'Martes 8 Diciembre 2026 (Inmaculada)', dateShort: 'Mar 8 Dic', phase: 'sierras',
    title: 'Manteigas ➔ Gouveia ➔ Pinhão ➔ N222 Duero ➔ Peso da Régua ➔ Chaves (Km 0)',
    km: 190, time: '5 h', roads: 'N232 · N17 · N323 · N222 · N2 (enlace) · A24/N2',
    cities: ['Manteigas', 'Gouveia', 'São João da Pesqueira', 'Pinhão', 'Peso da Régua', 'Vidago', 'Chaves'],
    waypoints: [
      { name: 'Manteigas', lat: 40.4020, lng: -7.5390 },
      { name: 'Gouveia', lat: 40.4940, lng: -7.5920 },
      { name: 'Trancoso', lat: 40.7790, lng: -7.3490 },
      { name: 'São João da Pesqueira', lat: 41.1480, lng: -7.4040 },
      { name: 'Pinhão', lat: 41.1880, lng: -7.5450 },
      { name: 'Peso da Régua', lat: 41.1631, lng: -7.7878 },
      { name: 'Vila Real', lat: 41.2959, lng: -7.7464 },
      { name: 'Vidago', lat: 41.6330, lng: -7.5700 },
      { name: 'Chaves', lat: 41.7403, lng: -7.4688 }
    ],
    night: { name: 'Hotel / residencial en Chaves (camping cerrado en diciembre)', type: 'hotel', campingId: null, lat: 41.7380, lng: -7.4700 },
    maxAlt: 1500, altPass: 'Salida de la Serra por Gouveia (N232 ~1.400 m)',
    stamps: 0, timezone: 'Portugal (UTC+0) · Puesta de sol 16:59 (¡la más temprana!)',
    lunch: 'Pinhão: bacalhau à Brás junto al río y un Porto Tawny (solo uno)',
    summary: 'Cruce de la Serra hacia el norte y el gran premio del día: la N222 Pinhão ➔ Peso da Régua, votada mejor carretera de conducción del mundo, pegada al Duero entre bancales de viñedo. Llegada a Chaves para comprar el Pasaporte EN2 en el Café do Km 0.',
    gmaps: 'https://www.google.com/maps/dir/Manteigas/Pinhao/Peso+da+Regua/Vidago/Chaves',
    timeline: [
      { time: '08:15', act: 'Salida de Manteigas por la N232 hacia Gouveia (tramo de montaña con posible hielo a primera hora).' },
      { time: '09:30', act: '⛽ Repostaje en Gouveia.' },
      { time: '09:30 - 11:30', act: 'Enlace norte por la meseta de Trancoso hacia el Douro.' },
      { time: '11:30 - 12:30', act: '🏍️ N222 Pinhão ➔ Peso da Régua: 27 km de curvas perfectas junto al río. Para en el mirador de São Leonardo de Galafura si vas bien de hora.' },
      { time: '12:30 - 13:30', act: 'Comida en Régua o Pinhão.' },
      { time: '13:30 - 15:30', act: 'Subida a Vila Real y Vidago por la N2 en sentido inverso (reconocimiento del Día 5).' },
      { time: '15:30', act: '⛽ Repostaje en Chaves: lleno para salir mañana a las 08:00 sin paradas extra.' },
      { time: '15:45 - 16:30', act: '🛂 Compra del Pasaporte EN2 en el Café do Km 0 (o Posto de Turismo hasta las 18:00). Foto en el Marco Km 0.' },
      { time: '16:45', act: '🏨 Check-in en hotel / residencial de Chaves (camping Quinta do Rebentão CERRADO en diciembre). Hoy anochece a las 16:59: no te retrases.' },
      { time: '20:00', act: 'Cena: pastel de Chaves y presunto. Planificar los 16 sellos del Día 5.' }
    ],
    sightIds: ['n222', 'galafura', 'km0', 'ponte-trajano'], passIds: ['n222']
  },
  {
    day: 5, date: 'Miércoles 9 Diciembre 2026', dateShort: 'Mié 9 Dic', phase: 'n2',
    title: 'N2 Tramo 1: Chaves (Km 0) ➔ Vila Real ➔ Lamego ➔ Viseu ➔ Penacova ➔ Góis (Km 285)',
    km: 220, time: '6,5 h', roads: 'N2',
    cities: ['Chaves', 'Vila Pouca de Aguiar', 'Vila Real', 'Peso da Régua', 'Lamego', 'Castro Daire', 'Viseu', 'Penacova', 'Góis'],
    waypoints: [
      { name: 'Chaves (Km 0)', lat: 41.7403, lng: -7.4688 },
      { name: 'Vila Real', lat: 41.2959, lng: -7.7464 },
      { name: 'Peso da Régua', lat: 41.1631, lng: -7.7878 },
      { name: 'Lamego', lat: 41.0970, lng: -7.8090 },
      { name: 'Castro Daire', lat: 40.8986, lng: -7.9343 },
      { name: 'Viseu', lat: 40.6566, lng: -7.9125 },
      { name: 'Penacova', lat: 40.2700, lng: -8.2810 },
      { name: 'Góis', lat: 40.1560, lng: -8.1100 }
    ],
    night: { name: 'Parque de Campismo de Góis (río Ceira)', type: 'camping', campingId: 'gois', lat: 40.1530, lng: -8.1080 },
    maxAlt: 1000, altPass: 'Serra do Montemuro (Castro Daire ~900 m)',
    stamps: 16, timezone: 'Portugal (UTC+0) · Puesta de sol 17:07',
    lunch: 'Viseu: vitela assada à Lafões y vino del Dão',
    summary: 'Arranca la mítica: Km 0 en Chaves y descenso por Trás-os-Montes, el Duero en Régua, la escalera barroca de Lamego, la Serra do Montemuro y la Beira hasta Góis. Día de 16 sellos: pasaporte siempre en la bolsa sobredepósito y paradas exprés de 5 minutos.',
    gmaps: 'https://www.google.com/maps/dir/Chaves/Vila+Real/Peso+da+Regua/Lamego/Castro+Daire/Viseu/Penacova/Gois',
    timeline: [
      { time: '07:45 - 08:00', act: '🛂 Sello 1: Chaves (Café do Km 0 o Bombeiros). Foto en el monolito y salida a las 08:00.' },
      { time: '08:30 - 09:30', act: 'Sellos 2–4: Vila Pouca de Aguiar, Vila Real (PSP 24h) y Santa Marta de Penaguião.' },
      { time: '09:45 - 10:30', act: 'Sellos 5–6: Peso da Régua (muelle) y Lamego (café de los Remédios). ☕ Café rápido.' },
      { time: '11:00 - 12:15', act: 'Sellos 7–9: Castro Daire, São Pedro do Sul y Viseu. ⛽ Repostaje en Viseu (km ~180 desde Chaves).' },
      { time: '12:15 - 13:15', act: 'Comida en Viseu.' },
      { time: '13:30 - 15:00', act: 'Sellos 10–13: Tondela, Santa Comba Dão, Mortágua y Penacova (mirador sobre el Mondego).' },
      { time: '15:15 - 16:15', act: 'Sellos 14–16: Vila Nova de Poiares, Lousã y Góis.' },
      { time: '16:30', act: '⛺ Llegada al camping de Góis junto al río Ceira y montaje antes de las 16:45.' },
      { time: '19:30', act: 'Cena de chanfana (cabra al vino) en Góis.' }
    ],
    sightIds: ['km0', 'remedios'], passIds: []
  },
  {
    day: 6, date: 'Jueves 10 Diciembre 2026', dateShort: 'Jue 10 Dic', phase: 'n2',
    title: 'N2 Tramo 2: Góis ➔ Pedrógão ➔ Sertã ➔ Centro Geodésico ➔ Abrantes ➔ Montargil',
    km: 180, time: '5 h', roads: 'N2',
    cities: ['Góis', 'Pedrógão Grande', 'Sertã', 'Picoto da Melriça', 'Sardoal', 'Abrantes', 'Ponte de Sor', 'Montargil'],
    waypoints: [
      { name: 'Góis', lat: 40.1560, lng: -8.1100 },
      { name: 'Pedrógão Grande', lat: 39.9180, lng: -8.1460 },
      { name: 'Sertã', lat: 39.8010, lng: -8.1000 },
      { name: 'Picoto da Melriça', lat: 39.6940, lng: -8.1300 },
      { name: 'Sardoal', lat: 39.5370, lng: -8.1620 },
      { name: 'Abrantes', lat: 39.4630, lng: -8.1990 },
      { name: 'Ponte de Sor', lat: 39.2490, lng: -8.0100 },
      { name: 'Montargil', lat: 39.0790, lng: -8.1700 }
    ],
    night: { name: 'Camping Orbitur Montargil', type: 'camping', campingId: 'montargil', lat: 39.0690, lng: -8.1630 },
    maxAlt: 600, altPass: 'Picoto da Melriça (592 m)',
    stamps: 8, timezone: 'Portugal (UTC+0) · Puesta de sol 17:10',
    lunch: 'Sertã: maranhos y bucho en la Pastelaria Império para el postre',
    summary: 'El corazón geográfico de Portugal: presas del Zêzere, el puente de la Sertã, el monolito del Centro Geodésico y la bajada hacia el Tajo en Abrantes. Fin en el alcornocal del embalse de Montargil. Avis y Mora quedan al sur de Montargil: si no da la luz, se sellan a primera hora del Día 7.',
    gmaps: 'https://www.google.com/maps/dir/Gois/Pedrogao+Grande/Serta/Picoto+da+Melrica/Abrantes/Ponte+de+Sor/Montargil',
    timeline: [
      { time: '08:30', act: 'Desmontaje y salida de Góis por la N2 de montaña (curvas cerradas y bosque de eucalipto).' },
      { time: '09:15', act: 'Sello 17: Pedrógão Grande (Bombeiros junto a la presa del Cabril).' },
      { time: '10:00', act: 'Sello 18: Sertã · ☕ Pastelaria Império junto al puente.' },
      { time: '10:45', act: '📍 Sello 19: Vila de Rei y subida al Picoto da Melriça (Centro Geodésico de Portugal).' },
      { time: '11:45 - 12:30', act: 'Sellos 20–21: Sardoal y Abrantes (cruce del Tajo). ⛽ Repostaje en Rossio ao Sul do Tejo.' },
      { time: '12:30 - 13:30', act: 'Comida en Abrantes.' },
      { time: '14:15', act: 'Sello 22: Ponte de Sor.' },
      { time: '15:00', act: '⛺ Llegada al Orbitur Montargil (abierto 365 días, agua caliente 24 h).' },
      { time: '15:15 - 16:40', act: 'Opcional sin equipaje: bucle Montargil ➔ Avis ➔ Mora ➔ Montargil (~95 km) para los sellos 23–24. Si no, se hacen mañana temprano.' },
      { time: '19:00', act: 'Cena en el restaurante del embalse y lavado de ropa técnica.' }
    ],
    sightIds: ['melrica', 'montargil'], passIds: []
  },
  {
    day: 7, date: 'Viernes 11 Diciembre 2026', dateShort: 'Vie 11 Dic', phase: 'n2',
    title: 'N2 Tramo 3: Montargil ➔ Mora ➔ Montemor ➔ Viana ➔ Ferreira ➔ Aljustrel ➔ Almodôvar (Km 670)',
    km: 210, time: '5 h', roads: 'N2',
    cities: ['Montargil', 'Mora', 'Coruche', 'Montemor-o-Novo', 'Viana do Alentejo', 'Torrão', 'Ferreira do Alentejo', 'Aljustrel', 'Castro Verde', 'Almodôvar'],
    waypoints: [
      { name: 'Montargil', lat: 39.0790, lng: -8.1700 },
      { name: 'Mora', lat: 38.9440, lng: -8.1630 },
      { name: 'Montemor-o-Novo', lat: 38.6480, lng: -8.2160 },
      { name: 'Viana do Alentejo', lat: 38.3330, lng: -8.0000 },
      { name: 'Ferreira do Alentejo', lat: 38.0580, lng: -8.1150 },
      { name: 'Aljustrel', lat: 37.8780, lng: -8.1650 },
      { name: 'Castro Verde', lat: 37.6980, lng: -8.0860 },
      { name: 'Almodôvar', lat: 37.5110, lng: -8.0600 }
    ],
    night: { name: 'Parque de Campismo de Castro Verde (N2) · confirmar', type: 'camping', campingId: 'castro-verde', lat: 37.7045, lng: -8.0879 },
    maxAlt: 450, altPass: null,
    stamps: 8, timezone: 'Portugal (UTC+0) · Puesta de sol 17:14',
    lunch: 'Montemor-o-Novo: açorda alentejana y sericaia de postre',
    summary: 'El Alentejo infinito: rectas entre alcornoques, pueblos blancos, olivos milenarios y las llanuras cerealistas de Castro Verde. Etapa de navegación tranquila y gasolineras espaciadas: no bajes de medio depósito.',
    gmaps: 'https://www.google.com/maps/dir/Montargil/Mora/Montemor-o-Novo/Viana+do+Alentejo/Ferreira+do+Alentejo/Aljustrel/Castro+Verde/Almodovar',
    timeline: [
      { time: '08:00', act: 'Salida temprana. Si quedaron pendientes: sellos 23–24 Avis y Mora (Bombeiros 24h).' },
      { time: '09:30', act: 'Sello 25: Coruche (gasolinera de la travesía).' },
      { time: '10:30', act: 'Sello 26: Montemor-o-Novo. ⛽ Repostaje (las gasolineras escasean hacia el sur).' },
      { time: '11:30 - 12:15', act: 'Sellos 27–28: Viana do Alentejo y Alcácer do Sal (Torrão).' },
      { time: '12:15 - 13:15', act: 'Comida en Torrão o Ferreira.' },
      { time: '13:30 - 15:00', act: 'Sellos 29–31: Ferreira do Alentejo (olivo milenario), Aljustrel y Castro Verde. ⛽ Lleno en Castro Verde.' },
      { time: '15:45', act: 'Sello 32: Almodôvar (Bombeiros).' },
      { time: '16:15', act: '⛺ Almodôvar no tiene camping verificado: vuelve ~20 km por la N2 al camping de Castro Verde (confirma antes por teléfono) o consulta el Plan B de hoy. Mañana retomas desde Almodôvar.' },
      { time: '19:30', act: 'Cena: ensopado de borrego. Chequeo de cadena y pastillas antes de las 365 curvas.' }
    ],
    sightIds: [], passIds: []
  },
  {
    day: 8, date: 'Sábado 12 Diciembre 2026', dateShort: 'Sáb 12 Dic', phase: 'n2',
    title: 'N2 Tramo 4: Almodôvar ➔ 365 Curvas del Caldeirão ➔ Barranco do Velho ➔ Faro (Km 738)',
    km: 100, time: '3 h', roads: 'N2',
    cities: ['Almodôvar', 'Ameixial', 'Barranco do Velho', 'São Brás de Alportel', 'Faro'],
    waypoints: [
      { name: 'Almodôvar', lat: 37.5110, lng: -8.0600 },
      { name: 'Ameixial', lat: 37.3640, lng: -7.9750 },
      { name: 'Barranco do Velho', lat: 37.2360, lng: -7.9330 },
      { name: 'São Brás de Alportel', lat: 37.1520, lng: -7.8880 },
      { name: 'Faro (Km 738)', lat: 37.0194, lng: -7.9322 }
    ],
    night: { name: 'Camping Municipal de Faro (Praia de Faro)', type: 'camping', campingId: 'faro', lat: 37.0060, lng: -7.9930 },
    maxAlt: 580, altPass: 'Serra do Caldeirão (Barranco do Velho ~520 m)',
    stamps: 3, timezone: 'Portugal (UTC+0) · Puesta de sol 17:16',
    lunch: 'Mariscada de celebración en Faro: cataplana y gambas de la Ría Formosa',
    summary: 'El broche de oro: las 365 curvas de la Serra do Caldeirão, asfalto continuo de serpentina entre alcornoques hasta el café de la Tia Bia en Barranco do Velho. Bajada a São Brás y Faro, Km 738, diploma oficial y noche en la duna de Praia de Faro.',
    gmaps: 'https://www.google.com/maps/dir/Almodovar/Barranco+do+Velho/Sao+Bras+de+Alportel/Faro',
    timeline: [
      { time: '09:00', act: 'Salida sin prisa: asfalto frío a primera hora en la sierra. Modo Tour, ritmo rodador.' },
      { time: '09:00 - 10:30', act: '🏍️ Las 365 curvas de la Serra do Caldeirão (Km 670 ➔ 730).' },
      { time: '10:30', act: '🛂 Sello 33: Loulé · Café A Tia Bia en Barranco do Velho.' },
      { time: '11:15', act: 'Sello 34: São Brás de Alportel.' },
      { time: '12:00', act: '🏁 Sello 35: Faro · Marco Km 738. Foto final con la Africa Twin.' },
      { time: '12:15 - 13:00', act: '🎓 Recogida del Diploma Oficial EN2 (Templo N2 / Posto de Turismo / Moto Clube de Faro).' },
      { time: '13:30 - 15:30', act: '🦐 Mariscada de celebración en la Ribeira de Faro.' },
      { time: '16:00', act: '⛺ Montaje en el Camping Municipal de Praia de Faro (duna entre ría y océano).' },
      { time: '17:15', act: '🌅 Puesta de sol sobre el Atlántico.' }
    ],
    sightIds: ['caldeirao', 'km738'], passIds: ['caldeirao']
  },
  {
    day: 9, date: 'Domingo 13 Diciembre 2026', dateShort: 'Dom 13 Dic', phase: 'regreso',
    title: 'Faro ➔ Tavira ➔ Huelva ➔ Sevilla / Ronda ➔ Málaga',
    km: 410, time: '5,5 h', roads: 'N125 · A22 (EasyToll) · A-49 · A-92 · A-45',
    cities: ['Faro', 'Tavira', 'Vila Real de Santo António', 'Huelva', 'Sevilla', 'Málaga'],
    waypoints: [
      { name: 'Faro', lat: 37.0194, lng: -7.9322 },
      { name: 'Tavira', lat: 37.1270, lng: -7.6480 },
      { name: 'Vila Real de Santo António', lat: 37.1950, lng: -7.4150 },
      { name: 'Huelva', lat: 37.2614, lng: -6.9447 },
      { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
      { name: 'Antequera', lat: 37.0190, lng: -4.5600 },
      { name: 'Málaga', lat: 36.7213, lng: -4.4214 }
    ],
    night: { name: 'Casa (Málaga)', type: 'home', campingId: null, lat: 36.7213, lng: -4.4214 },
    maxAlt: 700, altPass: null,
    stamps: 0, timezone: '⏰ Al cruzar a España adelanta el reloj 1 h (UTC+1) · Puesta de sol 18:02',
    lunch: 'Huelva o Sevilla: tapeo rápido en ruta',
    summary: 'Regreso a casa. Tramo de enlace eficiente: N125 por Tavira, cruce del Guadiana y autovía por Huelva y Sevilla. Si queda energía y luz, alternativa de vuelta por Ronda y la A-397 para cerrar el bucle con curvas.',
    gmaps: 'https://www.google.com/maps/dir/Faro/Tavira/Vila+Real+de+Santo+Antonio/Huelva/Sevilla/Malaga',
    timeline: [
      { time: '08:30 (PT)', act: 'Desmontaje final y secado de la tienda. Salida por la N125 hacia Tavira.' },
      { time: '09:30', act: '☕ Café en Tavira y foto en el puente romano.' },
      { time: '10:30 (PT) = 11:30 (ES)', act: 'Cruce del Guadiana. Reloj en hora española.' },
      { time: '12:30', act: '⛽ Repostaje en Huelva (gasolina más barata en España).' },
      { time: '13:30 - 14:30', act: 'Comida en Sevilla (circunvalación SE-30).' },
      { time: '14:30 - 17:30', act: 'A-92 / A-45 hasta Málaga. ⛽ Repostaje de seguridad en Antequera.' },
      { time: '17:45', act: '🏠 Llegada a casa con luz (sol en Málaga hasta ~18:00). Limpieza y engrase de cadena.' }
    ],
    sightIds: [], passIds: []
  }
];

const routeTotals = {
  stagesKm: stagesData.reduce((s, d) => s + d.km, 0), // suma de etapas
  plannedKm: 2650 // total estimado con desvíos, miradores, enlaces y bucles de sellos
};
