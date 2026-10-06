import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 1: For any array of Project_Entry values, rendering the Projects page produces exactly one Project_Card per entry, in the same order as the array — and appending a new entry yields exactly one additional card for that entry with all others unchanged
//
// Validates: Requirements 5.2, 13.1
//
// Strategy: the Projects page maps its entries to one ProjectCard per entry in
// array order. To exercise "for any array of entries" we render the same
// mapping (entries -> ProjectCard, keyed by id, in order) that Projects uses,
// using the exported ProjectCard. Each entry is given a unique, index-prefixed
// title so individual cards can be located and counted by their title text, and
// their document order can be compared against the input array order.

afterEach(() => {
  cleanup();
});

// A test harness that renders a list of ProjectCards exactly the way the
// Projects page does: one card per entry, in array order, keyed by id.
const ProjectList = ({ entries }) => (
  <MemoryRouter>
    <div>
      {entries.map((entry) => (
        <ProjectCard
          key={entry.id}
          title={entry.title}
          description={entry.description}
          image={entry.image}
          tech={entry.tech}
          demoUrl={entry.demoUrl}
          repoUrl={entry.repoUrl}
        />
      ))}
    </div>
  </MemoryRouter>
);

// Arbitrary for the per-entry content fields (title is assigned separately so
// it stays unique across the array). Fields are kept optional to mirror the
// Project_Entry shape, but the title we inject is always present and unique.
const techArb = fc.array(fc.string({ minLength: 1, maxLength: 12 }), {
  maxLength: 5,
});

// Build an array of entries with guaranteed-unique, index-prefixed titles so we
// can locate each card unambiguously by its title heading.
const entriesArb = fc
  .array(
    fc.record({
      description: fc.option(fc.string({ maxLength: 60 }), { nil: undefined }),
      image: fc.option(fc.webUrl(), { nil: undefined }),
      tech: fc.option(techArb, { nil: undefined }),
    }),
    { minLength: 1, maxLength: 8 }
  )
  .map((partials) =>
    partials.map((p, index) => ({
      id: index,
      // Unique, order-encoding title. The "#<index>" suffix makes every title
      // distinct and lets us assert both presence (one per entry) and order.
      title: `Project #${index}`,
      ...p,
    }))
  );

// Collect the ordered list of card titles currently in the document. Each card
// renders its title inside an <h3> heading, so heading order == card order.
function renderedTitlesInOrder() {
  const headings = screen.queryAllByRole("heading", { level: 3 });
  return headings.map((h) => h.textContent);
}

describe("Projects: one ordered card per entry property", () => {
  it("renders exactly one card per entry in the same order as the array", () => {
    fc.assert(
      fc.property(entriesArb, (entries) => {
        cleanup();
        render(<ProjectList entries={entries} />);

        const expectedTitles = entries.map((e) => e.title);

        // Exactly one card per entry: count of title headings equals entry count.
        const titles = renderedTitlesInOrder();
        expect(titles).toHaveLength(entries.length);

        // Each entry's title appears exactly once.
        for (const title of expectedTitles) {
          const matches = screen.getAllByText(title);
          expect(matches).toHaveLength(1);
        }

        // Order is preserved: rendered heading order equals input array order.
        expect(titles).toEqual(expectedTitles);
      }),
      { numRuns: 100 }
    );
  });

  it("appending a new entry yields exactly one additional card at the end, others unchanged", () => {
    fc.assert(
      fc.property(entriesArb, (entries) => {
        cleanup();

        // Render the baseline list first and capture its ordered titles.
        const { rerender } = render(<ProjectList entries={entries} />);
        const baselineTitles = renderedTitlesInOrder();
        expect(baselineTitles).toEqual(entries.map((e) => e.title));

        // Append a brand-new entry with a title that cannot collide with the
        // index-prefixed baseline titles.
        const newEntry = {
          id: `appended-${entries.length}`,
          title: `Appended Project ${entries.length}`,
          description: "A freshly appended project entry.",
          tech: ["React"],
        };
        const extended = [...entries, newEntry];

        rerender(<ProjectList entries={extended} />);

        const extendedTitles = renderedTitlesInOrder();

        // Exactly one more card than before.
        expect(extendedTitles).toHaveLength(baselineTitles.length + 1);

        // All original cards unchanged and in the same order (prefix equality).
        expect(extendedTitles.slice(0, baselineTitles.length)).toEqual(
          baselineTitles
        );

        // The one additional card is the appended entry, at the end.
        expect(extendedTitles[extendedTitles.length - 1]).toBe(newEntry.title);

        // The appended title appears exactly once.
        expect(screen.getAllByText(newEntry.title)).toHaveLength(1);
      }),
      { numRuns: 100 }
    );
  });
});
