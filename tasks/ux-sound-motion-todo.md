# Task List: UX Enhancement — Interaction Sound + Hotspot Choreography

> Referensi: [`ux-sound-motion-plan.md`](./ux-sound-motion-plan.md). Kerjakan berurutan; setiap task diakhiri verifikasi.
> Legend: 🧱 = fondasi, 🔊 = sound, 🎬 = motion, ♿ = a11y, 🧪 = test/QA. Prioritas: **P0** wajib, **P1** penting, **P2** nice-to-have.

---

## Phase 0 — Persiapan

### Task 0.1 🧱 Checkpoint & baseline (P0)
- [ ] `git status` bersih → commit checkpoint `chore: checkpoint before ux sound & motion`.
- [ ] Jalankan `npm test`, `npm run lint`, `npm run build`; catat baseline (test yang sudah gagal dicatat terpisah).

### Task 0.2 🧱 Approval keputusan plan §5 (P0)
- [ ] Exit animation: opsi **A** atau **B**.
- [ ] Sumber suara: synth-first / sample.
- [ ] Default SFX ON/OFF.
- [ ] Catat keputusan di `.agent/notes.md`.

### Task 0.3 🧱 Pecah stage yang akan disentuh (P0, refactor terbatas)
- [ ] Ekstrak render trophy → `src/assets/desk/stages/TrophyStage.jsx`, buku → `stages/BookStage.jsx` (props sama, tanpa perubahan perilaku).
- [ ] `data-testid`, heading `id="desk-overlay-heading"`, `aria-label` tombol tetap identik.

**Verifikasi:** test suite sama persis dengan baseline; tampilan tidak berubah.

---

## Phase 1 — Sound Engine (fondasi) 🔊

### Task 1.1 🔊 `sfxCatalog.js` (P0)
- [ ] Data murni: nama cue → resep (`type: tone|noise|chord|sample`, freq, durasi, envelope, gain, filter).
- [ ] Isi semua cue dari plan §3.3 + pitch map pentatonik per hotspot.

### Task 1.2 🔊 `sfxEngine.js` (P0)
- [ ] `createSfxEngine()` → `unlock()`, `play(name, { pitch, gain, when })`, `setEnabled()`, `setVolume()`, `cleanup()`.
- [ ] Noise buffer dibuat sekali & di-reuse; node di-stop + disconnect setelah envelope.
- [ ] Throttle per cue (hover 90ms), max polyphony 8.
- [ ] No-op aman tanpa `AudioContext` (jsdom) dan saat belum di-unlock.
- [ ] Fungsi `duck(ms, db)` untuk menurunkan musik ambient (hook kecil ke `ambientAudio.setLevel`).

### Task 1.3 🔊 `SfxProvider` + `useSfx()` (P0)
- [ ] Context di `src/main.jsx`/`App.jsx`; preferensi `localStorage` (`bagas.sfx.enabled`, `bagas.sfx.volume`) dengan try/catch (private mode).
- [ ] Unlock dipanggil di `handleEnterRoom` (klik pintu / Enter) dan di pointerdown pertama sebagai fallback.

### Task 1.4 🧪 Test engine (P0)
- [ ] Unit: catalog valid (semua cue punya resep lengkap, gain ≤ batas, durasi ≤ 1.5s).
- [ ] Unit: engine no-op tanpa AudioContext; disabled → tidak membuat node; throttle bekerja (mock AudioContext + fake timers).

**Verifikasi:** `npm test` hijau; demo manual cepat lewat tombol sementara di dev (dihapus setelahnya).

---

## Phase 2 — Wiring Suara ke Semua Interaksi 🔊

### Task 2.1 🔊 Kontrol SFX di UI (P0)
- [ ] Tombol **SFX on/off** di sebelah tombol Musik Syahdu, `aria-pressed` + accessible name jelas.
- [ ] (P2) Shortcut `M` mute semua — jangan bentrok dengan hotkey 1–6/ESC/Enter dan input fields.

### Task 2.2 🔊 Room & pintu (P0)
- [ ] Hover/focus hotspot + dock → `ui.hover` pitch-mapped (skip di `pointer: coarse`).
- [ ] Klik hotspot → cue pembuka hotspot (sementara cue tunggal; disinkron ulang di Phase 4).
- [ ] Pintu: `door.handle` (hover), `door.open` (klik/Enter).
- [ ] Musik: `music.needle` / `music.tapeStop`; Pins toggle: `ui.toggleOn/Off`.

### Task 2.3 🔊 Di dalam stage (P0)
- [ ] Close/ESC/Back to Room → `ui.close`.
- [ ] Monitor: filter kategori `ui.toggleOn`, pilih project `monitor.select`, back `monitor.back`, maximize/restore, open full page `monitor.dive`.
- [ ] Phone: copy email `ui.success` (gagal → `ui.error`), link sosial `ui.pop`.
- [ ] Documents: tab `docs.paperSlide`, download `docs.stamp`, open new tab `ui.pop`.
- [ ] Trophy: klik sertifikat `ui.pop`.

