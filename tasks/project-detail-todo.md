# Task List: Project Case Study di Monitor + Live Demo

> Referensi: [`project-detail-plan.md`](./project-detail-plan.md). Kerjakan berurutan; setiap task diakhiri verifikasi.
> Legend: 🧱 = fondasi, 🎨 = UI/UX, ✍️ = konten, 🧪 = test/QA, 🚀 = demo/deploy.

---

## Phase 0 — Persiapan (tanpa mengubah UI)

### Task 0.1 🧱 Checkpoint & baseline
- [x] `git status` bersih → buat commit checkpoint sebelum mulai.
- [x] Jalankan `npm test`, `npm run lint`, `npm run build`; catat hasil baseline (test yang memang sudah gagal sebelum perubahan dicatat terpisah).

### Task 0.2 🧱 Petakan test yang terdampak
- [x] Baca semua `ProjectCard.*.test.jsx`, `DeskWorkstation.unit.test.jsx`, `heading-structure.*`, `accessible-names.*`.
- [x] Tulis daftar asumsi struktur yang dikunci test (selector, jumlah link, heading) di `.agent/notes.md`.

### Task 0.3 ✍️ Kumpulkan sumber konten dari GitHub `TheGasz`
- [x] Ambil README (dan ringkasan notebook bila perlu) dari 11 repo yang ada di `projectsData[].repoUrl`.
- [x] Simpan ringkasan per project di `tasks/content-sources.md`: problem, data, arsitektur, metrik + baseline, keterbatasan.
- [x] Tandai info yang **tidak ditemukan** di repo sebagai `TODO(Bagas)` — tidak boleh dikarang.

**Verifikasi:** baseline tercatat, `content-sources.md` berisi 11 bagian.

---

## Phase 1 — Data Layer

### Task 1.1 🧱 Tambah `slug` ke `projectsData`
- [x] Slug kebab-case unik, mis. `enterprise-ai-support-copilot`, `klaimkilat-reimbursement-agent`, `transit-sentinel`, dst.
- [x] Export helper `getProjectBySlug(slug)`.

### Task 1.2 🧱 Buat `src/assets/projectDetails.js` + schema
- [x] Tulis JSDoc `ProjectDetail` & `DemoConfig` (lihat plan §3.4).
- [x] Export `projectDetails` (map slug → detail) dan `getProjectDetail(slug)`.
- [x] Isi **1 project pilot**: Enterprise AI Support Copilot (RAG) dari `content-sources.md`.

### Task 1.3 🧪 Schema test
- [x] `projectDetails.schema.test.js`: setiap detail punya slug yang ada di `projectsData`, semua field wajib terisi, `architecture.edges` hanya merujuk node yang ada, URL artifacts valid (`isValidHttpUrl`), `demo.type` termasuk enum.

**Verifikasi:** `npm test -- projectDetails` lulus.

---

## Phase 2 — Komponen Case Study (berdiri sendiri, belum dipasang ke monitor)

### Task 2.1 🎨 `ProjectCard` bisa membuka detail
- [x] Prop opsional `onOpenDetail`; jika ada → tampil tombol **"View case study →"** + stretched click area.
- [x] Link GitHub/Demo tetap bisa diklik sendiri (`relative z-10`).
- [x] Hover/focus state jelas; tombol punya accessible name.

**Verifikasi:** seluruh `ProjectCard.*` test lulus + 1 test baru untuk `onOpenDetail`.

### Task 2.2 🎨 Kerangka `ProjectDetail.jsx`
- [x] Props: `slug`, `headingLevel` (1|2), `onBack?`, `isMaximized?`, `onToggleMaximize?`.
- [x] `DetailHeader`: kategori, judul, tagline, metric chips, tech pills, tombol GitHub / Copy link.
- [x] Mini TOC sticky (chip 1–6) + scroll-spy via `IntersectionObserver` (guard bila tidak tersedia).
- [x] Section 1 Problem, 2 Data (tabel challenge → fix), 4 Validation (tabel metrik + baseline, impact, limitations), 6 Artifacts.
- [x] Heading level konsisten (judul = `headingLevel`, section = +1, sub = +2).
- [x] Slug tidak dikenal → state "Project not found".

