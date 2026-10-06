import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 2: For any Project_Entry whose title and description are present, the rendered Project_Card contains that exact title text and that exact description text
//
// Validates: Requirements 6.1, 5.3, 13.2
//
// Strategy: generate non-empty title and description strings (excluding
// whitespace-only values) and render the Project_Card under MemoryRouter. The
// title renders inside an <h3> and the description inside a <p>; we assert the
// exact text content of each node matches the generated input. A custom text
// matcher comparing node.textContent avoids RTL's default whitespace
// normalization so the match is truly exact.

afterEach(() => {
  cleanup();
});

// Non-empty strings that are not whitespace-only. Title and description must be
// distinct so each exact-text query resolves to a single, unambiguous node.
const nonBlankStringArb = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0);

const titleDescArb = fc
  .record({ title: nonBlankStringArb, description: nonBlankStringArb })
  .filter(({ title, description }) => title !== description);

// Exact matcher on a node's full textContent (no whitespace normalization).
const exactText = (value) => (_content, node) =>
  node != null && node.textContent === value;

describe("ProjectCard title/description fidelity property", () => {
  it("renders the exact title and exact description text when both are present", () => {
    fc.assert(
      fc.property(titleDescArb, ({ title, description }) => {
        cleanup();

        render(
          <MemoryRouter>
            <ProjectCard title={title} description={description} />
          </MemoryRouter>
        );

        // The title renders in an <h3> and matches exactly.
        const titleEl = screen.getByText(exactText(title), {
          selector: "h3",
        });
        expect(titleEl).toBeInTheDocument();
        expect(titleEl.textContent).toBe(title);

        // The description renders in a <p> and matches exactly.
        const descEl = screen.getByText(exactText(description), {
          selector: "p",
        });
        expect(descEl).toBeInTheDocument();
        expect(descEl.textContent).toBe(description);
      }),
      { numRuns: 100 }
    );
  });
});
