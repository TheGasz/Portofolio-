import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-glow-up, Property 2: Tilt is presentation-only — attaching
// the pointer-tilt behavior to a Project_Card never changes its accessible
// content. For any Project_Entry, the card count, the <h3> title text (and
// order), the tag text (and order), and the link-out hrefs plus accessible
// names are identical before and after the tilt handlers fire, and match the
// content derived purely from the entry data.
//
// Validates: Requirements 2.7, 7.1
//
// Strategy: the tilt lives entirely in usePointerTilt, which writes only the
// `--rx`/`--ry` CSS custom properties and never mutates DOM content, order, or
// attributes (Req 2.7). Under jsdom there is no matchMedia, so the hook resolves
// to `enabled: false` and its handlers are no-ops — firing pointer events must
// therefore leave the accessible content byte-identical, which is exactly what
// "tilt is presentation-only" guarantees in this environment.
//
// For any generated entry we render the ProjectCard (tilt attached), capture a
// snapshot of its accessible content, then fire onPointerMove/onPointerLeave on
// the tilt container (div.card-tilt) and re-capture. We assert:
//   - the before and after snapshots are deeply equal (the tilt interaction did
//     not alter any accessible content), and
//   - the snapshot matches the content expected from the entry data itself.
// Both URLs are always valid https URLs so both link-outs render with their
// `Live demo of {title}` / `Source repository of {title}` accessible names.

afterEach(() => {
  cleanup();
});

// Capture the card's accessible content from a rendered container: card count,
// the ordered <h3> titles, the ordered tag text, and the ordered link-out
// href + accessible-name pairs.
const snapshotAccessibleContent = (container) => {
  const cards = container.querySelectorAll("div.card-tilt");
  const titles = Array.from(container.querySelectorAll("h3")).map(
    (el) => el.textContent
  );
  const tags = Array.from(container.querySelectorAll("span.bg-blue-50")).map(
    (el) => el.textContent
  );
  const links = Array.from(container.querySelectorAll("a[aria-label]")).map(
    (el) => ({
      href: el.getAttribute("href"),
      name: el.getAttribute("aria-label"),
    })
  );
  return { cardCount: cards.length, titles, tags, links };
};

// Arbitrary single Project_Entry. Title/description are non-empty after
// trimming; tech is an ordered, deduped list of non-empty strings; both URLs
// are valid absolute https URLs so both link-outs render with accessible names.
const nonEmptyString = fc
  .string({ minLength: 1, maxLength: 24 })
  .filter((s) => s.trim().length > 0);

const entryArb = fc.record({
  title: nonEmptyString,
  description: nonEmptyString,
  tech: fc
    .array(nonEmptyString, { minLength: 0, maxLength: 10 })
    .map((arr) => [...new Set(arr)]),
  demoUrl: fc
    .webUrl({ validSchemes: ["https"] })
    .map((u) => u),
  repoUrl: fc.webUrl({ validSchemes: ["https"] }).map((u) => u),
});

describe("ProjectCard tilt-is-presentation-only property", () => {
  it("accessible content is identical with and without the tilt interaction", () => {
    fc.assert(
      fc.property(entryArb, (entry) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ProjectCard
              title={entry.title}
              description={entry.description}
              tech={entry.tech}
              demoUrl={entry.demoUrl}
              repoUrl={entry.repoUrl}
            />
          </MemoryRouter>
        );

        // Content derived purely from the entry data (the expectation the tilt
        // must not disturb).
        const expected = {
          cardCount: 1,
          titles: [entry.title],
          tags: entry.tech,
          links: [
            { href: entry.demoUrl, name: `Live demo of ${entry.title}` },
            {
              href: entry.repoUrl,
              name: `Source repository of ${entry.title}`,
            },
          ],
        };

        // Snapshot BEFORE any tilt interaction.
        const before = snapshotAccessibleContent(container);
        expect(before).toEqual(expected);

        // Fire the tilt handlers on the element that carries them.
        const card = container.querySelector("div.card-tilt");
        expect(card).not.toBeNull();
        fireEvent.pointerMove(card, { clientX: 10, clientY: 10 });
        fireEvent.pointerMove(card, { clientX: 200, clientY: 150 });
        fireEvent.pointerLeave(card);

        // Snapshot AFTER the tilt interaction: must be byte-identical, proving
        // the tilt is presentation-only and never mutates accessible content.
        const after = snapshotAccessibleContent(container);
        expect(after).toEqual(before);
        expect(after).toEqual(expected);
      }),
      { numRuns: 100 }
    );
  });
});
