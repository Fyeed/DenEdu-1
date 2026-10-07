// TEST PAGE
// =========================
function renderApiStatus() {
  const apis = [
    ['Microphone', Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia), 'MediaDevices API'],
    ['Web Audio API', typeof window.AudioContext === 'function' || typeof window.webkitAudioContext === 'function', 'Analisis RMS lokal'],
    ['Canvas', Boolean(waveContext), 'Visualisasi waveform'],
    ['Vibration API', typeof navigator.vibrate === 'function', 'Getaran perangkat'],
    ['LocalStorage', storageAvailable(), 'Penyimpanan lokal']
  ];
  document.getElementById('api-status-list').innerHTML = apis.map(([name, supported, detail]) => `<div class="api-status ${supported ? '' : 'unsupported'}"><span>${supported ? '✓' : '✕'}</span><div><strong>${name}</strong><small>${supported ? 'Tersedia' : 'Tidak tersedia'} · ${detail}</small></div></div>`).join('');
}

function storageAvailable() {
  try {
    const key = '__dentum_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

const savedChecklist = readStored(CHECKLIST_KEY, {});
document.getElementById('test-checklist').innerHTML = defaultChecklist.map((item, index) => `<label class="check-item"><input type="checkbox" data-check="${index}" ${savedChecklist[index] ? 'checked' : ''}><span>${item}</span></label>`).join('');
document.querySelectorAll('[data-check]').forEach(input => input.addEventListener('change', () => {
  const next = {};
  document.querySelectorAll('[data-check]').forEach(item => { next[item.dataset.check] = item.checked; });
  writeStored(CHECKLIST_KEY, next);
}));
const notes = document.getElementById('test-notes');
notes.value = readStored(TEST_KEY, '');
notes.addEventListener('input', () => writeStored(TEST_KEY, notes.value));

document.getElementById('test-microphone').addEventListener('click', async () => {
  const output = document.getElementById('test-feedback');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    output.textContent = 'Mikrofon tidak tersedia pada konteks ini. Coba buka menggunakan localhost atau mode simulasi.';
    return;
  }
  output.textContent = 'Meminta izin mikrofon...';
  let testStream;
  try {
    testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    testStream.getTracks().forEach(track => track.stop());
    output.textContent = 'Mikrofon berhasil diakses. Audio tidak direkam atau disimpan.';
  } catch (error) {
    console.error('Uji mikrofon gagal.', error);
    output.textContent = error.name === 'NotAllowedError' ? 'Izin mikrofon ditolak. Periksa izin browser.' : 'Mikrofon tidak dapat diakses.';
  } finally {
    if (testStream) testStream.getTracks().forEach(track => track.stop());
  }
});
document.getElementById('test-animation').addEventListener('click', () => {
  const hand = document.getElementById('haptic-hand');
  hand.classList.add('shake');
  document.getElementById('haptic-card').classList.add('active');
  window.clearTimeout(animationTestTimer);
  animationTestTimer = window.setTimeout(() => {
    hand.classList.remove('shake');
    document.getElementById('haptic-card').classList.remove('active');
  }, 1500);
  document.getElementById('test-feedback').textContent = 'Animasi feedback visual dijalankan selama 1,5 detik.';
});
document.getElementById('test-waveform').addEventListener('click', () => {
  demoWave = true;
  let steps = 0;
  const animate = () => {
    drawDemoWave(52);
    steps += 1;
    if (demoWave && steps < 45) waveAnimation = requestAnimationFrame(animate);
    else {
      demoWave = false;
      drawIdleWave();
    }
  };
  cancelAnimationFrame(waveAnimation);
  waveAnimation = requestAnimationFrame(animate);
  document.getElementById('test-feedback').textContent = 'Waveform demo bergerak selama beberapa detik.';
});
document.getElementById('export-results').addEventListener('click', () => {
  const checkState = Array.from(document.querySelectorAll('[data-check]')).map(input => `${input.checked ? '[x]' : '[ ]'} ${defaultChecklist[Number(input.dataset.check)]}`);
  const content = [
    'DENTUM-EDU — CATATAN UJI FITUR',
    `Tanggal: ${new Date().toLocaleString('id-ID')}`,
    '',
    'Checklist:',
    ...checkState,
    '',
    'Catatan:',
    notes.value.trim() || '(Tidak ada catatan)',
    '',
    'Informasi: Prototipe mendeteksi aktivitas suara, kekuatan, dan durasi; bukan ketepatan fonem.'
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dentum-edu-hasil-uji.txt';
  link.click();
  URL.revokeObjectURL(url);
  showToast('Catatan pengujian berhasil diekspor.');
});

