// PROGRESS & ACHIEVEMENTS
// =========================
function renderProgress() {
  const entries = materials.map(item => ({ item, value: materialProgress(item.id) }));
  const completed = entries.filter(entry => entry.value.completed).length;
  document.getElementById('stat-completed').textContent = String(completed);
  document.getElementById('total-materials').textContent = String(materials.length);
  document.getElementById('stat-attempts').textContent = String(progress.attempts);
  document.getElementById('stat-detections').textContent = String(progress.successfulDetections);
  document.getElementById('stat-stars').textContent = String(progress.successfulDetections + entries.filter(entry => entry.value.starred).length);
  document.getElementById('comp-attempts').textContent = String(progress.attempts);
  document.getElementById('comp-completed').textContent = String(completed);
  document.getElementById('comp-detections').textContent = String(progress.successfulDetections);
  document.getElementById('comp-last').textContent = progress.lastPractice ? (materials.find(item => item.id === lastMaterialId()) || selectedMaterial).name : 'Belum ada latihan';
  document.getElementById('comp-date').textContent = progress.lastPractice ? new Date(progress.lastPractice).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—';
  document.getElementById('comp-sensitivity').textContent = ['','Rendah','Agak rendah','Sedang','Agak tinggi','Tinggi'][settings.sensitivity];
  document.getElementById('comp-duration').textContent = `${settings.minimumDuration} ms`;
  document.getElementById('comp-sign').textContent = settings.signLanguage;
  document.getElementById('success-count').textContent = String(progress.successfulDetections);
  document.getElementById('home-last-material').textContent = progress.lastPractice ? (materials.find(item => item.id === lastMaterialId()) || selectedMaterial).name : 'Huruf B';
  const homeProgress = progress.lastPractice ? materialProgress(lastMaterialId()).progress : 0;
  document.getElementById('home-progress-bar').style.width = `${homeProgress}%`;
  const list = document.getElementById('progress-material-list');
  const touched = entries.filter(entry => entry.value.attempts > 0 || entry.value.starred || entry.value.completed);
  const rows = (touched.length ? touched.slice(0, 5) : entries.slice(0, 3));
  list.innerHTML = rows.map(({ item, value }) => `<div class="progress-material-row"><div class="letter-tile">${item.type === 'word' ? item.icon : item.name}</div><div><strong>${item.name}</strong><small>${categoryLabels[item.category]} · ${value.progress || 0}% progres</small></div><span class="row-status">${value.completed ? '✓ Selesai' : value.attempts ? '▶ Belajar' : 'Belum'}</span></div>`).join('');
  const achievements = [
    { icon: '🏆', name: 'Langkah pertama', detail: 'Coba satu materi', unlocked: progress.attempts >= 1 },
    { icon: '⭐', name: 'Semangat belajar', detail: 'Lakukan 5 percobaan', unlocked: progress.attempts >= 5 },
    { icon: '🌟', name: 'Konsisten', detail: 'Deteksi 3 aktivitas suara', unlocked: progress.successfulDetections >= 3 },
    { icon: '🎯', name: 'Penjelajah materi', detail: 'Coba 5 materi berbeda', unlocked: touched.filter(entry => entry.value.attempts > 0).length >= 5 }
  ];
  document.getElementById('achievement-list').innerHTML = achievements.map(item => `<div class="achievement ${item.unlocked ? '' : 'locked'}"><span class="achievement-icon">${item.icon}</span><div><strong>${item.name}</strong><small>${item.detail}</small></div><span class="badge-check">${item.unlocked ? '✓' : '🔒'}</span></div>`).join('');
}

function lastMaterialId() {
  let last = null;
  materials.forEach(item => {
    const date = materialProgress(item.id).lastPractice;
    if (date && (!last || date > last.date)) last = { id: item.id, date };
  });
  return last ? last.id : 'B';
}

// =========================
