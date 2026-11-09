# Task List: Project Case Study di Monitor + Live Demo

> Referensi: [`project-detail-plan.md`](./project-detail-plan.md). Kerjakan berurutan; setiap task diakhiri verifikasi.
> Legend: 🧱 = fondasi, 🎨 = UI/UX, ✍️ = konten, 🧪 = test/QA, 🚀 = demo/deploy.

---

## Phase 0 — Persiapan (tanpa mengubah UI)

### Task 0.1 🧱 Checkpoint & baseline
- [ ] `git status` bersih → buat commit checkpoint sebelum mulai.
- [ ] Jalankan `npm test`, `npm run lint`, `npm run build`; catat hasil baseline (test yang memang sudah gagal sebelum perubahan dicatat terpisah).

### Task 0.2 🧱 Petakan test yang terdampak
- [ ] Baca semua `ProjectCard.*.test.jsx`, `DeskWorkstation.unit.test.jsx`, `heading-structure.*`, `accessible-names.*`.
- [ ] Tulis daftar asumsi struktur yang dikunci test (selector, jumlah link, heading) di `.agent/notes.md`.

### Task 0.3 ✍️ Kumpulkan sumber konten dari GitHub `TheGasz`
- [ ] Ambil README (dan ringkasan notebook bila perlu) dari 11 repo yang ada di `projectsData[].repoUrl`.
- [ ] Simpan ringkasan per project di `tasks/content-sources.md`: problem, data, arsitektur, metrik + baseline, keterbatasan.
- [ ] Tandai info yang **tidak ditemukan** di repo sebagai `TODO(Bagas)` — tidak boleh dikarang.

**Verifikasi:** baseline tercatat, `content-sources.md` berisi 11 bagian.

---

## Phase 1 — Data Layer

### Task 1.1 🧱 Tambah `slug` ke `projectsData`
- [ ] Slug kebab-case unik, mis. `enterprise-ai-support-copilot`, `klaimkilat-reimbursement-agent`, `transit-sentinel`, dst.
- [ ] Export helper `getProjectBySlug(slug)`.

### Task 1.2 🧱 Buat `src/assets/projectDetails.js` + schema
- [ ] Tulis JSDoc `ProjectDetail` & `DemoConfig` (lihat plan §3.4).
- [ ] Export `projectDetails` (map slug → detail) dan `getProjectDetail(slug)`.
- [ ] Isi **1 project pilot**: Enterprise AI Support Copilot (RAG) dari `content-sources.md`.

### Task 1.3 🧪 Schema test
- [ ] `projectDetails.schema.test.js`: setiap detail punya slug yang ada di `projectsData`, semua field wajib terisi, `architecture.edges` hanya merujuk node yang ada, URL artifacts valid (`isValidHttpUrl`), `demo.type` termasuk enum.

**Verifikasi:** `npm test -- projectDetails` lulus.

---

## Phase 2 — Komponen Case Study (berdiri sendiri, belum dipasang ke monitor)

### Task 2.1 🎨 `ProjectCard` bisa membuka detail
- [ ] Prop opsional `onOpenDetail`; jika ada → tampil tombol **"View case study →"** + stretched click area.
- [ ] Link GitHub/Demo tetap bisa diklik sendiri (`relative z-10`).
- [ ] Hover/focus state jelas; tombol punya accessible name.

**Verifikasi:** seluruh `ProjectCard.*` test lulus + 1 test baru untuk `onOpenDetail`.

### Task 2.2 🎨 Kerangka `ProjectDetail.jsx`
- [ ] Props: `slug`, `headingLevel` (1|2), `onBack?`, `isMaximized?`, `onToggleMaximize?`.
- [ ] `DetailHeader`: kategori, judul, tagline, metric chips, tech pills, tombol GitHub / Copy link.
- [ ] Mini TOC sticky (chip 1–6) + scroll-spy via `IntersectionObserver` (guard bila tidak tersedia).
- [ ] Section 1 Problem, 2 Data (tabel challenge → fix), 4 Validation (tabel metrik + baseline, impact, limitations), 6 Artifacts.
- [ ] Heading level konsisten (judul = `headingLevel`, section = +1, sub = +2).
- [ ] Slug tidak dikenal → state "Project not found".