### Task 2.3 🎨 `ArchitectureDiagram.jsx`
- [x] Render `nodes/edges` sebagai pipeline kotak + panah; warna per `kind`.
- [x] Horizontal (≥ md / maximized), vertikal (mobile).
- [x] Dukung branch sederhana (1 node → 2 cabang), contoh: confidence router → answer / escalate.
- [x] Diagram punya teks alternatif (`<figcaption>` / daftar langkah untuk screen reader).
- [x] `TradeoffList`: kartu "Chosen vs Alternative — Why".

### Task 2.4 🎨 `DemoPanel.jsx` (shell 4 mode)
- [x] `iframe`: kartu "▶ Launch live demo" + cold-start note → klik baru mount iframe (lazy) + skeleton + "Open in new tab".
- [x] `playground`: slot `React.lazy` + `Suspense` fallback.
- [x] `in-browser`: tombol "Load model (x MB)" + progress placeholder.
- [x] `none`/`coming-soon`: kartu jujur + link repo.
- [x] Semua project di fase ini = `coming-soon` kecuali yang sudah punya URL.

### Task 2.5 🧪 Unit test komponen
- [x] `ProjectDetail.unit.test.jsx`: semua 6 section tampil, heading tidak lompat untuk level 1 & 2, not-found state.
- [x] `DemoPanel.unit.test.jsx`: iframe tidak ter-mount sebelum klik; tiap mode render state yang benar.

**Verifikasi:** `npm test`, `npm run lint`.

---

## Phase 3 — Integrasi ke Monitor (Level 2)

### Task 3.1 🎨 State & render di `DeskWorkstation.jsx`
- [x] State baru `selectedSlug` (null = grid).
- [x] Card di monitor mengirim `onOpenDetail={() => setSelectedSlug(slug)}`.
- [x] Area layar monitor menampilkan grid **atau** `<ProjectDetail headingLevel={2} />`.
- [x] Top bar monitor berubah: breadcrumb `BagasOS / Projects / <judul>` + tombol "← All projects".
- [x] Filter kategori disembunyikan saat detail terbuka.
- [x] Reset `selectedSlug` saat keluar monitor.

### Task 3.2 🎨 Transisi & fokus
- [x] Animasi grid → detail (mis. card "membesar"/fade + slide) di `desk.css`; dimatikan saat `prefers-reduced-motion`.
- [x] Scroll layar monitor kembali ke atas saat detail dibuka.
- [x] Fokus pindah ke judul detail; saat kembali, fokus ke card asal.

### Task 3.3 🧱 ESC stack
- [x] Satu handler ESC dengan prioritas: Maximized → Detail → Monitor → (tidak ada apa-apa).
- [x] Tidak memicu shortcut hotspot (angka 1–5) saat detail terbuka bila mengganggu — putuskan & dokumentasikan.

### Task 3.4 🧪 Test integrasi
- [x] `DeskWorkstation.detail.unit.test.jsx`: buka monitor → klik card → detail tampil → ESC → grid → ESC → kamar.

**Verifikasi:** `npm test`, `npm run lint`, cek manual di `npm run dev`.

---

## Phase 4 — Maximize / Restore (Level 3)

### Task 4.1 🎨 Mode maximized
- [x] State `isMaximized`; tombol **⤢ Maximize** / **⤡ Restore** di top bar monitor (accessible name + `aria-pressed`).
- [x] Maximized = panel `fixed inset-0 z-[60]`, bezel tipis tetap (identitas "monitor Bagas"), `body` tidak ikut scroll.
- [x] Layout maximized memanfaatkan lebar: TOC jadi sidebar kiri, konten max-width nyaman dibaca (~72ch), diagram horizontal.
- [x] Transisi scale dari posisi monitor → penuh (reduced-motion: tanpa animasi).

### Task 4.2 🎨 Mobile
- [x] < 768px: detail otomatis maximized, tombol Restore disembunyikan, tombol back tetap ada.

