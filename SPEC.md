# Spec: Interactive 3D/Isometric Workstation Landing Page ("Anatomy Desk" Edition)

## 1. Objective

Merombak konsep *landing page* (`/`) portofolio Data Science & Data Engineering **Bagas Adjie Pamungkas** (`d:\Bagas\Portofolio\Portofolio`) menjadi sebuah **Interactive 3D/Isometric Workstation ("Bagas's Desk")** menggunakan pendekatan dan *drawing kit* dari skill **`wheresryan22/anatomy`**, sambil tetap mempertahankan identitas warna hangat **"Lab Notebook"** (`paper`, `ink`, `signal`, `marker`).

Pengunjung yang membuka halaman utama tidak lagi hanya melihat teks statis, melainkan **sebuah meja kerja fisik 3D/isometrik yang hidup dan bisa diklik (*clickable & reactive*)**, di mana setiap objek di meja dan dinding adalah pintu navigasi menuju bagian portofolio:

### Core Interactive Objects (Kebutuhan Utama User)
1. **Meja Kerja dengan PC, Monitor, Keyboard & Mouse (`Workstation Centerpiece`)**
   - **Monitor (Klik → Projects `/project`):** Menampilkan *live dashboard/terminal* mini (metrik model ML, status pipeline, dan prompt interaktif). Saat di-*hover*, layar menyala dengan aksen `signal` (`#d93f12`) / `lit` dan menampilkan petunjuk `"Click to explore 11 ML & Data Engineering Projects"`. Saat diklik, menavigasi langsung ke halaman `/project`.
   - **Keyboard & Mouse (Reaktif):**
     - Keyboard mekanis isometrik dengan *keycaps* detail: saat pengunjung menekan tombol keyboard fisik (`1`–`5` atau huruf) maupun mengeklik keyboard di layar, *keycap* bergerak turun (`translateAlong` Z) dan teks/perintah tampil di layar monitor.
     - Mouse di atas *mousepad* lengkap dengan kabel (`kit/tube.mjs`): bergeser halus di bidang meja mengikuti pergerakan kursor pengunjung (*pointer tracking*).
2. **Foto Bingkai di Dinding (Klik → About Me)**
   - Di bidang dinding belakang meja (`wallX` / `wallY`), tergantung bingkai foto Bagas (`profile.jpg` yang diproyeksikan secara isometrik atau terintegrasi di dalam bingkai dinding lengkap dengan *masking tape* kuning & *nameplate* logam).
   - Saat di-*hover*, bingkai menampilkan efek *spotlight/elevation*. Saat diklik, membuka **Interactive About Drawer / Modal** (atau *smooth-scroll* ke `#about`) yang menampilkan cerita personal Bagas, fokus keahlian, dan fakta singkat.
3. **Telepon Meja (Klik → Contact Me: Email, LinkedIn, GitHub)**
   - Telepon meja di sudut meja lengkap dengan gagang (*handset*), kabel spiral (*coiled cord*), tombol *keypad*, dan lampu indikator LED (`signal` orange).
   - Saat di-*hover*, gagang telepon sedikit terangkat/bergetar halus (*ringing micro-interaction*) dan lampu LED menyala. Saat diklik, membuka **Quick Contact Popover / Panel** (atau menuju `#contact`) yang berisi tombol langsung ke **Email (`mailto:` + `Copy email`)**, **LinkedIn**, dan **GitHub**.

---

### Usulan Refinement Tambahan (Agar Portofolio Makin Lengkap & Berkelas)
Untuk memastikan seluruh aset portofolio kamu (Skills & 7 Sertifikat/Penghargaan) juga terwakili di meja kerja tanpa membuat meja berantakan, berikut **4 refinement** yang dimasukkan ke dalam desain:

4. **Refinement 1 — Lab Notebook Terbuka di Meja (Klik → Skills & Toolbelt `#skills`)**
   - Di sebelah kiri keyboard terdapat **Buku Catatan Lab ("Lab Notebook") terbuka + pena** dengan sketsa kurva model & arsitektur pipeline.
   - Saat diklik, mengarahkan pengunjung ke bagian **What I Do (`#skills`)** (Data Science, Data Engineering, EDA, Evaluation, Deployment).
