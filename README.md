# Portugal N2 & Iberian Mountain Loops Planner

Planificador estático de la expedición en solitario en Honda CRF1100L Africa Twin: Málaga ➔ sierras ➔ Chaves (Km 0) ➔ Estrada Nacional 2 completa ➔ Faro (Km 738) ➔ Málaga, 4–13 diciembre 2026.

- HTML + JS clásico (sin módulos ES) + Tailwind (CDN) + Leaflet 1.9.4 (CDN). Sin build.
- Funciona con doble clic en `index.html` o con `python3 -m http.server 8080`.
- 8 pestañas: mapa, itinerario, pasaporte N2 (35 sellos), lugares, presupuesto, campings, tramos y moto, equipaje.
- localStorage: `n2_theme`, `n2_stamps`, `n2_packing`, `n2_favorites`.
- Los datos viven en `js/data/` (stages, stamps, sights, campings, passes).