### Task 2.4 🔊 Di luar desk (P1)
- [ ] Navbar link & route change → `nav.whoosh`; ProjectDetail tombol/tab → `ui.press`.

### Task 2.5 🧪 Test wiring (P0)
- [ ] Mock `useSfx` → assert cue yang benar dipanggil untuk: klik hotspot, ESC, copy email, toggle musik, hover (desktop) / tidak hover (coarse).
- [ ] Assert tidak ada `play` yang efektif sebelum unlock.

### Task 2.6 🧪 Listening pass (P0)
- [ ] Dengarkan semua cue berurutan di Chrome + Firefox, headphone & speaker laptop; tuning gain/durasi di catalog.
- [ ] Putuskan: page flip & door creak tetap synth atau ganti sample CC0 (kalau ganti → task tambahan lazy-load `public/sfx/`).

**Verifikasi:** semua interaksi bunyi, mute persist setelah reload, test hijau.

---

## Phase 3 — Fondasi Choreography 🎬

### Task 3.1 🎬 `stageTimelines.js` (P0)
- [ ] Data fase per hotspot `{ phase, at, sfx }` untuk 6 hotspot (+ `closing` jika opsi B).
- [ ] Total intro ≤ 1500ms, exit ≤ 300ms.

### Task 3.2 🎬 `useStageChoreography(openStageId)` (P0)
- [ ] Output `phase`; dialog dapat `data-stage-phase`.
- [ ] Trigger SFX per fase; `duck` musik untuk cue signature.
- [ ] Interruptible: ganti hotspot / ESC / unmount → clear semua timer.
- [ ] Skip-on-click saat intro → lompat ke `settled`.
- [ ] `prefers-reduced-motion` (via `matchMedia`, reaktif) → langsung `settled`.
- [ ] Dialog tetap render sinkron saat `openStageId` berubah.

### Task 3.3 ♿ Focus management (P0)
- [ ] Fokus ke tombol close/heading saat fase `open` (langsung jika reduced motion); kembalikan fokus ke hotspot asal setelah close.
- [ ] Konten yang masih transparan selama intro diberi `inert` sampai `open` (cek dukungan; fallback `aria-hidden` pada layer dekoratif saja).

### Task 3.4 🎬 Exit animation (P0, sesuai keputusan 0.2)
- [ ] **Opsi B:** state `closingStageId` 220–300ms sebelum unmount; update test close pakai `waitForElementToBeRemoved`/fake timers.
- [ ] **Opsi A:** objek di room "kembali" (settle bounce) + `ui.close`, dialog tetap unmount instan.

### Task 3.5 🧪 Test hook (P0)
- [ ] Fake timers: urutan fase benar, SFX dipanggil di waktu yang benar, cancel saat interrupt, reduced motion skip, skip-on-click.

**Verifikasi:** test hijau; belum ada perubahan visual signifikan.

---

## Phase 4 — Choreography Trophy & Buku (permintaan utama) 🎬

### Task 4.1 🎬 Trophy: struktur (P0)
- [ ] Pisah card shell ke layer `.stage-card-shell` (`::before`) agar bisa fade/clip terpisah dari trophy.
- [ ] Tambah layer dekoratif `aria-hidden`: conic rays, 8–12 sparkle, flash.

### Task 4.2 🎬 Trophy: FLIP center → kiri (P0)
- [ ] `useLayoutEffect` ukur slot `.stage-trophy-hero` vs pusat overlay → CSS var `--flip-x/--flip-y/--flip-scale`; re-measure saat resize.
- [ ] Fase `intro` (0–750ms): trophy besar di tengah, ignite glow + rays + `trophy.ignite`.
- [ ] Fase `slide` (750–1350ms): trophy ke slot kiri sambil mengecil + `trophy.slide`.
- [ ] Bersamaan: panel kanan `clip-path` reveal kiri→kanan, shell fade-in.
- [ ] Kartu achievement + 7 sertifikat stagger 60ms + `trophy.cardDeal` (gain kecil).
- [ ] `settled`: `trophyGoldenAura` loop (sudah ada).
- [ ] Mobile 1 kolom: verifikasi FLIP jadi "slide ke atas".

### Task 4.3 🎬 Buku: struktur 3D (P0)
- [ ] `.book-stage` (perspective) → `.book` (preserve-3d) → `.book-cover` (front: judul "What I Do" + spine, back: endpaper) → `.book-leaf` ×3 → `.book-spread` (konten asli).
- [ ] Scroll hanya di dalam page; wrapper 3D tanpa overflow.