5. **Refinement 2 — Plakat Trophy & Rak Dokumen di Sudut Meja/Dinding (Klik → Certifications & Awards `#credentials`)**
   - Menampilkan miniatur **Trophy Juara (`1st Runner Up`) + Map Sertifikat (`7 Credentials`)** untuk merepresentasikan 7 sertifikat & kemenangan kompetisi (Bootcamp TETI AI, Mobile Dev, AWS Academy, DataCamp).
   - Saat diklik, mengarahkan ke bagian **Certifications & Awards (`#credentials`)**.
6. **Refinement 3 — "Inspect / Explode View" Toggle & Live Status Readout Bar (`Anatomy` Signature)**
   - Mengadopsi ciri khas terbaik dari `wheresryan22/anatomy`: sebuah **Readout Bar (`font-mono`)** di bagian bawah bingkai meja yang berubah *real-time* saat kursor menyentuh objek (contoh: `TARGET: CRT MONITOR · 11 PROJECTS · CLICK TO OPEN (/project)`), ditambah tombol/shortcut **`[I] Inspect Hotspots`** untuk menyalakan *pin label* bernomor (`01 Projects`, `02 About Me`, `03 Contact`, `04 Skills`, `05 Credentials`) sehingga pengunjung awam langsung tahu bagian mana saja yang bisa diklik dalam < 2 detik.
7. **Refinement 4 — Arsitektur Hibrida (Interactive 3D Desk di Atas + Full Scannable Sections & Mobile Dock di Bawah)**
   - Di layar desktop maupun mobile (`390px`), pengunjung mendapatkan pengalaman visual 3D/isometrik di bagian atas (Hero Workstation), dilengkapi **Quick Action Dock** (baris tombol akses cepat di bawah meja untuk pengguna layar sentuh/keyboard) serta section lengkap (`#skills`, `#featured-works`, `#credentials`, `#about`, `#contact`) di bawahnya. Dengan ini, pengalaman visual tetap *mind-blowing*, namun aksesibilitas (WCAG AA), SEO, dan seluruh 112 *property-based tests* yang sudah ada tetap 100% terjaga.

---

## 2. Visual & Interactive Architecture (`Bagas's Workstation`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FIG 01 / BAGAS'S WORKSTATION                   [I] Hotspots   [Theme/Sound]│
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     [ DINDING / BACK WALL ]                           │  │
│  │        ┌──────────────┐                   ┌──────────────────┐        │  │
│  │        │  [02] FOTO   │                   │ [05] TROPHY &    │        │  │
│  │        │   BAGAS      │                   │  7 CERTIFICATES  │        │  │
│  │        │ (About Me)   │                   │  SHELF (Awards)  │        │  │
│  │        └──────────────┘                   └──────────────────┘        │  │
│  │  ───────────────────────────────────────────────────────────────────  │  │
│  │                      [ PERMUKAAN MEJA / DESK ]                        │  │
│  │                                                                       │  │
│  │   ┌─────────────┐     ┌───────────────────────┐     ┌──────────────┐  │  │
│  │   │ [04] LAB    │     │  [01] MONITOR & PC    │     │ [03] TELEPON │  │  │
│  │   │  NOTEBOOK   │     │   (Klik -> /project)  │     │    MEJA      │  │  │
│  │   │  (Skills)   │     └───────────┬───────────┘     │  (Contact:   │  │  │
│  │   └─────────────┘     ┌───────────┴───────────┐     │  Email/LI/GH)│  │  │
│  │                       │   KEYBOARD   [MOUSE]  │     └──────────────┘  │  │
│  │                       └───────────────────────┘                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  HINT: Click Monitor · Photo · Phone · or press [1–5]   READOUT: READY      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pemetaan Hotspot Interaktif

