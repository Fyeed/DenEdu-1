function readSimulation() {
  if (!practiceMode || practiceMode !== 'simulation') return;
  const progressRatio = isSimulating ? 0.28 + 0.64 * (0.5 + 0.5 * Math.sin(performance.now() / 350)) : 0.015 * Math.random();
  const level = Math.round(progressRatio * 100);
  const rms = isSimulating ? Math.max(0.02, level / 1800) : 0;
  drawDemoWave(isSimulating ? level : 0);
  updateLiveLevel(rms, null);
  document.getElementById('meter-value').textContent = String(level);
  document.getElementById('meter-fill').style.width = `${level}%`;
}

document.getElementById('record-button').addEventListener('click', startMicrophonePractice);
document.getElementById('stop-button').addEventListener('click', finishPractice);
document.getElementById('simulate-button').addEventListener('pointerdown', event => {
  event.preventDefault();
  if (isSimulating || practiceMode) return;
  isSimulating = true;
  document.getElementById('simulate-button').classList.add('holding');
  materialProgress(selectedMaterial.id).attempts += 1;
  progress.attempts += 1;
  persistProgress();
  beginCalibration('simulation');
});

function releaseSimulation() {
  if (!isSimulating) return;
  isSimulating = false;
  document.getElementById('simulate-button').classList.remove('holding');
  if (practiceMode === 'simulation') finishPractice();
}
document.getElementById('simulate-button').addEventListener('pointerup', releaseSimulation);
document.getElementById('simulate-button').addEventListener('pointercancel', releaseSimulation);
document.getElementById('simulate-button').addEventListener('lostpointercapture', releaseSimulation);
document.getElementById('simulate-button').addEventListener('keydown', event => {
  if ((event.key === ' ' || event.key === 'Enter') && !isSimulating) {
    event.preventDefault();
    document.getElementById('simulate-button').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
  }
});
document.getElementById('simulate-button').addEventListener('keyup', event => {
  if (event.key === ' ' || event.key === 'Enter') releaseSimulation();
});

function registerDetection() {
  const itemProgress = materialProgress(selectedMaterial.id);
  itemProgress.successfulDetections += 1;
  itemProgress.progress = Math.min(100, Math.max(25, itemProgress.progress) + 25);
  progress.successfulDetections += 1;
  progress.lastPractice = new Date().toISOString();
  itemProgress.lastPractice = progress.lastPractice;
  if (itemProgress.progress >= 100) itemProgress.completed = true;
  persistProgress();
  setSensorState('detected', 'SUARA TERDETEKSI', 'Aktivitas suara terdeteksi');
  setFeedback('✓', 'Bagus! Aktivitas suara terdeteksi.', 'Satu usaha hebat — ayo apresiasi dirimu!', '★ ✦ ★');
  document.getElementById('feedback-box').classList.add('success');
  triggerHaptic('success');
  renderProgress();
  renderMaterials();
  window.setTimeout(() => document.getElementById('feedback-box').classList.remove('success'), 900);
}

function finishPractice() {
  if (!practiceMode) return;
  const finishedMode = practiceMode;
  practiceMode = '';
  window.cancelAnimationFrame(calibrationTimer);
  window.clearInterval(simulationTimer);
  cancelAnimationFrame(microphoneFrame);
  if (finishedMode === 'simulation') {
    isSimulating = false;
    document.getElementById('simulate-button').classList.remove('holding');
  }
  stopAudioResources();
  const itemProgress = materialProgress(selectedMaterial.id);
  if (finishedMode !== 'simulation') {
    itemProgress.attempts += 1;
    progress.attempts += 1;
  }
  itemProgress.lastPractice = new Date().toISOString();
  progress.lastPractice = itemProgress.lastPractice;
  persistProgress();
  if (sessionDetectionCount > 0) {
    setSensorState('finished', 'LATIHAN SELESAI', `${sessionDetectionCount} aktivitas suara terdeteksi`);
    setFeedback('⭐', 'Latihan selesai. Kamu hebat!', 'Aktivitas suara sudah dicatat pada perangkat ini.', '★ ★ ★');
  } else {
    setSensorState('finished', 'LATIHAN SELESAI', 'Terima kasih sudah mencoba');
    setFeedback('✦', 'Terima kasih sudah berlatih.', 'Kamu bisa mencoba lagi kapan saja.', '');
  }
  document.getElementById('wave-label-state').textContent = 'SELESAI';
  document.getElementById('record-button').hidden = false;
  document.getElementById('record-button').disabled = false;
  document.getElementById('record-button').innerHTML = '<span>🎙</span> Mulai rekam';
  document.getElementById('simulate-button').hidden = false;
  document.getElementById('stop-button').hidden = true;
  document.getElementById('success-count').textContent = String(progress.successfulDetections);
  renderProgress();
  renderMaterials();
}

function stopAudioResources() {
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  if (audioContext) {
    const contextToClose = audioContext;
    audioContext = null;
    analyser = null;
    contextToClose.close().catch(error => console.warn('AudioContext tidak dapat ditutup dengan rapi.', error));
  }
}

function resetPracticeDisplay() {
  if (practiceMode) finishPractice();
  document.getElementById('meter-value').textContent = '0';
  document.getElementById('meter-fill').style.width = '0%';
  document.getElementById('success-count').textContent = String(progress.successfulDetections);
  setSensorState('waiting', 'MENUNGGU', 'Tekan mulai saat kamu siap');
  setFeedback('🎙', 'Silakan mulai ketika siap.', 'Layar akan menampilkan aktivitas, bukan ketepatan bunyi.', '');
}

function setSensorState(state, title, description) {
  const sensor = document.getElementById('sensor-status');
  sensor.classList.remove('waiting', 'listening', 'detected', 'finished');
  sensor.classList.add(state);
  document.getElementById('status-symbol').textContent = { waiting: '◌', listening: '〰', detected: '✓', finished: '★' }[state] || '◌';
  document.getElementById('status-title').textContent = title;
  document.getElementById('status-description').textContent = description;
}

function setFeedback(icon, title, description, stars) {
  document.getElementById('feedback-icon').textContent = icon;
  document.getElementById('feedback-title').textContent = title;
  document.getElementById('feedback-description').textContent = description;
  document.getElementById('feedback-stars').textContent = stars;
  document.getElementById('feedback-box').classList.remove('warning');
}

