# Task List: Portfolio Holistic Refinement ("Lab Notebook" Edition)

> **Aturan Eksekusi Wajib (Mandatory Skill Gate):**
> Saat mengeksekusi setiap task di bawah ini, agent **WAJIB** menggunakan dan menerapkan pedoman dari:
> - **`ui-ux-pro-max`** (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`)
> - **`frontend-ui-engineering`** (`C:\Users\bagas\.gemini\config\skills\frontend-ui-engineering\SKILL.md`)
> - **`ui-styling`** (`C:\Users\bagas\.gemini\config\skills\ui-styling\SKILL.md`)
> - **`web-design-guidelines`** (`C:\Users\bagas\.gemini\config\skills\web-design-guidelines\SKILL.md`)
> - **`vercel-react-best-practices`** (`C:\Users\bagas\.gemini\config\skills\react-best-practices\SKILL.md`)
> - **Workspace UI/UX Skills** (`.kiro/skills/ux-design/SKILL.md` & `.kiro/skills/visual-design/SKILL.md`)

---

## Phase 1: Foundation, Branding & Motion Primitives

## Task 1: Brand Favicon (`"b"` Monogram), SEO Metadata & Static Certificate Asset
**Description:** Mengganti favicon default Vite (`/vite.svg`) dengan SVG monogram `"b"` bergaya *Lab Notebook* (`#17150f` ink circle, `#f3efe6` italic serif `"b"`, `#d93f12` signal dot), melengkapi `<meta name="description">` serta OpenGraph tags di `index.html`, dan menyalin file sertifikat ke-7 (`SERTIF JUARA MOBDEV.pdf`) ke `public/certificates/juara-2-mobdev.pdf`.

**Acceptance criteria:**
- [x] File `public/favicon.svg` tersedia dan terhubung di `index.html` menggantikan `/vite.svg`.
- [x] `index.html` memiliki `<meta name="description">` dan OpenGraph meta tags yang mendeskripsikan portofolio Data Scientist & Data Engineer Bagas Adjie Pamungkas.
- [x] File `public/certificates/juara-2-mobdev.pdf` tersalin dari `src/assets/Sertifikat/SERTIF JUARA MOBDEV.pdf`.

**Verification:**
- [x] Tests pass: `npx vitest run src/test/structure.test.js`
- [x] Build succeeds: `npm run build`
- [x] Manual check: Cek tag `<head>` di `index.html` dan keberadaan file di `public/`.

**Dependencies:** None
**Files likely touched:**
- `public/favicon.svg`
- `public/certificates/juara-2-mobdev.pdf`
- `index.html`
- `src/test/structure.test.js`
**Estimated scope:** Small (3–4 files)

---

## Task 2: CSS Motion Primitives (`.page-enter`, `.marker-sweep`) & `Reveal` Helper Component
**Description:** Menambahkan animasi transisi halaman `.page-enter` dan efek sapuan stabilo `.marker-sweep` di `src/index.css` (tanpa mengubah deklarasi `.reveal` / `.reveal-visible` yang dikunci oleh test), serta mengekspor komponen pembungkus `<Reveal>` di `src/assets/useScrollReveal.js` untuk memudahkan *staggered scroll-reveal* di seluruh halaman.

**Acceptance criteria:**
- [x] `.page-enter` dan `.marker-sweep` menggunakan properti *compositor-safe* (`transform`, `opacity`, `background-size`) dan memiliki fallback di `@media (prefers-reduced-motion: reduce)`.
- [x] `Reveal` diekspor dari `src/assets/useScrollReveal.js` dan mendukung prop `delayMs`, `threshold`, `as`, dan `className`.
- [x] Invariant `.reveal` dan `.reveal-visible` di `src/test/motion-primitives.test.js` tetap 100% hijau.

**Verification:**
- [x] Tests pass: `npx vitest run src/test/motion-primitives.test.js src/assets/useScrollReveal.unit.test.jsx`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 1
**Files likely touched:**
- `src/index.css`
- `src/assets/useScrollReveal.js`
- `src/assets/useScrollReveal.unit.test.jsx`
- `src/test/motion-primitives.test.js`
**Estimated scope:** Small (3–4 files)

---

## Checkpoint 1: Foundation & Motion Primitives
- [x] `npm test` lulus 100%
- [x] `npm run build` sukses tanpa error

---

## Phase 2: Navigation Ergonomics & Projects Page Discovery

## Task 3: Smooth Sliding Navbar Pill Indicator & Route Scroll/Transition in `App.jsx`
**Description:** Membuat indikator kapsul hitam (`bg-ink`) di `Navbar.jsx` bergeser secara smooth (`translate-x-0` ↔ `translate-x-full` dengan `cubic-bezier(0.22, 1, 0.36, 1)`) saat berpindah antara `Home` (`/`) dan `Projects` (`/project`), serta menambahkan reset posisi scroll otomatis ke `(0, 0)` dan animasi `.page-enter` saat berganti route di `App.jsx`.

**Acceptance criteria:**
- [x] Indikator kapsul `data-testid="nav-sliding-pill"` bergeser halus antara `Home` dan `Projects` (`duration-300`), dan otomatis tersembunyi (`opacity-0`) pada unknown route.
- [x] Link aktif tetap memiliki `aria-current="page"` serta class `text-blue-600 font-bold` sehingga `Navbar.property.test.jsx` lulus 100%.
- [x] Berpindah route dari `/` ke `/project` (atau sebaliknya) mereset scroll window ke atas (`window.scrollTo(0, 0)` dengan guard aman untuk `jsdom`) dan menerapkan class `.page-enter`.

**Verification:**
- [x] Tests pass: `npx vitest run src/assets/Navbar.unit.test.jsx src/assets/Navbar.property.test.jsx`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 2
**Files likely touched:**
- `src/assets/Navbar.jsx`
- `src/App.jsx`
- `src/assets/Navbar.unit.test.jsx`
**Estimated scope:** Small (3 files)

---

## Task 4: Projects Page — Key Metric Badges, Interactive Category Filter & Header Scroll-Reveal
**Description:** Menambahkan metadata `category` dan `metric` pada ke-11 item di `projectsData` (`src/assets/project.jsx`), menampilkan *Impact Metric Badge* (`font-mono`) di setiap `ProjectCard`, membuat *Interactive Category Filter Pills* (`All`, `GenAI & Agents`, `Computer Vision`, `Time-Series & Geo`, `Tabular & ML`) di halaman `/project`, serta menambahkan animasi scroll-reveal pada header halaman `/project`.

**Acceptance criteria:**
- [x] Semua 11 project di `projectsData` memiliki field `category` dan `metric` yang akurat.
- [x] `ProjectCard` menampilkan badge `metric` (`data-testid="project-metric"`) tanpa mengubah jumlah elemen `<h3>` ataupun `span.shimmer-pill`.
- [x] Halaman `/project` menampilkan tombol filter kategori dengan `aria-pressed`, `focus-ring`, dan ukuran sentuh minimal `44px` (`min-h-[44px]`), serta memfilter `ProjectGrid` secara reaktif.
- [x] Header `Featured Works` dan counter project di `/project` memiliki animasi entrance/scroll-reveal halus.

**Verification:**
- [x] Tests pass: `npx vitest run src/assets/Projects.unit.test.jsx src/assets/ProjectCard*.test.jsx src/test/structure.test.js`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 2
**Files likely touched:**
- `src/assets/project.jsx`
- `src/assets/Projects.unit.test.jsx`
**Estimated scope:** Small (2 files)

---

## Checkpoint 2: Navigation & Projects Page
- [x] `npm test` lulus 100% (termasuk semua property tests `ProjectCard` dan `Navbar`)
- [x] `npm run lint` bersih tanpa error

---

## Phase 3: Home Page Choreography, Content Completeness & Contact UX

## Task 5: Home Page — Scroll-Reveal Choreography, Featured Works Preview, Verified 7 Certificates & Copy Email UX
**Description:** Memperbarui `src/assets/core.jsx` untuk:
1. Melengkapi data 7 sertifikat & penghargaan dari hasil baca PDF asli (menghapus semua `TODO` dan mengisi `issuer` + `date` yang valid).
2. Menambahkan animasi scroll-reveal (`<Reveal>`) bertahap pada `SectionHeader`, `SkillsSection`, `CertificationsSection`, `About me` (termasuk `.marker-sweep`), dan `Contact`, serta animasi entrance pada foto Polaroid Hero.
3. Menambahkan section **`02 / Featured Works`** di halaman `Home` yang menampilkan 3 project unggulan beserta link CTA menuju `/project`.
4. Menambahkan tombol **"Copy email"** dengan feedback `"Copied!"` (`aria-live="polite"`) di sebelah link `mailto:` pada section `#contact`.

**Acceptance criteria:**
- [x] Array `certifications` berisi 7 item lengkap dengan `title`, `issuer`, `date`, dan `href` tanpa string `"TODO"`.
- [x] Halaman `Home` memiliki section `02 / Featured Works` dengan 3 project unggulan dan tombol menuju `/project`, dengan urutan heading tetap valid (`h1 → h2 → h3`).
- [x] Seluruh section di `Home` (`Skills`, `Featured Works`, `Credentials`, `About`, `Contact`) dan foto Polaroid Hero terbungkus animasi reveal yang menghormati `prefers-reduced-motion`.
- [x] Tombol `"Copy email"` di `#contact` menyalin email ke clipboard dan menampilkan status `"Copied!"`.

**Verification:**
- [x] Tests pass: `npx vitest run src/assets/core.content.test.js src/assets/core.unit.test.jsx src/assets/heading-structure.glowup.property.test.jsx src/assets/accessible-names.glowup.property.test.jsx`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 1, Task 2, Task 4
**Files likely touched:**
- `src/assets/core.jsx`
- `src/assets/core.content.test.js`
- `src/assets/core.unit.test.jsx`
**Estimated scope:** Medium (3 files)

---

## Task 6: Final Audit, Full Property-Based Test Suite, ESLint & Production Build
**Description:** Menjalankan verifikasi menyeluruh terhadap seluruh codebase menggunakan checklist `ui-ux-pro-max` dan `web-design-guidelines`, serta memastikan `npm test`, `npm run lint`, dan `npm run build` lulus tanpa error/warning.

**Acceptance criteria:**
- [x] Seluruh 35 file test (`npm test`) lulus 100% (112 tests passed).
- [x] `npm run lint` keluar dengan kode `0` (0 errors).
- [x] `npm run build` keluar dengan kode `0`.
- [x] Checklist aksesibilitas & UI/UX Pro Max (kontras, focus ring, reduced-motion, touch target `>=44px`, tidak ada horizontal overflow) terpenuhi.

**Verification:**
- [x] Tests pass: `npm test` (35 test files, 112 tests passed)
- [x] Lint passes: `npm run lint` (0 errors)
- [x] Build succeeds: `npm run build` (vite v6 build passed in 1.04s)

**Dependencies:** Task 1–5
**Files likely touched:** Semua file yang disentuh pada Task 1–5 (jika ditemukan perbaikan saat audit).
**Estimated scope:** Small


