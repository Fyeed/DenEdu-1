'use strict';

// =========================
// LOCAL STORAGE
// =========================
const PROGRESS_KEY = 'dentumProgress';
const SETTINGS_KEY = 'dentumSettings';
const TEST_KEY = 'dentumTestNotes';
const CHECKLIST_KEY = 'dentumTestChecklist';

const vowels = [
  { id: 'A', icon: '🍎', word: 'AYAM', hint: 'Amati bentuk mulut dan coba bersama pendamping.' },
  { id: 'I', icon: '🍦', word: 'IKAN', hint: 'Amati bentuk mulut dan coba bersama pendamping.' },
  { id: 'U', icon: '☂️', word: 'ULAR', hint: 'Amati bentuk mulut dan coba bersama pendamping.' },
  { id: 'E', icon: '🦆', word: 'ENAK', hint: 'Amati bentuk mulut dan coba bersama pendamping.' },
  { id: 'O', icon: '🍊', word: 'OBAT', hint: 'Amati bentuk mulut dan coba bersama pendamping.' }
].map(item => ({ ...item, name: item.id, category: 'Vokal', type: 'vowel' }));

const bilabials = [
  { id: 'B', icon: '⚽', word: 'BOLA', hint: 'Rapatkan kedua bibir, kemudian buka bibir secara perlahan.' },
  { id: 'P', icon: '🍍', word: 'PAPA', hint: 'Amati gerakan bibir dan aliran udara bersama pendamping.' },
  { id: 'M', icon: '🍈', word: 'MAMA', hint: 'Rapatkan kedua bibir dengan nyaman bersama pendamping.' }
].map(item => ({ ...item, name: item.id, category: 'Bilabial', type: 'bilabial' }));

const otherConsonants = 'C D F G H J K L N Q R S T V W X Y Z'.split(' ')
  .map(letter => ({ id: letter, name: letter, category: 'Konsonan', type: 'consonant', icon: '🔤', word: letter, hint: 'Amati contoh gerakan mulut yang sudah divalidasi pendamping.' }));

const syllables = ['BA', 'BI', 'BU', 'BE', 'BO', 'PA', 'PI', 'PU', 'PE', 'PO', 'MA', 'MI', 'MU', 'ME', 'MO']
  .map(syllable => ({ id: `sy-${syllable}`, name: syllable, category: 'Suku kata', type: 'syllable', icon: '🔡', word: syllable, hint: 'Coba suku kata ini dengan nyaman dan didampingi.' }));

const wordItems = [
  ['MAMA', '👩‍👧'], ['PAPA', '👨‍👧'], ['BOLA', '⚽'], ['BUKU', '📚'], ['MAKAN', '🍽️'], ['MINUM', '🥛'],
  ['MATA', '👀'], ['GIGI', '😁'], ['SUSU', '🥛'], ['KAKI', '🦶'], ['TOPI', '🧢'],
  ['NASI', '🍚'], ['ROTI', '🍞'], ['AYAH', '👨'], ['IBU', '👩']
].map(([word, icon]) => ({
  id: word, name: word, category: 'Kata', type: 'word', icon, word,
  hint: 'Amati gerakan bibir kata ini dan coba bersama pendamping.'
}));

const animalItems = [
  ['KUCING', '🐱'], ['ANJING', '🐶'], ['SAPI', '🐄'], ['KUDA', '🐴'], ['IKAN', '🐟'],
  ['BURUNG', '🐦'], ['KELINCI', '🐰'], ['GAJAH', '🐘'], ['BEBEK', '🦆'], ['KAMBING', '🐐'],
  ['KUPU-KUPU', '🦋']
].map(([word, icon]) => ({
  id: word, name: word, category: 'Hewan', type: 'word', icon, word,
  hint: `Amati gerakan bibir pada kata ${word} dan coba bersama pendamping.`
}));

const materials = [...vowels, ...bilabials, ...otherConsonants, ...syllables, ...wordItems, ...animalItems];

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Tidak dapat membaca ${key} dari localStorage.`, error);
    return fallback;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Tidak dapat menyimpan ${key} ke localStorage.`, error);
    showToast('Penyimpanan browser tidak tersedia. Perubahan hanya berlaku sementara.');
    return false;
  }
}

function newMaterialProgress() {
  return { attempts: 0, successfulDetections: 0, lastPractice: null, completed: false, starred: false, progress: 0 };
}

let progress = readStored(PROGRESS_KEY, { materials: {}, attempts: 0, successfulDetections: 0, lastPractice: null });
if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
  progress = { materials: {}, attempts: 0, successfulDetections: 0, lastPractice: null };
}
progress.materials = progress.materials || {};
progress.attempts = Number(progress.attempts) || 0;
progress.successfulDetections = Number(progress.successfulDetections) || 0;
let settings = Object.assign({
  sensitivity: 3, minimumDuration: 300, haptic: true, hapticStrength: 'medium',
  textSize: 'm', contrast: false, reduceMotion: false, theme: 'light', signLanguage: 'SIBI'
}, readStored(SETTINGS_KEY, {}));
let selectedMaterial = materials.find(item => item.id === 'B');
const signMediaFiles = new Map();
const signMediaUrls = new Map();
const bundledSignMedia = new Map();
const checkedBundledSignMedia = new Set();
let activeSignMediaUrl = '';
let currentPage = 'beranda';
let activeFilter = 'Semua';
let audioContext = null;
let analyser = null;
let audioStream = null;
let microphoneFrame = 0;
let calibrationTimer = 0;
let calibrationSamples = [];
let noiseFloor = 0;
let soundThreshold = 0.012;
let activeSince = 0;
let currentBoutDetected = false;
let currentBoutTooLoud = false;
let sessionDetectionCount = 0;
let simulationTimer = 0;
let isSimulating = false;
let waveAnimation = 0;
let wavePhase = 0;
let demoWave = false;
let toastTimer = 0;
let mouthTimer = 0;
let mouthSpeed = 760;
let animationTestTimer = 0;
let practiceMode = '';
const audioBuffer = new Uint8Array(2048);
const defaultChecklist = ['Navigasi', 'Materi', 'Bahasa Isyarat', 'Visualisasi Mulut', 'Mikrofon', 'Deteksi Vokalisasi', 'Feedback Visual', 'Haptik', 'LocalStorage', 'Responsive'];

function materialProgress(id) {
  if (!progress.materials[id]) progress.materials[id] = newMaterialProgress();
  return progress.materials[id];
}

function persistProgress() {
  writeStored(PROGRESS_KEY, progress);
}

function persistSettings() {
  writeStored(SETTINGS_KEY, settings);
}

