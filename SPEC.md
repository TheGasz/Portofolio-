# Spec: Portfolio Holistic Refinement & Motion Polish ("Lab Notebook" Edition)

## 1. Objective

Refine and elevate Bagas Adjie Pamungkas's personal Data Science & Data Engineering portfolio (`d:\Bagas\Portofolio\Portofolio`) across **navigation ergonomics, scroll-driven micro-interactions, content credibility, discovery UX, and brand metadata**—while strictly preserving the "Lab Notebook" aesthetic (`paper`, `ink`, `signal`, `marker`) and maintaining 100% compatibility with the existing Vitest + `fast-check` property-based test suite.

### Scope of Refinements (All 11 Selected Items)

1. **Smooth Sliding Pill Indicator in Navbar (`Navbar.jsx`)**
   - Replace the abrupt active-background swap between `Home` (`/`) and `Projects` (`/project`) with a continuous, hardware-accelerated sliding capsule indicator (`bg-ink`) that smoothly glides (`translateX` + `width`) between active navigation items, while hiding gracefully on unknown routes.
2. **Subtle Scroll-Reveal Choreography Across Home & Projects (`core.jsx`, `project.jsx`, `useScrollReveal.js`)**
   - Extend the existing `useScrollReveal` (`IntersectionObserver` + `.reveal` / `.reveal-visible`) beyond `ProjectCard` to cover:
     - Home `SectionHeader` blocks (`01 / Skills`, `02 / Credentials`, `03 / About`, `04 / Contact`)
     - Staggered reveal on `SkillsSection` cards (`0ms`, `100ms`, `200ms`...)
     - Staggered reveal on `CertificationsSection` ledger rows
     - `About me` narrative + facts column
     - `Contact` section content
     - `Projects` page header (`Featured Works` + total project counter + `Selected Projects` divider)
3. **Route Scroll Restoration & Page Enter Transition (`App.jsx`, `index.css`)**
   - Automatically reset scroll position to `(0, 0)` on route pathname changes (`/` ↔ `/project`) unless navigating to an in-page hash (`#contact`), paired with a subtle compositor-safe page entrance transition (`.page-transition`).
4. **Home "Featured Works" Preview Section (`core.jsx`, `project.jsx`)**
   - Export `projectsData` (and top featured projects) from `src/assets/project.jsx` and add a curated 3-card **"Selected Works" (`02 / Featured Works`)** preview section on `Home` (`core.jsx`) with a direct CTA to `/project`, ensuring visitors who scroll down `Home` see concrete project proof before reaching `Contact`. (Renumber subsequent Home sections cleanly: `01 / Skills`, `02 / Featured Works`, `03 / Credentials`, `04 / About`, `05 / Contact`).
5. **Interactive Category Filter Pills on `/project` (`project.jsx`)**
   - Add domain category metadata to `projectsData` (`"All"`, `"GenAI & Agents"`, `"Computer Vision"`, `"Time-Series & Geo"`, `"Tabular & ML"`) and render an accessible filter bar with a sliding active pill indicator on `/project`, updating the displayed `ProjectGrid` and project count dynamically.
6. **Highlighter Sweep (`.marker-sweep`) & Hero Polaroid Entrance (`index.css`, `core.jsx`)**
   - Animate the `.marker` yellow highlighter background from `0%` to `100%` width when revealed in the viewport, and add a staggered entrance (`animate-fade-in-up animation-delay-400`) to the Hero Polaroid figure so the right column matches the left column's choreography.
7. **Key Impact / Metric Badge on `ProjectCard` (`project.jsx`)**
   - Surface each project's headline quantitative outcome (e.g., `"0.98 macro-F1 · 30/30 traps caught"`, `"0% false auto-approve"`, `"0.987 PR-AUC · <25ms p95"`, `"0.9962 F1 (Satria Data)"`) as a crisp `font-mono` impact badge inside `ProjectCard` so recruiters grasp project impact in under 2 seconds.
8. **Quick "Copy Email" Button with Live Feedback in Contact Section (`core.jsx`)**
   - Add a keyboard-accessible **"Copy email"** button next to the `mailto:` CTA in `#contact` that copies `siteConfig.contactEmail` to the clipboard and shows a 2-second `"Copied!"` confirmation state (`aria-live="polite"`).
