// Arranque de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFavorites();
  renderItineraryCards();
  initToday();
  renderPassport();
  renderSightsFilters();
  renderSights();
  renderCampings();
  renderNightsTable();
  renderPasses();
  renderRangePlanner();
  renderPackingList();
  updateBudget();
  renderQuickSummary();
  initOffline();
  initMap(); // al final: si Leaflet no carga, el resto ya está renderizado
  if (isTripOngoing()) switchTab('today'); // durante el viaje se abre directamente en "Hoy"
});
