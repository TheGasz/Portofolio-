# Specification: Single-Page Interactive 3D Bedroom & Study Desk Portfolio ("Bagas's Room" Edition)

## Goal
Mengubah seluruh website portofolio **Bagas Adjie Pamungkas** (Data Scientist & Data Engineer) menjadi **Satu Landing Page Interaktif (Single-Page Immersive Room)** yang merepresentasikan **meja belajar dan kamar asli Bagas** berdasarkan referensi foto [`src/assets/WhatsApp Image 2026-11-07 at 20.53.34.jpeg`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/WhatsApp%20Image%202026-11-07%20at%2020.53.34.jpeg).

Pengunjung seolah-olah berada langsung di dalam kamar Bagas yang memiliki:
- **Dinding kamar dengan *tone* wallpaper sejuk (*cool-toned cozy slate/twilight*)** dan **jendela kamar dengan pemandangan tenang di baliknya** (langit senja/malam sejuk, pegunungan/lampu kota, dan cahaya lembut yang masuk ke meja).
- **Musik latar syahdu (*Serene Ambient / Lofi Room Music*)** yang mengalun lembut saat berada di kamar (dengan kontrol *Play/Pause* & volume).
- **Replika 3D/Isometrik Meja Belajar & Lemari Kayu Jati Asli Bagas** beserta pernak-pernik portofolio yang memiliki **animasi transisi sinematik berbasis objek (bukan sekadar *pop-up* biasa dari bawah)** saat diklik.

---

## Referensi Visual Meja Asli (`src/assets/WhatsApp Image 2026-11-07 at 20.53.34.jpeg`)

Dari foto meja kerja asli Bagas, tata letak geometri 3D/isometrik kamar dibagi menjadi:

1. **Sisi Kiri — Lemari & Rak Buku Kayu Jati Tinggi (`Tall Wooden Cabinet & Open Bookshelf`)**:
   - **Bagian Kiri Atas Lemari (Atas Lemari):** Tempat berdirinya **Piala (*Championship Trophy*) & Deretan Sertifikat (`[05] Achievements & Certifications`)**.
   - **Rak Terbuka Kiri (`3 Open Cubbies`):** Berisi **Buku-Buku & Catatan Lab (`[04] What I Do / Skills`)**, kotak hijau/hitam & kotak ungu, serta tumpukan kertas.
   - **Pintu Lemari Kanan & Bawah:** Pintu kayu jati dengan gagang perak tempat tergantungnya **Hanger Biru + Lanyard ID Card**, serta 2 pintu kabinet bawah.
2. **Sisi Tengah & Kanan — Meja Belajar Kayu dengan *Hutch* (Papan Sandaran Atas) & Laci Kanan**:
   - **Papan Sandaran Atas (*Wooden Hutch*) & Dinding Samping Kanan Berlubang:** Persis seperti meja asli, lengkap dengan stiker kecil di tengah papan atas dan *power strip* putih di tiang kiri.
   - **Monitor Widescreen Eksternal di Tengah-Kiri Meja (`[01] Projects`):** Berdiri di atas *stand* dengan **Keyboard Mekanis** dan **Mouse di atas Mousepad Hitam** di depannya.
   - **Gaming Laptop di Sisi Kanan Meja:** Laptop hitam dengan **keyboard menyala merah (*red backlit keyboard*)** dan tampilan kode di layarnya.
   - **HP di Atas *Stand* Meja (`[03] Contact Me`):** Menggantikan telepon rumah lama; terletak di sisi kiri meja dekat kipas mini putih.
   - **Laci Kayu 2 Tingkat di Kanan Bawah Meja** dan lantai keramik di kolong meja.
3. **Latar Belakang Kamar (`Cool Wallpaper + Scenic Window + Wall Portrait`)**:
   - **Wallpaper Kamar Tone Sejuk:** Warna biru-abu sejuk (*cool slate/misty teal*) yang kontras hangat dengan warna kayu jati meja dan lemari.
   - **Jendela Kamar (`Bedroom Window`):** Menampilkan pemandangan langit senja/malam yang tenang dengan siluet bukit, bintang/awan lembut, dan bias cahaya jendela.
   - **Bingkai Foto Dinding (`[02] About Me`):** Menampilkan foto profil [`src/assets/profile.jpg`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/profile.jpg) di dinding kamar.

---

## 5 Objek Interaktif & Koreografi Animasi Klik Sinematik

Alih-alih menampilkan *pop-up card* biasa di bawah gambar, setiap objek yang diklik menjalankan **koreografi animasi kamera & objek (Stage Transition)**:

