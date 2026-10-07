// MICROPHONE
// =========================
function rmsFromBuffer(bytes) {
  let sum = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    const sample = (bytes[index] - 128) / 128;
    sum += sample * sample;
  }
  return Math.sqrt(sum / bytes.length);
}

function thresholdMargin() {
  return [0.021, 0.016, 0.012, 0.008, 0.005][Number(settings.sensitivity) - 1] || 0.012;
}

async function startMicrophonePractice() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) {
    showToast('Mikrofon tidak tersedia di browser ini. Gunakan mode simulasi suara.');
    return;
  }
  const recordButton = document.getElementById('record-button');
  recordButton.disabled = true;
  recordButton.innerHTML = '<span>…</span> Meminta izin mikrofon';
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false } });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();
    const source = audioContext.createMediaStreamSource(audioStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.15;
    source.connect(analyser);
    beginCalibration('microphone');
  } catch (error) {
    console.error('Mikrofon tidak dapat diaktifkan.', error);
    stopAudioResources();
    recordButton.disabled = false;
    recordButton.innerHTML = '<span>🎙</span> Mulai rekam';
    showToast(error && error.name === 'NotAllowedError' ? 'Izin mikrofon belum diberikan. Coba mode simulasi.' : 'Mikrofon gagal dimulai. Coba mode simulasi.');
  }
}

function beginCalibration(mode) {
  practiceMode = mode;
  calibrationSamples = [];
  sessionDetectionCount = 0;
  currentBoutDetected = false;
  currentBoutTooLoud = false;
  activeSince = 0;
  document.getElementById('record-button').hidden = true;
  document.getElementById('simulate-button').hidden = true;
  document.getElementById('stop-button').hidden = false;
  setSensorState('waiting', 'KALIBRASI LINGKUNGAN', 'Diam selama 2 detik...');
  setFeedback('🎙', 'Mengukur suara sekitar...', 'Mohon tetap diam selama kalibrasi.', '');
  document.getElementById('wave-label-state').textContent = 'KALIBRASI';
  const calibrateStartedAt = performance.now();
  const calibrateFrame = () => {
    if (!practiceMode || practiceMode !== mode) return;
    if (mode === 'microphone' && analyser) {
      analyser.getByteTimeDomainData(audioBuffer);
      calibrationSamples.push(rmsFromBuffer(audioBuffer));
      drawWaveform(audioBuffer);
    } else if (mode === 'simulation') {
      calibrationSamples.push(0.001);
    }
    if (performance.now() - calibrateStartedAt >= 2000) {
      const averageNoise = calibrationSamples.length ? calibrationSamples.reduce((sum, value) => sum + value, 0) / calibrationSamples.length : 0;
      noiseFloor = Math.min(averageNoise, 0.06);
      soundThreshold = noiseFloor + thresholdMargin();
      setSensorState('listening', 'MENDENGARKAN...', 'Coba vokalisasi saat kamu siap');
      setFeedback('🎙', 'Silakan mulai ketika siap.', 'Aktivitas suara akan terlihat pada meter.', '');
      document.getElementById('wave-label-state').textContent = 'MENDENGARKAN';
      if (mode === 'microphone') {
        microphoneFrame = requestAnimationFrame(readMicrophone);
      } else {
        simulationTimer = window.setInterval(readSimulation, 35);
      }
      return;
    }
    calibrationTimer = requestAnimationFrame(calibrateFrame);
  };
  calibrationTimer = requestAnimationFrame(calibrateFrame);
}

function readMicrophone() {
  if (!practiceMode || practiceMode !== 'microphone' || !analyser) return;
  analyser.getByteTimeDomainData(audioBuffer);
  const rms = rmsFromBuffer(audioBuffer);
  updateLiveLevel(rms, audioBuffer);
  microphoneFrame = requestAnimationFrame(readMicrophone);
}

function updateLiveLevel(rms, buffer) {
  const level = Math.min(100, Math.round(rms * 1800));
  document.getElementById('meter-value').textContent = String(level);
  document.getElementById('meter-fill').style.width = `${level}%`;
  if (buffer) drawWaveform(buffer);
  if (rms > soundThreshold) {
    if (!activeSince) {
      activeSince = performance.now();
      currentBoutDetected = false;
      currentBoutTooLoud = false;
      triggerHaptic('activity');
    }
    const duration = performance.now() - activeSince;
    document.getElementById('wave-label-state').textContent = 'AKTIVITAS TERLIHAT';
    if (level > 86) {
      if (!currentBoutTooLoud) {
        setSensorState('detected', 'AKTIVITAS TERDETEKSI', 'Level suara cukup kuat');
        setFeedback('⬇', 'Coba lebih lembut.', 'Aktivitas suara terlihat cukup kuat.', '');
        triggerHaptic('loud');
        currentBoutTooLoud = true;
      }
    } else if (duration >= Number(settings.minimumDuration) && !currentBoutDetected) {
      currentBoutDetected = true;
      sessionDetectionCount += 1;
      registerDetection();
    } else if (!currentBoutDetected) {
      setSensorState('listening', 'MENDENGARKAN...', 'Aktivitas suara terlihat');
      setFeedback('⬆', 'Coba sedikit lebih kuat.', 'Pertahankan aktivitas dengan nyaman.', '');
    }
  } else {
    if (activeSince && !currentBoutDetected) {
      setFeedback('⬆', 'Coba sedikit lebih kuat.', 'Aktivitas singkat terlihat; coba lagi jika nyaman.', '');
    }
    activeSince = 0;
    currentBoutDetected = false;
    currentBoutTooLoud = false;
    if (practiceMode) {
      setSensorState('listening', 'MENDENGARKAN...', 'Coba vokalisasi saat kamu siap');
      if (sessionDetectionCount === 0) setFeedback('🎙', 'Silakan mulai ketika siap.', 'Sistem menampilkan aktivitas, bukan ketepatan bunyi.', '');
      document.getElementById('wave-label-state').textContent = 'MENDENGARKAN';
    }
  }
}