9. **Complete & Verified Certificate Metadata + 7th Certificate (`core.jsx`, `public/certificates/`)**
   - Replace all `TODO` issuer strings and blank `date: ""` fields in `certifications` (`core.jsx`) using the verified OCR data from the official PDF certificates:
     - `Pelatihan Data Science` → Issuer: `"Divisi Workshop KMTETI FT UGM"`, Date: `"Nov 2025"`
     - `Cleaning Data in Python` → Issuer: `"DataCamp"`, Date: `"Sep 2026"`
     - `Exploratory Data Analysis in Python` → Issuer: `"DataCamp"`, Date: `"Sep 2026"`
     - `Dimensionality Reduction in Python` → Issuer: `"DataCamp"`, Date: `"Sep 2026"`
     - `1st Runner Up — Final Project Bootcamp TETI AI` (Juara 2 AI) → Issuer: `"Divisi Workshop KMTETI FT UGM"`, Date: `"Jul 2025"`
     - Copy `src/assets/Sertifikat/SERTIF JUARA MOBDEV.pdf` to `public/certificates/juara-2-mobdev.pdf` and register it in `certifications` (`1st Runner Up — Final Project Bootcamp TETI Mobile Dev`, Issuer: `"Divisi Workshop KMTETI FT UGM"`, Date: `"Jul 2026"`, Icon: `"trophy"`).
     - `AWS Academy Graduate — Cloud Web Application Builder` → Issuer: `"AWS Academy (Credly)"`, Date: `"Oct 2026"`
10. **On-Brand Monogram `"b"` Favicon & SEO/OpenGraph Metadata (`index.html`, `public/favicon.svg`)**
    - Create `public/favicon.svg` matching the Navbar's `"b"` italic serif monogram on an `#17150f` (`ink`) circle with `#f3efe6` (`paper`) glyph, replace `/vite.svg` in `index.html`, and add `<meta name="description">` and OpenGraph tags.

---

## 2. Mandatory UI/UX Skills Enforcement

When executing any task in this specification, the implementer **MUST** actively apply and adhere to the following global and workspace UI/UX skills:

