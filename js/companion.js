// COMPANION ACCESS
// =========================
const pinDialog = document.getElementById('pin-dialog');
document.getElementById('advanced-settings').addEventListener('click', () => {
  document.getElementById('pin-input').value = '';
  document.getElementById('pin-error').textContent = '';
  pinDialog.showModal();
});
document.getElementById('pin-submit').addEventListener('click', event => {
  event.preventDefault();
  if (document.getElementById('pin-input').value === '1234') {
    pinDialog.close();
    showPage('pengaturan');
    showToast('Pengaturan pendamping terbuka.');
  } else {
    document.getElementById('pin-error').textContent = 'PIN belum sesuai. Coba lagi.';
  }
});

// =========================
