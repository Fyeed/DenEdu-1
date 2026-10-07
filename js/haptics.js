// HAPTIC
// =========================
function vibrate(pattern) {
  if (!settings.haptic || typeof navigator.vibrate !== 'function') {
    if (typeof navigator.vibrate !== 'function') document.getElementById('haptic-card').classList.add('active');
    return false;
  }
  const multiplier = { low: 0.6, medium: 1, high: 1.4 }[settings.hapticStrength] || 1;
  const adjusted = Array.isArray(pattern) ? pattern.map((value, index) => index % 2 === 0 ? Math.round(value * multiplier) : value) : Math.round(pattern * multiplier);
  const result = navigator.vibrate(adjusted);
  if (result === false) document.getElementById('haptic-card').classList.add('active');
  return result !== false;
}

function triggerHaptic(type) {
  const patterns = { activity: 100, success: [100, 50, 100, 50, 200], soft: [40, 50, 40], loud: [35, 35, 35] };
  const card = document.getElementById('haptic-card');
  card.classList.add('active');
  const hand = document.getElementById('haptic-hand');
  hand.classList.add('shake');
  if (navigator.vibrate) vibrate(patterns[type] || 100);
  window.setTimeout(() => {
    if (!practiceMode) {
      card.classList.remove('active');
      hand.classList.remove('shake');
    }
  }, type === 'success' ? 900 : 450);
}

function testVibration() {
  const supported = typeof navigator.vibrate === 'function';
  if (supported && settings.haptic) navigator.vibrate(100);
  document.getElementById('haptic-card').classList.add('active');
  document.getElementById('haptic-hand').classList.add('shake');
  window.setTimeout(() => {
    document.getElementById('haptic-card').classList.remove('active');
    document.getElementById('haptic-hand').classList.remove('shake');
  }, 600);
  if (!supported) showToast('Getaran tidak tersedia. Animasi haptik visual dijalankan.');
  else showToast(settings.haptic ? 'Pola getaran singkat dijalankan.' : 'Haptik nonaktif. Aktifkan di Pengaturan untuk mencoba getar.');
}
document.getElementById('test-vibration').addEventListener('click', testVibration);
document.getElementById('test-vibration-page').addEventListener('click', testVibration);

// =========================
