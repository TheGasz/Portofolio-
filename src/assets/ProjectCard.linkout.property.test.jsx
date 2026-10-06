import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";
import { isValidHttpUrl } from "./url.js";

// Feature: portfolio-redesign, Property 5: For any pair of demoUrl and repoUrl values (each independently absent, empty, invalid, or a valid absolute http(s) URL), the rendered Project_Card displays a link-out CTA for a given slot if and only if that slot's URL is a valid absolute http(s) URL, each present CTA's target equals its source URL, and all other card content is unaffected
//
// Validates: Requirements 7.1, 7.2, 7.3, 7.6
//
// Strategy: render a ProjectCard under MemoryRouter with a fixed title and
// description. Each of demoUrl and repoUrl is independently drawn from a mix of
// absent (undefined), empty (""), invalid strings, and valid absolute http(s)
// URLs (fast-check's webUrl). For each slot we assert the link-out CTA appears
// if and only if isValidHttpUrl(url) is true; when present, its href equals the
// source URL exactly; when absent, no such link exists. We also assert the
// title and description still render regardless of URL state (content
// unaffected).

afterEach(() => {
  cleanup();
});

const TITLE = "Analytics Dashboard";
const DESCRIPTION = "A clean internal dashboard presenting real-time stats.";

// Accessible names the card uses for each slot (destination type + title).
const DEMO_NAME = new RegExp(`live demo of ${TITLE}`, "i");
const REPO_NAME = new RegExp(`source repository of ${TITLE}`, "i");

// A slot URL can be: absent, empty, an invalid non-URL string, or a valid
// absolute http(s) URL. Covers all four buckets from the property statement.
const slotUrlArb = fc.oneof(
  fc.constant(undefined),
  fc.constant(""),
  // Invalid strings: free-form text plus a few concrete non-http(s) shapes.
  fc.oneof(
    fc.string(),
    fc.constantFrom("not a url", "ftp://example.com", "//example.com", "mailto:a@b.com", "   ")
  ),
  // Valid absolute http(s) URLs.
  fc.webUrl()
);

describe("ProjectCard link-out CTA property", () => {
  it("renders a CTA for a slot iff its URL is a valid absolute http(s) URL, with matching href, content unaffected", () => {
    fc.assert(
      fc.property(slotUrlArb, slotUrlArb, (demoUrl, repoUrl) => {
        cleanup();

        render(
          <MemoryRouter>
            <ProjectCard
              title={TITLE}
              description={DESCRIPTION}
              demoUrl={demoUrl}
              repoUrl={repoUrl}
            />
          </MemoryRouter>
        );

        const slots = [
          { url: demoUrl, name: DEMO_NAME },
          { url: repoUrl, name: REPO_NAME },
        ];

        for (const { url, name } of slots) {
          const link = screen.queryByRole("link", { name });

          if (isValidHttpUrl(url)) {
            // CTA present exactly when the slot URL is valid.
            expect(link).not.toBeNull();
            // Each present CTA's target equals its source URL.
            expect(link).toHaveAttribute("href", url);
          } else {
            // No CTA for absent / empty / invalid URLs.
            expect(link).toBeNull();
          }
        }

        // All other card content is unaffected by URL validity.
        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
      }),
      { numRuns: 100 }
    );
  });
});
