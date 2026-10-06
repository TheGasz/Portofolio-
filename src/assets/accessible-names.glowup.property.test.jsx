import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { computeAccessibleName } from "dom-accessibility-api";
import fc from "fast-check";
import Core from "./core.jsx";
import Projects from "./project.jsx";

// Feature: portfolio-glow-up, Property 5: Accessible names preserved
//
// For the Home_Page and Projects_Page rendered with the glow-up applied, every
// interactive element (link, button) has a non-empty accessible name.
//
// Validates: Requirements 7.4
//
// Strategy: this is the glow-up regression analog of the portfolio-redesign
// accessible-name property. It proves the glow-up's added classes, hooks, and
// micro-interactions did NOT remove or empty any accessible name. Both the Home
// (Core) and Projects pages read their content from module-level data, so
// rendering the real page components satisfies "any page rendered with any valid
// data". A page-selector arbitrary (fc.constantFrom) exercises both pages across
// >= 100 iterations. For every interactive element on the rendered page (links
// and buttons), we compute its accessible name and assert it is a non-empty
// string.

afterEach(() => {
  cleanup();
});

// Maps the page selector to the real page component under test.
const PAGES = {
  home: Core,
  projects: Projects,
};

/**
 * Resolve the accessible name of an element, preferring the spec-compliant
 * computeAccessibleName from dom-accessibility-api, with a textContent /
 * aria-label fallback for robustness.
 */
function accessibleNameOf(element) {
  const computed = computeAccessibleName(element);
  if (computed && computed.trim() !== "") return computed.trim();

  const text = (element.textContent || "").trim();
  if (text !== "") return text;

  const ariaLabel = (element.getAttribute("aria-label") || "").trim();
  return ariaLabel;
}

describe("Glow-up: every interactive element has a non-empty accessible name property", () => {
  it("gives every link and button a non-empty accessible name on Home and Projects", () => {
    fc.assert(
      fc.property(fc.constantFrom("home", "projects"), (pageKey) => {
        cleanup();

        const Page = PAGES[pageKey];
        render(
          <MemoryRouter>
            <Page />
          </MemoryRouter>
        );

        // All interactive elements on the page: links and buttons.
        const links = screen.getAllByRole("link");
        const buttons = screen.queryAllByRole("button");
        const interactive = [...links, ...buttons];

        // There should be at least one interactive element on each page.
        expect(interactive.length).toBeGreaterThan(0);

        for (const el of interactive) {
          const name = accessibleNameOf(el);
          expect(typeof name).toBe("string");
          expect(name.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });
});
