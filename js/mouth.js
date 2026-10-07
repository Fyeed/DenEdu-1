// MOUTH VISUALIZATION
// =========================
const mouthStage = document.getElementById('mouth-stage');
let mouthStep = 0;

function getMouthPattern() {
  const initial = selectedMaterial.name.charAt(0);
  if (selectedMaterial.category === 'Vokal' && initial === 'I') return {
    motion: 'vowel-spread',
    overview: 'Bibir melebar sedikit ke samping. Gerakkan perlahan dan pertahankan bentuknya dengan nyaman.',
    stages: [
      ['Posisi siap', 'Mulut rileks sebelum mulai.'],
      ['Bibir melebar', 'Tarik kedua sudut bibir sedikit ke samping; jangan menarik terlalu kuat.'],
      ['Tahan bentuk', 'Pertahankan bibir yang melebar dengan nyaman, lalu rileks.']
    ]
  };
  if (selectedMaterial.category === 'Vokal' && (initial === 'U' || initial === 'O')) return {
    motion: 'vowel-round',
    overview: 'Bibir membentuk lingkaran kecil dengan rileks. Jangan mengerucutkan bibir terlalu kuat.',
    stages: [
      ['Posisi siap', 'Mulut rileks sebelum mulai.'],
      ['Bibir membulat', 'Majukan kedua bibir dan bentuk lingkaran kecil yang nyaman.'],
      ['Tahan bentuk', 'Pertahankan bentuk bulat tanpa menegangkan wajah, lalu rileks.']
    ]
  };
  if (selectedMaterial.category === 'Vokal' && (initial === 'A' || initial === 'E')) return {
    motion: 'vowel-open',
    overview: 'Buka mulut secara nyaman dengan menurunkan rahang. Hindari membuka terlalu lebar.',
    stages: [
      ['Posisi siap', 'Mulut rileks sebelum mulai.'],
      ['Rahang turun', 'Turunkan rahang perlahan dan biarkan bibir terbuka dengan nyaman.'],
      ['Tahan bentuk', 'Pertahankan bukaan kecil yang nyaman, lalu tutup dan rileks.']
    ]
  };
  if (selectedMaterial.category === 'Bilabial' && 'BPM'.includes(initial)) {
    const isM = initial === 'M';
    return {
      motion: isM ? 'bilabial-hold' : 'bilabial-release',
      overview: isM
        ? 'Rapatkan kedua bibir dengan lembut dan pertahankan sesaat.'
        : 'Rapatkan kedua bibir, lalu lepaskan dengan membuka bibir secara perlahan.',
      stages: [
        ['Posisi siap', 'Mulut rileks sebelum mulai.'],
        ['Bibir merapat', 'Pertemukan bibir atas dan bawah dengan lembut; jangan digigit atau ditekan kuat.'],
        [isM ? 'Bibir tetap rapat' : 'Bibir terbuka perlahan', isM
          ? 'Pertahankan bibir tetap menutup sejenak, lalu lepaskan dan rileks.'
          : 'Lepaskan rapatan bibir hingga terbuka sedikit. Gerakkan perlahan dan santai.']
      ]
    };
  }
  return {
    motion: 'generic',
    overview: 'Setiap kata memiliki rangkaian gerak bibir. Amati media atau contoh pendamping; ilustrasi ini tidak menebak bentuk gerak kata secara spesifik.',
    stages: [
      ['Posisi siap', 'Duduk nyaman dan lihat contoh media atau pendamping terlebih dahulu.'],
      ['Amati gerakan', 'Perhatikan perubahan bentuk bibir pada contoh. Ilustrasi tidak menetapkan bentuk khusus untuk kata ini.'],
      ['Coba dengan pendamping', 'Ikuti contoh secara perlahan jika sudah siap, lalu rileks kembali.']
    ]
  };
}

function updateMouthVisualization() {
  const pattern = getMouthPattern();
  mouthStage.dataset.motion = pattern.motion;
  setMouthStep(mouthStep, false);
}

function setMouthStep(step, animate = false) {
  const pattern = getMouthPattern();
  mouthStep = ((step % pattern.stages.length) + pattern.stages.length) % pattern.stages.length;
  mouthStage.dataset.stage = String(mouthStep);
  mouthStage.classList.toggle('is-playing', animate);
  document.getElementById('mouth-stage-number').textContent = `LANGKAH ${mouthStep + 1}`;
  document.getElementById('mouth-stage-title').textContent = pattern.stages[mouthStep][0];
  document.getElementById('mouth-stage-description').textContent = pattern.stages[mouthStep][1];
  document.getElementById('pronunciation-text').textContent = pattern.overview;
  const guide = document.getElementById('mouth-howto-list');
  guide.replaceChildren(...pattern.stages.map(([title, description], index) => {
    const item = document.createElement('li');
    const copy = document.createElement('div');
    const stepTitle = document.createElement('strong');
    const stepDescription = document.createElement('span');
    stepTitle.textContent = `${title}: `;
    stepDescription.textContent = description;
    copy.className = 'mouth-howto-copy';
    copy.append(stepTitle, stepDescription);
    item.append(copy);
    item.classList.toggle('current', index === mouthStep);
    return item;
  }));
  document.querySelectorAll('[data-mouth-dot]').forEach(dot => {
    const selected = Number(dot.dataset.mouthDot) === mouthStep;
    dot.classList.toggle('active', selected);
    dot.setAttribute('aria-pressed', String(selected));
  });
}

function stopMouthAnimation() {
  window.clearInterval(mouthTimer);
  mouthTimer = 0;
  mouthStage.classList.remove('is-playing');
}

function playMouthStep(step) {
  stopMouthAnimation();
  setMouthStep(step, true);
}

function playMouthAnimation() {
  stopMouthAnimation();
  setMouthStep(mouthStep, true);
  mouthTimer = window.setInterval(() => setMouthStep(mouthStep + 1, true), mouthSpeed);
}

document.getElementById('mouth-play').addEventListener('click', playMouthAnimation);
document.getElementById('mouth-pause').addEventListener('click', stopMouthAnimation);
document.getElementById('mouth-reset').addEventListener('click', () => {
  stopMouthAnimation();
  setMouthStep(0);
});
document.getElementById('mouth-next').addEventListener('click', () => {
  playMouthStep(mouthStep + 1);
});
document.querySelectorAll('[data-mouth-dot]').forEach(button => button.addEventListener('click', () => {
  playMouthStep(Number(button.dataset.mouthDot));
}));
document.querySelectorAll('[data-speed]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-speed]').forEach(item => item.classList.toggle('selected', item === button));
  mouthSpeed = button.dataset.speed === 'slow' ? 1300 : 760;
  if (mouthStage.classList.contains('is-playing')) playMouthAnimation();
}));