### Task 4.3 🧪 Test
- [x] Toggle maximize mengubah class/atribut; ESC saat maximized hanya restore (detail tetap terbuka).

**Verifikasi:** `npm test`, cek manual desktop 1366/1920 + mobile 375.

---

## Phase 5 — Deep Link & Halaman `/project`

### Task 5.1 🎨 Route `/project/:slug`
- [x] Tambah route di `App.jsx`, halaman wrapper dengan tepat satu `<h1>` (judul project) + tombol kembali ke `/project` dan ke kamar.
- [x] `document.title` = `<judul> — Bagas`.
- [x] Tombol "Copy link" di detail monitor menyalin URL ini.

### Task 5.2 🎨 Halaman `/project` ikut pakai detail
- [x] Card di `/project` → navigasi ke `/project/:slug`.

### Task 5.3 🧪 Test
- [x] Tambahkan `/project/:slug` ke test heading & accessible-names; test not-found.

**Verifikasi:** `npm test`, `npm run build`, buka langsung `/project/<slug>` di `npm run preview`.

---

## Phase 6 — Konten 10 Project Lainnya ✍️

Untuk tiap project: isi semua field dari `content-sources.md`, diagram arsitektur, ≥ 2 trade-off, metrik **dengan baseline**, ≥ 1 limitation, `demo` config. Setelah itu pendekkan `description` card menjadi 2–3 kalimat.

- [x] KlaimKilat — AI Reimbursement Agent
- [x] TransitSentinel — Cashless Transit Anomaly Detection
- [x] The 15-Minute City Profiler
- [x] River Water-Level Forecasting (Bengawan Solo)
- [x] Jakarta Flood Risk Data Pipeline
- [x] Hierarchical Waste Classification (AI PilahYuk)
- [x] Waste Image Classification (Satria Data 2026)
- [x] Face Anti-Spoofing Detection
- [x] Crop Yield Prediction
- [x] Agent-Based Exposure Simulation
- [x] **Review oleh Bagas**: semua `TODO(Bagas)` dijawab/dihapus.

**Verifikasi:** schema test lulus untuk 11 project.

---

## Phase 7 — QA Akhir 🧪

- [x] `npm test`, `npm run lint`, `npm run build` lulus.
- [x] Keyboard-only: buka monitor → card → detail → maximize → ESC berlapis, tanpa jebakan fokus.
- [x] Kontras warna teks & chip di layar monitor gelap/terang memenuhi WCAG AA.
- [x] `prefers-reduced-motion` → tanpa animasi besar.
- [x] Cek visual: 375 / 768 / 1366 / 1920 px.
- [x] Ukuran bundle sebelum vs sesudah dicatat (`npm run build` output).
- [x] Update `.agent/notes.md` dengan keputusan final.

---

## Phase 8 — Live Demo (setelah UI/UX selesai) 🚀

> Akan dibuat sebagai **panduan step-by-step terpisah** (`tasks/demo-deploy-guide.md`) setelah Phase 7.

- [x] 8.0 Verifikasi ulang dari dokumentasi resmi: limit Streamlit Community Cloud, status free tier HF Spaces (Gradio/Streamlit/Docker/ZeroGPU), limit Vercel/Netlify untuk file model statis.
- [x] 8.1 Audit tiap repo: ukuran model, dependency, apakah bisa diekspor ke ONNX/TF.js.
- [x] 8.2 Tetapkan strategi final per project (iframe / in-browser / playground / none) + alasan.
- [x] 8.3 Panduan **Streamlit Community Cloud** (RAG Copilot, ABM Simulation) — termasuk rencana kalau RAM tidak cukup.
- [x] 8.4 Panduan **in-browser** (Crop Yield → TF.js, TransitSentinel → ONNX Runtime Web).
- [x] 8.5 Panduan **playground pre-computed** (SigLIP waste, Face Anti-Spoofing, KlaimKilat flow, geo/time-series maps): script Python untuk generate JSON + komponen playground.
- [x] 8.6 Isi `demo` config di `projectDetails.js` dengan URL/komponen nyata, ubah status ke `live`.

