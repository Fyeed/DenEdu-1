# DENTUM-EDU

Prototipe media pembelajaran artikulasi berbasis visual-taktil dengan tagline **Lihat → Tiru → Rasakan**. Website ini menggunakan HTML5, CSS3, dan Vanilla JavaScript tanpa framework, backend, atau database eksternal.

## Menjalankan

1. Buka `index.html` langsung di browser, atau buka folder ini di Visual Studio Code dan jalankan Live Server.
2. Pilih materi, pelajari petunjuk visual, lalu tekan **Mulai latihan**.
3. Tekan **Mulai rekam** dan berikan izin mikrofon untuk kalibrasi 2 detik dan latihan langsung.
4. Jika mikrofon tidak tersedia atau izin ditolak, tekan dan tahan **Simulasikan suara** untuk demonstrasi.

> Pada beberapa browser, akses mikrofon memerlukan konteks aman seperti `localhost` (Live Server). Mode simulasi tetap tersedia tanpa izin mikrofon.

## Struktur

```text
DENTUM-EDU/
├── index.html
├── style.css
├── js/
│   ├── core.js
│   ├── navigation.js
│   ├── materials.js
│   ├── mouth.js
│   ├── microphone.js
│   ├── practice.js
│   ├── waveform.js
│   ├── haptics.js
│   ├── progress.js
│   ├── settings.js
│   ├── companion.js
│   ├── testing.js
│   └── app.js
├── assets/
│   ├── images/
│   ├── icons/
│   ├── videos/
│   └── animations/
└── README.md
```

Placeholder visual dibuat dengan HTML/CSS dan emoji agar demo dapat berjalan tanpa mengunduh aset. Maskot orisinal Tumi tersedia di `assets/images/dentum-mascot.svg` dan ditampilkan pada hero beranda. Katalog kini berisi 67 materi: seluruh huruf A–Z, 15 suku kata BA/BI/BU/BE/BO, PA/PI/PU/PE/PO, MA/MI/MU/ME/MO, 15 kata sederhana, dan 11 nama hewan.

### Organisasi JavaScript

Logika dipisahkan menjadi file per fitur di folder `js/`. Semua file dimuat sebagai script klasik dengan `defer` dan urutannya diatur pada `index.html`; cara ini menjaga prototipe tetap dapat dibuka langsung tanpa server maupun bundler. `core.js` berisi data, state bersama, dan penyimpanan; file lainnya menangani navigasi, materi/isyarat, visualisasi mulut, mikrofon dan latihan, waveform, haptik, progres, pengaturan, pendamping, pengujian, dan inisialisasi aplikasi. Pertahankan urutan pemuatan tersebut karena beberapa fitur memakai fungsi dan state dari file sebelumnya.

### Menambahkan media isyarat

Pada halaman detail materi, pilih **SIBI** atau **BISINDO**, lalu gunakan **Tambahkan foto/video isyarat** untuk mempratinjau file lokal (JPG, PNG, WebP, MP4, atau WebM; maksimal 20 MB). File yang dipilih hanya tersedia di tab browser saat itu dan tidak diunggah atau disimpan.

Di bawah media ada kolom **Cara gerakan** yang mengikuti materi dan bahasa isyarat yang dipilih. Pendamping dapat menuliskan deskripsi gerakan berdasarkan media yang sudah divalidasi, lalu menekan **Simpan panduan**. Setiap deskripsi disimpan di `localStorage` berdasarkan pasangan materi dan bahasa, misalnya `BISINDO:BOLA`, sehingga panduan BISINDO tidak tertukar dengan SIBI atau materi lain. Prototipe tidak mengisi deskripsi isyarat otomatis karena BISINDO bervariasi menurut wilayah/komunitas; deskripsi harus diperiksa penutur atau pendidik BISINDO.

Agar media ikut tersedia setiap kali prototipe dibuka melalui Live Server, letakkan media yang telah mendapat izin penggunaan dan divalidasi penutur/pengajar di folder aset dengan nama berikut:

- Video: `assets/videos/isyarat/<id-materi>-<bahasa>.mp4` atau `.webm`
- Foto: `assets/images/isyarat/<id-materi>-<bahasa>.jpg`, `.png`, atau `.webp`

Gunakan ID huruf/kata dalam huruf kecil (misalnya `b-sibi.mp4`, `bola-bisindo.jpg`). ID suku kata menggunakan awalan `sy-` (misalnya `sy-ba-sibi.mp4`). Pemutar akan mencari file tersebut otomatis saat detail materi dibuka melalui Live Server. Jika `index.html` dibuka langsung, gunakan tombol tambah media karena browser membatasi pencarian aset lokal. Isyarat dapat bervariasi menurut bahasa, wilayah, dan komunitas; jangan gunakan media yang belum tervalidasi sebagai contoh pembelajaran.

## Fitur prototipe

- Navigasi SPA, filter materi, penandaan materi, visualisasi mulut bertahap dengan kontrol putar/jeda/ulang/langkah berikutnya, dan pilihan label SIBI/BISINDO.
- Pengambilan mikrofon sesuai tindakan pengguna, kalibrasi noise, pembacaan RMS, deteksi aktivitas berdasarkan threshold dan durasi minimum.
- Sound meter, waveform Canvas real-time, feedback visual, dan simulasi haptik dengan animasi fallback.
- Mode simulasi tekan-tahan untuk presentasi tanpa mikrofon.
- Progres, pengaturan, checklist uji, dan catatan yang disimpan di `localStorage`; catatan uji dapat diekspor sebagai `.txt`.
- Tata letak responsif, navigasi bawah pada layar kecil, tema, ukuran teks, kontras, dan opsi pengurangan animasi.

## Privasi dan batasan

Audio hanya dianalisis sementara di browser selama sesi; audio tidak direkam, disimpan, atau dikirim ke server. Track mikrofon dihentikan saat sesi berakhir.

**DENTUM-EDU hanya mendeteksi aktivitas suara, kekuatan, dan durasi vokalisasi. Sistem tidak menilai ketepatan bunyi atau fonem.** DENTUM-EDU bukan alat diagnosis dan merupakan media pendukung pembelajaran, bukan pengganti guru, orang tua, atau terapis. Pendampingan orang dewasa tetap disarankan.

Prototipe isyarat dan contoh pelafalan bersifat placeholder, bukan materi instruksi bahasa isyarat yang tervalidasi. Sesuaikan materi dengan kebutuhan anak, pendidik, serta bahasa dan komunitas setempat.

Pada visualisasi mulut, pengguna dapat memilih langsung tombol **1 Siap**, **2 Gerak**, atau **3 Amati**. Saat tahap dipilih, animasi gerakan tahap tersebut langsung diputar singkat dan berhenti pada bentuk visual tahap itu. Panel “Cara menggerakkan bibir” memberi instruksi di setiap langkah dan ringkasan berubah mengikuti materi. Bentuk visual diselaraskan untuk beberapa gerak bibir bilabial dan vokal; kata/suku kata lainnya meminta pengguna mengikuti media atau pendamping, bukan menebak gerakan kata. Tombol putar menjalankan urutan, sementara jeda, ulang, dan berikutnya tetap tersedia. Ilustrasi merupakan skema tiga langkah, bukan model anatomi presisi atau petunjuk klinis. Gunakan arahan guru/terapis sebagai panduan.
