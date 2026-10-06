import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Static/snapshot review of the glow-up motion primitives.
// Like design-tokens.test.js, this suite reads tailwind.config.js and
// src/index.css as source text and asserts the motion/accessibility
// invariants from the design hold, without importing the config or applying
// the CSS. It inspects the authored keyframes/helpers/fallbacks directly.
//
// Covers Requirements:
//   5.3, 8.1 — gradientPan animates only background-position (compositor-safe,
//              no layout reflow)
//   2.6      — .card-tilt is guarded by reduced-motion AND a coarse/no-hover
//              pointer query (tilt disabled where it cannot be driven)
//   4.4      — .reveal / .reveal-visible animate only transform/opacity
//   1.3      — .animated-gradient-text has a reduced-motion animation: none
//              fallback

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
 * matching closing brace, using brace-depth counting so nested step objects
 * are included. (Mirrors the helper in design-tokens.test.js.)
 *
 * @param {string} src   tailwind.config.js source text
 * @param {string} name  keyframe identifier (e.g. "gradientPan")
 * @returns {string}     the keyframe body text
 */
function extractKeyframeBody(src, name) {
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
 * Collect the CSS property names referenced inside a keyframe body. Step keys
 * ("0%", "100%", "from", "to") are filtered out so only the animated property
 * identifiers remain. (Mirrors the helper in design-tokens.test.js, with
 * camelCase normalized to kebab-case so `backgroundPosition` reads as
 * `background-position`.)
 *
 * @param {string} body  keyframe body text (from extractKeyframeBody)
 * @returns {string[]}   lowercased, kebab-cased property names, in order
 */
function collectAnimatedProperties(body) {
  const props = [];
  const propRe = /(?:["']?([a-zA-Z-]+)["']?)\s*:/g;
  let m;
  while ((m = propRe.exec(body)) !== null) {
    const raw = m[1];
    if (raw === "from" || raw === "to") continue; // step selectors, not props
    // Normalize camelCase config keys (backgroundPosition) to CSS kebab-case.
    const name = raw
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
    props.push(name);
  }
  return props;
}

/**
 * Extract the declaration body of a top-level CSS rule by selector. Returns the
 * text between the selector's opening brace and its matching closing brace.
 * Only matches a selector at the start of a rule (not inside a longer selector)
 * by requiring the selector to be preceded by whitespace/start and followed by
 * optional whitespace then `{`.
 *
 * @param {string} css       stylesheet source text
 * @param {string} selector  exact selector (e.g. ".card-tilt", ".reveal")
 * @param {number} [from]    index to start searching from
 * @returns {{ body: string, end: number } | null}
 */
function extractRuleBody(css, selector, from = 0) {
  // Escape regex metacharacters in the selector (., -, etc.).
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Require the selector to be a standalone token: preceded by start-of-string,
  // whitespace, `}` or `,`, and followed by whitespace then `{`.
  const header = new RegExp(`(?:^|[\\s}{,])${esc}\\s*{`, "g");
  header.lastIndex = from;
  const match = header.exec(css);
  if (!match) return null;
  const start = match.index + match[0].length;
  let depth = 1;
  let i = start;
  for (; i < css.length && depth > 0; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
  }
  if (depth !== 0) return null;
  return { body: css.slice(start, i - 1), end: i };
}

/**
 * Collect the CSS property names declared in a flat rule body (no nested
 * blocks). Pulls `prop:` identifiers; values are ignored.
 *
 * @param {string} body  rule declaration body
 * @returns {string[]}   lowercased property names, in order
 */
function collectDeclaredProperties(body) {
  const props = [];
  const propRe = /([a-zA-Z-]+)\s*:/g;
  let m;
  while ((m = propRe.exec(body)) !== null) {
    props.push(m[1].toLowerCase());
  }
  return props;
}

describe("gradientPan motion token (Req 5.3, 8.1)", () => {
  it("animates only background-position (no layout props)", () => {
    const body = extractKeyframeBody(tailwindConfigSrc, "gradientPan");
    const props = collectAnimatedProperties(body);

    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(prop).toBe("background-position");
    }
    // Explicitly: no transform/opacity/layout props leaked into the pan.
    expect(props).not.toContain("transform");
    expect(props).not.toContain("opacity");
    expect(props).not.toContain("width");
    expect(props).not.toContain("height");
    expect(props).not.toContain("left");
    expect(props).not.toContain("top");
  });
});

describe(".card-tilt reduced-motion + coarse-pointer guard (Req 2.6)", () => {
  it("defines .card-tilt with a transform-only resting transform", () => {
    const rule = extractRuleBody(indexCssSrc, ".card-tilt");
    expect(rule).not.toBeNull();
    expect(rule.body).toMatch(/transform\s*:/);
  });

  it("is disabled under reduced-motion AND a coarse/no-hover pointer", () => {
    // The guard query must combine prefers-reduced-motion: reduce with a
    // coarse-pointer / no-hover condition. The authored query is:
    //   @media (prefers-reduced-motion: reduce) and (hover: none),
    //          (prefers-reduced-motion: reduce) and (pointer: coarse)
    const guardRe =
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*and\s*\(\s*hover\s*:\s*none\s*\)\s*,\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*and\s*\(\s*pointer\s*:\s*coarse\s*\)/;
    const guardMatch = guardRe.exec(indexCssSrc);
    expect(guardMatch).not.toBeNull();

    // Inside that guarded block, .card-tilt must flatten (transform: none).
    const block = extractRuleBody(indexCssSrc, ".card-tilt", guardMatch.index);
    expect(block).not.toBeNull();
    expect(block.body).toMatch(/transform\s*:\s*none/);
  });

  it("references both a reduced-motion and a coarse/no-hover condition", () => {
    expect(indexCssSrc).toMatch(/prefers-reduced-motion\s*:\s*reduce/);
    expect(indexCssSrc).toMatch(/hover\s*:\s*none/);
    expect(indexCssSrc).toMatch(/pointer\s*:\s*coarse/);
  });
});

describe(".reveal / .reveal-visible animate only transform/opacity (Req 4.4)", () => {
  const ALLOWED = new Set(["transform", "opacity"]);
  const FORBIDDEN = [
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin",
    "padding",
    "inset",
  ];

  it(".reveal declares only transform/opacity (and its transition) props", () => {
    const rule = extractRuleBody(indexCssSrc, ".reveal");
    expect(rule).not.toBeNull();
    const props = collectDeclaredProperties(rule.body);

    // Allowed set: the animated props plus the `transition` shorthand itself.
    for (const prop of props) {
      expect(ALLOWED.has(prop) || prop === "transition").toBe(true);
    }
    for (const forbidden of FORBIDDEN) {
      expect(props).not.toContain(forbidden);
    }
    // The transition must only reference transform/opacity, never a layout prop.
    const transitionRe = /transition\s*:\s*([^;]+)/;
    const tMatch = transitionRe.exec(rule.body);
    expect(tMatch).not.toBeNull();
    const transitionValue = tMatch[1];
    expect(transitionValue).toMatch(/transform/);
    expect(transitionValue).toMatch(/opacity/);
    for (const forbidden of FORBIDDEN) {
      expect(transitionValue).not.toContain(forbidden);
    }
  });

  it(".reveal-visible declares only transform/opacity props", () => {
    const rule = extractRuleBody(indexCssSrc, ".reveal-visible");
    expect(rule).not.toBeNull();
    const props = collectDeclaredProperties(rule.body);

    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(ALLOWED.has(prop)).toBe(true);
    }
    for (const forbidden of FORBIDDEN) {
      expect(props).not.toContain(forbidden);
    }
  });
});

describe(".animated-gradient-text reduced-motion fallback (Req 1.3)", () => {
  it("animates via gradientPan in its base rule", () => {
    const rule = extractRuleBody(indexCssSrc, ".animated-gradient-text");
    expect(rule).not.toBeNull();
    expect(rule.body).toMatch(/animation\s*:\s*gradientPan/);
  });

  it("resolves to animation: none under prefers-reduced-motion: reduce", () => {
    // Find a reduced-motion block that scopes .animated-gradient-text and sets
    // animation: none. Scan each reduced-motion @media block for the override.
    const mediaRe = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/g;
    let found = false;
    let m;
    while ((m = mediaRe.exec(indexCssSrc)) !== null) {
      const block = extractRuleBody(
        indexCssSrc,
        ".animated-gradient-text",
        m.index
      );
      if (block && /animation\s*:\s*none/.test(block.body)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
