// Arranque de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFavorites();
  renderItineraryCards();
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
  initMap(); // al final: si Leaflet no carga, el resto ya está renderizado
});
