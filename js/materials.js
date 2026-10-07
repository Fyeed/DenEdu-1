// MATERIAL
// =========================
const categoryLabels = { Vokal: 'Vokal', Bilabial: 'Konsonan bilabial', Konsonan: 'Konsonan', 'Suku kata': 'Suku kata', Kata: 'Kata sederhana', Hewan: 'Hewan' };

function renderMaterials(filter = activeFilter) {
  activeFilter = filter;
  const grid = document.getElementById('materials-grid');
  const filtered = materials.filter(item => {
    if (filter === 'Semua') return true;
    if (filter === 'Ditandai') return materialProgress(item.id).starred;
    return item.category === filter;
  });
  grid.innerHTML = filtered.map(item => {
    const itemProgress = materialProgress(item.id);
    let status = '◌ Belum';
    let statusClass = 'locked';
    if (itemProgress.completed) { status = '✓ Selesai'; statusClass = 'done'; }
    else if (itemProgress.attempts > 0) { status = '▶ Sedang dipelajari'; statusClass = 'learning'; }
    return `<article class="material-card">
      <div class="material-visual visual-${item.type}"><span class="${item.type === 'word' ? 'material-word-icon' : 'material-letter'}">${item.type === 'word' ? item.icon : item.name}</span>
        <button class="material-mark ${itemProgress.starred ? 'marked' : ''}" data-star="${item.id}" aria-label="${itemProgress.starred ? 'Hapus tanda' : 'Tandai'} ${item.name}">${itemProgress.starred ? '★' : '☆'}</button>
      </div>
      <div class="material-name-row"><h3>${item.name}</h3><span class="material-category">${categoryLabels[item.category]}</span></div>
      <span class="material-status ${statusClass}">${status}</span>
      <div class="card-progress" aria-label="Progres ${itemProgress.progress || 0}%"><span style="width:${itemProgress.progress || 0}%"></span></div>
      <div class="material-card-footer"><span class="material-stars">${itemProgress.completed ? '★ ★ ★' : itemProgress.starred ? '★ ☆ ☆' : '☆ ☆ ☆'}</span><button class="button button-primary button-small" data-open-material="${item.id}">Belajar <span>→</span></button></div>
    </article>`;
  }).join('');
  document.getElementById('count-all').textContent = materials.length;
  grid.querySelectorAll('[data-open-material]').forEach(button => button.addEventListener('click', () => openMaterial(button.dataset.openMaterial)));
  grid.querySelectorAll('[data-star]').forEach(button => button.addEventListener('click', () => toggleStar(button.dataset.star)));
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(chip => chip.classList.toggle('selected', chip === button));
  renderMaterials(button.dataset.filter);
}));

function openMaterial(id) {
  const item = materials.find(material => material.id === id);
  if (!item) return;
  stopMouthAnimation();
  mouthStep = 0;
  selectedMaterial = item;
  updateMaterialViews();
  showPage('detail');
}

function toggleStar(id) {
  const itemProgress = materialProgress(id);
  itemProgress.starred = !itemProgress.starred;
  persistProgress();
  renderMaterials();
  if (selectedMaterial.id === id) updateStarButton();
  renderProgress();
  showToast(itemProgress.starred ? 'Materi ditambahkan ke daftar ditandai.' : 'Tanda materi dihapus.');
}

function updateStarButton() {
  const button = document.getElementById('detail-star');
  const starred = materialProgress(selectedMaterial.id).starred;
  button.textContent = starred ? '★' : '☆';
  button.classList.toggle('active', starred);
  button.setAttribute('aria-label', starred ? 'Hapus tanda materi' : 'Tandai materi');
}

function updateMaterialViews() {
  const titleType = selectedMaterial.category === 'Suku kata' ? 'suku kata' : ['Kata', 'Hewan'].includes(selectedMaterial.category) ? 'kata' : 'huruf';
  document.getElementById('detail-title').innerHTML = `Belajar ${titleType} <em>${selectedMaterial.name}</em>`;
  document.getElementById('detail-category').textContent = categoryLabels[selectedMaterial.category].toUpperCase();
  document.getElementById('pronunciation-text').textContent = selectedMaterial.hint;
  updateMouthVisualization();
  document.getElementById('example-letter').textContent = selectedMaterial.name;
  document.getElementById('example-word').textContent = selectedMaterial.word;
  document.querySelector('.example-ball').textContent = selectedMaterial.icon;
  const practiceIcon = document.getElementById('practice-letter');
  const isWordTarget = selectedMaterial.category === 'Kata' || selectedMaterial.category === 'Hewan';
  practiceIcon.textContent = isWordTarget ? selectedMaterial.icon : selectedMaterial.name;
  practiceIcon.classList.toggle('word-icon', isWordTarget);
  practiceIcon.setAttribute('aria-label', isWordTarget ? `Ilustrasi ${selectedMaterial.name}` : `Huruf atau suku kata ${selectedMaterial.name}`);
  document.getElementById('practice-word').textContent = selectedMaterial.word;
  document.getElementById('practice-category').textContent = categoryLabels[selectedMaterial.category];
  document.getElementById('preview-sign').textContent = `${settings.signLanguage} · ${selectedMaterial.name}`;
  document.getElementById('preview-word').textContent = selectedMaterial.word;
  document.querySelectorAll('[data-sign]').forEach(button => button.classList.toggle('selected', button.dataset.sign === settings.signLanguage));
  updateStarButton();
  renderMaterials();
}

