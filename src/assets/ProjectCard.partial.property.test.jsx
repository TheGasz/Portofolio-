import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 11: For any Project_Entry with an arbitrary subset of {title, description, tech} present, rendering the Project_Card succeeds without throwing and displays exactly the present fields while omitting the absent ones
//
// Validates: Requirements 13.3
//
// Strategy: build a partial Project_Entry where each of title, description, and
// tech is independently present or absent (fc.option with nil: undefined). When
// present, title/description are non-empty, non-whitespace strings and tech is
// an array of non-empty strings. We render the card under MemoryRouter and
// assert that rendering never throws, that the title <h3> and description <p>
// appear iff their fields are present, and that the tech tag container appears
// iff tech is a present, non-empty array.

afterEach(() => {
  cleanup();
});

const nonBlankStringArb = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0);

// Each field independently present (a real value) or absent (undefined).
const partialEntryArb = fc.record({
  title: fc.option(nonBlankStringArb, { nil: undefined }),
  description: fc.option(nonBlankStringArb, { nil: undefined }),
  tech: fc.option(fc.array(nonBlankStringArb), { nil: undefined }),
});

describe("ProjectCard partial-entry resilience property", () => {
  it("renders present fields and omits absent ones without throwing", () => {
    fc.assert(
      fc.property(partialEntryArb, (entry) => {
        cleanup();

        let container;
        // Rendering must not throw for any subset of present fields.
        expect(() => {
          ({ container } = render(
            <MemoryRouter>
              <ProjectCard {...entry} />
            </MemoryRouter>
          ));
        }).not.toThrow();

        // Title renders in an <h3> iff title is present.
        const titleEl = container.querySelector("h3");
        if (entry.title !== undefined) {
          expect(titleEl).not.toBeNull();
          expect(titleEl.textContent).toBe(entry.title);
        } else {
          expect(titleEl).toBeNull();
        }

        // Description renders in a <p> iff description is present.
        const descEl = container.querySelector("p");
        if (entry.description !== undefined) {
          expect(descEl).not.toBeNull();
          expect(descEl.textContent).toBe(entry.description);
        } else {
          expect(descEl).toBeNull();
        }

        // Tech tag container renders iff tech is a present, non-empty array.
        const tagContainer = container.querySelector("div.flex-wrap");
        const tagEl = container.querySelector("span.bg-blue-50");
        const hasTech =
          Array.isArray(entry.tech) && entry.tech.length > 0;
        if (hasTech) {
          expect(tagContainer).not.toBeNull();
          expect(tagEl).not.toBeNull();
          const tags = container.querySelectorAll("span.bg-blue-50");
          expect(tags.length).toBe(entry.tech.length);
        } else {
          expect(tagContainer).toBeNull();
          expect(tagEl).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });
});
