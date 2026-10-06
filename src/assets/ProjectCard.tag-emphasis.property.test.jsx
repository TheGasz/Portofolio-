import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-glow-up, Property 3: Tag emphasis preserves tags - for any
// tech list, the rendered Project_Card displays exactly one tag per listed
// technology, in the same order with unchanged text, via the PRESERVED
// `span.bg-blue-50` selector, even after the group-hover tag-emphasis classes
// added in task 4.3.
//
// Validates: Requirements 3.2
//
// This is the glow-up regression analog of the portfolio-redesign Property 3
// tech-tag test. The tag <span> now also carries group-hover emphasis classes
// (`group-hover:-translate-y-0.5`, `group-hover:bg-blue-100`,
// `group-hover:text-blue-700`, `group-hover:shadow-sm`), but the resting
// `span.bg-blue-50` selector, the tag text, order, and count must be unchanged.
//
// Strategy: generate arrays of unique, non-empty technology strings (deduped so
// each rendered tag text maps unambiguously to exactly one input element),
// including empty arrays. Render the ProjectCard under MemoryRouter and query
// the tag <span> elements by the preserved `span.bg-blue-50` selector. Assert:
//   - exactly tech.length tag spans render, in the same order with matching text
//   - for an empty tech list, no tag spans and no tag container render

afterEach(() => {
  cleanup();
});

// Preserved tag-span selector: the group-hover emphasis classes added by the
// glow-up must not change this resting selector.
const TAG_SPAN_SELECTOR = "span.bg-blue-50";
// The tag container wraps the tag spans; it must be absent when tech is empty.
const TAG_CONTAINER_SELECTOR = "div.flex-wrap";

// Arbitrary: arrays of unique, non-empty technology strings (including []).
// Non-empty after trimming so the rendered text is meaningful; deduped so each
// rendered tag text maps unambiguously to exactly one input element.
const techArb = fc
  .array(
    fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
    { minLength: 0, maxLength: 12 }
  )
  .map((arr) => [...new Set(arr)]);

describe("ProjectCard tag emphasis preserves tags property", () => {
  it("renders exactly one tag per technology, in order, via the preserved span.bg-blue-50 selector", () => {
    fc.assert(
      fc.property(techArb, (tech) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ProjectCard
              title="A Project"
              description="A description."
              tech={tech}
            />
          </MemoryRouter>
        );

        const tagSpans = container.querySelectorAll(TAG_SPAN_SELECTOR);

        if (tech.length === 0) {
          // Empty tech list: no tag spans and no tag container at all.
          expect(tagSpans.length).toBe(0);
          expect(
            container.querySelectorAll(TAG_CONTAINER_SELECTOR).length
          ).toBe(0);
          return;
        }

        // Exactly one tag span per technology (count preserved).
        expect(tagSpans.length).toBe(tech.length);

        // Same count and same order as the input list, with unchanged text.
        const renderedText = Array.from(tagSpans).map((el) => el.textContent);
        expect(renderedText).toEqual(tech);
      }),
      { numRuns: 100 }
    );
  });
});
