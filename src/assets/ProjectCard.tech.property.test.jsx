import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 3: For any Project_Entry tech list, the rendered Project_Card displays exactly one tag per listed technology, with the same count and the same order as the input list
//
// Validates: Requirements 6.2, 5.3
//
// Strategy: generate arrays of unique, non-empty technology strings (deduped so
// that assertions on rendered tag text are unambiguous), including empty arrays.
// Render the ProjectCard under MemoryRouter and query the tag <span> elements by
// their shared class. Assert:
//   - exactly tech.length tag spans render, in the same order with matching text
//   - for an empty tech list, no tag spans and no tag container render

afterEach(() => {
  cleanup();
});

// Tag spans carry this shared, distinctive class in the card markup.
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

describe("ProjectCard tech tags property", () => {
  it("renders exactly one tag per technology, in order, and no container when empty", () => {
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

        // Exactly one tag span per technology.
        expect(tagSpans.length).toBe(tech.length);

        // Same count and same order as the input list.
        const renderedText = Array.from(tagSpans).map(
          (el) => el.textContent
        );
        expect(renderedText).toEqual(tech);
      }),
      { numRuns: 100 }
    );
  });
});
