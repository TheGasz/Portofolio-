# Task List: Interactive 3D/Isometric Workstation Landing Page ("Anatomy Desk" Edition)

> **Aturan Eksekusi Wajib (Mandatory Skill Gate):**
> Saat mengeksekusi setiap task di bawah ini, agent **WAJIB** menggunakan dan menerapkan pedoman dari:
> - **`anatomy`** (`C:\Users\bagas\.gemini\config\skills\anatomy\SKILL.md`, `references/craft.md`, `references/kit.md`, `references/motion.md`, `references/react.md`)
> - **`ui-ux-pro-max`** (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`)
> - **`frontend-ui-engineering`** (`C:\Users\bagas\.gemini\config\skills\frontend-ui-engineering\SKILL.md`)
> - **`ui-styling`** (`C:\Users\bagas\.gemini\config\skills\ui-styling\SKILL.md`)
> - **`web-design-guidelines`** (`C:\Users\bagas\.gemini\config\skills\web-design-guidelines\SKILL.md`)
> - **`vercel-react-best-practices`** (`C:\Users\bagas\.gemini\config\skills\react-best-practices\SKILL.md`)

---

## Phase 1: Skill Setup, Isometric Kit Vendoring & Workstation Geometry

## Task 1: Install `wheresryan22/anatomy` Skill & Vendor Core Isometric Kit (`src/assets/iso/`)
**Description:** Memasang skill `wheresryan22/anatomy` ke direktori global skills Antigravity (`C:\Users\bagas\.gemini\config\skills\anatomy`) dari hasil audit, lalu menyalin modul geometri intinya (`kit/iso-kit.mjs`, `kit/lathe.mjs`, `kit/tube.mjs`) ke dalam `src/assets/iso/` agar dapat di-import secara langsung oleh komponen React & Vite tanpa tambahan dependency npm.

**Acceptance criteria:**
- [ ] Skill `anatomy` terpasang lengkap di `C:\Users\bagas\.gemini\config\skills\anatomy\SKILL.md`.
- [ ] File `src/assets/iso/iso-kit.js`, `src/assets/iso/lathe.js`, dan `src/assets/iso/tube.js` tersedia dan bebas warning ESLint.
- [ ] Fungsi proyeksi dasar (`fitProjection`, `slabOf`, `cylinder`, `extrude`, `coil`, `tubePieces`) dapat di-import dan dijalankan di Vitest.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`

**Dependencies:** None (Menunggu persetujuan Spec & Plan dari user)
**Files likely touched:**
- `C:\Users\bagas\.gemini\config\skills\anatomy\*`
- `src/assets/iso/iso-kit.js`
- `src/assets/iso/lathe.js`
- `src/assets/iso/tube.js`
- `eslint.config.js` (jika perlu penyesuaian aturan untuk file vendored `src/assets/iso/`)
**Estimated scope:** Small (3–4 files)

---

## Task 2: Build Workstation World Model (`deskModel.js`) & 60+ Part Isometric Geometry (`deskGeometry.js`)
**Description:** Membuat model data murni (`src/assets/desk/deskModel.js`) untuk 5 hotspot interaktif (`monitor`, `photo`, `phone`, `notebook`, `trophy`), *readout* status, serta terminal prompt; dilanjutkan dengan menyusun geometri isometrik detail tinggi (`src/assets/desk/deskGeometry.js`) menggunakan `iso-kit`, `lathe`, dan `tube` yang mencakup:
1. **Meja Kerja & Dinding Belakang** (permukaan meja ber-bevel, kaki meja, sekrup sudut, *nameplate*, bidang dinding).
2. **PC Desktop & Monitor CRT/Widescreen (`[01] Projects Hotspot`)** lengkap dengan layar cekung (*recessed screen*), grafik metrik ML, dan lampu indikator.
3. **Keyboard Mekanis (baris keycaps 3D) & Mouse + Mousepad + Kabel** yang siap digerakkan secara dinamis.
4. **Bingkai Foto Dinding (`[02] About Me Hotspot`)** yang membingkai foto `profile.jpg` pada perspektif dinding lengkap dengan *masking tape* kuning.
5. **Telepon Meja (`[03] Contact Me Hotspot`)** dengan gagang telepon, *keypad* 3×4, kabel spiral (*coiled cord*), dan lampu LED.
6. **Lab Notebook + Pena (`[04] Skills Hotspot`)** dan **Trophy + Rak Sertifikat (`[05] Credentials Hotspot`)**.

**Acceptance criteria:**
- [ ] `deskModel.js` mengekspor daftar hotspot, metadata aksi/tujuan, teks *readout* untuk setiap state, dan helper terminal.
- [ ] `deskGeometry.js` menghasilkan minimal 60 *solid parts* dalam urutan *painter's depth* yang benar (belakang ke depan, bawah ke atas) tanpa *z-fighting*.
- [ ] Menyediakan fungsi pembangun dinamis untuk bagian yang bergerak: posisi mouse + kabelnya (`mouseArt(mx, my)`), *keycaps* keyboard (`keycapArt(pressedKey)`), dan gagang telepon (`phoneHandsetArt(ringing)`).

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual/Script check: Pastikan `buildDeskScene()` mengembalikan struktur path SVG lengkap tanpa nilai `NaN` di atribut `d`.

**Dependencies:** Task 1
**Files likely touched:**
- `src/assets/desk/deskModel.js`
- `src/assets/desk/deskGeometry.js`
**Estimated scope:** Medium (2 files)

---

## Checkpoint 1: Engine & Geometry Foundation
- [ ] `npm test` dan `npm run build` lulus tanpa error
- [ ] Geometri menghasilkan path SVG valid tanpa koordinat `NaN`

---

## Phase 2: Interactive Workstation Component, Styles & Hotspot Overlays

## Task 3: Scoped Lab-Notebook Isometric Styles (`desk.css`) & Core `<DeskWorkstation />` Component
**Description:** Membuat stylesheet `src/assets/desk/desk.css` yang memetakan 4-nada shading `anatomy` (`--iso-paper`, `--iso-top`, `--iso-shade-0..3`, `--iso-line`, `--iso-lit`) ke palet **Lab Notebook** (`#f3efe6`, `#fbf9f4`, `#e9e3d5`, `#17150f`, `#d93f12`, `#ffd84d`), serta membangun komponen `<DeskWorkstation />` (`src/assets/desk/DeskWorkstation.jsx`) lengkap dengan bingkai kartu `Fig 01`, *live readout bar*, tombol `[I] Inspect Hotspots`, dan **Quick Hotspot Dock** di bawah meja.

**Acceptance criteria:**
- [ ] Ilustrasi meja menggunakan warna hangat *Lab Notebook* dan menyorot objek dengan aksen `signal` (`#d93f12`) / `marker` (`#ffd84d`) saat hotspot di-*hover* atau difokuskan via keyboard (`Tab`).
- [ ] Mengeklik **Monitor (`[01]`)** menavigasi pengunjung langsung ke halaman `/project`.
- [ ] Tombol `[I] Inspect Hotspots` menyalakan/mematikan *pin badge* bernomor (`01` s/d `05`) di atas setiap objek interaktif.
- [ ] **Quick Hotspot Dock** di bawah meja menyediakan tombol akses cepat (`min-h-[44px] focus-ring`) untuk kelima objek sehingga sangat nyaman di layar mobile (`390px`).

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task 2
**Files likely touched:**
- `src/assets/desk/desk.css`
- `src/assets/desk/DeskWorkstation.jsx`
**Estimated scope:** Medium (2 files)

---

## Task 4: Interactive Hotspot Overlays (About Me, Contact Hub, Skills & Credentials) + Hover/Focus Polish
**Description:** Menambahkan **Interactive Overlay Cards / Drawers** bergaya *Lab Notebook* yang muncul tepat di atas meja saat objek selain Monitor diklik:
1. **About Me Overlay (Klik Foto Dinding `[02]`):** Menampilkan foto Polaroid & bio *About Me* Bagas, fakta singkat (`Focus`, `Toolkit`, `Credentials`), serta tombol *"Jump to About Section ↓"* (`#about`).
2. **Contact Hub Overlay (Klik Telepon Meja `[03]`):** Menampilkan panel kontak cepat berisi tombol **Email (`mailto:bagasadjie2006@gmail.com`)**, **Copy Email** (dengan feedback `"Copied!"`), **LinkedIn**, **GitHub**, serta tombol *"Jump to Contact Section ↓"* (`#contact`).
3. **Skills Overlay (Klik Buku Catatan Lab `[04]`):** Menampilkan ringkasan 5 keahlian utama (*Data Science & ML*, *Data Engineering*, *EDA*, *Evaluation*, *Deployment*) + *toolbelt* serta tombol menuju `#skills`.
4. **Credentials Overlay (Klik Trophy & Rak Sertifikat `[05]`):** Menampilkan daftar 7 sertifikat & penghargaan terverifikasi (dengan link langsung untuk membuka PDF/Credly) serta tombol menuju `#credentials`.

**Acceptance criteria:**
- [ ] Klik pada **Foto Dinding (`[02]`)** membuka kartu overlay *About Me* dan dapat ditutup via tombol `Close`, klik backdrop, atau tombol `Escape`.
- [ ] Klik pada **Telepon Meja (`[03]`)** membuka kartu overlay *Contact Me* dengan link Email, Copy Email, LinkedIn, dan GitHub yang valid dan aksesibel.
- [ ] Klik pada **Lab Notebook (`[04]`)** dan **Trophy (`[05]`)** membuka kartu overlay *Skills* / *Credentials* (beserta tombol loncat ke `#skills` dan `#credentials`).
- [ ] Semua animasi transisi menghormati `prefers-reduced-motion: reduce`.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task 3
**Files likely touched:**
- `src/assets/desk/DeskWorkstation.jsx`
- `src/assets/desk/desk.css`
**Estimated scope:** Small–Medium (2 files)

---

## Checkpoint 2: Interactive Workstation Ready
- [ ] Semua 5 hotspot, ketikan keyboard, gerakan mouse, dan overlay About/Contact berfungsi penuh
- [ ] `npm run lint` dan `npm run build` bersih

---

## Phase 3: Home Page Integration, Testing & Visual Audit

## Task 5: Integrate `<DeskWorkstation />` into `src/assets/core.jsx` & Add Unit Tests
**Description:** Mengintegrasikan `<DeskWorkstation />` sebagai centerpiece utama di bagian atas `src/assets/core.jsx` (menggantikan layout Hero 2-kolom lama namun tetap mempertahankan `<h1>` `"Hi, I'm Bagas."` dengan `span.animated-gradient-text` serta CTA utama agar kompatibel dengan seluruh test lama), menambahkan `id="skills"`, `id="featured-works"`, `id="credentials"`, dan `id="about"` pada section terkait, serta menulis unit test komprehensif di `src/assets/DeskWorkstation.unit.test.jsx`.

**Acceptance criteria:**
- [ ] `<DeskWorkstation />` tampil sebagai Hero utama di `/`.
- [ ] Unit test baru `src/assets/DeskWorkstation.unit.test.jsx` memverifikasi:
  - Render kelima hotspot (`Monitor`, `Wall Photo`, `Desk Phone`, `Lab Notebook`, `Trophy`).
  - Klik `Monitor` berpindah route ke `/project`.
  - Klik `Wall Photo` memunculkan informasi *About Me* Bagas.
  - Klik `Desk Phone` memunculkan opsi kontak (*Email*, *Copy email*, *LinkedIn*, *GitHub*).
  - Penekanan tombol keyboard memperbarui layar terminal monitor.
- [ ] Seluruh test yang sudah ada (`Hero.glowup.unit.test.jsx`, `core.unit.test.jsx`, `heading-structure.glowup.property.test.jsx`, `accessible-names.glowup.property.test.jsx`, dll.) tetap lulus 100%.

**Verification:**
- [ ] Tests pass: `npx vitest run src/assets/DeskWorkstation.unit.test.jsx src/assets/core.unit.test.jsx src/assets/Hero.glowup.unit.test.jsx src/assets/heading-structure.glowup.property.test.jsx src/assets/accessible-names.glowup.property.test.jsx`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task 4
**Files likely touched:**
- `src/assets/core.jsx`
- `src/assets/DeskWorkstation.unit.test.jsx`
**Estimated scope:** Medium (2 files)

---

## Task 6: Visual Verification (`capture.mjs`), Full Regression Suite, Lint & Production Build
**Description:** Menjalankan dev server dan menggunakan script `capture.mjs` dari skill `anatomy` untuk memeriksa hasil render meja kerja 3D di ukuran desktop (`1440px`) dan mobile (`390px`), memeriksa kualitas visual & kontras sesuai `ui-ux-pro-max`, lalu menjalankan `npm test`, `npm run lint`, dan `npm run build`.

**Acceptance criteria:**
- [ ] Tangkapan layar desktop (`1440px`) dan mobile (`390px`) terverifikasi rapi, proporsional, tanpa garis melayang atau *horizontal scroll overflow*.
- [ ] `npm test` lulus 100% di seluruh test suite.
- [ ] `npm run lint` keluar dengan kode `0`.
- [ ] `npm run build` keluar dengan kode `0`.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task 5
**Files likely touched:** Semua file pada Task 1–5 (jika ada polesan visual akhir).
**Estimated scope:** Small
