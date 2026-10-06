import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { SkillsSection } from "./core.jsx";

// Feature: portfolio-redesign, Property 8: For any non-empty skills array (length 3–12), the rendered "What I Do" section displays exactly one skill card per item, in the same order as the array
//
// Validates: Requirements 2.1
//
// Strategy: Core renders the module-level `skills` const, which is not
// prop-injectable. The "What I Do" section is therefore extracted into the
// exported presentational component `SkillsSection`, which Core renders with
// `<SkillsSection skills={skills} />`. To exercise "for any non-empty skills
// array" we render SkillsSection directly with generated arbitrary skills
// arrays (length 3–12) under MemoryRouter. Each skill is given a unique,
// index-prefixed title so individual cards can be located and counted by their
// <h3> title heading, and their document order can be compared against the
// input array order.

afterEach(() => {
  cleanup();
});

// Arbitrary for a single skill's non-identifying fields. Descriptions and icons
// are non-empty strings mirroring the Skill shape; the title is assigned
// separately so it stays unique and order-encoding across the array.
const skillPartialArb = fc.record({
  description: fc.string({ minLength: 1, maxLength: 60 }),
  icon: fc.string({ minLength: 1, maxLength: 4 }),
});

// Build a non-empty skills array (length 3–12) with guaranteed-unique,
// index-prefixed titles so each card is locatable unambiguously by its title.
const skillsArb = fc
  .array(skillPartialArb, { minLength: 3, maxLength: 12 })
  .map((partials) =>
    partials.map((p, index) => ({
      // Unique, order-encoding title. The "#<index>" suffix makes every title
      // distinct and lets us assert both presence (one per item) and order.
      title: `Skill #${index}`,
      ...p,
    }))
  );

// Collect the ordered list of skill-card titles currently in the document. Each
// card renders its title inside an <h3> heading, so heading order == card order.
// The section's own "What I Do" heading is an <h2>, so it is excluded here.
function renderedTitlesInOrder() {
  const headings = screen.queryAllByRole("heading", { level: 3 });
  return headings.map((h) => h.textContent);
}

describe("What I Do: one ordered skill card per item property", () => {
  it("renders exactly one skill card per item in the same order as the array", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        cleanup();

        render(
          <MemoryRouter>
            <SkillsSection skills={skills} />
          </MemoryRouter>
        );

        const expectedTitles = skills.map((s) => s.title);

        // Exactly one card per item: count of title headings equals item count.
        const titles = renderedTitlesInOrder();
        expect(titles).toHaveLength(skills.length);

        // Each item's title appears exactly once.
        for (const title of expectedTitles) {
          expect(screen.getAllByText(title)).toHaveLength(1);
        }

        // Order is preserved: rendered heading order equals input array order.
        expect(titles).toEqual(expectedTitles);
      }),
      { numRuns: 100 }
    );
  });
});
