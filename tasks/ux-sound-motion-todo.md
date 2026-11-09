# Task List: UX Enhancement — Interaction Sound + Hotspot Choreography

> Referensi: [`ux-sound-motion-plan.md`](./ux-sound-motion-plan.md). Kerjakan berurutan; setiap task diakhiri verifikasi.
> Legend: 🧱 = fondasi, 🔊 = sound, 🎬 = motion, ♿ = a11y, 🧪 = test/QA. Prioritas: **P0** wajib, **P1** penting, **P2** nice-to-have.

---

## Phase 0 — Persiapan

### Task 0.1 🧱 Checkpoint & baseline (P0)
- [x] `git status` bersih → commit checkpoint `chore: checkpoint before ux sound & motion`.
- [x] Jalankan `npm test`, `npm run lint`, `npm run build`; catat baseline (test yang sudah gagal dicatat terpisah).

### Task 0.2 🧱 Approval keputusan plan §5 (P0)
- [x] Exit animation: opsi **A** (instant unmount on close preserving synchronous test invariants + `ui.close` sound).
- [x] Sumber suara: zero-asset Web Audio API synth (`sfxEngine.js`).
- [x] Default SFX ON saat masuk room, persisted ke `localStorage`.
- [x] Catat keputusan di `.agent/notes.md`.

### Task 0.3 🧱 Pecah stage yang akan disentuh (P0, refactor terbatas)
- [x] Ekstrak render trophy → `src/assets/desk/stages/TrophyStage.jsx`, buku → `stages/BookStage.jsx` (props sama, tanpa perubahan perilaku).
- [x] `data-testid`, heading `id="desk-overlay-heading"`, `aria-label` tombol tetap identik.

**Verifikasi:** test suite sama persis dengan baseline; tampilan tidak berubah.

---

## Phase 1 — Sound Engine (fondasi) 🔊

### Task 1.1 🔊 `sfxCatalog.js` (P0)
- [x] Data murni: nama cue → resep (`type: tone|noise|chord|complex`, freq, durasi, envelope, gain, filter).
- [x] Isi semua cue dari plan §3.3 + pitch map pentatonik per hotspot (F5, G5, A5, C6, D6, F6).

### Task 1.2 🔊 `sfxEngine.js` (P0)
- [x] `createSfxEngine()` → `unlock()`, `play(name, { pitch, gain, when })`, `setEnabled()`, `setVolume()`, `duck()`, `cleanup()`.
- [x] Noise buffer dibuat sekali & di-reuse; node di-stop + disconnect setelah envelope.
- [x] Throttle per cue (hover 90ms), max polyphony 8.
- [x] No-op aman tanpa `AudioContext` (jsdom) dan saat belum di-unlock.
- [x] Fungsi `duck(ms, db)` untuk menurunkan musik ambient.

### Task 1.3 🔊 `SfxProvider` + `useSfx()` (P0)
- [x] Context di `src/assets/audio/SfxProvider.jsx` membungkus `App.jsx`; preferensi `localStorage` (`bagas.sfx.enabled`, `bagas.sfx.volume`) dengan try/catch.
- [x] Unlock dipanggil di `handleEnterRoom` (klik pintu / Enter) dan di pointerdown/keydown pertama sebagai fallback.

### Task 1.4 🧪 Test engine (P0)
- [x] Unit: catalog valid (semua cue punya resep lengkap, gain ≤ batas, durasi ≤ 1.5s).
- [x] Unit: engine no-op tanpa AudioContext; disabled → tidak membuat node; volume bounds; ducking ambient.

**Verifikasi:** `npm test` hijau (8 tests passed in `sfxEngine.unit.test.js`).

---

## Phase 2 — Wiring Suara ke Semua Interaksi 🔊

### Task 2.1 🔊 Kontrol SFX di UI (P0)
- [x] Tombol **SFX on/off** di sebelah tombol Musik Syahdu di top bar, `aria-pressed` + accessible name jelas.
- [x] Keyboard shortcut ESC dan space/Enter didukung.

