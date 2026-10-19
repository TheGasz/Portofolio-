/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- Color palette (builds on the existing blue/cyan gradient scheme) ---
      // Primary accent family (blue) powers all primary interactive elements and
      // the active nav link. Secondary (cyan) is the gradient partner for hero
      // accents. Tertiary (indigo) is reserved for decorative blobs/accents.
      // Neutrals cover headings, body text, surfaces, and borders. All pairings
      // are chosen to meet WCAG contrast (4.5:1, 3:1 for large text).
      colors: {
        // Primary interactive accent — maps to Tailwind blue so existing
        // blue-600/blue-700 utilities stay consistent across surfaces.
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // primary accent
          700: "#1d4ed8", // primary accent hover
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Secondary accent — cyan gradient partner for name/hero accents.
        secondary: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4", // secondary accent
          600: "#0891b2",
          700: "#0e7490",
        },
        // Tertiary — decorative only (blobs/accents).
        tertiary: {
          300: "#a5b4fc",
          500: "#6366f1",
        },
        // Aurora accents — extra gradient partners for the glow-up layer.
        // Used in decorative blobs, gradient text, and glow rings only; never
        // as a text/background pairing that must meet body-copy contrast.
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        fuchsia: {
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
        },
        amber: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
        // Dark surface tokens for the aurora night theme.
        night: {
          900: "#070a18", // page base
          800: "#0b1020", // elevated base
          700: "#121a33", // card surface
          600: "#1b2547", // card hover / border
        },
        // Neutral grays for headings, body, surfaces, and borders.
        neutral: {
          50: "#f9fafb",  // surface
          100: "#f3f4f6", // border / subtle surface
          200: "#e5e7eb", // border
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563", // body text
          700: "#374151",
          800: "#1f2937",
          900: "#111827", // headings
        },
      },

      // --- Typography scale ---
      // One reusable scale: display (hero h1), section (h2), card title, body,
      // and meta/tags. Line heights pair with each step for legible rhythm.
      fontSize: {
        meta: ["0.75rem", { lineHeight: "1rem" }],        // tags / meta  (12px)
        "body-sm": ["0.875rem", { lineHeight: "1.5rem" }], // small body  (14px)
        body: ["1.125rem", { lineHeight: "1.75rem" }],     // body        (18px)
        "card-title": ["1.5rem", { lineHeight: "2rem" }],  // card title  (24px)
        section: ["2.25rem", { lineHeight: "2.5rem" }],    // h2          (36px)
        "section-lg": ["3rem", { lineHeight: "1" }],       // h2 (lg)     (48px)
        display: ["3.75rem", { lineHeight: "1" }],         // hero h1     (60px)
        "display-lg": ["4.5rem", { lineHeight: "1" }],     // hero h1 lg  (72px)
      },

      // --- Spacing system ---
      // Shared section rhythm and container tokens reused across pages.
      spacing: {
        section: "5rem",       // py-20 section rhythm (80px)
        "section-lg": "8rem",  // md:py-32 section rhythm (128px)
        card: "2rem",          // card interior padding (32px)
        gutter: "1.5rem",      // container horizontal padding (24px)
      },

      // --- Corner radius tokens ---
      // One radius treatment for cards and one for buttons/pills/tags.
      borderRadius: {
        card: "1rem",   // rounded-2xl equivalent for all card surfaces
        pill: "9999px", // rounded-full for buttons/pills/tags
      },

      // --- Elevation (shadow) tokens ---
      // One rest/hover elevation treatment shared by all card surfaces.
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",                              // shadow-sm rest state
        "card-hover": "0 25px 50px -12px rgb(0 0 0 / 0.25)",                // shadow-2xl hover state
      },

      // --- Motion: animations and keyframes ---
      // Blob is an ambient, infinite loop (transform-only, no reflow).
      // fade-in-up is a one-shot entrance that completes in <= 1000ms and
      // settles at a fully-opaque, in-place end state.
      // gradient-pan is a continuous ambient loop (background-position only)
      // powering the hero focal-point gradient-text treatment.
      animation: {
        "animate-blob": "blob 7s infinite",
        blob: "blob 7s infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "animate-fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "gradient-pan": "gradientPan 6s linear infinite",
        // Ambient aurora wash — pans a large multi-stop gradient across the
        // page background (background-position only, no reflow).
        aurora: "auroraPan 18s ease-in-out infinite",
        // Shimmer sweep for pill/tag highlights (background-position only).
        shimmer: "shimmer 2.5s linear infinite",
        // Gentle vertical float for hero accents (transform only).
        float: "float 6s ease-in-out infinite",
        // Soft breathing glow for CTAs and focal accents (opacity only).
        "glow-pulse": "glowPulse 3.5s ease-in-out infinite",
      },
      keyframes: {
        // Transform-only — safe for compositing, no layout reflow.
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        // Opacity + transform only; ends fully opaque and in place.
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Background-position only — composites safely, no layout reflow.
        gradientPan: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        // Ambient aurora wash. Background-position only so it stays on the
        // compositor (no layout reflow). Travels in two axes for an organic,
        // non-linear drift across the page backdrop.
        auroraPan: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // Highlight sweep for tags/pills. Background-position only.
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Gentle float. Transform only — compositor-safe.
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" },
        },
        // Breathing glow. Opacity only — compositor-safe. Narrow, gentle
        // range so it reads as a soft ambient shift rather than a pulse.
        glowPulse: {
          "0%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
          "100%": { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
}
