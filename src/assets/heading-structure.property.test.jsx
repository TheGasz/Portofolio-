import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import Core from "./core.jsx";
import Projects from "./project.jsx";

// Feature: portfolio-redesign, Property 13: For any page component, the rendered DOM contains exactly one h1, and in document order each heading's level is at most one greater than the maximum level seen so far (no skipped levels)
//
// Validates: Requirements 10.1
//
// Strategy: the two top-level page components (Home = Core, Projects) are pure,
// data-driven renders, so this property is exercised by rendering each page and
// inspecting its heading structure. A fast-check arbitrary selects which page to
// render on each run (Core or Projects), driving >= 100 iterations across both
// Home and Projects. For each render we:
//   1. collect every heading in document order via
//      container.querySelectorAll("h1,h2,h3,h4,h5,h6") and map to numeric levels
//   2. assert exactly one h1 (count of level === 1 is exactly 1)
//   3. assert no skipped levels: walking the headings in document order while
//      tracking maxSeen (starting at 0), each heading level L must satisfy
//      L <= maxSeen + 1 before updating maxSeen = max(maxSeen, L). This matches
//      the property's "at most one greater than the maximum level seen so far".

afterEach(() => {
  cleanup();
});

// Each page is rendered under MemoryRouter because both use React Router
// primitives (<Link>, useLocation).
const PAGES = {
  Home: () => (
    <MemoryRouter initialEntries={["/"]}>
      <Core />
    </MemoryRouter>
  ),
  Projects: () => (
    <MemoryRouter initialEntries={["/project"]}>
      <Projects />
    </MemoryRouter>
  ),
};

// Arbitrary selecting which page to render, so the property runs across both
// Home and Projects over its iterations.
const pageNameArb = fc.constantFrom(...Object.keys(PAGES));

// Read all headings in document order and map them to their numeric levels.
function headingLevelsInOrder(container) {
  const headings = container.querySelectorAll("h1,h2,h3,h4,h5,h6");
  return Array.from(headings).map((el) => Number(el.tagName.slice(1)));
}

describe("Each page has exactly one h1 and no skipped heading levels (Property 13)", () => {
  it("renders exactly one h1 and never skips a heading level in document order", () => {
    fc.assert(
      fc.property(pageNameArb, (pageName) => {
        cleanup();

        const { container } = render(PAGES[pageName]());
        const levels = headingLevelsInOrder(container);

        // Exactly one top-level heading (h1).
        const h1Count = levels.filter((level) => level === 1).length;
        expect(h1Count, `${pageName}: expected exactly one <h1>`).toBe(1);

        // No skipped levels: in document order, each heading's level is at most
        // one greater than the maximum level seen so far.
        let maxSeen = 0;
        for (const level of levels) {
          expect(
            level,
            `${pageName}: heading <h${level}> skips a level (maxSeen=${maxSeen}); ` +
              `order was [${levels.join(", ")}]`
          ).toBeLessThanOrEqual(maxSeen + 1);
          maxSeen = Math.max(maxSeen, level);
        }
      }),
      { numRuns: 100 }
    );
  });
});