### Task 2.3 🎨 `ArchitectureDiagram.jsx`
- [ ] Render `nodes/edges` sebagai pipeline kotak + panah; warna per `kind`.
- [ ] Horizontal (≥ md / maximized), vertikal (mobile).
- [ ] Dukung branch sederhana (1 node → 2 cabang), contoh: confidence router → answer / escalate.
- [ ] Diagram punya teks alternatif (`<figcaption>` / daftar langkah untuk screen reader).
- [ ] `TradeoffList`: kartu "Chosen vs Alternative — Why".

### Task 2.4 🎨 `DemoPanel.jsx` (shell 4 mode)
- [ ] `iframe`: kartu "▶ Launch live demo" + cold-start note → klik baru mount iframe (lazy) + skeleton + "Open in new tab".
- [ ] `playground`: slot `React.lazy` + `Suspense` fallback.
- [ ] `in-browser`: tombol "Load model (x MB)" + progress placeholder.
- [ ] `none`/`coming-soon`: kartu jujur + link repo.
- [ ] Semua project di fase ini = `coming-soon` kecuali yang sudah punya URL.

### Task 2.5 🧪 Unit test komponen
- [ ] `ProjectDetail.unit.test.jsx`: semua 6 section tampil, heading tidak lompat untuk level 1 & 2, not-found state.
- [ ] `DemoPanel.unit.test.jsx`: iframe tidak ter-mount sebelum klik; tiap mode render state yang benar.

**Verifikasi:** `npm test`, `npm run lint`.

---

## Phase 3 — Integrasi ke Monitor (Level 2)

### Task 3.1 🎨 State & render di `DeskWorkstation.jsx`
- [ ] State baru `selectedSlug` (null = grid).
- [ ] Card di monitor mengirim `onOpenDetail={() => setSelectedSlug(slug)}`.
- [ ] Area layar monitor menampilkan grid **atau** `<ProjectDetail headingLevel={2} />`.
- [ ] Top bar monitor berubah: breadcrumb `BagasOS / Projects / <judul>` + tombol "← All projects".
- [ ] Filter kategori disembunyikan saat detail terbuka.
- [ ] Reset `selectedSlug` saat keluar monitor.

### Task 3.2 🎨 Transisi & fokus
- [ ] Animasi grid → detail (mis. card "membesar"/fade + slide) di `desk.css`; dimatikan saat `prefers-reduced-motion`.
- [ ] Scroll layar monitor kembali ke atas saat detail dibuka.
- [ ] Fokus pindah ke judul detail; saat kembali, fokus ke card asal.

### Task 3.3 🧱 ESC stack
- [ ] Satu handler ESC dengan prioritas: Maximized → Detail → Monitor → (tidak ada apa-apa).
- [ ] Tidak memicu shortcut hotspot (angka 1–5) saat detail terbuka bila mengganggu — putuskan & dokumentasikan.

### Task 3.4 🧪 Test integrasi
- [ ] `DeskWorkstation.detail.unit.test.jsx`: buka monitor → klik card → detail tampil → ESC → grid → ESC → kamar.

**Verifikasi:** `npm test`, `npm run lint`, cek manual di `npm run dev`.

---

## Phase 4 — Maximize / Restore (Level 3)

### Task 4.1 🎨 Mode maximized
- [ ] State `isMaximized`; tombol **⤢ Maximize** / **⤡ Restore** di top bar monitor (accessible name + `aria-pressed`).
- [ ] Maximized = panel `fixed inset-0 z-[60]`, bezel tipis tetap (identitas "monitor Bagas"), `body` tidak ikut scroll.
- [ ] Layout maximized memanfaatkan lebar: TOC jadi sidebar kiri, konten max-width nyaman dibaca (~72ch), diagram horizontal.
- [ ] Transisi scale dari posisi monitor → penuh (reduced-motion: tanpa animasi).

### Task 4.2 🎨 Mobile
- [ ] < 768px: detail otomatis maximized, tombol Restore disembunyikan, tombol back tetap ada.

