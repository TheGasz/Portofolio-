# Task List: Single-Page Interactive 3D Bedroom & Real Study Desk ("Bagas's Room" Edition)

> **Referensi Utama:** Foto meja kerja asli Bagas di [`src/assets/WhatsApp Image 2026-11-07 at 20.53.34.jpeg`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/WhatsApp%20Image%202026-11-07%20at%2020.53.34.jpeg) serta spesifikasi di [`SPEC.md`](file:///d:/Bagas/Portofolio/Portofolio/SPEC.md) dan [`tasks/plan.md`](file:///d:/Bagas/Portofolio/Portofolio/tasks/plan.md).

---

## Phase 1: 3D Bedroom, Window Background & Real Study Desk Geometry

### Task 1: Update Hotspot Model (`deskModel.js`) & Build Serene Ambient Music Engine (`ambientAudio.js`)
**Description:**
1. Memperbarui [`src/assets/desk/deskModel.js`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/desk/deskModel.js) agar kelima hotspot mencerminkan objek asli pada meja/kamar Bagas beserta koordinat 3D dan target *camera zoom*-nya:
   - `[01]` **Monitor & Gaming Laptop** (Tengah meja → *Dive into Monitor* menampilkan semua `ProjectCard`).
   - `[02]` **Framed Wall Portrait & Lanyard** (Dinding kamar → *Portrait Zoom & Slide-Aside* untuk *About Me*).
   - `[03]` **Smartphone on Stand** (Kiri meja → *Phone Zoom-In* berisi Email, Copy Email, LinkedIn, GitHub).
   - `[04]` **Books in Left Cabinet Shelf** (Rak terbuka lemari kiri → *Book Pull-Out & Open* menampilkan *What I Do*).
   - `[05]` **Trophy on Top-Left Cabinet** (Puncak lemari kiri atas → *Trophy Glow, Zoom & Slide-Aside* menampilkan *Achievement & Sertifikat*).
2. Membuat [`src/assets/desk/ambientAudio.js`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/desk/ambientAudio.js) menggunakan Web Audio API untuk menghasilkan **Musik Syahdu** (*warm ambient electric piano chords + gentle night breeze pad*) dengan fungsi `start()`, `stop()`, `toggle()`, `setVolume()`, dan fallback aman untuk environment test (Vitest/jsdom).

**Acceptance criteria:**
- [x] `deskModel.js` mengekspor kelima hotspot baru lengkap dengan properti `cameraZoom` (`scale`, `originX`, `originY`) dan `readout`.
- [x] `ambientAudio.js` dapat dinyalakan/dimatikan tanpa file audio eksternal dan tidak melempar error di lingkungan test tanpa `AudioContext`.

**Verification:**
- [x] `npm run lint`

---

### Task 2: Rebuild 3D Isometric Geometry Matching Bagas's Real Study Desk & Cool-Toned Window Room (`deskGeometry.js`)
**Description:** Merombak [`src/assets/desk/deskGeometry.js`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/desk/deskGeometry.js) agar mereplikasi secara detail foto [`src/assets/WhatsApp Image 2026-11-07 at 20.53.34.jpeg`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/WhatsApp%20Image%202026-11-07%20at%2020.53.34.jpeg) beserta latar belakang kamar sejuk:
1. **Kamar Wallpaper Sejuk & Jendela Pemandangan (`buildRoomAndWindow`)**:
   - Dinding kamar dengan *tone* wallpaper sejuk (*cool slate/misty teal*), lantai keramik, pintu kayu di sisi kanan, serta **Jendela Kamar** dengan pemandangan langit senja/malam yang sejuk, siluet pegunungan/pepohonan, bintang, dan cahaya jendela lembut.
2. **Lemari & Rak Buku Kayu Jati di Sebelah Kiri (`buildLeftCabinet`)**:
   - Lemari kayu tinggi di kiri meja dengan **3 Rak Terbuka** di kiri (berisi **Buku-Buku yang bisa diklik `[04]`**, kotak hijau/hitam, kotak ungu, tumpukan kertas), pintu kabinet bawah, serta pintu lemari kanan dengan **Hanger Biru + Lanyard ID Card**.
   - **Trophy & Deretan Sertifikat (`[05]`)** diletakkan tepat di **sebelah kiri atas meja (di atas lemari kiri)**.
3. **Meja Belajar Kayu dengan Hutch Atas, Laci Kanan & Setup Komputer (`buildStudyDeskAndGear`)**:
   - Meja kayu jati dengan papan sandaran atas (*hutch*), stiker tengah, *power strip* putih di tiang kiri, dinding samping kanan berlubang, dan **2 Laci Kayu** di kanan bawah.
   - **Monitor Widescreen Hitam (`[01]`)** di tengah-kiri meja + **Keyboard Mekanis** + **Mouse & Mousepad Hitam**.
   - **Gaming Laptop Hitam dengan Keyboard Menyala Merah (*Red Backlit Keyboard*)** dan layar kode di sisi kanan meja.
   - **HP di Atas Stand (`[03]`)** dan kipas mini putih di sisi kiri meja.
   - **Bingkai Foto Dinding (`[02]`)** dengan foto [`src/assets/profile.jpg`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/profile.jpg).

**Acceptance criteria:**
- [x] Seluruh elemen khas meja asli Bagas (lemari kiri ber-rak buku, hanger lanyard, meja ber-*hutch*, laci kanan, monitor + laptop berlampu merah, HP di stand, trophy di kiri atas, dan jendela pemandangan sejuk) ter-render proporsional dalam urutan *painter's depth* yang benar.
- [x] Tidak ada nilai `NaN` pada path SVG.

**Verification:**
- [x] `npm run lint` dan `npm run build`

---

## Phase 2: Cinematic Object Click Animations & Serene Audio UI

### Task 3: Implement 5 Cinematic Stage Animations & Cool Room Palette (`desk.css` & `DeskWorkstation.jsx`)
**Description:** Mengganti *pop-up* bawah lama di [`src/assets/desk/DeskWorkstation.jsx`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/desk/DeskWorkstation.jsx) dan [`src/assets/desk/desk.css`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/desk/desk.css) dengan **5 Koreografi Animasi Kamera & Objek** serta tombol kontrol **Musik Syahdu**:
1. **Klik `[01]` Monitor → *Monitor Power-On & Dive-In* (`Projects`)**:
   - Layar monitor menyala, kamera *zoom-in* masuk ke dalam layar monitor, lalu menampilkan antarmuka penuh **Monitor Screen (`BagasOS // Projects`)** berisi filter kategori dan **seluruh 11 `ProjectCard`**.
2. **Klik `[05]` Trophy (Kiri Atas) → *Trophy Glow, Zoom & Slide-Aside* (`Achievements & Certifications`)**:
   - Trophy melakukan *zoom-in*, menyala keemasan (*glowing golden aura*), lalu bergeser ke samping kiri sementara daftar **Achievement & 7 Sertifikat** (dengan tombol buka PDF/Credly) muncul di samping kanannya.
3. **Klik `[04]` Buku (Rak Kiri) → *Book Pull-Out & Page Unfold* (`What I Do`)**:
   - Buku terambil dari rak lemari kiri, melayang ke tengah, lalu **membuka 2 halamannya (*open book spread*)** menampilkan 5 keahlian **What I Do** di halaman kiri dan **16 Toolbelt** di halaman kanan.
4. **Klik `[03]` HP di Stand → *Smartphone Zoom-In* (`Contact Me`)**:
   - HP melakukan *zoom-in* ke depan menjadi layar Smartphone interaktif berisi tombol **Email (`mailto:`)**, **Copy Email** (dengan feedback `"Copied!"`), **GitHub**, dan **LinkedIn**.
5. **Klik `[02]` Foto Dinding → *Portrait Zoom & Slide-Aside* (`About Me`)**:
   - Bingkai foto Bagas *zoom-in* dan bergeser ke kiri dengan sorotan hangat, menampilkan cerita **About Me** dan fakta utama di sebelahnya.
6. **Kontrol Musik Syahdu**:
   - Menambahkan tombol `🎵 Musik Syahdu` (Play/Pause + equalizer animasi) di bar kamar.

**Acceptance criteria:**
- [x] Kelima objek memiliki animasi masuk/keluar yang unik sesuai skenario di atas (bukan sekadar *pop-up* biasa di bawah).
- [x] Klik Monitor menampilkan seluruh `ProjectCard` langsung di dalam tampilan layar monitor (tanpa harus pindah halaman, namun tetap menyediakan link `/project`).
- [x] Tombol `← Kembali ke Kamar [ESC]` mengembalikan kamera secara mulus ke tampilan kamar utuh.

**Verification:**
- [x] `npm run lint` dan `npm run build`

---

## Phase 3: Single-Page Room Consolidation, Testing & Visual Verification

### Task 4: Consolidate `core.jsx` into a Single-Page Room Landing Page & Update Unit Tests
**Description:**
1. Memperbarui [`src/assets/core.jsx`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/core.jsx) sehingga tampilan visual utama website adalah **Satu Landing Page Kamar & Meja Belajar** yang imersif (tanpa *scroll* panjang ke section-section di bawahnya), sambil tetap menjaga kompatibilitas semantik penuh dengan *screen reader* dan seluruh 36 file test yang ada.
2. Memperbarui [`src/assets/DeskWorkstation.unit.test.jsx`](file:///d:/Bagas/Portofolio/Portofolio/src/assets/DeskWorkstation.unit.test.jsx) untuk menguji:
   - Klik Monitor menyalakan layar dan menampilkan daftar `ProjectCard` di dalam layar monitor.
   - Klik Trophy di kiri atas menampilkan piala yang menyala di samping daftar achievement & sertifikat.
   - Klik Buku di rak kiri membuka buku dua halaman berisi *What I Do* & *Toolbelt*.
   - Klik HP di stand melakukan zoom-in HP berisi kontak Email, Copy Email, GitHub, dan LinkedIn.
   - Klik Foto Dinding menampilkan *About Me*.
   - Tombol *Musik Syahdu* dapat di-*toggle* dengan aman.

**Acceptance criteria:**
- [x] Website tampil sebagai satu halaman penuh kamar & meja belajar Bagas.
- [x] Seluruh 36 file test (`npm test -- --run`) lulus 100%.

**Verification:**
- [x] `npm test -- --run`

---

### Task 5: Visual Capture Verification (`1440px`, `390px`, & Active Stage Animations)
**Description:** Menjalankan `capture.mjs` untuk menangkap *screenshot* kamar 3D baru pada resolusi desktop (`1440px`), mobile (`390px`), serta saat animasi Monitor/Trophy/Buku/HP aktif, lalu menginspeksi hasilnya secara visual.

**Acceptance criteria:**
- [x] Tampilan meja kayu, lemari kiri, laptop berlampu merah, monitor, HP di stand, trophy di kiri atas, dan jendela pemandangan sejuk terlihat jelas, rapi, dan proporsional.
- [x] `npm test`, `npm run lint`, dan `npm run build` lulus 100%.

**Verification:**
- [x] `npm test -- --run`
- [x] `npm run lint`
- [x] `npm run build`
