import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Static/snapshot review of config and motion tokens.
// This suite reads tailwind.config.js and src/index.css as source text and
// asserts the motion/accessibility invariants from the design hold, without
// importing the config (Tailwind 4's ESM config is read as text here so we can
// inspect the authored keyframes/durations directly).
//
// Covers Requirements:
//   11.3 — Motion_Effect animations use only transform/opacity (no reflow)
//   11.6 — Motion_Effect entrances complete within 1000ms
//   11.2 — Reduced-motion safety net + focus-visible utility in src/index.css

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");

const tailwindConfigSrc = readFileSync(
  resolve(root, "tailwind.config.js"),
  "utf8"
);
const indexCssSrc = readFileSync(resolve(root, "src", "index.css"), "utf8");

/**
 * Extract the body of a named keyframe object from the tailwind config source.
 * Returns the raw text between the keyframe name's opening brace and its
 * matching closing brace. Uses brace-depth counting so nested step objects
 * (e.g. "0%": { ... }) are included.
 *
 * @param {string} src   tailwind.config.js source text
 * @param {string} name  keyframe identifier (e.g. "blob", "fadeInUp")
 * @returns {string}     the keyframe body text
 */
function extractKeyframeBody(src, name) {
  // Match `name:` or `"name":` followed by the opening brace.
  const header = new RegExp(`(?:["']?${name}["']?)\\s*:\\s*{`);
  const match = header.exec(src);
  if (!match) {
    throw new Error(`Keyframe "${name}" not found in tailwind.config.js`);
  }
  const start = match.index + match[0].length; // position just after the `{`
  let depth = 1;
  let i = start;
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
  }
  if (depth !== 0) {
    throw new Error(`Unbalanced braces while parsing keyframe "${name}"`);
  }
  return src.slice(start, i - 1);
}

/**
 * Collect the CSS property names referenced inside a keyframe body. Each step
 * is an object literal like `"0%": { transform: "...", opacity: "0" }`; this
 * pulls the inner property identifiers (transform, opacity, width, ...).
 *
 * @param {string} body  keyframe body text (from extractKeyframeBody)
 * @returns {string[]}   lowercased property names, in order of appearance
 */
function collectAnimatedProperties(body) {
  const props = [];
  // Property keys appear as `identifier:` or `"identifier":` inside step
  // objects. Step keys themselves ("0%", "33%", "from", "to") are filtered out:
  // percentage keys are quoted numeric+% strings, and from/to are explicitly
  // excluded below.
  const propRe = /(?:["']?([a-zA-Z-]+)["']?)\s*:/g;
  let m;
  while ((m = propRe.exec(body)) !== null) {
    const name = m[1].toLowerCase();
    if (name === "from" || name === "to") continue; // step selectors, not props
    props.push(name);
  }
  return props;
}

// Only compositor-friendly properties are allowed in keyframes (Req 11.3).
const ALLOWED_ANIMATED_PROPS = new Set(["transform", "opacity"]);

// Layout-affecting properties that must never appear in a keyframe.
const FORBIDDEN_ANIMATED_PROPS = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "margin-top",
  "margin-left",
  "padding",
  "border-width",
  "inset",
];

describe("tailwind.config.js motion tokens (Req 11.3, 11.6)", () => {
  it("blob keyframe animates only transform/opacity (no layout props)", () => {
    const body = extractKeyframeBody(tailwindConfigSrc, "blob");
    const props = collectAnimatedProperties(body);

    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(ALLOWED_ANIMATED_PROPS.has(prop)).toBe(true);
    }
    for (const forbidden of FORBIDDEN_ANIMATED_PROPS) {
      expect(props).not.toContain(forbidden);
    }
  });

  it("fadeInUp keyframe animates only transform/opacity (no layout props)", () => {
    const body = extractKeyframeBody(tailwindConfigSrc, "fadeInUp");
    const props = collectAnimatedProperties(body);

    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(ALLOWED_ANIMATED_PROPS.has(prop)).toBe(true);
    }
    for (const forbidden of FORBIDDEN_ANIMATED_PROPS) {
      expect(props).not.toContain(forbidden);
    }
    // fadeInUp is the one-shot entrance: it must settle fully opaque and in
    // place, so transform and opacity should both appear.
    expect(props).toContain("transform");
    expect(props).toContain("opacity");
  });

  it("fade-in-up entrance completes within 1000ms (Req 11.6)", () => {
    // The one-shot fade entrance duration governs Req 11.6. Pull the duration
    // from the `fade-in-up` / `animate-fade-in-up` animation shorthand.
    const fadeAnim = /["']?(?:animate-)?fade-in-up["']?\s*:\s*["']([^"']+)["']/.exec(
      tailwindConfigSrc
    );
    expect(fadeAnim).not.toBeNull();

    const durationMs = parseDurationMs(fadeAnim[1]);
    expect(durationMs).not.toBeNull();
    expect(durationMs).toBeLessThanOrEqual(1000);
  });

  it("blob is an infinite ambient loop, not a one-shot entrance", () => {
    // The blob loop is ambient background motion (not an entrance), so the
    // <=1000ms one-shot rule does not apply to it. Assert it is explicitly an
    // infinite loop so its 7s period is intentional and not mistaken for a
    // violating entrance duration.
    const blobAnim = /["']?(?:animate-)?blob["']?\s*:\s*["']([^"']+)["']/.exec(
      tailwindConfigSrc
    );
    expect(blobAnim).not.toBeNull();
    expect(blobAnim[1]).toMatch(/\binfinite\b/);
  });
});

/**
 * Parse the first time value (e.g. "0.8s", "800ms", "7s") out of an animation
 * shorthand string and return it in milliseconds.
 *
 * @param {string} shorthand animation shorthand (e.g. "fadeInUp 0.8s ease-out")
 * @returns {number|null} duration in ms, or null if none found
 */
function parseDurationMs(shorthand) {
  const timeRe = /(\d*\.?\d+)\s*(ms|s)\b/;
  const m = timeRe.exec(shorthand);
  if (!m) return null;
  const value = parseFloat(m[1]);
  return m[2] === "s" ? value * 1000 : value;
}

describe("src/index.css motion + focus utilities (Req 11.2)", () => {
  it("contains the prefers-reduced-motion reduce rule", () => {
    expect(indexCssSrc).toMatch(
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/
    );
  });

  it("contains a focus-visible utility", () => {
    // Shared focus ring utility (.focus-ring:focus-visible) or any
    // :focus-visible rule satisfies the keyboard focus indicator requirement.
    expect(indexCssSrc).toMatch(/:focus-visible/);
    expect(indexCssSrc).toMatch(/\.focus-ring:focus-visible/);
  });
});