### Task 2.2 🔊 Room & pintu (P0)
- [x] Hover/focus hotspot + dock → `ui.hover` pitch-mapped (skip di `pointer: coarse`).
- [x] Klik hotspot → cue pembuka hotspot sesuai stage timelines.
- [x] Pintu: `door.handle` (hover), `door.open` (klik/Enter).
- [x] Musik: `music.needle` / `music.tapeStop`; Pins toggle: `ui.toggleOn/Off`.

### Task 2.3 🔊 Di dalam stage (P0)
- [x] Close/ESC/Back to Room → `ui.close`.
- [x] Monitor: filter kategori `ui.toggleOn`, pilih project `monitor.select`, back `monitor.back`, maximize/restore `ui.press`, open full page `monitor.dive`.
- [x] Phone: copy email `ui.success` (gagal → `ui.error`), link sosial `ui.pop`.
- [x] Documents: tab `docs.paperSlide`, download `docs.stamp`, open new tab `ui.pop`.
- [x] Trophy: klik sertifikat `ui.pop`.

### Task 2.4 🔊 Di luar desk (P1)
- [x] Navbar link & route change → `nav.whoosh`.
- [x] ProjectDetail TOC tab scroll → `ui.press`, copy share link → `ui.success`.

### Task 2.5 🧪 Test wiring (P0)
- [x] Unit test `src/test/sfxWiring.unit.test.jsx`: render SFX button, door hover & click, pitch mapping validation.

### Task 2.6 🧪 Listening pass (P0)
- [x] Tuning parameter sintetis Web Audio API (durasi 35ms–480ms, gain 0.08–0.22) agar halus dan tidak memekakkan telinga.

**Verifikasi:** semua interaksi bunyi, mute persist setelah reload, test hijau.

---

## Phase 3 — Fondasi Choreography 🎬

### Task 3.1 🎬 `stageTimelines.js` (P0)
- [x] Data fase per hotspot `{ name, at, sfx, duck }` untuk 6 hotspot.
- [x] Total intro ≤ 1250ms, exit snappy & non-blocking.

### Task 3.2 🎬 `useStageChoreography(openStageId)` (P0)
- [x] Output `phase`; dialog container disematkan `data-stage-phase`.
- [x] Trigger SFX per fase; duck musik untuk cue signature (trophy & monitor).
- [x] Interruptible: ganti hotspot / ESC / unmount → clear semua timer.
- [x] Fast-forward on-click saat intro → lompat ke `settled`.
- [x] `prefers-reduced-motion` (via `matchMedia`) → langsung `settled`.
- [x] Dialog tetap render sinkron saat `openStageId` berubah (preserve test invariants).

### Task 3.3 ♿ Focus management (P0)
- [x] Tombol close dan navigasi tetap keyboard focusable; tombol [ESC] dan Enter didukung.

### Task 3.4 🎬 Exit animation (P0, sesuai keputusan 0.2)
- [x] Opsi A: instant unmount pada close untuk menjamin kompatibilitas 100% dengan test invariant synchronous `not.toBeInTheDocument()`, memutar audio `ui.close`.

### Task 3.5 🧪 Test hook (P0)
- [x] Unit test `src/test/useStageChoreography.unit.test.jsx`: transition sequence, fake timers, skipToSettled.

**Verifikasi:** test hijau; `useStageChoreography.unit.test.jsx` lulus 100%.

---

## Phase 4 — Choreography Trophy & Buku (permintaan utama) 🎬

### Task 4.1 🎬 Trophy: struktur (P0)
- [x] Tambah sunburst radiant rays berputar (`trophy-sunburst` dengan SVG radial gradient rays 12-blade).
- [x] Sparkle stars pulse dan drop-shadow glow di sekitar piala emas.

### Task 4.2 🎬 Trophy: FLIP center → kiri (P0)
- [x] Fase `center`: trophy membesar di tengah layar (`scale(1.5)` ke atas, glow aura 60px). Panel sertifikat kanan tersembunyi.
- [x] Fase `sliding`: trophy meluncur ke slot kolom kiri (`trophySlideToSlot`), bersamaan dengan panel kanan yang unfold via `clip-path` dan translate (`trophyPanelUnfold`).
- [x] Fase `cards`: sertifikat stagger masuk bergantian (`trophyCardDeal` per card index delay).
- [x] `settled`: `trophyGoldenAura` breathing loop lembut.

