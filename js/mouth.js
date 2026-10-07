// MOUTH ARTICULATION VISUALIZATION POWERED BY MOTION LIBRARY
// ==========================================================
'use strict';

const mouthStage = document.getElementById('mouth-stage');
let mouthStep = 0;
let previewVowelOverride = null;
let currentMotionAnimations = [];

// ==========================================================
// VOWEL & ARTICULATION KNOWLEDGE BASE
// ==========================================================
const VOWEL_CONFIGS = {
  A: {
    vowel: 'A',
    badge: 'VOKAL A',
    shapeLabel: 'Buka Lebar & Santai',
    overview: 'Rahang bawah turun rileks, rongga mulut terbuka lebar secara vertikal, dan lidah mendatar di dasar rongga mulut.',
    stages: [
      {
        title: 'Posisi siap',
        desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan vokal A.',
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.8, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0, y: -3 },
        teethLower: { opacity: 0, y: 3 },
        tongue: { opacity: 0, y: 6 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: 'Rahang turun & bibir terbuka',
        desc: 'Buka rapatan bibir dan turunkan rahang ke bawah secara rileks; rongga mulut mulai membuka vertikal.',
        upperLip: { y: -8, scaleX: 0.98, scaleY: 0.95 },
        lowerLip: { y: 14, scaleX: 0.98, scaleY: 1.05 },
        aperture: { scaleX: 1.02, scaleY: 0.85, opacity: 1 },
        teethUpper: { y: 0, opacity: 1 },
        teethLower: { y: 7, opacity: 0.7 },
        tongue: { y: 6, scaleX: 1.02, scaleY: 0.72, opacity: 0.9 },
        corners: { scaleX: 0.96 },
        waves: { opacity: 0.45 }
      },
      {
        title: 'Bentuk terbuka penuh & bersuara',
        desc: 'Pertahankan bukaan luas dengan lidah santai mendatar di bawah, hembuskan suara vokal A dari tenggorokan.',
        upperLip: { y: -12, scaleX: 0.96, scaleY: 0.92 },
        lowerLip: { y: 22, scaleX: 0.96, scaleY: 1.1 },
        aperture: { scaleX: 1.06, scaleY: 1.25, opacity: 1 },
        teethUpper: { y: 0, opacity: 1 },
        teethLower: { y: 14, opacity: 0.85 },
        tongue: { y: 8, scaleX: 1.08, scaleY: 0.75, opacity: 1 },
        corners: { scaleX: 0.94 },
        waves: { opacity: 1 }
      }
    ]
  },
  I: {
    vowel: 'I',
    badge: 'VOKAL I',
    shapeLabel: 'Bibir Melebar Mendatar',
    overview: 'Kedua sudut bibir ditarik melebar ke samping (seperti senyum santai), gigi atas dan bawah tampak rapat sejajar, lidah terangkat ke depan.',
    stages: [
      {
        title: 'Posisi siap',
        desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan vokal I.',
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.8, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0, y: -2 },
        teethLower: { opacity: 0, y: 2 },
        tongue: { opacity: 0, y: 5 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: 'Tarik sudut bibir ke samping',
        desc: 'Tarik kedua sudut bibir melebar ke samping kiri dan kanan secara simetris seperti tersenyum santai.',
        upperLip: { y: -5, scaleX: 1.18, scaleY: 0.88 },
        lowerLip: { y: 4, scaleX: 1.18, scaleY: 0.88 },
        aperture: { scaleX: 1.2, scaleY: 0.35, opacity: 0.95 },
        teethUpper: { y: 1, opacity: 0.95 },
        teethLower: { y: -1, opacity: 0.85 },
        tongue: { y: -1, scaleX: 1.15, scaleY: 0.9, opacity: 0.85 },
        corners: { scaleX: 1.2 },
        waves: { opacity: 0.45 }
      },
      {
        title: 'Gigi rapat sejajar & bersuara',
        desc: 'Pertahankan celah mendatar sempit dengan gigi atas dan bawah tampak berdekatan rapi serta lidah terangkat ke depan.',
        upperLip: { y: -8, scaleX: 1.25, scaleY: 0.82 },
        lowerLip: { y: 6, scaleX: 1.25, scaleY: 0.82 },
        aperture: { scaleX: 1.28, scaleY: 0.42, opacity: 1 },
        teethUpper: { y: 2, opacity: 1 },
        teethLower: { y: -2, opacity: 0.95 },
        tongue: { y: -3, scaleX: 1.22, scaleY: 1.05, opacity: 1 },
        corners: { scaleX: 1.28 },
        waves: { opacity: 1 }
      }
    ]
  },
  U: {
    vowel: 'U',
    badge: 'VOKAL U',
    shapeLabel: 'Bibir Mengerucut Terbuka Bulat',
    overview: 'Bibir membulat dan membuka corong bundar ke depan, gigi terlindung bibir, dan suara vokal U beresonansi dari bukaan bibir yang bulat.',
    stages: [
      {
        title: 'Posisi siap',
        desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan vokal U.',
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.7, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { opacity: 0 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: 'Bibir membulat & membuka corong',
        desc: 'Buka rapatan bibir dan majukan bibir membulat ke depan, menyempit ke tengah membentuk corong bundar yang terbuka.',
        upperLip: { y: -8, scaleX: 0.8, scaleY: 0.98 },
        lowerLip: { y: 10, scaleX: 0.8, scaleY: 0.98 },
        aperture: { scaleX: 0.62, scaleY: 0.72, opacity: 0.95 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { y: 5, scaleX: 0.75, scaleY: 0.7, opacity: 0.6 },
        corners: { scaleX: 0.8 },
        waves: { opacity: 0.45 }
      },
      {
        title: 'Bukaan corong bulat & bersuara',
        desc: 'Pertahankan bukaan bulat mengerucut yang terbuka jelas di tengah bibir, lalu bunyikan suara vokal U secara stabil.',
        upperLip: { y: -11, scaleX: 0.74, scaleY: 0.95 },
        lowerLip: { y: 14, scaleX: 0.74, scaleY: 0.95 },
        aperture: { scaleX: 0.58, scaleY: 0.92, opacity: 1 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { y: 6, scaleX: 0.72, scaleY: 0.75, opacity: 0.75 },
        corners: { scaleX: 0.74 },
        waves: { opacity: 1 }
      }
    ]
  },
  E: {
    vowel: 'E',
    badge: 'VOKAL E',
    shapeLabel: 'Bukaan Sedang Agak Melebar',
    overview: 'Mulut terbuka sedang dengan sudut bibir agak melebar (antara bentuk I dan A), gigi atas terlihat sebagian, lidah di posisi tengah-depan rileks.',
    stages: [
      {
        title: 'Posisi siap',
        desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan vokal E.',
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.8, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { opacity: 0 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: 'Turunkan rahang sedikit',
        desc: 'Buka rapatan bibir separuh dan biarkan sudut bibir agak melebar santai (posisi transisi antara bentuk I dan A).',
        upperLip: { y: -6, scaleX: 1.08, scaleY: 0.92 },
        lowerLip: { y: 8, scaleX: 1.08, scaleY: 0.95 },
        aperture: { scaleX: 1.08, scaleY: 0.55, opacity: 0.9 },
        teethUpper: { y: 1, opacity: 0.85 },
        teethLower: { y: 2, opacity: 0.4 },
        tongue: { y: 2, scaleX: 0.98, scaleY: 0.8, opacity: 0.8 },
        corners: { scaleX: 1.08 },
        waves: { opacity: 0.45 }
      },
      {
        title: 'Bukaan elips sedang & bersuara',
        desc: 'Pertahankan bukaan elips sedang horizontal dengan gigi atas tampak sedikit, lalu bunyikan vokal E dengan nyaman.',
        upperLip: { y: -9, scaleX: 1.12, scaleY: 0.9 },
        lowerLip: { y: 11, scaleX: 1.12, scaleY: 0.95 },
        aperture: { scaleX: 1.14, scaleY: 0.72, opacity: 1 },
        teethUpper: { y: 2, opacity: 0.95 },
        teethLower: { y: 3, opacity: 0.55 },
        tongue: { y: 3, scaleX: 1.02, scaleY: 0.85, opacity: 0.9 },
        corners: { scaleX: 1.14 },
        waves: { opacity: 1 }
      }
    ]
  },
  O: {
    vowel: 'O',
    badge: 'VOKAL O',
    shapeLabel: 'Bibir Membulat Lonjong Terbuka',
    overview: 'Bibir membentuk kurva oval terbuka sedang-lebar (lebih besar dari U), rahang sedikit turun, dan rongga mulut beresonansi bulat.',
    stages: [
      {
        title: 'Posisi siap',
        desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan vokal O.',
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.75, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { opacity: 0 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: 'Bibir membulat & rahang turun',
        desc: 'Buka bibir membulat lonjong dengan rahang bawah turun sedang (bukaan lebih luas dan santai daripada U).',
        upperLip: { y: -6, scaleX: 0.82, scaleY: 1.02 },
        lowerLip: { y: 11, scaleX: 0.82, scaleY: 1.06 },
        aperture: { scaleX: 0.76, scaleY: 0.85, opacity: 0.9 },
        teethUpper: { y: 0, opacity: 0.4 },
        teethLower: { opacity: 0 },
        tongue: { y: 6, scaleX: 0.82, scaleY: 0.75, opacity: 0.8 },
        corners: { scaleX: 0.82 },
        waves: { opacity: 0.45 }
      },
      {
        title: 'Bukaan bulat rileks & bersuara',
        desc: 'Pertahankan bentuk oval bulat terbuka tanpa menegangkan pipi, lalu alirkan suara vokal O dari rongga mulut yang bulat.',
        upperLip: { y: -9, scaleX: 0.78, scaleY: 1.02 },
        lowerLip: { y: 15, scaleX: 0.78, scaleY: 1.08 },
        aperture: { scaleX: 0.78, scaleY: 1.05, opacity: 1 },
        teethUpper: { y: 0, opacity: 0.5 },
        teethLower: { opacity: 0 },
        tongue: { y: 7, scaleX: 0.85, scaleY: 0.8, opacity: 0.85 },
        corners: { scaleX: 0.8 },
        waves: { opacity: 1 }
      }
    ]
  }
};

// ==========================================================
// MOTION ANIMATION WRAPPER
// ==========================================================
function animateWithMotion(element, keyframes, options = {}) {
  if (!element) return null;
  const isReduced = typeof settings !== 'undefined' && settings.reduceMotion;
  const duration = isReduced ? 0.01 : (options.duration || 0.42);
  const ease = isReduced ? 'linear' : (options.ease || [0.34, 1.25, 0.64, 1]);

  try {
    if (window.Motion && typeof window.Motion.animate === 'function') {
      return window.Motion.animate(element, keyframes, {
        duration,
        ease,
        ...options
      });
    }
  } catch (err) {
    console.warn('Motion animate error, applying style directly:', err);
  }

  // Fallback direct application
  for (const prop in keyframes) {
    const val = Array.isArray(keyframes[prop])
      ? keyframes[prop][keyframes[prop].length - 1]
      : keyframes[prop];
    element.style[prop] = val;
  }
  return null;
}

function stopCurrentMotionAnimations() {
  currentMotionAnimations.forEach(anim => {
    try {
      if (anim && typeof anim.stop === 'function') anim.stop();
    } catch (e) {}
  });
  currentMotionAnimations = [];
}

// ==========================================================
// PATTERN RESOLUTION LOGIC
// ==========================================================
function getMouthPattern() {
  // 1. Manual Vowel Choice Override
  if (previewVowelOverride && VOWEL_CONFIGS[previewVowelOverride]) {
    const config = VOWEL_CONFIGS[previewVowelOverride];
    return {
      motion: `vowel-${config.vowel.toLowerCase()}`,
      badge: config.badge,
      vowelLetter: config.vowel,
      shapeLabel: config.shapeLabel,
      overview: config.overview,
      stages: config.stages
    };
  }

  const name = (selectedMaterial && selectedMaterial.name ? selectedMaterial.name : 'A').toUpperCase();
  const category = (selectedMaterial && selectedMaterial.category) || 'Vokal';

  // 2. Direct Vowels A, I, U, E, O
  if (category === 'Vokal' && VOWEL_CONFIGS[name]) {
    const config = VOWEL_CONFIGS[name];
    return {
      motion: `vowel-${name.toLowerCase()}`,
      badge: config.badge,
      vowelLetter: name,
      shapeLabel: config.shapeLabel,
      overview: config.overview,
      stages: config.stages
    };
  }

  // 3. Syllables (e.g. BA, BI, BU, BE, BO, PA, PI, PU, PE, PO, MA, MI, MU, ME, MO)
  if (category === 'Suku kata' && name.length >= 2) {
    const cons = name.charAt(0);
    const targetVowel = name.charAt(1);
    const vConfig = VOWEL_CONFIGS[targetVowel] || VOWEL_CONFIGS.A;
    const isM = cons === 'M';

    return {
      motion: `syllable-${name.toLowerCase()}`,
      badge: `SUKU KATA ${name}`,
      vowelLetter: targetVowel,
      shapeLabel: `Transisi → Vokal ${targetVowel} (${vConfig.shapeLabel})`,
      overview: `Mulai dari bibir merapat (${cons}), lalu buka letupan dan bentuk mulut langsung ke posisi vokal ${targetVowel}.`,
      stages: [
        {
          title: `Posisi awal konsonan ${cons}`,
          desc: isM
            ? `Kedua bibir tertutup rapat dengan santai sebelum mendengungkan konsonan ${cons}.`
            : `Kedua bibir tertutup rapat untuk mempersiapkan letupan konsonan ${cons}.`,
          upperLip: { y: 0, scaleX: 1, scaleY: 1 },
          lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
          aperture: { scaleX: 0.85, scaleY: 0, opacity: 0 },
          teethUpper: { opacity: 0 },
          teethLower: { opacity: 0 },
          tongue: { opacity: 0 },
          corners: { scaleX: 1 },
          waves: { opacity: 0 }
        },
        {
          title: isM ? 'Lepaskan ke vokal' : 'Letupan pelepasan bibir',
          desc: isM
            ? `Buka rapatan bibir secara perlahan menuju posisi bukaan vokal ${targetVowel}.`
            : `Lepaskan rapatan bibir dengan letupan udara lembut menuju vokal ${targetVowel}.`,
          upperLip: { y: -5, scaleX: 1.02, scaleY: 0.96 },
          lowerLip: { y: 9, scaleX: 1.02, scaleY: 1.0 },
          aperture: { scaleX: (vConfig.stages[1].aperture.scaleX + 0.8) / 2, scaleY: 0.65, opacity: 0.9 },
          teethUpper: { y: 0, opacity: 0.7 },
          teethLower: { y: 3, opacity: 0.4 },
          tongue: { y: 4, scaleX: 0.95, scaleY: 0.7, opacity: 0.7 },
          corners: { scaleX: 1.02 },
          waves: { opacity: 0.5 }
        },
        {
          title: `Bentuk vokal target ${targetVowel}`,
          desc: `Pertahankan bentuk vokal ${targetVowel} (${vConfig.shapeLabel.toLowerCase()}) saat mengeluarkan suara suku kata ${name}.`,
          ...vConfig.stages[2]
        }
      ]
    };
  }

  // 4. Bilabial Consonants (B, P, M)
  if (category === 'Bilabial' || ['B', 'P', 'M'].includes(name)) {
    const isM = name === 'M';
    return {
      motion: isM ? 'bilabial-nasal' : 'bilabial-plosive',
      badge: `KONSONAN ${name}`,
      vowelLetter: isM ? 'M' : name,
      shapeLabel: isM ? 'Bibir Rapat Dengung' : 'Bibir Rapat Letup',
      overview: isM
        ? 'Rapatkan kedua bibir secara lembut dan pertahankan; getaran suara mengalir melalui rongga hidung.'
        : 'Rapatkan kedua bibir rapat untuk menahan aliran udara, kemudian buka bibir dengan letupan lembut.',
      stages: [
        {
          title: 'Posisi siap',
          desc: 'Kedua bibir tertutup rapat dan santai sebelum mulai artikulasi.',
          upperLip: { y: 0, scaleX: 1, scaleY: 1 },
          lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
          aperture: { scaleX: 0.8, scaleY: 0, opacity: 0 },
          teethUpper: { opacity: 0 },
          teethLower: { opacity: 0 },
          tongue: { opacity: 0 },
          corners: { scaleX: 1 },
          waves: { opacity: 0 }
        },
        {
          title: isM ? 'Bibir merapat lembut' : 'Bibir merapat rapat & tahan udara',
          desc: isM
            ? 'Pertemukan bibir atas dan bawah dengan lembut tanpa menekan terlalu kuat.'
            : 'Rapatkan kedua bibir hingga terkatup kencang; aliran udara tertahan sementara di balik bibir.',
          upperLip: { y: 2, scaleX: 1.04, scaleY: 1.04 },
          lowerLip: { y: -2, scaleX: 1.04, scaleY: 1.04 },
          aperture: { scaleX: 0.85, scaleY: 0, opacity: 0 },
          teethUpper: { opacity: 0 },
          teethLower: { opacity: 0 },
          tongue: { opacity: 0 },
          corners: { scaleX: 1.03 },
          waves: { opacity: isM ? 0.6 : 0 }
        },
        {
          title: isM ? 'Tahan dengungan nasal' : 'Lepaskan letupan udara',
          desc: isM
            ? 'Pertahankan bibir tetap merapat sambil merasakan dengungan suara di bibir dan hidung.'
            : 'Lepaskan rapatan bibir dengan membuka sedikit; udara keluar dengan letupan lembut yang nyaman.',
          upperLip: isM ? { y: 1, scaleX: 1.03, scaleY: 1.02 } : { y: -7, scaleX: 0.98, scaleY: 0.94 },
          lowerLip: isM ? { y: -1, scaleX: 1.03, scaleY: 1.02 } : { y: 11, scaleX: 0.98, scaleY: 0.96 },
          aperture: isM ? { scaleX: 0.85, scaleY: 0, opacity: 0 } : { scaleX: 0.9, scaleY: 0.58, opacity: 0.85 },
          teethUpper: isM ? { opacity: 0 } : { y: 1, opacity: 0.85 },
          teethLower: isM ? { opacity: 0 } : { y: 4, opacity: 0.5 },
          tongue: isM ? { opacity: 0 } : { y: 3, scaleX: 0.92, scaleY: 0.72, opacity: 0.75 },
          corners: isM ? { scaleX: 1.03 } : { scaleX: 0.98 },
          waves: { opacity: 1 }
        }
      ]
    };
  }

  // 5. Words, Animals, and Other Consonants
  const matchVowel = name.match(/[AIUEO]/);
  const detectedVowel = matchVowel ? matchVowel[0] : 'A';
  const vConfig = VOWEL_CONFIGS[detectedVowel] || VOWEL_CONFIGS.A;

  return {
    motion: `word-${detectedVowel.toLowerCase()}`,
    badge: `KATA ${name}`,
    vowelLetter: detectedVowel,
    shapeLabel: `Fokus Vokal ${detectedVowel} (${vConfig.shapeLabel})`,
    overview: `Perhatikan bentuk mulut saat melafalkan kata ${name}, dengan fokus artikulasi pada vokal ${detectedVowel}.`,
    stages: [
      {
        title: 'Posisi siap',
        desc: `Kedua bibir tertutup rapat dan santai sebelum mulai melafalkan kata ${name}.`,
        upperLip: { y: 0, scaleX: 1, scaleY: 1 },
        lowerLip: { y: 0, scaleX: 1, scaleY: 1 },
        aperture: { scaleX: 0.85, scaleY: 0, opacity: 0 },
        teethUpper: { opacity: 0 },
        teethLower: { opacity: 0 },
        tongue: { opacity: 0 },
        corners: { scaleX: 1 },
        waves: { opacity: 0 }
      },
      {
        title: `Bentuk artikulasi ${name}`,
        desc: `Mulai gerakkan mulut menuju artikulasi vokal utama ${detectedVowel} pada kata ini.`,
        ...vConfig.stages[1]
      },
      {
        title: `Pelepasan vokal ${detectedVowel}`,
        desc: `Pertahankan bentuk vokal ${detectedVowel} (${vConfig.shapeLabel.toLowerCase()}) hingga bunyi kata selesai.`,
        ...vConfig.stages[2]
      }
    ]
  };
}

// ==========================================================
// APPLY VISUAL TRANSFORMS VIA MOTION
// ==========================================================
function applyMouthTransforms(stageConfig, animate = true) {
  if (!stageConfig) return;
  const isReduced = typeof settings !== 'undefined' && settings.reduceMotion;
  const animDuration = isReduced ? 0.01 : (animate ? (mouthSpeed / 1000) * 0.65 : 0.01);
  const springEase = [0.34, 1.25, 0.64, 1];

  stopCurrentMotionAnimations();

  const apertureEl = document.getElementById('mouth-aperture-group');
  const upperLipEl = document.getElementById('mouth-upper-lip-group');
  const lowerLipEl = document.getElementById('mouth-lower-lip-group');
  const teethUpperEl = document.getElementById('mouth-teeth-upper');
  const teethLowerEl = document.getElementById('mouth-teeth-lower');
  const tongueEl = document.getElementById('mouth-tongue-group');
  const cornersEl = document.getElementById('mouth-corners-group');
  const wavesEl = document.getElementById('mouth-vocal-waves');

  if (apertureEl && stageConfig.aperture) {
    const { scaleX = 1, scaleY = 1, opacity = 1 } = stageConfig.aperture;
    currentMotionAnimations.push(
      animateWithMotion(apertureEl, {
        transform: `scale(${scaleX}, ${scaleY})`,
        opacity
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (upperLipEl && stageConfig.upperLip) {
    const { y = 0, scaleX = 1, scaleY = 1 } = stageConfig.upperLip;
    currentMotionAnimations.push(
      animateWithMotion(upperLipEl, {
        transform: `translateY(${y}px) scale(${scaleX}, ${scaleY})`
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (lowerLipEl && stageConfig.lowerLip) {
    const { y = 0, scaleX = 1, scaleY = 1 } = stageConfig.lowerLip;
    currentMotionAnimations.push(
      animateWithMotion(lowerLipEl, {
        transform: `translateY(${y}px) scale(${scaleX}, ${scaleY})`
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (teethUpperEl && stageConfig.teethUpper) {
    const { y = 0, opacity = 1 } = stageConfig.teethUpper;
    currentMotionAnimations.push(
      animateWithMotion(teethUpperEl, {
        transform: `translateY(${y}px)`,
        opacity
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (teethLowerEl && stageConfig.teethLower) {
    const { y = 0, opacity = 1 } = stageConfig.teethLower;
    currentMotionAnimations.push(
      animateWithMotion(teethLowerEl, {
        transform: `translateY(${y}px)`,
        opacity
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (tongEl() && stageConfig.tongue) {
    const { y = 0, scaleX = 1, scaleY = 1, opacity = 1 } = stageConfig.tongue;
    currentMotionAnimations.push(
      animateWithMotion(tongEl(), {
        transform: `translateY(${y}px) scale(${scaleX}, ${scaleY})`,
        opacity
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (cornersEl && stageConfig.corners) {
    const { scaleX = 1 } = stageConfig.corners;
    currentMotionAnimations.push(
      animateWithMotion(cornersEl, {
        transform: `scaleX(${scaleX})`
      }, { duration: animDuration, ease: springEase })
    );
  }

  if (wavesEl && stageConfig.waves) {
    const targetOpacity = stageConfig.waves.opacity;
    currentMotionAnimations.push(
      animateWithMotion(wavesEl, {
        opacity: targetOpacity
      }, { duration: animDuration * 0.75, ease: 'easeOut' })
    );

    // Delicate acoustic echo pulse when vocalizing
    if (targetOpacity > 0.5 && !isReduced && window.Motion) {
      try {
        const ripple = window.Motion.animate(wavesEl, {
          transform: ['scale(0.98) translateX(0px)', 'scale(1.03) translateX(2.5px)', 'scale(1.0) translateX(1px)'],
          opacity: [0.55, 0.95, 0.65]
        }, {
          duration: 1.35,
          repeat: Infinity,
          ease: 'easeInOut'
        });
        currentMotionAnimations.push(ripple);
      } catch (e) {}
    }
  }
}

function tongEl() {
  return document.getElementById('mouth-tongue-group');
}

// ==========================================================
// VOWEL CHIP UI SYNCHRONIZATION
// ==========================================================
function updateVowelChipsUI(currentVowel) {
  document.querySelectorAll('[data-vowel-choice]').forEach(chip => {
    const isSelected = chip.dataset.vowelChoice === currentVowel;
    chip.classList.toggle('active', isSelected);
    chip.setAttribute('aria-pressed', String(isSelected));
  });
}

// ==========================================================
// MAIN UPDATE FUNCTIONS
// ==========================================================
function updateMouthVisualization(resetOverride = true) {
  if (resetOverride) previewVowelOverride = null;
  const pattern = getMouthPattern();
  mouthStage.dataset.motion = pattern.motion;
  setMouthStep(mouthStep, false);
}

function setMouthStep(step, animate = false) {
  const pattern = getMouthPattern();
  mouthStep = ((step % pattern.stages.length) + pattern.stages.length) % pattern.stages.length;
  mouthStage.dataset.stage = String(mouthStep);
  mouthStage.classList.toggle('is-playing', animate);

  // Update text copies
  const stageNumEl = document.getElementById('mouth-stage-number');
  if (stageNumEl) stageNumEl.textContent = `LANGKAH ${mouthStep + 1}`;

  const titleEl = document.getElementById('mouth-stage-title');
  if (titleEl) titleEl.textContent = pattern.stages[mouthStep].title;

  const descEl = document.getElementById('mouth-stage-description');
  if (descEl) descEl.textContent = pattern.stages[mouthStep].desc;

  const pronunEl = document.getElementById('pronunciation-text');
  if (pronunEl) pronunEl.textContent = pattern.overview;

  const vowelTagLetter = document.getElementById('mouth-vowel-badge-letter');
  if (vowelTagLetter) vowelTagLetter.textContent = pattern.vowelLetter || pattern.badge;

  const shapeTag = document.getElementById('mouth-shape-tag');
  if (shapeTag) {
    if (mouthStep === 0) {
      shapeTag.innerHTML = 'Posisi: <span>Bibir Tertutup Rapat</span>';
    } else {
      shapeTag.innerHTML = `Bentuk: <span>${pattern.shapeLabel}</span>`;
    }
  }

  // Update How-To list
  const guide = document.getElementById('mouth-howto-list');
  if (guide) {
    guide.replaceChildren(...pattern.stages.map((stg, index) => {
      const item = document.createElement('li');
      const copy = document.createElement('div');
      const stepTitle = document.createElement('strong');
      const stepDescription = document.createElement('span');
      stepTitle.textContent = `${stg.title}: `;
      stepDescription.textContent = stg.desc;
      copy.className = 'mouth-howto-copy';
      copy.append(stepTitle, stepDescription);
      item.append(copy);
      item.classList.toggle('current', index === mouthStep);
      return item;
    }));
  }

  // Update Step buttons
  document.querySelectorAll('[data-mouth-dot]').forEach(dot => {
    const selected = Number(dot.dataset.mouthDot) === mouthStep;
    dot.classList.toggle('active', selected);
    dot.setAttribute('aria-pressed', String(selected));
  });

  // Update Vowel Chips
  updateVowelChipsUI(pattern.vowelLetter);

  // Apply Motion Transforms
  applyMouthTransforms(pattern.stages[mouthStep], animate);
}

function stopMouthAnimation() {
  window.clearInterval(mouthTimer);
  mouthTimer = 0;
  mouthStage.classList.remove('is-playing');
  stopCurrentMotionAnimations();
}

function playMouthStep(step) {
  stopMouthAnimation();
  setMouthStep(step, true);
}

function playMouthAnimation() {
  stopMouthAnimation();
  setMouthStep(mouthStep, true);
  mouthTimer = window.setInterval(() => {
    setMouthStep(mouthStep + 1, true);
  }, mouthSpeed);
}

// ==========================================================
// EVENT LISTENERS
// ==========================================================
document.getElementById('mouth-play').addEventListener('click', playMouthAnimation);
document.getElementById('mouth-pause').addEventListener('click', stopMouthAnimation);
document.getElementById('mouth-reset').addEventListener('click', () => {
  stopMouthAnimation();
  previewVowelOverride = null;
  setMouthStep(0, true);
});
document.getElementById('mouth-next').addEventListener('click', () => {
  playMouthStep(mouthStep + 1);
});

document.querySelectorAll('[data-mouth-dot]').forEach(button => {
  button.addEventListener('click', () => {
    playMouthStep(Number(button.dataset.mouthDot));
  });
});

document.querySelectorAll('[data-speed]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-speed]').forEach(item => item.classList.toggle('selected', item === button));
    mouthSpeed = button.dataset.speed === 'slow' ? 1300 : 760;
    if (mouthStage.classList.contains('is-playing')) playMouthAnimation();
  });
});

// Vowel Quick Explorer button clicks
document.querySelectorAll('[data-vowel-choice]').forEach(button => {
  button.addEventListener('click', () => {
    stopMouthAnimation();
    const vowel = button.dataset.vowelChoice;
    previewVowelOverride = vowel;
    // Jump straight to vocalization (step 2) with smooth Motion spring animation!
    setMouthStep(2, true);
  });
});
