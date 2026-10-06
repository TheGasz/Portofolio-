import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fc from "fast-check";
import { ProjectCard } from "./project.jsx";

// Feature: portfolio-redesign, Property 4: For any Project_Entry that has an image and a title, the rendered project image has a non-empty alt attribute whose text equals the entry's title
//
// Validates: Requirements 6.4, 10.2
//
// Strategy: generate a non-empty (non-whitespace-only) title and a non-empty
// image URL string. The ProjectCard renders an <img alt={title}> when an image
// is present and has not errored; on initial render imgError is false, so the
// image is shown. We locate the image by role "img" and assert its alt
// attribute is non-empty and exactly equals the generated title.

afterEach(() => {
  cleanup();
});

// Non-empty strings that are not whitespace-only, so the title is a meaningful
// accessible name and getByAltText resolves to a real value.
const nonBlankStringArb = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0);

// A non-empty image URL string. The component only checks truthiness of the
// image prop (image && !imgError), so any non-empty string exercises the
// image-present branch.
const imageUrlArb = fc.webUrl().filter((s) => s.length > 0);

describe("ProjectCard image alt equals title property", () => {
  it("renders an image whose non-empty alt equals the title when image and title are present", () => {
    fc.assert(
      fc.property(nonBlankStringArb, imageUrlArb, (title, image) => {
        cleanup();

        render(
          <MemoryRouter>
            <ProjectCard title={title} image={image} />
          </MemoryRouter>
        );

        // The image renders (image present, not errored on initial render).
        const img = screen.getByRole("img");
        const alt = img.getAttribute("alt");

        // Alt is non-empty and exactly equals the entry's title. We compare the
        // raw alt attribute (not RTL's getByAltText, which normalizes/trims
        // whitespace) so the equality check is truly exact.
        expect(alt).not.toBeNull();
        expect(alt.length).toBeGreaterThan(0);
        expect(alt).toBe(title);
      }),
      { numRuns: 100 }
    );
  });
});