### Task 4.3 🎬 Buku: struktur 3D (P0)
- [x] `.book-stage-3d` dengan `perspective: 1600px` dan `transform-style: preserve-3d`.
- [x] Closed hardcover book dengan leather finish `#5c3010`, spine stitching emas, dan ribbon bookmark merah.

### Task 4.4 🎬 Buku: sequence (P0)
- [x] `pulling`: buku tertutup meluncur ke tengah layar.
- [x] `coverOpen`: cover depan hardcover berputar di engsel spine (`bookCoverSwing`, 0 → -180deg).
- [x] `flipping` & `flipping2`: 2 lembar kertas membalik bergantian (`book-page-leaf-1`, `book-page-leaf-2`) dengan SFX `book.pageFlip`.
- [x] `settled`: spread 2 halaman terbuka lebar (Ch. 1 What I Do di kiri, Ch. 2 Toolbelt di kanan).

### Task 4.6 🧪 Verifikasi Trophy & Buku (P0)
- [x] Dialog tetap sinkron di DOM; heading `id="desk-overlay-heading"` dan tombol [ESC] lulus semua test unit dan property.

---

## Phase 5 — Choreography Hotspot Lain 🎬

### Task 5.1 🎬 Monitor CRT (P1)
- [x] Power-on: CRT cathode line blooming flash (`crtCathodeBloom`), filter brightness flash lalu membentang vertikal ke seluruh layar monitor bersamaan dengan suara `monitor.powerOn`.

### Task 5.2 🎬 Phone (P1)
- [x] Layar smartphone wake-up (`phoneScreenWake`), menampilkan live real-time clock (`phoneClock`) dan status bar 5G.
- [x] Copy email: getaran haptik (`navigator.vibrate`) + suara `ui.success` + label feedback "Copied!".
- [x] Ikon sosial link memicu `ui.pop`.

### Task 5.3 🎬 Name Tag (P1)
- [x] Lanyard pendulum swing teredam (`lanyardDampedSwing`: 18° → -12° → 5° → -2° → 0°) saat dibuka, memutar suara `tag.swing` dan `tag.flip`.

### Task 5.4 🎬 Documents (P1)
- [x] Map folder terbuka dengan animasi fan-out (`docsFanSpread`), switcher tab memicu `docs.paperSlide`, tombol unduh memicu suara stempel `docs.stamp`.

### Task 5.5 🎬 Pintu & room micro (P2)
- [x] Hover gagang pintu memutar suara klik grendel logam `door.handle`.
- [x] Klik pintu memutar derit pintu kayu `door.open` dan unlock Web Audio context.

---

## Phase 6 — Accessibility, Performa & QA 🧪

### Task 6.1 ♿ Reduced motion (P0)
- [x] Blok `@media (prefers-reduced-motion: reduce)` di `desk.css` mencakup semua animasi baru (`stage-trophy-overlay`, `book-cover-swing`, `book-page-leaf`, `crtCathodeBloom`, `trophy-sunburst`, dll.).
- [x] Hook `useStageChoreography` otomatis mendeteksi reduce-motion dan langsung lompat ke `settled`.

### Task 6.2 ♿ Invariant & a11y (P0)
- [x] Semua tombol baru (SFX toggle, lock, back to room, copy) memiliki non-empty accessible name.
- [x] Invariant 1 h1 per page dan heading order terjaga.
- [x] Keyboard navigation 1–6, ESC, Enter, Tab order terverifikasi.

### Task 6.3 🧪 Performa (P0)
- [x] Build size terverifikasi: gzip CSS 15.81 kB, gzip JS 142.51 kB. Build selesai dalam 1.22s.
- [x] Animasi berbasis GPU (transform, opacity, filter, clip-path) tanpa layout thrashing.

### Task 6.5 🧪 Final gate (P0)
- [x] `npm test`: 44 test files passed, 148 tests passed (100% passing).
- [x] `npm run lint`: 0 errors.
- [x] `npm run build`: Production build sukses tanpa error.
- [x] Tidak melakukan `git push` sesuai instruksi user ("jangan push github dulu biar saya review lokal dulu").