document.getElementById('detail-star').addEventListener('click', () => toggleStar(selectedMaterial.id));
document.querySelectorAll('[data-open-material]').forEach(button => button.addEventListener('click', () => openMaterial(button.dataset.openMaterial)));
document.getElementById('change-target').addEventListener('click', () => showPage('materi'));
document.getElementById('detail-practice').addEventListener('click', () => {
  showPage('latihan');
  resetPracticeDisplay();
});

document.querySelectorAll('[data-sign]').forEach(button => button.addEventListener('click', () => {
  settings.signLanguage = button.dataset.sign;
  persistSettings();
  updateSettingsUI();
  updateMaterialViews();
  if (currentPage === 'detail') renderSignMedia();
}));

function signMediaKey() {
  return `${selectedMaterial.id}:${settings.signLanguage}`;
}

function renderSignMedia() {
  const key = signMediaKey();
  const file = signMediaFiles.get(key);
  const bundled = bundledSignMedia.get(key);
  const placeholder = document.getElementById('sign-placeholder');
  const image = document.getElementById('sign-image');
  const video = document.getElementById('sign-video');
  const caption = document.getElementById('sign-media-caption');
  const uploadLabel = document.getElementById('sign-upload-label');
  const source = file ? { type: file.type.startsWith('image/') ? 'image' : 'video', url: signMediaUrls.get(key), name: file.name } : bundled;
  const nextUrl = source ? source.url : '';
  if (activeSignMediaUrl && activeSignMediaUrl !== nextUrl) {
    video.pause();
    image.removeAttribute('src');
    video.removeAttribute('src');
    video.load();
  }
  activeSignMediaUrl = nextUrl;
  placeholder.hidden = Boolean(file);
  image.hidden = true;
  video.hidden = true;
  if (!source) {
    caption.textContent = `Belum ada media ${settings.signLanguage} untuk ${selectedMaterial.name}. Pilih foto/video yang sudah divalidasi.`;
    uploadLabel.textContent = 'Tambahkan foto/video isyarat';
    if (!checkedBundledSignMedia.has(key)) loadBundledSignMedia(key);
    return;
  }
  uploadLabel.textContent = file ? 'Ganti foto/video isyarat' : 'Pilih media lain';
  if (source.type === 'image') {
    image.src = source.url;
    image.alt = `Foto isyarat ${selectedMaterial.name} ${settings.signLanguage}`;
    image.hidden = false;
  } else {
    video.src = source.url;
    video.hidden = false;
  }
  caption.textContent = file
    ? `${file.name} · pratinjau lokal untuk ${settings.signLanguage}. Pastikan gerakan telah divalidasi.`
    : `Media paket · ${settings.signLanguage}. Pastikan gerakan telah divalidasi oleh pendamping.`;
}

async function loadBundledSignMedia(key) {
  checkedBundledSignMedia.add(key);
  if (window.location.protocol === 'file:') return;
  const [materialId, language] = key.split(':');
  const base = `assets/videos/isyarat/${materialId.toLowerCase()}-${language.toLowerCase()}`;
  const candidates = [
    { type: 'video', url: `${base}.mp4` },
    { type: 'video', url: `${base}.webm` },
    { type: 'image', url: `assets/images/isyarat/${materialId.toLowerCase()}-${language.toLowerCase()}.jpg` },
    { type: 'image', url: `assets/images/isyarat/${materialId.toLowerCase()}-${language.toLowerCase()}.png` },
    { type: 'image', url: `assets/images/isyarat/${materialId.toLowerCase()}-${language.toLowerCase()}.webp` }
  ];
  for (const candidate of candidates) {
    let response;
    try {
      response = await fetch(candidate.url, { method: 'HEAD' });
    } catch (error) {
      console.warn(`Tidak dapat memeriksa media isyarat ${candidate.url}.`, error);
      return;
    }
    if (response.ok) {
      bundledSignMedia.set(key, candidate);
      if (key === signMediaKey() && !signMediaFiles.has(key)) renderSignMedia();
      return;
    }
  }
  if (key === signMediaKey() && !signMediaFiles.has(key)) {
    document.getElementById('sign-media-caption').textContent = `Belum ada media ${language} untuk ${selectedMaterial.name}. Tambahkan media yang sudah divalidasi.`;
  }
}

document.getElementById('sign-media-file').addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
  if (!supportedTypes.includes(file.type)) {
    showToast('Pilih file gambar atau video yang didukung.');
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast('Ukuran media maksimal 20 MB untuk pratinjau browser.');
    return;
  }
  const key = signMediaKey();
  const previousUrl = signMediaUrls.get(key);
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  signMediaFiles.set(key, file);
  signMediaUrls.set(key, URL.createObjectURL(file));
  renderSignMedia();
});

window.addEventListener('beforeunload', () => {
  signMediaUrls.forEach(url => URL.revokeObjectURL(url));
});

