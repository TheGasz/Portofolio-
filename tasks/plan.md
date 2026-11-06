# Portfolio Holistic Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILLS:
> - Execution workflow: `executing-plans` or `subagent-driven-development` + `test-driven-development` + `verification-before-completion`.
> - **Mandatory UI/UX Skills on EVERY task:** `ui-ux-pro-max` (`C:\Users\bagas\.gemini\config\skills\ui-ux-pro-max\SKILL.md`), `frontend-ui-engineering`, `ui-styling`, `web-design-guidelines`, `vercel-react-best-practices`, and workspace skills `.kiro/skills/ux-design` & `.kiro/skills/visual-design`.

**Goal:** Implement all 11 approved portfolio refinements (smooth sliding Navbar pill, site-wide subtle scroll-reveal choreography, route scroll restoration + page enter transition, Home Featured Works preview, interactive `/project` category filter with sliding pill, `.marker` sweep + Hero Polaroid entrance, `ProjectCard` impact metric badge, Contact copy-email button, complete 7-certificate metadata, and custom `"b"` monogram favicon + SEO metadata) with zero regressions across the Vitest property-based test suite.

**Architecture:** Extend the existing React 19 + Tailwind CSS v4 "Lab Notebook" architecture in-place without adding external runtime dependencies. Shared motion primitives live in `src/index.css` and `src/assets/useScrollReveal.js`; route-level scroll/transition behavior lives in `src/App.jsx`; navigation capsule physics live in `src/assets/Navbar.jsx`; project metadata, badges, and category filtering live in `src/assets/project.jsx`; and Home sections, credentials, Featured Works preview, and Contact copy-email UX live in `src/assets/core.jsx`.

**Tech Stack:** React 19, React Router DOM 7, Tailwind CSS 4 (`@tailwindcss/vite`), Vitest 4, React Testing Library, `fast-check`.