| No | Objek di Scene 3D/Isometrik | Aksi Hover / Pointer | Aksi Klik / Enter | Shortcut Keyboard |
|---|---|---|---|---|
| **01** | **Monitor & PC Unit** | Layar menyala aksen `signal`/`lit`, grafik bergerak, *readout* menampilkan info 11 project | Navigasi ke `/project` (atau buka preview + CTA ke `/project`) | `1` |
| **02** | **Foto Bingkai di Dinding** | Bingkai sedikit terangkat + *halo* hangat, *readout* menampilkan `"ABOUT BAGAS"` | Buka panel/modal **About Me** atau *scroll* ke `#about` | `2` |
| **03** | **Telepon Meja + Kabel Spiral** | Gagang telepon bergetar halus + LED menyala, *readout* menampilkan `"CONTACT ME"` | Buka **Quick Contact Popover** (Email, Copy Email, LinkedIn, GitHub) / *scroll* ke `#contact` | `3` |
| **04** | **Lab Notebook & Pena** | Halaman buku tersorot warna `marker` (`#ffd84d`), *readout* menampilkan `"5 CORE SKILLS"` | *Smooth-scroll* ke `#skills` (`What I Do`) | `4` |
| **05** | **Trophy & Rak Sertifikat** | Kilau pada piala & map sertifikat, *readout* menampilkan `"7 CERTIFICATES & AWARDS"` | *Smooth-scroll* ke `#credentials` (`Certifications & Awards`) | `5` |
| **—** | **Keyboard & Mouse** | Mouse bergeser mengikuti kursor; keycaps turun saat diketik | Mengetik karakter ke layar terminal monitor | `A–Z` |

---

## 3. Mandatory Skills Enforcement

Dalam mengimplementasikan spesifikasi ini, agent **WAJIB** membaca dan menerapkan:

1. **`anatomy` (`wheresryan22/anatomy`)** — Akan dipasang ke `C:\Users\bagas\.gemini\config\skills\anatomy` setelah spec & plan ini disetujui:
   - Menggunakan *drawing kit* (`kit/iso-kit.mjs`, `kit/lathe.mjs`, `kit/tube.mjs`) untuk membangun geometri benda padat (*solids, not wireframes*), *four-tone shading* (`lo`, `mid`, `hi`, `lit`), *painter's depth order* (`depthOf` / `A.settle`), *recessed screen* untuk layar monitor & bingkai foto, serta *coiled cord* untuk kabel telepon & mouse.
   - Wajib memiliki minimal 60–100 *solid parts* yang presisi (meja dengan kaki & sekrup sudut, casing PC dengan *vent slots*, monitor dengan bezel cekung, keyboard dengan baris *keycaps*, mouse + mousepad, telepon dengan gagang + *keypad* + kabel spiral, bingkai foto dinding dengan *tape*, buku catatan, dan piala).
   - Mematuhi aturan `anatomy`: setiap garis berakhir pada *stroke/dot/outline*, proporsi konsisten di desktop (`1440px`) dan mobile (`390px`), serta berhenti tenang (*still pose*) saat `prefers-reduced-motion: reduce` aktif.
