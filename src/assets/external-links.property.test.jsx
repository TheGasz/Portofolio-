import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";
import { ContactSection } from "./ContactSection.jsx";

// Feature: portfolio-redesign, Property 6: For any rendered link that opens in a new browsing context (project link-outs and configured social links), the link has target="_blank" and a rel attribute that includes both noopener and noreferrer
//
// Validates: Requirements 7.4, 4.4
//
// Strategy: exercise BOTH surfaces that render links opening in a new browsing
// context — ProjectCard demo/repo link-outs and ContactSection social links.
// Across each render we select ALL anchors that declare target="_blank"
// (container.querySelectorAll('a[target="_blank"]')) and assert that every such
// link carries a rel attribute whose value includes BOTH "noopener" and
// "noreferrer". We also assert the set of new-context links is non-empty when
// valid URLs are supplied, so the property is not vacuously satisfied: for
// ProjectCard we generate valid demoUrl/repoUrl (fc.webUrl()); for
// ContactSection we generate a non-empty array of socials with valid hrefs
// (fc.webUrl()) and mutually-unique labels.

afterEach(() => {
  cleanup();
});

// Assert every target="_blank" anchor in `container` has a safe rel attribute,
// and that at least `expectedMin` such anchors exist (non-vacuous check).
function assertSafeBlankLinks(container, expectedMin) {
  const blankLinks = Array.from(
    container.querySelectorAll('a[target="_blank"]')
  );

  // The expected new-context link-outs are actually rendered.
  expect(blankLinks.length).toBeGreaterThanOrEqual(expectedMin);

  for (const link of blankLinks) {
    const rel = link.getAttribute("rel") || "";
    const tokens = rel.split(/\s+/).filter(Boolean);
    expect(tokens).toContain("noopener");
    expect(tokens).toContain("noreferrer");
  }
}

// A valid absolute http(s) URL for a link-out slot.
const urlArb = fc.webUrl();

// Non-empty label fragment, made mutually unique per entry in socialsArb.
const labelArb = fc.string().filter((s) => s.trim().length > 0);

// 1..8 social links with distinct hrefs (ContactSection keys list items by
// href) and valid absolute http(s) URLs.
const socialsArb = fc.uniqueArray(
  fc.record({ label: labelArb, href: fc.webUrl() }),
  { minLength: 1, maxLength: 8, selector: (s) => s.href }
);

describe("External links carry safe relationship attributes property", () => {
  it("ProjectCard link-outs that open in a new tab have target=_blank and rel with noopener + noreferrer", () => {
    fc.assert(
      fc.property(urlArb, urlArb, (demoUrl, repoUrl) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ProjectCard
              title="Analytics Dashboard"
              description="A clean internal dashboard presenting real-time stats."
              demoUrl={demoUrl}
              repoUrl={repoUrl}
            />
          </MemoryRouter>
        );

        // Both demo and repo URLs are valid, so both CTAs open in a new tab.
        assertSafeBlankLinks(container, 2);
      }),
      { numRuns: 100 }
    );
  });

  it("ContactSection social links that open in a new tab have target=_blank and rel with noopener + noreferrer", () => {
    fc.assert(
      fc.property(socialsArb, (socials) => {
        cleanup();

        const { container } = render(
          <MemoryRouter>
            <ContactSection contactEmail={null} socials={socials} />
          </MemoryRouter>
        );

        // Every configured social link has a valid URL, so each opens in a new tab.
        assertSafeBlankLinks(container, socials.length);
      }),
      { numRuns: 100 }
    );
  });
});