### Task 4.4 🎬 Buku: sequence (P0)
- [ ] `slide` (0–500ms): buku tertutup dari titik `cameraZoom` hotspot ke tengah + `book.slide`.
- [ ] `coverOpen` (500–950ms): cover `rotateY(0 → -180deg)` di engsel kiri + `book.coverOpen`.
- [ ] `pages` (950–1450ms): 3 leaf flip stagger 130ms, tiap lembar `book.pageFlip` dengan variasi pitch.
- [ ] `open`: konten spread fade-in, item skill stagger.
- [ ] Close: cover menutup 300ms + `book.close` (jika opsi B).
- [ ] Mobile < md: 1 halaman, 2 leaf.

### Task 4.5 🎬 Buku: navigasi halaman (P2)
- [ ] Spread 1 = What I Do, spread 2 = Toolbelt; tombol `‹ ›` (accessible name) + arrow key; animasi flip + suara.

### Task 4.6 🧪 Verifikasi Trophy & Buku (P0)
- [ ] Test: dialog tetap ada sinkron; `data-stage-phase` berjalan sesuai timeline (fake timers); close berfungsi.
- [ ] Manual: Chrome DevTools Performance recording kedua animasi (≥ 55fps, no long task > 50ms); screenshot/GIF di catatan PR.

---

## Phase 5 — Choreography Hotspot Lain 🎬

### Task 5.1 🎬 Monitor CRT (P1)
- [ ] Power-on: garis horizontal → flash → scanline → boot text → card stagger; cue `monitor.powerOn`.
- [ ] Power-off saat close; cue `monitor.powerOff`.
- [ ] (P2) Card → detail pakai `document.startViewTransition` dengan fallback crossfade.

### Task 5.2 🎬 Phone (P1)
- [ ] Lift dari stand → wake → lock screen jam real-time → swipe-up unlock → ikon pop spring; cue `phone.lift/buzz/unlock/appPop`.
- [ ] Copy email: ripple + checkmark + toast + `navigator.vibrate(10)` bila tersedia.

### Task 5.3 🎬 Name Tag (P1)
- [ ] Drop + damped pendulum swing → flip → slide kiri, panel bio terbuka kanan; cue `tag.swing/flip`.

### Task 5.4 🎬 Documents (P1)
- [ ] Map keluar laci → flap terbuka → 3 kertas fan-out → viewer; tab = kertas geser; download = stempel; cue `docs.*`.

### Task 5.5 🎬 Pintu & room micro (P2)
- [ ] Gagang hover, light spill, camera dolly saat masuk.
- [ ] Hover hotspot: lift + glow + pin pulse, hotspot lain dim.
- [ ] Tombol press `scale(.97)`, progress bar loading iframe dokumen.

**Verifikasi tiap task:** test terkait hijau + cek manual desktop & mobile.

---

## Phase 6 — Accessibility, Performa & QA 🧪

### Task 6.1 ♿ Reduced motion (P0)
- [ ] Update blok `@media (prefers-reduced-motion: reduce)` di `desk.css` untuk semua class baru (rays, sparkle, leaf, cover, CRT, pendulum).
- [ ] Test: dengan `matchMedia` reduce → fase langsung `settled`.

### Task 6.2 ♿ Invariant & a11y (P0)
- [ ] Semua tombol baru punya accessible name; heading tidak lompat; satu `<h1>` per route (notes §3).
- [ ] Layer dekoratif `aria-hidden`; tidak ada informasi yang hanya lewat suara.
- [ ] Keyboard-only walkthrough: 1–6, ESC, Tab order, fokus kembali ke hotspot.

### Task 6.3 🧪 Performa (P0)
- [ ] Profiling Chrome Performance (CPU 4× throttle) untuk 6 stage; catat fps & long task.
- [ ] Cek tidak ada AudioContext/timer leak setelah buka-tutup 20× (Memory panel).

### Task 6.4 🧪 Cross-browser & device (P0)
- [ ] Chrome, Firefox, Edge desktop; 1 Android / iOS Safari (autoplay unlock, vibrate, 3D transform).

### Task 6.5 🧪 Final gate (P0)
- [ ] `npm test`, `npm run lint`, `npm run build` hijau.
- [ ] Update `.agent/notes.md` (arsitektur SFX, timeline, keputusan exit animation).
- [ ] Commit per phase dengan pesan konvensional (`feat(sfx): …`, `feat(motion): …`).

---

## Ringkasan Urutan & Estimasi Kasar

| Phase | Isi | Estimasi |
|---|---|---|
| 0 | Checkpoint, approval, ekstraksi stage | 0.5 hari |
| 1 | Sound engine + test | 1 hari |
| 2 | Wiring suara semua interaksi + listening pass | 1 hari |
| 3 | Fondasi choreography + focus + exit | 1 hari |
| 4 | **Trophy & Buku** | 1.5 hari |
| 5 | Monitor, Phone, Name Tag, Documents, micro | 2 hari |
| 6 | A11y, performa, cross-browser, final gate | 0.5–1 hari |

