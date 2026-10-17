# Portugal N2 & Iberian Mountain Loops Planner

Planificador estático de la expedición en solitario en Honda CRF1100L Africa Twin: Málaga ➔ sierras ➔ Chaves (Km 0) ➔ Estrada Nacional 2 completa ➔ Faro (Km 738) ➔ Málaga, 4–13 diciembre 2026.

- HTML + JS clásico (sin módulos ES) + Tailwind (CDN) + Leaflet 1.9.4 (CDN). Sin build.
- Funciona con doble clic en `index.html` o con `python3 -m http.server 8080`.
- 8 pestañas: mapa, itinerario, pasaporte N2 (35 sellos), lugares, presupuesto, campings, tramos y moto, equipaje.
- localStorage: `n2_theme`, `n2_stamps`, `n2_packing`, `n2_favorites`.
- Los datos viven en `js/data/` (stages, stamps, sights, campings, passes).

## Novedades
- **Pestaña "Hoy"**: etapa del día (se abre sola durante el viaje), amanecer/anochecer calculados, control de repostaje (alerta a 140 y 180 km), sellos del día, enlaces de tiempo y botón "Marcar etapa como completada".
- **Modo sin conexión (PWA)**: tras abrir la web una vez con internet funciona sin cobertura y se puede instalar en el móvil. Botón "Guardar mapa para usar sin conexión" (zoom 6–10, ~275 teselas).
- **Previsión** (Open-Meteo) para la pernocta, disponible desde 15 días antes de cada etapa.
- localStorage nuevo: `n2_done`, `n2_today`, `n2_weather`.

## Al desplegar cambios
Sube `VERSION` en `sw.js` para que los móviles renueven la caché.

## Verificación de campings (oct 2026)
Datos contrastados con directorios (Alan Rogers, camping.info, PiNCAMP, Pitchup, ACSI). Cada ficha indica su fuente. Los directorios se desactualizan: llama antes de salir.
- Camping Asseiceira (Marvão) figura "enero–octubre": sustituido por Quinta do Pomarinho (a confirmar).
- Sin camping verificado en Almodôvar (Día 7): reservar alojamiento.
- Camping de Faro: reabierto en 2021, admite tiendas; fechas de diciembre sin confirmar.
- Manteigas: sin datos de fechas.

## Plan B y rutas sin autopistas
Cada etapa tiene su Plan B (`js/data/planb.js`) y un enlace de Google Maps por coordenadas con `avoid=highways`.
