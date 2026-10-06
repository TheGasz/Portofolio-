import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectGrid } from "./project.jsx";
import { isValidHttpUrl } from "./url.js";

// Feature: portfolio-glow-up, Property 1: Reveal never gates content — for any
// array of Project_Entry values rendered via ProjectGrid, every rendered card
// exposes its title, description, tech tags, and link-outs in the DOM
// regardless of reveal/animation state.
//
// Validates: Requirements 4.6, 4.7, 7.1
//
// Rationale: the scroll-reveal micro-interaction (useScrollReveal + the
// .reveal/.reveal-visible CSS helpers) is presentation-only. Content must live
// in the DOM independent of whether a card has "revealed". Under jsdom the
// hook resolves to revealed=true (no IntersectionObserver), so .reveal-visible
// is applied; the invariant asserted here is that content presence (titles,
// descriptions, tags, link-outs) is driven by the data, never gated by the
// animation. The reveal wrapper only toggles opacity/transform classes and
// keeps all children mounted.
//
// Strategy: generate arrays of Project_Entry objects with unique ids,
// non-empty titles/descriptions, arrays of non-empty tech strings, and valid
// absolute http(s) demo/repo URLs. Render the whole array via ProjectGrid and
// assert, across the array:
//   - one <h3> title per entry with a (non-empty) title
//   - total tech tag spans (span.bg-blue-50) equals the summed tech count
//   - one link-out <a rel="noopener noreferrer"> per valid demo/repo URL

afterEach(() => {
  cleanup();
});

// Tag spans carry this shared, distinctive class in the card markup.
const TAG_SPAN_SELECTOR = "span.bg-blue-50";
// Link-out anchors render with this exact rel for safe external navigation.
const LINKOUT_SELECTOR = 'a[rel="noopener noreferrer"]';

// Non-empty-after-trim string arbitrary (used for titles/descriptions/tech).
const nonEmptyStr = (maxLength) =>
  fc.string({ minLength: 1, maxLength }).filter((s) => s.trim().length > 0);

// Absolute http(s) URL arbitrary so isValidHttpUrl() passes and link-outs
// render. Build from a fixed scheme + an arbitrary host/path segment.
const httpUrlArb = fc
  .tuple(
    fc.constantFrom("https", "http"),
    nonEmptyStr(12).map((s) => encodeURIComponent(s))
  )
  .map(([scheme, seg]) => `${scheme}://example.com/${seg}`);

// A single Project_Entry with all content fields populated and valid link-outs.
// `id` uniqueness across the array is enforced by the array arbitrary below.
const entryArb = fc.record({
  title: nonEmptyStr(40),
  description: nonEmptyStr(80),
  tech: fc.array(nonEmptyStr(20), { minLength: 0, maxLength: 6 }),
  demoUrl: httpUrlArb,
  repoUrl: httpUrlArb,
});

// Arrays of entries (including empty) with unique numeric ids assigned by index
// so React keys and the grid are well-formed and deterministic.
const entriesArb = fc
  .array(entryArb, { minLength: 0, maxLength: 8 })
  .map((arr) => arr.map((e, i) => ({ ...e, id: i })));

describe("portfolio-glow-up Property 1: reveal never gates content", () => {
  it("exposes title/description/tags/link-outs for every card regardless of reveal state", () => {
    fc.assert(
      fc.property(entriesArb, (entries) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ProjectGrid projects={entries} />
          </MemoryRouter>
        );

        // Titles: one <h3> per entry that has a (non-empty) title.
        const expectedTitles = entries
          .filter((e) => e.title && e.title.trim().length > 0)
          .map((e) => e.title);
        const titleEls = Array.from(container.querySelectorAll("h3"));
        expect(titleEls.map((el) => el.textContent)).toEqual(expectedTitles);

        // Descriptions: one <p> description per entry that has a description.
        // Match by text content rather than relying on positional selectors.
        const expectedDescriptions = entries
          .filter((e) => e.description && e.description.trim().length > 0)
          .map((e) => e.description);
        for (const desc of expectedDescriptions) {
          expect(container.textContent).toContain(desc);
        }

        // Tech tags: total span.bg-blue-50 equals the summed tech length.
        const totalTechTags = entries.reduce(
          (sum, e) => sum + (Array.isArray(e.tech) ? e.tech.length : 0),
          0
        );
        expect(container.querySelectorAll(TAG_SPAN_SELECTOR).length).toBe(
          totalTechTags
        );

        // Link-outs: one anchor per valid demo/repo URL across all entries.
        const expectedLinkOuts = entries.reduce((sum, e) => {
          return (
            sum +
            (isValidHttpUrl(e.demoUrl) ? 1 : 0) +
            (isValidHttpUrl(e.repoUrl) ? 1 : 0)
          );
        }, 0);
        const linkOuts = container.querySelectorAll(LINKOUT_SELECTOR);
        expect(linkOuts.length).toBe(expectedLinkOuts);

        // Every rendered link-out carries a real href (content, not gated).
        for (const a of linkOuts) {
          expect(a.getAttribute("href")).toBeTruthy();
        }
      }),
      { numRuns: 100 }
    );
  });
});
