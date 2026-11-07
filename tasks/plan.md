# Implementation Plan: Interactive 3D/Isometric Workstation Landing Page ("Anatomy Desk" Edition)

> **For agentic workers:** REQUIRED SUB-SKILLS:
> - **3D/Isometric Craft & Engine:** `anatomy` (`C:\Users\bagas\.gemini\config\skills\anatomy\SKILL.md`, plus `references/craft.md`, `references/kit.md`, `references/motion.md`, `references/react.md`).
> - **Mandatory UI/UX Skills on EVERY task:** `ui-ux-pro-max` (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`), `frontend-ui-engineering`, `ui-styling`, `web-design-guidelines`, `vercel-react-best-practices`, and workspace skills `.kiro/skills/ux-design` & `.kiro/skills/visual-design`.

## Overview

Merombak Hero / Landing Page (`/`) portofolio Bagas Adjie Pamungkas menjadi **Interactive 3D/Isometric Workstation ("Bagas's Desk")** menggunakan *drawing kit* dari `wheresryan22/anatomy`. Scene utama menampilkan meja kerja detail tinggi (60+ *solid parts*) lengkap dengan **PC & Monitor** (klik → `/project`), **Keyboard & Mouse reaktif** (mengetik ke layar & mengikuti kursor), **Bingkai Foto Bagas di Dinding** (klik → *About Me*), **Telepon Meja berkabel spiral** (klik → *Contact Me*: Email, Copy Email, LinkedIn, GitHub), serta objek pendukung **Lab Notebook** (klik → *Skills*) dan **Trophy/Sertifikat** (klik → *Credentials*).

**Spec:** [`SPEC.md`](file:///d:/Bagas/Portofolio/Portofolio/SPEC.md)

---

## Architecture Decisions

1. **Vendoring `anatomy` Core Kit (`src/assets/iso/`):**
   - Menyalin modul murni bebas-dependensi dari `wheresryan22/anatomy` (`kit/iso-kit.mjs`, `kit/lathe.mjs`, `kit/tube.mjs`) ke dalam `src/assets/iso/` sehingga dapat di-bundle langsung oleh Vite 6 + React 19 tanpa menambah *runtime dependency* di `package.json`.
2. **Precomputed Static Geometry + Ref-Driven Live Layer (`deskGeometry.js` + `DeskWorkstation.jsx`):**
   - Mengikuti pola `references/react.md` dan `examples/desk-computer/build.mjs` dari `anatomy`: seluruh bangun ruang statis (meja, kaki meja, sekrup, dinding, bingkai foto, unit PC, monitor, badan keyboard, telepon, buku catatan, piala) dihitung **satu kali saat modul dimuat** di `src/assets/desk/deskGeometry.js`.
   - Bagian yang bergerak per frame (posisi mouse + kabelnya di atas mousepad, *keycap* yang sedang ditekan, kursor berkedip & teks di layar CRT/monitor, getaran gagang telepon, serta teks *readout*) diperbarui secara efisien di `DeskWorkstation.jsx`.
3. **Palet 4-Nada "Lab Notebook × Anatomy" (`src/assets/desk/desk.css`):**
   - Menyelaraskan variabel CSS `--iso-*` dengan token desain `src/index.css`:
     - Kertas dasar: `--color-paper` (`#f3efe6`) / `--color-card` (`#fbf9f4`)
     - Garis tinta & bayangan: `--color-ink` (`#17150f`)
     - Aksen interaktif (`lit` / hotspot aktif): `--color-signal` (`#d93f12`) dan `--color-marker` (`#ffd84d`).
4. **Interactive Overlay + Section Anchors (Hybrid UX):**
   - Mengeklik **Monitor** langsung menavigasi ke `/project` via `useNavigate()` (atau `<Link to="/project">`).
   - Mengeklik **Foto Dinding (About Me)** atau **Telepon Meja (Contact Me)** menampilkan **Interactive Card Modal/Popover** langsung di atas meja (agar user langsung mendapatkan info About/Contact secara instan) sekaligus menyediakan tombol *Jump to Section* (`#about` / `#contact`).
   - Di bawah kanvas meja 3D terdapat **Quick Hotspot Bar** (5 tombol kapsul `>= 44px`: `[1] Monitor → Projects`, `[2] Wall Photo → About`, `[3] Phone → Contact`, `[4] Notebook → Skills`, `[5] Trophy → Certs`) agar pengguna mobile (`390px`) dan pembaca layar mendapatkan akses 1-klik yang ergonomis.
5. **Kompatibilitas Penuh terhadap 112 Existing Tests:**
   - Mempertahankan satu `<h1>` (`Hi, I'm Bagas.` dengan `<span class="animated-gradient-text">Bagas</span>`) di header workstation, serta mempertahankan section `#skills`, `#featured-works`, `#credentials`, `#about`, dan `#contact` sehingga seluruh *property-based test* (`Hero.glowup.unit.test.jsx`, `heading-structure.glowup.property.test.jsx`, `accessible-names.glowup.property.test.jsx`, `core.unit.test.jsx`, dll.) tetap 100% hijau.

---

## Dependency Graph

```text
Task 1: Install Skill `anatomy` & Vendor Core Isometric Kit (`src/assets/iso/`)
   │
Task 2: Desk World Model & Pure Isometric Geometry (`src/assets/desk/deskModel.js`, `deskGeometry.js`)
   │
Task 3: Scoped Lab-Notebook Isometric Styles & Interactive Workstation Component (`desk.css`, `DeskWorkstation.jsx`)
   │
Task 4: Quick Overlays (About Me Photo Card & Desk Phone Contact Hub) + Keyboard/Pointer Physics
   │
Task 5: Integrate `<DeskWorkstation />` into `core.jsx` & Write Unit/Integration Tests (`DeskWorkstation.unit.test.jsx`)
   │
Task 6: Visual Audit (Headless Chrome Capture / Line Check) + Full Regression Suite (`npm test`, `npm run lint`, `npm run build`)
```

---

## Task List Overview

### Phase 1: Foundation & Isometric Engine
- [ ] **Task 1:** Pasang skill `wheresryan22/anatomy` ke global skills Antigravity (`C:\Users\bagas\.gemini\config\skills\anatomy`) dan vendor modul intinya (`iso-kit.mjs`, `lathe.mjs`, `tube.mjs`) ke `src/assets/iso/`.
- [ ] **Task 2:** Bangun model murni (`src/assets/desk/deskModel.js`) dan generator geometri isometrik 60+ *solid parts* (`src/assets/desk/deskGeometry.js`) yang mencakup Meja, Dinding + Bingkai Foto Bagas, PC + Monitor, Keyboard + Mouse, Telepon Meja + Kabel Spiral, Lab Notebook, dan Trophy Sertifikat.

### Checkpoint 1: Engine & Geometry Ready
- [ ] Geometri menghasilkan SVG valid tanpa error runtime, seluruh *painter's order* terurut rapi, dan `npm test` lulus.

### Phase 2: Interactive Workstation & Hotspot Overlays
- [ ] **Task 3:** Buat stylesheet `src/assets/desk/desk.css` (palet 4-nada *Lab Notebook* + efek *hover/focus* hotspot) dan komponen `<DeskWorkstation />` (`src/assets/desk/DeskWorkstation.jsx`) dengan 5 hotspot yang bisa diklik, *live readout*, dan mode `[I] Inspect Hotspots`.
- [ ] **Task 4:** Tambahkan interaktivitas fisik (ketikan keyboard muncul di layar monitor & menekan *keycap*, mouse 3D bergeser mengikuti kursor) serta *Quick Overlay Panel* untuk **About Me (Foto Dinding)** dan **Contact Me (Telepon Meja: Email, Copy Email, LinkedIn, GitHub)**.

### Checkpoint 2: Interactive Component Complete
- [ ] Seluruh 5 hotspot merespons klik, hover, dan keyboard (`1`–`5`, `Tab`, `Enter`, `Escape`).

### Phase 3: Landing Page Integration & Verification
- [ ] **Task 5:** Integrasikan `<DeskWorkstation />` ke halaman utama `src/assets/core.jsx` dan tambahkan test suite `src/assets/DeskWorkstation.unit.test.jsx`.
- [ ] **Task 6:** Jalankan verifikasi visual (`scripts/capture.mjs` pada desktop `1440px` & mobile `390px`), `npm test`, `npm run lint`, dan `npm run build`.

### Checkpoint 3: Complete & Verified
- [ ] Semua acceptance criteria di `SPEC.md` terpenuhi, 100% test lulus, bundle produksi ter-build bersih.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Proyeksi foto `profile.jpg` di bingkai dinding terlihat pecah atau tidak pas dengan sudut isometrik | Medium | Gunakan matriks transformasi bidang dinding dari `iso-kit` (`sideMatrix` / SVG `<clipPath>` + `<pattern>`/`<image>` dengan filter *warm paper contrast*) sehingga foto asli Bagas terpasang presisi di dalam bingkai 3D dinding. |
| Terlalu banyak path SVG memperlambat *re-render* saat mouse digerakkan | High | Hitung seluruh path statis **sekali di luar siklus render React** (`deskGeometry.js` / `useMemo`), dan gunakan state ringan / DOM attribute hanya pada grup yang berubah (mouse, keycap aktif, teks monitor, hotspot hover). |
| Hotspot SVG (`<g>`) tidak terbaca oleh test aksesibilitas (`accessible-names.glowup.property.test.jsx`) | High | Gunakan elemen `<a href>` / `<button>` di Quick Action Dock dan atribut `role="button"` / `aria-label` yang valid pada grup hotspot SVG, lalu uji langsung dengan `accessible-names.glowup.property.test.jsx`. |
| Tampilan di layar HP (`390px`) terlalu kecil untuk mengeklik objek detail di meja | Medium | Atur `viewBox` responsif dengan *padding* ketat, tambahkan toggle `[I] Inspect Pins` yang menampilkan badge bernomor jelas, serta sediakan **Quick Action Dock** (`min-h-[44px]`) tepat di bawah ilustrasi meja. |

---

## Resolved Decisions

1. **Interactive Overlay Card + Scroll:** Mengeklik **Foto Dinding (About Me)**, **Telepon Meja (Contact Me)**, **Buku Catatan Lab (Skills)**, atau **Trophy/Sertifikat (Credentials)** memunculkan **Kartu Overlay Interaktif** langsung di atas meja sekaligus menyediakan tombol *scroll* ke section lengkap di bawahnya. Mengeklik **Monitor** langsung menuju `/project`.
2. **Hotspot Objek di Scene 3D:** Menyertakan ke-5 objek fungsional (**Monitor + PC + Keyboard + Mouse**, **Foto Dinding**, **Telepon Meja**, **Buku Catatan Lab + Pena**, dan **Trophy + Rak Sertifikat**). Keyboard & Mouse ditampilkan detail sebagai bagian utuh dari workstation tanpa gimmick ketikan bebas yang tidak fungsional.

