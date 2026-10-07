// WAVEFORM
// =========================
const waveform = document.getElementById('waveform');
const waveContext = waveform.getContext('2d');

function sizeWaveform() {
  const rect = waveform.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  waveform.width = Math.max(1, Math.floor(rect.width * ratio));
  waveform.height = Math.max(1, Math.floor(rect.height * ratio));
  waveContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawIdleWave();
}

function drawIdleWave() {
  const width = waveform.clientWidth;
  const height = waveform.clientHeight;
  waveContext.clearRect(0, 0, width, height);
  waveContext.strokeStyle = '#dfdbea';
  waveContext.lineWidth = 1;
  waveContext.beginPath();
  waveContext.moveTo(0, height / 2);
  waveContext.lineTo(width, height / 2);
  waveContext.stroke();
}

function drawWaveform(bytes) {
  const width = waveform.clientWidth;
  const height = waveform.clientHeight;
  if (!width || !height) return;
  waveContext.clearRect(0, 0, width, height);
  waveContext.strokeStyle = '#8f78dc';
  waveContext.lineWidth = 2;
  waveContext.lineJoin = 'round';
  waveContext.beginPath();
  const step = Math.ceil(bytes.length / width);
  for (let x = 0; x < width; x += 1) {
    const value = (bytes[x * step] - 128) / 128;
    const y = (height / 2) + value * (height * 0.43);
    if (x === 0) waveContext.moveTo(x, y);
    else waveContext.lineTo(x, y);
  }
  waveContext.stroke();
}

function drawDemoWave(level) {
  const width = waveform.clientWidth;
  const height = waveform.clientHeight;
  if (!width || !height) return;
  waveContext.clearRect(0, 0, width, height);
  waveContext.strokeStyle = '#8f78dc';
  waveContext.lineWidth = 2;
  waveContext.beginPath();
  for (let x = 0; x <= width; x += 2) {
    const amplitude = (level / 100) * height * 0.4;
    const y = height / 2 + Math.sin((x / width) * Math.PI * 13 + wavePhase) * amplitude * (0.35 + 0.65 * Math.random());
    if (x === 0) waveContext.moveTo(x, y);
    else waveContext.lineTo(x, y);
  }
  waveContext.stroke();
  if (level > 0) wavePhase += 0.23;
}

window.addEventListener('resize', sizeWaveform);