| No | Objek di Kamar / Meja | Tujuan Konten | Koreografi Animasi Saat Diklik |
|---|---|---|---|
| **`01`** | **Monitor & Setup Komputer** *(Tengah meja, dilengkapi Keyboard, Mouse & Gaming Laptop)* | **Projects (11 Proyek Data Science & Data Engineering)** | **Monitor Screen Dive-In:** Layar monitor menyala terang (*boot glow*), lalu kamera melakukan **zoom-in masuk ke dalam layar monitor** hingga bingkai monitor memenuhi layar menjadi antarmuka **BagasOS Project Explorer** yang menampilkan seluruh **11 `ProjectCard`** lengkap dengan filter kategori. |
| **`02`** | **Bingkai Foto Dinding / Lanyard ID** *(Dinding kamar & gantungan lemari)* | **About Me (Profil, Cerita & Fakta Singkat)** | **Portrait Zoom & Slide-Aside:** Kamera *zoom-in* ke foto profil, bingkai foto menyala hangat dan bergeser ke sisi kiri panggung, lalu menampilkan cerita **About Me** & fakta utama Bagas di sisi kanan. |
| **`03`** | **HP di Atas Stand (`Smartphone on Stand`)** *(Sisi kiri meja belajar)* | **Contact Me (Email, Copy Email, LinkedIn, GitHub)** | **Smartphone Lift & Zoom-In:** HP di atas *stand* terangkat dan **zoom-in ke depan layar** menampilkan antarmuka layar HP interaktif berisi tombol **Email (`mailto:`)**, **Copy Email**, **GitHub**, dan **LinkedIn**. |
| **`04`** | **Buku di Rak Lemari Kiri (`Bookshelf`)** *(Rak terbuka pada lemari kayu sebelah kiri)* | **What I Do (5 Keahlian Utama & 16 Toolbelt)** | **Book Pull-Out & Page Unfold:** Buku di rak lemari kiri **terambil keluar (*slide out*), melayang ke tengah, lalu membuka sampulnya menjadi 2 halaman terbuka (*open book spread*)** yang menampilkan daftar **"What I Do"** di halaman kiri dan **Toolbelt** di halaman kanan. |
| **`05`** | **Trophy di Atas Lemari Kiri (`Trophy & Certs`)** *(Sebelah kiri atas meja / puncak lemari)* | **Achievements & 7 Sertifikat Terverifikasi** | **Trophy Glow, Zoom & Slide-Aside:** Kamera *zoom-in* ke piala, **Trophy menyala keemasan (*golden aura glow*) lalu bergeser ke samping kiri**, sementara sisi kanan menampilkan daftar **Achievement & 7 Sertifikat** (dengan link buka PDF/Credly). |

---

## Fitur Musik Latar Syahdu (`Serene Room Ambient Music`)
- **Procedural Web Audio Synthesizer (`src/assets/desk/ambientAudio.js`)**:
  - Menghasilkan alunan musik instrumental syahdu (*warm ambient electric piano chords + gentle breeze/night pad*) langsung via browser `AudioContext` tanpa file MP3 berat dan bebas klaim hak cipta.
  - Dilengkapi tombol kontrol di sudut kamar: **`🎵 Musik Syahdu: ON / OFF`** + indikator gelombang suara (*waveform bars*) dan pengaturan volume.
  - Aman terhadap kebijakan *autoplay* browser (otomatis menyala lembut saat interaksi pertama pengguna atau saat tombol musik ditekan, serta dapat dimatikan kapan saja).

---

## Arsitektur Single-Page & Kompatibilitas Vercel + Test Suite
1. **Single-Page Room Experience:**
   - Tampilan visual utama di `/` adalah **1 halaman penuh kamar & meja kerja Bagas** tanpa deretan section panjang yang harus di-*scroll* ke bawah.
   - Saat salah satu dari 5 objek diklik, kamera melakukan transisi masuk ke **Interactive Stage View** objek tersebut (Monitor OS, Trophy Showcase, Open Book, Smartphone Screen, atau Portrait Dossier) dengan tombol **`← Kembali ke Kamar [ESC]`**.
2. **Tetap 100% Deployable di Vercel:**
   - Seluruh geometri 3D, animasi kamera CSS/SVG, dan synthesizer musik berjalan *client-side* di bundle Vite (`npm run build`).
3. **Menjaga Seluruh Invarian Test & Aksesibilitas:**
   - Mempertahankan `<h1>` tunggal (`"Hi, I'm Bagas."` dengan `span.animated-gradient-text`), aksesibilitas keyboard (`Tab`, `Enter`, `1`–`5`, `Escape`), serta struktur semantik untuk *screen reader* dan *property tests* yang sudah ada.