### Task 4.3 🧪 Test
- [ ] Toggle maximize mengubah class/atribut; ESC saat maximized hanya restore (detail tetap terbuka).

**Verifikasi:** `npm test`, cek manual desktop 1366/1920 + mobile 375.

---

## Phase 5 — Deep Link & Halaman `/project`

### Task 5.1 🎨 Route `/project/:slug`
- [ ] Tambah route di `App.jsx`, halaman wrapper dengan tepat satu `<h1>` (judul project) + tombol kembali ke `/project` dan ke kamar.
- [ ] `document.title` = `<judul> — Bagas`.
- [ ] Tombol "Copy link" di detail monitor menyalin URL ini.

### Task 5.2 🎨 Halaman `/project` ikut pakai detail
- [ ] Card di `/project` → navigasi ke `/project/:slug`.

### Task 5.3 🧪 Test
- [ ] Tambahkan `/project/:slug` ke test heading & accessible-names; test not-found.

**Verifikasi:** `npm test`, `npm run build`, buka langsung `/project/<slug>` di `npm run preview`.

---

## Phase 6 — Konten 10 Project Lainnya ✍️

Untuk tiap project: isi semua field dari `content-sources.md`, diagram arsitektur, ≥ 2 trade-off, metrik **dengan baseline**, ≥ 1 limitation, `demo` config. Setelah itu pendekkan `description` card menjadi 2–3 kalimat.

- [ ] KlaimKilat — AI Reimbursement Agent
- [ ] TransitSentinel — Cashless Transit Anomaly Detection
- [ ] The 15-Minute City Profiler
- [ ] River Water-Level Forecasting (Bengawan Solo)
- [ ] Jakarta Flood Risk Data Pipeline
- [ ] Hierarchical Waste Classification (AI PilahYuk)
- [ ] Waste Image Classification (Satria Data 2026)
- [ ] Face Anti-Spoofing Detection
- [ ] Crop Yield Prediction
- [ ] Agent-Based Exposure Simulation
- [ ] **Review oleh Bagas**: semua `TODO(Bagas)` dijawab/dihapus.

**Verifikasi:** schema test lulus untuk 11 project.

---

## Phase 7 — QA Akhir 🧪

- [ ] `npm test`, `npm run lint`, `npm run build` lulus.
- [ ] Keyboard-only: buka monitor → card → detail → maximize → ESC berlapis, tanpa jebakan fokus.
- [ ] Kontras warna teks & chip di layar monitor gelap/terang memenuhi WCAG AA.
- [ ] `prefers-reduced-motion` → tanpa animasi besar.
- [ ] Cek visual: 375 / 768 / 1366 / 1920 px.
- [ ] Ukuran bundle sebelum vs sesudah dicatat (`npm run build` output).
- [ ] Update `.agent/notes.md` dengan keputusan final.

---

## Phase 8 — Live Demo (setelah UI/UX selesai) 🚀

> Akan dibuat sebagai **panduan step-by-step terpisah** (`tasks/demo-deploy-guide.md`) setelah Phase 7.

- [ ] 8.0 Verifikasi ulang dari dokumentasi resmi: limit Streamlit Community Cloud, status free tier HF Spaces (Gradio/Streamlit/Docker/ZeroGPU), limit Vercel/Netlify untuk file model statis.
- [ ] 8.1 Audit tiap repo: ukuran model, dependency, apakah bisa diekspor ke ONNX/TF.js.
- [ ] 8.2 Tetapkan strategi final per project (iframe / in-browser / playground / none) + alasan.
- [ ] 8.3 Panduan **Streamlit Community Cloud** (RAG Copilot, ABM Simulation) — termasuk rencana kalau RAM tidak cukup.
- [ ] 8.4 Panduan **in-browser** (Crop Yield → TF.js, TransitSentinel → ONNX Runtime Web).
- [ ] 8.5 Panduan **playground pre-computed** (SigLIP waste, Face Anti-Spoofing, KlaimKilat flow, geo/time-series maps): script Python untuk generate JSON + komponen playground.
- [ ] 8.6 Isi `demo` config di `projectDetails.js` dengan URL/komponen nyata, ubah status ke `live`.