2. **`ui-ux-pro-max` (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`)**
   - Aksesibilitas WCAG AA, indikator fokus jelas (`focus-ring`), target sentuh minimal `44×44px` pada kontrol/dock hotspot, dan animasi yang hanya memakai properti *compositor-safe* (`transform`, `opacity`).
3. **`frontend-ui-engineering` & `ui-styling`**
   - Menyelaraskan palet 4-nada `anatomy` (`--iso-*`) dengan palet **Lab Notebook** (`#f3efe6` paper, `#e9e3d5` paper-2, `#fbf9f4` card, `#17150f` ink, `#d93f12` signal orange, `#ffd84d` marker yellow) sehingga ilustrasi meja 3D menyatu 100% dengan halaman.
4. **`web-design-guidelines` & `vercel-react-best-practices`**
   - Memisahkan perhitungan geometri statis (`deskGeometry.js`) dari *client interactivity* (`DeskWorkstation.jsx`) agar *render* awal instan dan bebas *re-render* per frame (menggunakan DOM refs untuk animasi mouse/keycap/readout).

---

## 4. Tech Stack & Commands

- **Framework:** React 19 (`^19.0.0`), React Router DOM 7 (`^7.8.2`)
- **Build Tool:** Vite 6 (`^6.2.0`)
- **Styling:** Tailwind CSS 4 (`^4.0.15` via `@tailwindcss/vite`) + Scoped Isometric CSS (`iso-desk.css`)
- **3D/Isometric Engine:** Vendored `wheresryan22/anatomy` kit (`src/assets/iso/iso-kit.js`, `lathe.js`, `tube.js`) — *zero external npm runtime dependencies*
- **Testing:** Vitest 4 (`^4.1.11`), `@testing-library/react`, `@testing-library/user-event`, `fast-check`, `jsdom`

### Executable Commands
```bash
# Jalankan seluruh test suite (unit + property-based tests)
npm test

# Jalankan test spesifik
npx vitest run src/assets/DeskWorkstation.unit.test.jsx

# Jalankan linter
npm run lint

# Build bundle produksi
npm run build

# Jalankan dev server lokal
npm run dev
```

---

## 5. Project Structure

```text
.
├── index.html                           # App entry HTML, favicon, meta description & OG tags
├── public/
│   ├── favicon.svg                      # Lab-notebook "b" monogram SVG icon
│   └── certificates/                    # Static PDF certificates served at /certificates/*.pdf
├── src/
│   ├── main.jsx                         # React root bootstrap
│   ├── App.jsx                          # Router, ScrollToTop, Header, Routes, Footer
│   ├── index.css                        # Tailwind v4 @theme tokens, motion keyframes, .reveal, .focus-ring
│   ├── assets/
│   │   ├── iso/                         # Vendored & adapted core modules from wheresryan22/anatomy
│   │   │   ├── iso-kit.js               # Isometric projection, extrude, slabOf, cylinder, coil, etc.
│   │   │   ├── lathe.js                 # Round/turned parts (trophy, phone handset, knobs)
│   │   │   └── tube.js                  # 3D cables & cords (mouse wire, phone cord, monitor cable)
│   │   ├── desk/                        # Interactive 3D/Isometric Desk Workstation modules
│   │   │   ├── deskModel.js             # Pure state & readout model (hotspots, terminal text, shortcuts)
│   │   │   ├── deskGeometry.js          # Precomputed isometric SVG paths (desk, PC, monitor, phone, wall photo, notebook, trophy)
│   │   │   ├── DeskWorkstation.jsx      # Interactive React component (hover/click hotspots, pointer tracking, keyboard typing, quick modal/popover)
│   │   │   └── desk.css                 # Scoped Lab-Notebook 4-tone isometric shading & hotspot highlight styles
│   │   ├── Navbar.jsx                   # Fixed top navigation with sliding active capsule
│   │   ├── core.jsx                     # Home page integrating <DeskWorkstation /> + Skills, Featured Works, Credentials, About, Contact
│   │   ├── project.jsx                  # Projects page (Header, Category Filter Pills, ProjectGrid, ProjectCard, projectsData)
│   │   ├── projectCovers.js             # Data-URI SVG covers for project cards
│   │   ├── icons.jsx                    # Line-art SVG icon dictionary
│   │   ├── useScrollReveal.js           # IntersectionObserver one-shot reveal hook
│   │   ├── usePointerTilt.js            # Fine-pointer 3D card tilt hook
│   │   ├── url.js                       # HTTP(S) URL validator
│   │   └── *.test.{js,jsx}              # Unit & property-based test suites
│   └── test/
│       ├── design-tokens.test.js
│       ├── motion-primitives.test.js
│       ├── smoke.test.jsx
│       └── structure.test.js
├── SPEC.md                              # Dokumen spesifikasi ini
└── tasks/
    ├── plan.md                          # Rencana implementasi teknis
    └── todo.md                          # Daftar task terurut beserta checkpoint verifikasi
```

---

## 6. Code Style & Existing Test Invariants

### Code Style Example (Interactive Hotspot & Geometry Separation)
```jsx
// Semua hotspot di dalam SVG meja memiliki role/link/button yang aksesibel,
// aria-label deskriptif, focus-ring, dan keyboard handler:
<g
  role="link"
  tabIndex={0}
  data-hotspot="monitor"
  aria-label="Monitor: View my 11 Data Science and Data Engineering projects"
  onClick={() => navigate("/project")}
  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/project")}
  onPointerEnter={() => setActiveHotspot("monitor")}
  className="desk-hotspot cursor-pointer focus-ring"
>
  {/* Precomputed isometric solid & recessed screen paths */}
</g>
```

### Non-Negotiable Test Invariants (Wajib Tetap Lulus 100%)
1. **`Hero.glowup.unit.test.jsx` & `heading-structure.glowup.property.test.jsx`**:
   - Halaman `Core` (`/`) wajib merender **tepat satu `<h1>`** yang teks lengkapnya `"Hi, I'm Bagas."` dan di dalamnya memuat `<span class="animated-gradient-text">Bagas</span>`, serta urutan heading tidak boleh melompat (`h1` → `h2` → `h3`).
2. **`core.unit.test.jsx`**:
   - Tetap memiliki teks peran `"Data Scientist & Data Engineer"`, link `/project` (`View My Work` + hotspot Monitor), link `#contact` (`Get in Touch` + hotspot Telepon), serta link `mailto:` dan tombol `Copy email`.
3. **`accessible-names.glowup.property.test.jsx` & `external-links.glowup.property.test.jsx`**:
   - Semua elemen `<a href>` dan `<button>` (termasuk kontrol hotspot meja, modal About, dan popover Contact) wajib memiliki *accessible name* yang tidak kosong, dan semua link eksternal (`target="_blank"`) wajib memiliki `rel="noopener noreferrer"`.
4. **`motion-primitives.test.js` & `design-tokens.test.js`**:
   - Aturan `.reveal`, `.reveal-visible`, `.card-tilt`, `.animated-gradient-text`, dan `.page-enter` di `src/index.css` tidak boleh dirusak. Styling spesifik meja isometrik ditempatkan di `src/assets/desk/desk.css` atau selector terpisah.

---

## 7. Testing Strategy

- **Unit Tests Baru (`src/assets/DeskWorkstation.unit.test.jsx`):**
  - Memastikan seluruh hotspot utama ter-render dengan *accessible name* yang jelas:
    1. **Monitor Hotspot** → klik menavigasi ke `/project`.
    2. **Wall Photo Hotspot (About Me)** → klik menampilkan panel/informasi About Me (atau mengarah ke `#about`) yang memuat foto & narasi Bagas.
    3. **Desk Phone Hotspot (Contact Me)** → klik menampilkan panel Contact cepat (Email `bagasadjie2006@gmail.com`, tombol Copy Email, LinkedIn, GitHub) atau mengarah ke `#contact`.
    4. **Lab Notebook & Trophy Hotspots** → mengarah ke `#skills` dan `#credentials`.
  - Memastikan penekanan tombol keyboard fisik/virtual memperbarui teks terminal di layar monitor dan menggerakkan *readout* status.
  - Memastikan mode `[I] Inspect Hotspots` menampilkan/menyembunyikan *pin badge* bantuan.
- **Visual & Geometry Verification (via `anatomy` scripts / browser):**
  - Memastikan urutan *painter's depth* meja, monitor, keyboard, mouse, kabel, telepon, dan bingkai dinding rapi tanpa garis yang melayang (*floating line ends*) baik di viewport desktop (`1440px`) maupun mobile (`390px`).
- **Regression Suite:**
  - Seluruh 35 file test yang sudah ada (`npm test`) harus tetap lulus 100%.

---

## 8. Boundaries

- **Always do:**
  - Gunakan *drawing kit* `anatomy` (`iso-kit`, `lathe`, `tube`) dengan *four-tone paper/ink shading* yang disesuaikan ke palet **Lab Notebook**.
  - Pastikan semua objek yang bisa diklik memiliki *hover state* yang jelas (perubahan *tone* ke `lit`/`signal`, perubahan *cursor*, dan pembaruan teks *readout*), serta bisa diakses via keyboard (`Tab`, `Enter`, `Space`, atau angka `1`–`5`).
  - Jalankan `npm test`, `npm run lint`, dan `npm run build` di setiap tahapan.
- **Ask first:**
  - Menambahkan library npm eksternal (seperti Three.js) — **tidak diperlukan** karena `anatomy` kit berbasis SVG/Canvas isometrik presisi yang jauh lebih ringan, tajam, dan terintegrasi langsung dengan React 19.
  - Menghapus section informasi di bawah Hero jika masih diperlukan oleh penguji/recruiter atau test suite.
- **Never do:**
  - Membuat ilustrasi kotak-kotak datar (*flat bland boxes*) yang melanggar prinsip `anatomy` (*"Every creation is highly detailed: at least 40–80 purposeful solid parts"*).
  - Merusak invariant test yang sudah ada di `src/assets/*.test.jsx` dan `src/test/*.test.js`.

---

## 9. Success Criteria

- [ ] **SC-1 (Skill Installation & Kit Vendoring):** Skill `wheresryan22/anatomy` terpasang di `C:\Users\bagas\.gemini\config\skills\anatomy` dan modul intinya (`iso-kit`, `lathe`, `tube`) terintegrasi bersih di `src/assets/iso/`.
- [ ] **SC-2 (Detailed Isometric Workstation):** Landing page (`/`) menampilkan ilustrasi meja kerja 3D/isometrik bergaya *Lab Notebook × Anatomy* dengan 60+ *solid parts* (meja, PC, monitor, keyboard dengan *keycaps*, mouse + mousepad + kabel, telepon meja + kabel spiral + LED, bingkai foto dinding dengan foto asli Bagas, buku catatan lab, dan piala/sertifikat).
- [ ] **SC-3 (Clickable Monitor → Projects):** Mengeklik monitor (atau menekan tombol `1`) membawa pengunjung ke halaman `/project`; saat di-*hover*, layar monitor menyala dan menampilkan preview status project.
- [ ] **SC-4 (Clickable Wall Photo → About Me):** Mengeklik bingkai foto Bagas di dinding (atau menekan tombol `2`) membuka **About Me Drawer/Modal** (serta terhubung ke `#about`) yang menampilkan foto, bio naratif, dan fakta singkat Bagas.
- [ ] **SC-5 (Clickable Desk Phone → Contact Me):** Mengeklik telepon di meja (atau menekan tombol `3`) membuka **Quick Contact Popover/Modal** (serta terhubung ke `#contact`) dengan akses 1-klik ke Email (`mailto:` + `Copy email`), LinkedIn, dan GitHub.
- [ ] **SC-6 (Reactive Keyboard, Mouse & Secondary Hotspots):** Mengetik di keyboard mengetikkan teks ke layar monitor & menekan *keycap* secara visual; menggerakkan kursor di atas meja menggerakkan mouse 3D secara halus; klik Lab Notebook & Trophy mengarah ke `#skills` dan `#credentials`.
- [ ] **SC-7 (Zero Test/Build Regressions):** `npm test` (termasuk unit test baru untuk `DeskWorkstation`), `npm run lint`, dan `npm run build` semuanya lulus dengan exit code `0`.

---

## 10. Resolved Design Decisions (Approved by User)

1. **Interaksi Klik Hotspot (Interactive Overlay Card + Scroll):**
   - Mengeklik **Monitor (`01`)** langsung menavigasi pengunjung ke halaman `/project`.
   - Mengeklik **Foto Dinding (`02 About Me`)**, **Telepon Meja (`03 Contact Me`)**, **Buku Catatan Lab (`04 Skills`)**, atau **Trophy & Sertifikat (`05 Credentials`)** akan memunculkan **Interactive Overlay Card / Drawer** bergaya *Lab Notebook* tepat di atas meja (sehingga pengunjung bisa langsung membaca isi atau mengeklik link Email/LinkedIn/GitHub/Sertifikat tanpa harus meninggalkan meja), dilengkapi tombol *"Jump to Full Section ↓"* untuk *smooth-scroll* ke section terkait di bawah halaman.
2. **Objek Fungsional di Meja & Dinding:**
   - **Disertakan penuh:**
     1. **PC, Monitor, Keyboard & Mouse** di tengah meja (Monitor sebagai hotspot utama menuju `/project`; Keyboard & Mouse tampil detail lengkap sebagai kesatuan workstation).
     2. **Foto Bagas di Dinding** (Hotspot *About Me*).
     3. **Telepon Meja** (Hotspot *Contact Me*: Email, Copy Email, LinkedIn, GitHub).
     4. **Buku Catatan Lab + Pena di Meja** (Hotspot *Skills / What I Do*).
     5. **Trophy & Rak Sertifikat** (Hotspot *7 Certifications & Awards*).
   - **Disederhanakan:** Animasi ketikan bebas non-fungsional pada keyboard dihapus agar fokus 100% pada fungsi navigasi portofolio yang jelas dan responsif.

