// SETTINGS
// =========================
function updateSettingsUI() {
  document.getElementById('sensitivity-input').value = String(settings.sensitivity);
  document.getElementById('sensitivity-label').textContent = ['','Rendah','Agak rendah','Sedang','Agak tinggi','Tinggi'][settings.sensitivity];
  document.getElementById('duration-input').value = String(settings.minimumDuration);
  document.getElementById('duration-output').textContent = String(settings.minimumDuration);
  setSwitch('haptic-toggle', settings.haptic);
  setSwitch('contrast-toggle', settings.contrast);
  setSwitch('motion-toggle', settings.reduceMotion);
  document.body.classList.toggle('high-contrast', settings.contrast);
  document.body.classList.toggle('reduce-motion', settings.reduceMotion);
  document.body.classList.toggle('theme-dark', settings.theme === 'dark');
  document.body.classList.remove('text-s', 'text-m', 'text-l', 'text-xl');
  document.body.classList.add(`text-${settings.textSize}`);
  document.querySelectorAll('[data-text-size]').forEach(button => button.classList.toggle('selected', button.dataset.textSize === settings.textSize));
  document.querySelectorAll('[data-theme]').forEach(button => button.classList.toggle('selected', button.dataset.theme === settings.theme));
  document.querySelectorAll('input[name="haptic-strength"]').forEach(input => { input.checked = input.value === settings.hapticStrength; });
  document.querySelectorAll('[data-setting-sign]').forEach(button => button.classList.toggle('selected', button.dataset.settingSign === settings.signLanguage));
  document.getElementById('haptic-fallback').hidden = typeof navigator.vibrate === 'function';
  document.getElementById('haptic-support').textContent = typeof navigator.vibrate === 'function' ? 'Getaran perangkat bergantung pada dukungan browser.' : 'Perangkat tidak mendukung getaran; animasi visual digunakan.';
}

function setSwitch(id, active) {
  const button = document.getElementById(id);
  button.setAttribute('aria-checked', String(Boolean(active)));
}

document.getElementById('sensitivity-input').addEventListener('input', event => {
  settings.sensitivity = Number(event.target.value);
  document.getElementById('sensitivity-label').textContent = ['','Rendah','Agak rendah','Sedang','Agak tinggi','Tinggi'][settings.sensitivity];
  persistSettings();
  renderProgress();
});
document.getElementById('duration-input').addEventListener('input', event => {
  settings.minimumDuration = Number(event.target.value);
  document.getElementById('duration-output').textContent = String(settings.minimumDuration);
  persistSettings();
  renderProgress();
});
document.getElementById('calibrate-button').addEventListener('click', () => showToast('Kalibrasi dilakukan otomatis saat sesi latihan dimulai.'));
document.getElementById('haptic-toggle').addEventListener('click', event => {
  settings.haptic = event.currentTarget.getAttribute('aria-checked') !== 'true';
  setSwitch('haptic-toggle', settings.haptic);
  persistSettings();
});
document.getElementById('contrast-toggle').addEventListener('click', event => {
  settings.contrast = event.currentTarget.getAttribute('aria-checked') !== 'true';
  updateSettingsUI();
  persistSettings();
});
document.getElementById('motion-toggle').addEventListener('click', event => {
  settings.reduceMotion = event.currentTarget.getAttribute('aria-checked') !== 'true';
  updateSettingsUI();
  persistSettings();
});
document.querySelectorAll('input[name="haptic-strength"]').forEach(input => input.addEventListener('change', () => {
  settings.hapticStrength = input.value;
  persistSettings();
}));
document.querySelectorAll('[data-text-size]').forEach(button => button.addEventListener('click', () => {
  settings.textSize = button.dataset.textSize;
  updateSettingsUI();
  persistSettings();
}));
document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
  settings.theme = button.dataset.theme;
  updateSettingsUI();
  persistSettings();
}));
document.querySelectorAll('[data-setting-sign]').forEach(button => button.addEventListener('click', () => {
  settings.signLanguage = button.dataset.settingSign;
  updateSettingsUI();
  updateMaterialViews();
  if (currentPage === 'detail') renderSignMedia();
  persistSettings();
}));

// =========================
