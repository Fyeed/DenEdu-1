// NAVIGATION
// =========================
const pageTitles = { beranda: 'Beranda', materi: 'Materi', detail: 'Detail materi', latihan: 'Latihan', progres: 'Progres', pendamping: 'Guru / Orang Tua', pengaturan: 'Pengaturan', tentang: 'Tentang', uji: 'Uji fitur' };

function showPage(page) {
  const target = document.getElementById(`page-${page}`) ? page : 'beranda';
  if (currentPage === 'latihan' && target !== 'latihan' && practiceMode) finishPractice();
  if (currentPage === 'detail' && target !== 'detail') stopMouthAnimation();
  currentPage = target;
  document.querySelectorAll('.page').forEach(section => section.classList.toggle('active', section.id === `page-${target}`));
  document.querySelectorAll('[data-page]').forEach(button => {
    const active = button.dataset.page === target;
    if (button.classList.contains('nav-link') || button.closest('.mobile-nav')) button.classList.toggle('active', active);
  });
  document.getElementById('current-page-name').textContent = pageTitles[target] || 'Beranda';
  if (target === 'detail') renderSignMedia();
  if (target === 'progres' || target === 'pendamping') renderProgress();
  if (target === 'uji') renderApiStatus();
  window.scrollTo({ top: 0, behavior: settings.reduceMotion ? 'auto' : 'smooth' });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3100);
}

document.querySelectorAll('[data-page]').forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.page));
});

document.querySelectorAll('.brand').forEach(brand => brand.addEventListener('click', event => {
  event.preventDefault();
  showPage('beranda');
}));

