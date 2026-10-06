import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import Header from "./Navbar.jsx";

// Feature: portfolio-redesign, Property 10: For any current pathname, the Navigation_Bar renders both a Home link and a Projects link, and the active marker (aria-current="page" plus active styling) is applied to exactly the link whose target equals the pathname — to neither link when the pathname matches no defined route
//
// Validates: Requirements 8.1, 8.2, 8.3, 8.4
//
// Strategy: render the Navigation_Bar (Header) under MemoryRouter with a
// generated initialEntries path. The generator mixes the two defined routes
// ("/", "/project") with arbitrary unknown routes so the invariant is exercised
// across the active-Home, active-Projects, and no-active cases.

afterEach(() => {
  cleanup();
});

// The active styling applied by Header to the matching link.
const ACTIVE_CLASSES = ["text-blue-600", "font-bold"];

// Arbitrary that yields a mix of defined routes and unknown routes.
const pathArb = fc.oneof(
  // Defined routes (active cases).
  fc.constantFrom("/", "/project"),
  // Arbitrary unknown routes: a non-empty path segment that is neither
  // of the defined routes. Keep segments URL-path-safe and non-empty.
  fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => "/" + encodeURIComponent(s))
    .filter((p) => p !== "/" && p !== "/project")
);

describe("Navigation active state property", () => {
  it("renders both links and marks exactly the matching link active per route", () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        cleanup();

        render(
          <MemoryRouter initialEntries={[path]}>
            <Header title="Bagas." />
          </MemoryRouter>
        );

        // Both navigation links are always present, on every route.
        const homeLink = screen.getByRole("link", { name: "Home" });
        const projectsLink = screen.getByRole("link", { name: "Projects" });
        expect(homeLink).toBeInTheDocument();
        expect(projectsLink).toBeInTheDocument();

        // Determine which link (if any) should be active for this pathname.
        const linkByPath = { "/": homeLink, "/project": projectsLink };
        const expectedActive = linkByPath[path]; // undefined for unknown routes

        for (const [to, link] of Object.entries(linkByPath)) {
          const shouldBeActive = to === path;

          // aria-current="page" is applied to exactly the matching link.
          if (shouldBeActive) {
            expect(link).toHaveAttribute("aria-current", "page");
            // Active styling (color + weight) is present.
            for (const cls of ACTIVE_CLASSES) {
              expect(link).toHaveClass(cls);
            }
          } else {
            expect(link).not.toHaveAttribute("aria-current");
            // Inactive link must not carry the active styling.
            for (const cls of ACTIVE_CLASSES) {
              expect(link).not.toHaveClass(cls);
            }
          }
        }

        // Sanity: for unknown routes neither link is marked active.
        if (!expectedActive) {
          expect(homeLink).not.toHaveAttribute("aria-current");
          expect(projectsLink).not.toHaveAttribute("aria-current");
        }
      }),
      { numRuns: 100 }
    );
  });
});
