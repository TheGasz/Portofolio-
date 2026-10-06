import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ContactSection } from "./ContactSection.jsx";

// Feature: portfolio-redesign, Property 9: For any array of configured social links with valid absolute URLs, each entry renders exactly one keyboard-focusable link whose accessible name includes that entry's label
//
// Validates: Requirements 4.3
//
// Strategy: render the prop-injectable ContactSection under MemoryRouter with a
// generated array of social links, each a { label, href } where label is a
// non-empty string and href is a valid absolute http(s) URL (fc.webUrl()).
// Labels are forced unique within an array so each entry maps to a distinct
// accessible name — otherwise two entries sharing a label would be
// indistinguishable when counting "exactly one link per entry". contactEmail is
// null so only social links are present. For each entry we assert:
//   - exactly one rendered anchor has an accessible name that includes the label
//   - that anchor is natively keyboard-focusable: it is an <a> element with a
//     non-empty href (anchors with href are in the tab order by default).
// Accessible names are read from aria-label (ContactSection sets
// aria-label={`${label} (opens in a new tab)`}), so the label is a substring.

afterEach(() => {
  cleanup();
});

// Non-empty label fragment: any string whose trimmed form is non-empty.
const labelArb = fc.string().filter((s) => s.trim().length > 0);

// A social link entry: a non-empty label plus a valid absolute http(s) URL.
const socialArb = fc.record({
  label: labelArb,
  href: fc.webUrl(),
});

// An array of 1..8 social links with distinct hrefs (ContactSection keys list
// items by href), then post-processed so labels are mutually non-substring.
//
// Labels must be mutually non-substring so each entry is independently
// identifiable by substring match on an accessible name — two entries where one
// label is a substring of the other would make "exactly one match" ambiguous.
// We guarantee this by prefixing each generated fragment with a per-entry
// delimited unique index token (e.g. "[0]-"), which no other entry's name can
// contain. The arbitrary fragment is preserved so real-world label text (spaces,
// punctuation, unicode) is still exercised inside the accessible name, and
// hrefs remain the fast-check-generated valid absolute URLs.
const socialsArb = fc
  .uniqueArray(socialArb, {
    minLength: 1,
    maxLength: 8,
    selector: (s) => s.href,
  })
  .map((entries) =>
    entries.map((entry, i) => ({
      label: `[${i}]-${entry.label}`,
      href: entry.href,
    }))
  );

describe("Configured social links focusable and named property", () => {
  it("renders exactly one keyboard-focusable, label-named link per configured entry", () => {
    fc.assert(
      fc.property(socialsArb, (socials) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ContactSection contactEmail={null} socials={socials} />
          </MemoryRouter>
        );

        const links = Array.from(container.querySelectorAll("a[aria-label]"));

        // One link per entry (all generated hrefs are valid absolute URLs).
        expect(links.length).toBe(socials.length);

        for (const { label } of socials) {
          // Exactly one rendered link whose accessible name includes the label.
          const matches = links.filter((a) =>
            (a.getAttribute("aria-label") || "").includes(label)
          );
          expect(matches.length).toBe(1);

          const link = matches[0];

          // Keyboard-focusable: a native anchor with a non-empty href is in the
          // default tab order and must not be removed from it.
          expect(link.tagName).toBe("A");
          expect(link.getAttribute("href")).toBeTruthy();
          expect(link).not.toHaveAttribute("tabindex", "-1");
        }
      }),
      { numRuns: 100 }
    );
  });
});
