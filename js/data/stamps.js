// Pasaporte EN2: los 35 municipios oficiales con su punto de sellado rápido
// day: etapa en la que se sella (5, 6, 7 u 8). id: clave guardada en localStorage (n2_stamps).

const stampDayInfo = {
  5: { label: 'Día 5 · N2 Tramo 1', range: 'Chaves ➔ Góis', color: '#0891b2', tag: 'tag-cyan', name: 'Cyan' },
  6: { label: 'Día 6 · N2 Tramo 2', range: 'Pedrógão ➔ Mora', color: '#ca8a04', tag: 'tag-yellow', name: 'Amarillo' },
  7: { label: 'Día 7 · N2 Tramo 3', range: 'Coruche ➔ Almodôvar', color: '#7e22ce', tag: 'tag-purple', name: 'Púrpura' },
  8: { label: 'Día 8 · N2 Tramo 4', range: 'Loulé ➔ Faro', color: '#059669', tag: 'tag-emerald', name: 'Esmeralda' }
};

const stampsData = [
  { n: 1,  id: 'chaves', name: 'Chaves', km: 0, day: 5, lat: 41.7403, lng: -7.4688,
    stamp: 'Café do Km 0 (frente a la rotonda del monolito)', backup: 'Bombeiros Voluntários de Chaves, Rua dos Bombeiros (24/7) · PSP Largo de Camões' },
  { n: 2,  id: 'vila-pouca-de-aguiar', name: 'Vila Pouca de Aguiar', km: 30, day: 5, lat: 41.4985, lng: -7.6440,
    stamp: 'Bombeiros Voluntários (en plena N2)', backup: 'Gasolinera Galp de la N2' },
  { n: 3,  id: 'vila-real', name: 'Vila Real', km: 60, day: 5, lat: 41.2959, lng: -7.7464,
    stamp: 'Esquadra PSP Vila Real (24/7)', backup: 'Repsol de la rotonda N2' },
  { n: 4,  id: 'santa-marta-de-penaguiao', name: 'Santa Marta de Penaguião', km: 78, day: 5, lat: 41.2093, lng: -7.7845,
    stamp: 'Bombeiros Voluntários a pie de N2', backup: 'Cafés de la travesía' },
  { n: 5,  id: 'peso-da-regua', name: 'Peso da Régua', km: 88, day: 5, lat: 41.1631, lng: -7.7878,
    stamp: 'Cafés del muelle del Duero', backup: 'Bombeiros tras cruzar el puente' },
  { n: 6,  id: 'lamego', name: 'Lamego', km: 100, day: 5, lat: 41.0970, lng: -7.8090,
    stamp: 'Café frente a la escalera de los Remédios', backup: 'Bombeiros Voluntários de Lamego' },
  { n: 7,  id: 'castro-daire', name: 'Castro Daire', km: 135, day: 5, lat: 40.8986, lng: -7.9343,
    stamp: 'Bombeiros Voluntários de Castro Daire (en la N2)', backup: 'Gasolinera Galp' },
  { n: 8,  id: 'sao-pedro-do-sul', name: 'São Pedro do Sul', km: 155, day: 5, lat: 40.7600, lng: -8.0650,
    stamp: 'Café del cruce de la N2', backup: 'Bombeiros de Santa Cruz da Trapa' },
  { n: 9,  id: 'viseu', name: 'Viseu', km: 180, day: 5, lat: 40.6566, lng: -7.9125,
    stamp: 'Esquadra PSP Viseu (24/7)', backup: 'Galp N2 (Avenida da Europa)' },
  { n: 10, id: 'tondela', name: 'Tondela', km: 205, day: 5, lat: 40.5170, lng: -8.0830,
    stamp: 'Bombeiros Voluntários de Tondela (fachada a la N2)', backup: 'Cafés de la travesía' },
  { n: 11, id: 'santa-comba-dao', name: 'Santa Comba Dão', km: 225, day: 5, lat: 40.3893, lng: -8.1310,
    stamp: 'Gasolinera Cepsa / Galp de la N2', backup: 'Bombeiros Voluntários' },
  { n: 12, id: 'mortagua', name: 'Mortágua', km: 240, day: 5, lat: 40.3970, lng: -8.2340,
    stamp: 'Estación de servicio del cruce N2', backup: 'Bombeiros Voluntários' },
  { n: 13, id: 'penacova', name: 'Penacova', km: 255, day: 5, lat: 40.2700, lng: -8.2810,
    stamp: 'Café Miradouro de Penacova', backup: 'Bombeiros de Penacova' },
  { n: 14, id: 'vila-nova-de-poiares', name: 'Vila Nova de Poiares', km: 268, day: 5, lat: 40.2100, lng: -8.2580,
    stamp: 'Bombeiros Voluntários (en la travesía N2)', backup: 'Cafés de la travesía' },
  { n: 15, id: 'lousa', name: 'Lousã', km: 278, day: 5, lat: 40.1120, lng: -8.2470,
    stamp: 'Bombeiros Voluntários da Lousã', backup: 'Pastelería de la N2' },
  { n: 16, id: 'gois', name: 'Góis', km: 285, day: 5, lat: 40.1560, lng: -8.1100,
    stamp: 'Moto Clube de Góis junto al río Ceira', backup: 'Bombeiros de Góis' },

  { n: 17, id: 'pedrogao-grande', name: 'Pedrógão Grande', km: 310, day: 6, lat: 39.9180, lng: -8.1460,
    stamp: 'Bombeiros Voluntários (junto al puente del embalse do Cabril)', backup: 'Galp N2' },
  { n: 18, id: 'serta', name: 'Sertã', km: 345, day: 6, lat: 39.8010, lng: -8.1000,
    stamp: 'Pastelaria Império (junto al puente N2)', backup: 'Bombeiros da Sertã' },
  { n: 19, id: 'vila-de-rei', name: 'Vila de Rei', km: 375, day: 6, lat: 39.6760, lng: -8.1490,
    stamp: 'Monolito Picoto da Melriça (Centro Geodésico)', backup: 'Bombeiros de Vila de Rei' },
  { n: 20, id: 'sardoal', name: 'Sardoal', km: 405, day: 6, lat: 39.5370, lng: -8.1620,
    stamp: 'Bombeiros Voluntários de Sardoal (pegados a la N2)', backup: 'Cafés del centro' },
  { n: 21, id: 'abrantes', name: 'Abrantes', km: 420, day: 6, lat: 39.4630, lng: -8.1990,
    stamp: 'Galp Rossio ao Sul do Tejo (cruce del río)', backup: 'Bombeiros de Abrantes' },
  { n: 22, id: 'ponte-de-sor', name: 'Ponte de Sor', km: 455, day: 6, lat: 39.2490, lng: -8.0100,
    stamp: 'Estación BP de la N2', backup: 'Bombeiros Voluntários' },
  { n: 23, id: 'avis', name: 'Avis', km: 475, day: 6, lat: 39.0560, lng: -7.8910,
    stamp: 'Cruce N2 con Avis', backup: 'Bombeiros de Avis',
    note: 'Queda al sureste de Montargil: bucle opcional la tarde del Día 6 o primera hora del Día 7.' },
  { n: 24, id: 'mora', name: 'Mora', km: 490, day: 6, lat: 38.9440, lng: -8.1630,
    stamp: 'Bombeiros de Mora', backup: 'Cafetería de la entrada al Fluviário',
    note: 'Queda al sur de Montargil: se sella de paso a primera hora del Día 7 si no da la luz el Día 6.' },

  { n: 25, id: 'coruche', name: 'Coruche', km: 510, day: 7, lat: 38.9580, lng: -8.5270,
    stamp: 'Gasolinera de la travesía N2', backup: 'Bombeiros de Coruche' },
  { n: 26, id: 'montemor-o-novo', name: 'Montemor-o-Novo', km: 545, day: 7, lat: 38.6480, lng: -8.2160,
    stamp: 'Bombeiros Voluntários', backup: 'Gasolinera del cruce N2' },
  { n: 27, id: 'viana-do-alentejo', name: 'Viana do Alentejo', km: 575, day: 7, lat: 38.3330, lng: -8.0000,
    stamp: 'Bombeiros Voluntários (variante del castillo)', backup: 'Cafés de la plaza' },
  { n: 28, id: 'alcacer-do-sal', name: 'Alcácer do Sal (Torrão)', km: 590, day: 7, lat: 38.2950, lng: -8.2240,
    stamp: 'Café del límite comarcal N2 (Torrão)', backup: 'Hito kilométrico de la N2' },
  { n: 29, id: 'ferreira-do-alentejo', name: 'Ferreira do Alentejo', km: 615, day: 7, lat: 38.0580, lng: -8.1150,
    stamp: 'Cafetería de la rotonda del olivo milenario', backup: 'Bombeiros Voluntários' },
  { n: 30, id: 'aljustrel', name: 'Aljustrel', km: 635, day: 7, lat: 37.8780, lng: -8.1650,
    stamp: 'Bombeiros Voluntários de Aljustrel (avenida N2)', backup: 'Cafés de la avenida' },
  { n: 31, id: 'castro-verde', name: 'Castro Verde', km: 655, day: 7, lat: 37.6980, lng: -8.0860,
    stamp: 'Galp N2', backup: 'Bombeiros de Castro Verde' },
  { n: 32, id: 'almodovar', name: 'Almodôvar', km: 675, day: 7, lat: 37.5110, lng: -8.0600,
    stamp: 'Bombeiros de Almodôvar', backup: 'Café del inicio de la sierra' },

  { n: 33, id: 'loule', name: 'Loulé', km: 715, day: 8, lat: 37.2360, lng: -7.9330,
    stamp: 'Café A Tia Bia (Barranco do Velho)', backup: 'Bombeiros de Loulé (en la ciudad)' },
  { n: 34, id: 'sao-bras-de-alportel', name: 'São Brás de Alportel', km: 725, day: 8, lat: 37.1520, lng: -7.8880,
    stamp: 'Bombeiros de São Brás', backup: 'Quiosco N2 del Museu do Traje' },
  { n: 35, id: 'faro', name: 'Faro', km: 738, day: 8, lat: 37.0194, lng: -7.9322,
    stamp: 'Marco Km 738 / Templo N2', backup: 'Moto Clube de Faro · Bombeiros Voluntários de Faro, Rua Dr. Júlio Filipe de Almeida Carrapato (24/7)' }
];

// Dónde comprar el pasaporte y recoger el diploma
const passportOffices = {
  start: {
    title: 'Comprar el Pasaporte · Chaves (Km 0)',
    main: ['Café do Km 0 (frente a la rotonda del monolito, abierto 7 días/semana)', 'Posto de Turismo de Chaves · Terreiro de Cavalaria (09:30–13:00 / 14:30–18:00)'],
    backup: ['Quartel de Bombeiros Voluntários de Chaves · Rua dos Bombeiros (24/7)', 'Esquadra da PSP de Chaves · Largo de Camões (24/7)'],
    lat: 41.7403, lng: -7.4688
  },
  end: {
    title: 'Recoger el Diploma · Faro (Km 738)',
    main: ['Templo N2 (junto al Marco Km 738)', 'Posto de Turismo de Faro · Rua da Misericórdia'],
    backup: ['Moto Clube de Faro (sede oficial)', 'Quartel de Bombeiros Voluntários de Faro · Rua Dr. Júlio Filipe de Almeida Carrapato (24/7)'],
    lat: 37.0194, lng: -7.9322
  }
};
