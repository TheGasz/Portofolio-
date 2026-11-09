# Project Notes & Conventions (`d:\Bagas\Portofolio\Portofolio`)

## 1. Tech Stack & Commands
- **Framework:** React 19 (`^19.0.0`), React Router DOM 7 (`^7.8.2`), Vite 6 (`^6.2.0`), Tailwind CSS 4 (`@tailwindcss/vite`).
- **Testing:** Vitest 4 (`npm test`), `@testing-library/react`, `@testing-library/user-event`, `fast-check`, `jsdom`.
- **Lint & Build:** `npm run lint`, `npm run build`.

## 2. Design System ("Lab Notebook" × "Anatomy Desk")
- **Color Palette (`src/index.css`):**
  - `--color-paper`: `#f3efe6`
  - `--color-paper-2`: `#e9e3d5`
  - `--color-card`: `#fbf9f4`
  - `--color-ink`: `#17150f`
  - `--color-ink-soft`: `#45413a`
  - `--color-muted`: `#67625a`
  - `--color-signal`: `#d93f12`
  - `--color-marker`: `#ffd84d`
- **Typography:** Bricolage Grotesque (`--font-sans`), Instrument Serif (`--font-serif`), JetBrains Mono (`--font-mono`).

## 3. Non-Negotiable Test Invariants
- **`Navbar.property.test.jsx`**: Active `<Link>` must keep `aria-current="page"`, `text-blue-600`, and `font-bold`.
- **`Hero.glowup.unit.test.jsx` & `heading-structure.glowup.property.test.jsx`**:
  - Both `/` and `/project` must render **exactly one `<h1>`**.
  - On `/`, the single `<h1>` text must be `"Hi, I'm Bagas."` containing `<span class="animated-gradient-text">Bagas</span>`.
  - Heading levels must never skip (`h1` → `h2` → `h3`).
- **`accessible-names.glowup.property.test.jsx`**: Every `<a href>` and `<button>` must have a non-empty accessible name.
- **`motion-primitives.test.js`**: Do not alter `.reveal` or `.reveal-visible` declarations in `src/index.css`.

## 4. Major Redesign Decision: Interactive 3D/Isometric Workstation ("Anatomy Desk")
- **Engine:** `wheresryan22/anatomy` (`kit/iso-kit.mjs`, `kit/lathe.mjs`, `kit/tube.mjs`) vendored into `src/assets/iso/`.
- **5 Interactive Hotspots on the Desk & Wall:**
  1. **Monitor (with PC, Keyboard & Mouse on desk)** → Click navigates to `/project`.
  2. **Wall Photo (`profile.jpg` frame on wall)** → Click opens **About Me Overlay Card** + button to scroll to `#about`.
  3. **Desk Phone (with coiled cord)** → Click opens **Contact Hub Overlay Card** (`mailto:`, Copy Email, LinkedIn, GitHub) + button to scroll to `#contact`.
  4. **Lab Notebook + Pen on desk** → Click opens **Skills Overlay Card** + button to scroll to `#skills`.
  5. **Trophy & Certificates Shelf** → Click opens **Credentials Overlay Card** (7 verified certs) + button to scroll to `#credentials`.
  6. **Career Dossier (Shelf)** → Click opens **Documents Overlay Card** (CV, Portfolio, Resume) + live preview and download.

## 5. UX Sound & Motion Architecture Decisions
- **Sound Engine (`src/assets/audio/sfxEngine.js`):** Pure Web Audio API synthesis (zero external audio file dependencies), harmonized to F-major pentatonic palette matching `ambientAudio.js`.
- **Exit Animation:** Option A (dialog unmounts immediately to preserve synchronous test assertions `not.toBeInTheDocument()`, plays `ui.close`, while room object settles).
- **Default SFX:** ON upon room door entrance / interaction, with dedicated accessible toggle button persisted to `localStorage`.
- **Stage Choreography:** Controlled multi-phase stages via `useStageChoreography` / CSS variables, auto-skipping on reduced-motion or user fast-forward click.


