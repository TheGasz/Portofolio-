import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 7: For any rendered link-out CTA on a card for a project with a given title, the CTA's accessible name contains both its destination type ("live demo" or "source repository") and the project title
//
// Validates: Requirements 7.5
//
// Strategy: render a ProjectCard under MemoryRouter with an arbitrary non-empty
// title and BOTH demoUrl and repoUrl set to valid absolute http(s) URLs so that
// both link-out CTAs render. We then read the rendered anchors directly by their
// aria-label attribute (container.querySelectorAll("a[aria-label]")) instead of
// getByRole name matching, which is awkward/ambiguous with arbitrary title text.
// For each CTA we lowercase its accessible name and assert it contains one of the
// destination types ("live demo" / "source repository") AND the (lowercased)
// title as a plain substring (no RegExp built from the title, avoiding
// regex-breaking characters in generated titles).

afterEach(() => {
  cleanup();
});

// Both URLs are always valid so both CTAs always render.
const DEMO_URL = "https://demo.example";
const REPO_URL = "https://repo.example";

// Non-empty title: any string whose trimmed form is non-empty.
const titleArb = fc.string().filter((s) => s.trim().length > 0);

describe("ProjectCard link-out accessible name property", () => {
  it("each CTA accessible name contains its destination type and the project title", () => {
    fc.assert(
      fc.property(titleArb, (title) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ProjectCard title={title} demoUrl={DEMO_URL} repoUrl={REPO_URL} />
          </MemoryRouter>
        );

        const links = container.querySelectorAll("a[aria-label]");

        // Both link-out CTAs must render when both URLs are valid.
        expect(links.length).toBe(2);

        const lowerTitle = title.toLowerCase();

        for (const link of links) {
          const name = (link.getAttribute("aria-label") || "").toLowerCase();

          // The accessible name identifies the destination type.
          const hasDestination =
            name.includes("live demo") || name.includes("source repository");
          expect(hasDestination).toBe(true);

          // The accessible name contains the project title.
          expect(name.includes(lowerTitle)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});