1. **`ui-ux-pro-max`** (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`)
   - Priority 1 (Accessibility): WCAG AA contrast (4.5:1 body, 3:1 large text), visible `focus-ring`, non-empty accessible names on all links/buttons, `prefers-reduced-motion: reduce` fallbacks.
   - Priority 2 (Touch & Interaction): Minimum `44×44px` tap targets (`min-h-[44px] min-w-[44px]`), immediate feedback on click/hover/copy.
   - Priority 3 & 7 (Performance & Animation): Animate **only** compositor-safe properties (`transform`, `opacity`, `background-position`, `background-size`, `stroke-dashoffset`). Never animate layout properties (`top`, `left`, `margin`, `padding`, `height`) that trigger layout thrashing.
2. **`frontend-ui-engineering`** (`C:\Users\bagas\.gemini\config\skills\frontend-ui-engineering\SKILL.md`)
   - Strict adherence to the existing "Lab Notebook" design system (`bg-paper`, `bg-paper-2`, `bg-card`, `text-ink`, `text-ink-soft`, `text-muted`, `text-signal`, `bg-marker`). Zero generic AI purple/indigo gradients on visible UI surfaces.
3. **`ui-styling`** (`C:\Users\bagas\.gemini\config\skills\ui-styling\SKILL.md`)
   - Mobile-first Tailwind v4 utility classes (`sm:`, `md:`, `lg:`), consistent border radii (`rounded-2xl` for cards, `rounded-full` for pills/tags, `rounded-xl` for primary CTAs) and hard-offset ink/signal shadows.
4. **`web-design-guidelines`** (`C:\Users\bagas\.gemini\config\skills\web-design-guidelines\SKILL.md`) & **`vercel-react-best-practices`** (`C:\Users\bagas\.gemini\config\skills\react-best-practices\SKILL.md`)
   - Clean React 19 state/effect patterns, stable list keys, semantic HTML landmarks (`<nav>`, `<main>`, `<header>`, `<section>`, `<figure>`), and strict heading order (`h1` → `h2` → `h3`).
5. **Workspace Skills** (`.kiro/skills/ux-design/SKILL.md` & `.kiro/skills/visual-design/SKILL.md`)
   - Preserve warm first-person voice, 3-second primary action clarity, and scannable hierarchy.

---

## 3. Tech Stack & Commands

- **Framework:** React 19 (`^19.0.0`), React Router DOM 7 (`^7.8.2`)
- **Build Tool:** Vite 6 (`^6.2.0`)
- **Styling:** Tailwind CSS 4 (`^4.0.15` via `@tailwindcss/vite`)
- **Testing:** Vitest 4 (`^4.1.11`), `@testing-library/react` (`^16.3.3`), `@testing-library/user-event` (`^14.6.7`), `fast-check` (`^4.10.2`), `jsdom` (`^29.1.1`)

### Executable Commands
```bash
# Run full unit + property-based test suite
npm test

# Run specific test file
npx vitest run src/assets/Navbar.unit.test.jsx

# Run linter
npm run lint

# Build production bundle
npm run build

# Start development server
npm run dev
```

---

## 4. Project Structure

```text
.
├── index.html                  # App entry HTML, favicon, meta description & OG tags
├── public/
│   ├── favicon.svg             # Lab-notebook "b" monogram SVG icon
│   └── certificates/           # Static PDF certificates served at /certificates/*.pdf
├── src/
│   ├── main.jsx                # React root bootstrap
│   ├── App.jsx                 # Router, ScrollToTop / route transition wrapper, Header, Routes, Footer
│   ├── index.css               # Tailwind v4 @theme tokens, motion keyframes, .reveal, .marker, .focus-ring
│   ├── assets/
│   │   ├── Navbar.jsx          # Fixed top navigation with sliding active capsule
│   │   ├── core.jsx            # Home page (Hero, Marquee, Skills, Featured Works Preview, Certifications, About, Contact)
│   │   ├── project.jsx         # Projects page (Header, Category Filter Pills, ProjectGrid, ProjectCard, projectsData)
│   │   ├── projectCovers.js    # Data-URI SVG covers for project cards
│   │   ├── icons.jsx           # Line-art SVG icon dictionary
│   │   ├── useScrollReveal.js  # IntersectionObserver one-shot reveal hook
│   │   ├── usePointerTilt.js   # Fine-pointer 3D card tilt hook
│   │   ├── url.js              # HTTP(S) URL validator
│   │   └── *.test.{js,jsx}     # Colocated unit and property-based tests
│   └── test/
│       ├── design-tokens.test.js
│       ├── motion-primitives.test.js
│       ├── smoke.test.jsx
│       └── structure.test.js
├── SPEC.md                     # This specification document
└── tasks/
    ├── plan.md                 # Technical implementation plan
    └── todo.md                 # Ordered task checklist with checkpoints
```

---

## 5. Code Style & Existing Test Invariants

### Code Style Example
```jsx
// Named + Default export convention in src/assets/*.jsx
export const RevealBlock = ({ delayMs = 0, className = "", children }) => {
  const { ref, revealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal${revealed ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
};
```

### Non-Negotiable Test Invariants (Must Never Break)
1. **`Navbar.property.test.jsx`**:
   - Active `<Link>` must retain `aria-current="page"` and classes `text-blue-600` and `font-bold`. Inactive `<Link>` must omit all three.
2. **`heading-structure.glowup.property.test.jsx`**:
   - Both `Core` (`/`) and `Projects` (`/project`) must render **exactly one `<h1>`** and never skip a heading level (`h1` → `h2` → `h3`).
3. **`accessible-names.glowup.property.test.jsx`**:
   - Every rendered `<a href>` and `<button>` on `Core` and `Projects` must have a non-empty accessible name.
4. **`ProjectCard.structure.glowup.unit.test.jsx` & `ProjectCard.reveal-content.property.test.jsx`**:
   - Inside `ProjectCard`:
     - Only the project title may use `<h3>`.
     - Only technology tags (`tech`) may carry the `shimmer-pill` class (`span.shimmer-pill`).
     - Outer wrapper keeps `.reveal`; inner card keeps `.card-tilt` and `.group`.
5. **`motion-primitives.test.js`**:
   - In `src/index.css`, `.reveal` may only declare `opacity`, `transform`, and `transition` (referencing only `transform` and `opacity`). `.reveal-visible` may only declare `opacity` and `transform`. Any new CSS animations (e.g. `.marker-sweep`, `.page-enter`) must live in their own distinct selectors.

---

## 6. Testing Strategy

- **Framework:** Vitest + React Testing Library + `fast-check` under `jsdom`.
- **Unit Tests:** Verify new interactive behaviors:
  - Sliding pill indicator presence and active index/position states in `Navbar.unit.test.jsx`.
  - Scroll-reveal classes applied across `Core` and `Projects` sections.
  - Category filter pill selection, filtered card counts, and `"All"` reset in `Projects.unit.test.jsx`.
  - Impact metric badge rendering in `ProjectCard`.
  - Copy-email button clipboard interaction and `"Copied!"` status feedback in `core.unit.test.jsx`.
  - Verified certificate metadata (no `"TODO"` strings, all 7 certificates have non-empty `issuer` and `date`) in `core.content.test.js`.
- **Property-Based Regression Suite:** All existing `*.property.test.{js,jsx}` and `src/test/*.test.{js,jsx}` suites must pass 100%.

---

## 7. Boundaries

- **Always do:**
  - Consult and apply `ui-ux-pro-max` and the global/workspace UI/UX skills before modifying any component or stylesheet.
  - Run `npm test`, `npm run lint`, and `npm run build` after each task to confirm zero regressions.
  - Respect `prefers-reduced-motion: reduce` on every new animation or transition.
  - Ensure all new interactive controls have `focus-ring` and `min-h-[44px]`.
- **Ask first:**
  - Adding any new npm dependencies to `package.json` (none should be needed; everything can be built cleanly with React 19 + Tailwind v4).
  - Deleting any existing files or existing test suites.
- **Never do:**
  - Alter or weaken existing property-based test assertions to force a failing test to pass.
  - Introduce generic AI purple/blue neon styling onto visible surfaces (keep the warm Lab Notebook palette).
  - Use array indices as React keys on dynamic/filtered project lists (always use `project.id`).

---

## 8. Success Criteria

- [ ] **SC-1 (Navbar Sliding Pill):** Navigating between `/` and `/project` animates a sliding `bg-ink` pill smoothly (`duration-300`) behind the active link; unknown routes hide the pill; `Navbar.property.test.jsx` passes.
- [ ] **SC-2 (Scroll-Reveal Choreography):** `Core` sections (`Skills`, `Featured Works`, `Certifications`, `About`, `Contact`) and `Projects` header use `useScrollReveal` with subtle staggered delays (`<= 1000ms` total) and instant visibility under `prefers-reduced-motion: reduce`.
- [ ] **SC-3 (Scroll Restoration & Page Transition):** Changing routes scrolls the window to `(0, 0)` (when no hash is present) and plays a subtle `.page-enter` animation.
- [ ] **SC-4 (Home Featured Works Preview):** `Home` renders a `02 / Featured Works` section showcasing 3 flagship projects with a `"View All 11 Projects"` link to `/project`, maintaining strict `h1 → h2 → h3` heading order.
- [ ] **SC-5 (Projects Category Filter):** `/project` renders accessible filter buttons (`All`, `GenAI & Agents`, `Computer Vision`, `Time-Series & Geo`, `Tabular & ML`) with `aria-pressed`, dynamically filtering the grid without breaking `ProjectGrid` tests.
- [ ] **SC-6 (Highlighter Sweep & Hero Polaroid):** `.marker` elements sweep in smoothly on reveal, and the Hero Polaroid portrait animates in with `animate-fade-in-up`.
- [ ] **SC-7 (ProjectCard Metric Badge):** All 11 entries in `projectsData` include a concise `metric` string rendered as a mono badge on `ProjectCard` without altering `span.shimmer-pill` or `<h3>` counts.
- [ ] **SC-8 (Copy Email UX):** Clicking `"Copy email"` in `#contact` copies `bagasadjie2006@gmail.com` and displays `"Copied!"` feedback.
- [ ] **SC-9 (Certificates Complete):** All 7 certificates (including `juara-2-mobdev.pdf` copied to `public/certificates/`) have accurate, non-empty `title`, `issuer`, `date`, and `href`, with zero `"TODO"` comments remaining.
- [ ] **SC-10 (Branding & Build):** `public/favicon.svg` and meta tags are wired in `index.html`, and `npm test`, `npm run lint`, and `npm run build` all exit with code `0`.