**Spec:** [`SPEC.md`](file:///d:/Bagas/Portofolio/Portofolio/SPEC.md)

## Global Constraints

- **Mandatory UI/UX Skill Usage:** Before coding any UI component or animation, apply `ui-ux-pro-max` (44×44px touch targets, WCAG AA contrast, compositor-only motion, `prefers-reduced-motion` parity), `frontend-ui-engineering` (Lab Notebook design tokens, zero AI-slop gradients), `ui-styling`, `web-design-guidelines`, and `vercel-react-best-practices`.
- **Zero New Dependencies:** Do not add packages to `package.json`.
- **Navbar Active Link Invariant (`Navbar.property.test.jsx`):** The active `<Link>` must keep `aria-current="page"`, `text-blue-600`, and `font-bold`; inactive links must omit all three.
- **Heading Hierarchy Invariant (`heading-structure.glowup.property.test.jsx`):** Both `Core` and `Projects` must render **exactly one `<h1>`** and never skip heading levels (`h1` → `h2` → `h3`).
- **Accessible Name Invariant (`accessible-names.glowup.property.test.jsx`):** Every `<a href>` and `<button>` on `Core` and `Projects` must compute a non-empty accessible name.
- **ProjectCard DOM Invariant (`ProjectCard.structure.glowup.unit.test.jsx` & `ProjectCard.reveal-content.property.test.jsx`):** Inside `ProjectCard`, only the title uses `<h3>`, and only `tech` tags carry `span.shimmer-pill`.
- **CSS Motion Rule Invariant (`src/test/motion-primitives.test.js`):** In `src/index.css`, `.reveal` may only declare `opacity`, `transform`, and `transition` (referencing only `transform`/`opacity`); `.reveal-visible` may only declare `opacity` and `transform`. New CSS animations must use separate class names (`.marker-sweep`, `.page-enter`).

## Review Focus

1. **Unknown Route in `Navbar.jsx`:** When `location.pathname` is neither `"/"` nor `"/project"` (tested by `fast-check` in `Navbar.property.test.jsx`), neither link is active and the sliding pill indicator must collapse/hide (`opacity-0 scale-95`) without throwing or marking any link active.
2. **`ProjectCard` Selector Collision:** Adding a `metric` or `category` badge inside `ProjectCard` must NOT use `<h3>` or `span.shimmer-pill`, or `ProjectCard.reveal-content.property.test.jsx` will fail its exact count assertions.
3. **`window.scrollTo` in `jsdom`:** `jsdom` does not implement `window.scrollTo` by default (or logs not-implemented warnings). Guard `window.scrollTo` calls in `App.jsx` with `typeof window !== "undefined" && typeof window.scrollTo === "function"` inside a `try/catch` (or mock-friendly check) so unit/property tests never throw or spam console errors.
4. **Clipboard API in `jsdom` / Older Browsers:** `navigator.clipboard?.writeText` may be undefined or reject in non-secure contexts; handle both success and fallback gracefully without unhandled promise rejections.
5. **Reduced Motion Parity:** Every new CSS keyframe or transition (`.page-enter`, `.marker-sweep`, sliding pill) must resolve to its resting readable state under `@media (prefers-reduced-motion: reduce)`.

---

## Dependency Graph

```text
Task 1: Brand Assets, Favicon, SEO & 7th Certificate Static File (index.html, public/)
   │
Task 2: CSS Motion Primitives & RevealBlock Helper (src/index.css, src/assets/useScrollReveal.js)
   │
   ├──► Task 3: Smooth Sliding Navbar Pill + Route Scroll Restoration & Page Enter (Navbar.jsx, App.jsx)
   │
   └──► Task 4: Projects Data Enrichment (Metrics + Categories), ProjectCard Badge & Category Filter Bar (project.jsx)
           │
           └──► Task 5: Home Page Refinements — Verified Certificates, Scroll-Reveal Choreography, Featured Works Preview & Copy Email UX (core.jsx)
                   │
                   └──► Task 6: Full Regression, Lint, Build & UI/UX Pro Max Audit
```

---

### Task 1: Brand Favicon, SEO Metadata & Static Certificate Asset

**Files:**
- Create: `public/favicon.svg`
- Copy: `src/assets/Sertifikat/SERTIF JUARA MOBDEV.pdf` → `public/certificates/juara-2-mobdev.pdf`
- Modify: `index.html:1-20`
- Test: `src/test/structure.test.js`

**Interfaces:**
- Produces: Static asset `/favicon.svg`, static asset `/certificates/juara-2-mobdev.pdf`, updated `index.html` head metadata.

- [ ] **Step 1: Write the failing test in `src/test/structure.test.js`**
  Assert that `index.html` references `/favicon.svg` and includes a non-empty `<meta name="description">`, and that `public/favicon.svg` and `public/certificates/juara-2-mobdev.pdf` exist on disk.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/test/structure.test.js`
  Expected: FAIL (`index.html` still points to `/vite.svg`, `public/favicon.svg` does not exist).

- [ ] **Step 3: Create `public/favicon.svg`, copy `juara-2-mobdev.pdf`, and update `index.html`**
  - Create `public/favicon.svg` with a 64×64 viewBox `#17150f` (`ink`) rounded circle, `#d93f12` (`signal`) accent dot, and `#f3efe6` (`paper`) italic serif `"b"` monogram.
  - Copy `src/assets/Sertifikat/SERTIF JUARA MOBDEV.pdf` to `public/certificates/juara-2-mobdev.pdf`.
  - Update `index.html` to link `/favicon.svg` and include `<meta name="description">` + OpenGraph tags (`og:title`, `og:description`, `og:type`).

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/test/structure.test.js`
  Expected: PASS

---

### Task 2: CSS Motion Primitives (`.page-enter`, `.marker-sweep`) & `Reveal` Component Helper

**Files:**
- Modify: `src/index.css:50-211`
- Modify: `src/assets/useScrollReveal.js:1-86`
- Test: `src/test/motion-primitives.test.js`

**Interfaces:**
- Consumes: Existing `useScrollReveal` hook in `src/assets/useScrollReveal.js`.
- Produces:
  - CSS classes `.page-enter` (subtle `fadeInUp` 350ms route entrance) and `.marker` sweep transition on `.reveal-visible` in `src/index.css` (without modifying `.reveal` or `.reveal-visible` rule declarations).
  - Named export `Reveal` component in `src/assets/useScrollReveal.js`:
    `export const Reveal = ({ as: Tag = "div", delayMs = 0, threshold = 0.12, className = "", children, ...rest })`

- [ ] **Step 1: Write the failing test in `src/test/motion-primitives.test.js` and `src/assets/useScrollReveal.unit.test.jsx`**
  Assert `.page-enter` exists with a `prefers-reduced-motion: reduce` override in `src/index.css`, and that `<Reveal delayMs={120}>` renders a `.reveal` element with `transitionDelay: "120ms"`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/test/motion-primitives.test.js src/assets/useScrollReveal.unit.test.jsx`
  Expected: FAIL (`Reveal` not exported, `.page-enter` not found).

- [ ] **Step 3: Implement `.page-enter` in `src/index.css` and `Reveal` in `src/assets/useScrollReveal.js`**
  Keep `.reveal` and `.reveal-visible` declarations untouched so `motion-primitives.test.js` continues to pass. Add `.page-enter` and reduced-motion override. Export `Reveal` wrapper in `src/assets/useScrollReveal.js`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/test/motion-primitives.test.js src/assets/useScrollReveal.unit.test.jsx`
  Expected: PASS

---

### Task 3: Smooth Sliding Navbar Pill Indicator & Route Scroll/Transition in `App.jsx`

**Files:**
- Modify: `src/assets/Navbar.jsx:1-61`
- Modify: `src/App.jsx:1-31`
- Test: `src/assets/Navbar.unit.test.jsx`, `src/assets/Navbar.property.test.jsx`

**Interfaces:**
- Consumes: `useLocation` from `react-router-dom`.
- Produces:
  - `Header` in `src/assets/Navbar.jsx` with a 2-column equal-width pill track (`grid grid-cols-2 relative`) and an `aria-hidden="true"` sliding `bg-ink` capsule (`data-testid="nav-sliding-pill"`) that translates `translate-x-0` for `/` and `translate-x-full` for `/project` with `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`, or `opacity-0 scale-95` on unknown routes.
  - `RouteEffects` / page-transition wrapper in `src/App.jsx` that resets scroll to `(0, 0)` on pathname change (when no `location.hash` is set) and keys the route container by `location.pathname` with `.page-enter`.

- [ ] **Step 1: Write the failing test in `src/assets/Navbar.unit.test.jsx`**
  Assert that `data-testid="nav-sliding-pill"` renders inside the nav pill container, has `translate-x-0` and `opacity-100` on `"/"`, switches to `translate-x-full` and `opacity-100` on `"/project"`, and has `opacity-0` on `"/unknown"`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/assets/Navbar.unit.test.jsx src/assets/Navbar.property.test.jsx`
  Expected: FAIL (`nav-sliding-pill` not found).

- [ ] **Step 3: Implement sliding pill in `src/assets/Navbar.jsx` and route transition/scroll reset in `src/App.jsx`**
  Preserve `text-blue-600 font-bold` and `aria-current="page"` on the active `<Link>`. Guard `window.scrollTo(0, 0)` safely for `jsdom`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/assets/Navbar.unit.test.jsx src/assets/Navbar.property.test.jsx`
  Expected: PASS

---

### Task 4: Projects Enrichment (Impact Metric Badges, Interactive Category Filter & Header Reveal)

**Files:**
- Modify: `src/assets/project.jsx:1-319`
- Test: `src/assets/Projects.unit.test.jsx`, `src/assets/ProjectCard.structure.glowup.unit.test.jsx`, `src/assets/ProjectCard.reveal-content.property.test.jsx`

**Interfaces:**
- Consumes: `Reveal`, `useScrollReveal` from `src/assets/useScrollReveal.js`.
- Produces:
  - Named export `projectsData` and `PROJECT_CATEGORIES = ["All", "GenAI & Agents", "Computer Vision", "Time-Series & Geo", "Tabular & ML"]` from `src/assets/project.jsx` (while keeping `const projectsData = [` at module top-level so `src/test/structure.test.js` regex `^[ \t]*const\s+projectsData\s*=\s*\[/m` matches!).
  - `ProjectCard` optional props `metric` and `category`, rendering a `font-mono` impact badge (`data-testid="project-metric"`) when `metric` is provided, without adding `<h3>` or `span.shimmer-pill`.
  - Interactive category filter bar on `Projects` page with `aria-pressed` buttons (`min-h-[44px] focus-ring`), active pill transition, and live project count indicator, plus scroll-reveal on the `Projects` header.

- [ ] **Step 1: Write the failing tests in `src/assets/Projects.unit.test.jsx`**
  - Test that `ProjectCard` renders the `metric` badge when `metric` prop is passed.
  - Test that `Projects` renders category filter buttons (`All`, `GenAI & Agents`, `Computer Vision`, `Time-Series & Geo`, `Tabular & ML`) with `aria-pressed`, filters the displayed project cards when a category is clicked, and restores all 11 projects when `All` is clicked.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/assets/Projects.unit.test.jsx`
  Expected: FAIL (category filter buttons and metric badge not yet rendered).

- [ ] **Step 3: Implement `metric` + `category` in `projectsData`, `ProjectCard`, and `Projects` in `src/assets/project.jsx`**
  Keep `const projectsData = [` at the start of its line and export it via `export { projectsData };` below so `structure.test.js` line-start regex `^[ \t]*const\s+projectsData\s*=\s*\[/m` still passes!

- [ ] **Step 4: Run all ProjectCard and Projects tests to verify they pass**
  Run: `npx vitest run src/assets/Projects.unit.test.jsx src/assets/ProjectCard*.test.jsx src/test/structure.test.js`
  Expected: PASS

---

### Task 5: Home Page Refinements (Verified Certificates, Scroll-Reveal Choreography, Featured Works Preview & Copy Email UX)

**Files:**
- Modify: `src/assets/core.jsx:1-570`
- Test: `src/assets/core.content.test.js`, `src/assets/core.unit.test.jsx`, `src/assets/heading-structure.glowup.property.test.jsx`, `src/assets/accessible-names.glowup.property.test.jsx`

**Interfaces:**
- Consumes: `Reveal` from `./useScrollReveal.js`, `projectsData` from `./project.jsx`.
- Produces:
  - Updated `certifications` array (7 items, all with verified `issuer` and `date`, zero `"TODO"` comments, including `juara-2-mobdev.pdf`).
  - Hero Polaroid entrance animation (`animate-fade-in-up animation-delay-400`).
  - Scroll-reveal choreography (`Reveal`) across `SectionHeader`, `SkillsSection` items, `FeaturedWorksPreview` cards, `CertificationsSection` rows, `About me` columns, and `Contact` section.
  - `FeaturedWorksSection` (`02 / Featured Works`) on `Home` displaying top 3 flagship projects (`id: 8, 9, 10`) with metric badges and a `"Explore All 11 Projects"` CTA link to `/project`.
  - `"Copy email"` button in `#contact` with clipboard write and `"Copied!"` live feedback.

- [ ] **Step 1: Write the failing tests in `src/assets/core.content.test.js` and `src/assets/core.unit.test.jsx`**
  - In `core.content.test.js`: assert `certifications` has 7 items, every item has non-empty `title`, `issuer`, `date`, and `href`, and no `issuer` contains `"Data science training"` or `"AI competition"` placeholder text.
  - In `core.unit.test.jsx`: assert `Home` renders the `"Featured Works"` preview section with 3 featured project cards and a link to `/project`, and that clicking the `"Copy email"` button in `#contact` copies `bagasadjie2006@gmail.com` and switches button text to `"Copied!"`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/assets/core.content.test.js src/assets/core.unit.test.jsx`
  Expected: FAIL

- [ ] **Step 3: Implement all Home refinements in `src/assets/core.jsx`**
  - Update `certifications` with the 7 verified entries.
  - Add `Reveal` wrappers to `SectionHeader`, `SkillsSection`, `FeaturedWorksSection`, `CertificationsSection`, `About`, and `Contact`.
  - Add `animate-fade-in-up animation-delay-400` to the Hero Polaroid container.
  - Add `FeaturedWorksSection` (`02 / Featured Works`) between `SkillsSection` (`01`) and `CertificationsSection` (`03`), renumbering `About` (`04`) and `Contact` (`05`). Ensure `FeaturedWorksSection` uses `<h2>` (via `SectionHeader`) and `<h3>` for project titles so `heading-structure.glowup.property.test.jsx` passes.
  - Add the `"Copy email"` button with `focus-ring min-h-[44px]` and `aria-live="polite"` feedback in `#contact`.

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npx vitest run src/assets/core.content.test.js src/assets/core.unit.test.jsx src/assets/heading-structure.glowup.property.test.jsx src/assets/accessible-names.glowup.property.test.jsx`
  Expected: PASS

---

### Task 6: Full Regression Suite, Linter, Production Build & UI/UX Pro Max Verification

**Files:**
- Verify: All files in `src/` and `public/`

- [ ] **Step 1: Run complete Vitest unit + property-based test suite**
  Run: `npm test`
  Expected: All test files and 100% of tests PASS.

- [ ] **Step 2: Run ESLint across the repository**
  Run: `npm run lint`
  Expected: Exit code `0` with zero warnings/errors.

- [ ] **Step 3: Run Vite production build**
  Run: `npm run build`
  Expected: Exit code `0`, clean bundle generated in `dist/`.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Existing regex/DOM tests in `src/test/` or `src/assets/*.property.test.jsx` fail due to markup changes | High | Preserved exact selectors (`text-blue-600 font-bold`, `span.shimmer-pill`, `.reveal`, `.card-tilt`, `^[ \t]*const\s+projectsData\s*=\s*\[/m`, single `<h1>`, `h1 → h2 → h3` order) in Global Constraints. |
| `window.scrollTo` or `navigator.clipboard` missing in `jsdom` tests | Medium | Guard both APIs with `typeof` checks and `try/catch` fallbacks so `jsdom` tests never throw. |
| Sliding pill misalignment on different screen widths | Medium | Use a 2-column equal-width grid (`grid-cols-2`) inside the Navbar pill container so `translate-x-0` and `translate-x-full` are 100% deterministic at every viewport width without layout measurement jitter. |
| Scroll-reveal hiding content in `jsdom` or under reduced motion | High | Reuse `useScrollReveal`, which initializes `revealed = true` immediately when `IntersectionObserver` is absent or `prefers-reduced-motion: reduce` matches. |

