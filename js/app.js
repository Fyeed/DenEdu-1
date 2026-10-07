// INITIALIZATION
// =========================
function initialize() {
  document.getElementById('today-label').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date());
  renderMaterials();
  updateMaterialViews();
  updateSettingsUI();
  renderProgress();
  sizeWaveform();
}
initialize();
