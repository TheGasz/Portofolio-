import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProjectCard } from "./project.jsx";

// Structure regression for ProjectCard after the glow-up (task 9.1).
//
// The glow-up is presentation-only: it adds hover/tilt/reveal classes and
// pointer handlers but MUST NOT change the card's accessible structure. This
// test pins the regression invariants for a fully-populated card (both
// link-outs present):
//   - both link-outs keep their accessible names, destinations, and safe
//     external `rel` (Req 2.7 presentation-only, Req 7.5 safe external links)
//   - the image `alt` equals the title
//   - the tech tags keep their text, order, and count via the preserved
//     `span.bg-blue-50` selector (Req 3.2)
//
// _Requirements: 2.7, 3.2, 7.5_

afterEach(() => {
  cleanup();
});

const ENTRY = {
  title: "Analytics Dashboard",
  description:
    "A clean internal dashboard for data management, presenting real-time user statistics and reports.",
  image: "https://example.com/img.jpg",
  tech: ["React", "Chart.js", "Express"],
  demoUrl: "https://demo.example.com",
  repoUrl: "https://repo.example.com",
};

function renderCard() {
  return render(
    <MemoryRouter>
      <ProjectCard
        title={ENTRY.title}
        description={ENTRY.description}
        image={ENTRY.image}
        tech={ENTRY.tech}
        demoUrl={ENTRY.demoUrl}
        repoUrl={ENTRY.repoUrl}
      />
    </MemoryRouter>
  );
}

describe("ProjectCard structure regression after glow-up (Req 2.7, 3.2, 7.5)", () => {
  it("exposes the Live Demo link-out with correct accessible name, href, target, and rel", () => {
    renderCard();

    const demoLink = screen.getByRole("link", {
      name: `Live demo of ${ENTRY.title}`,
    });

    expect(demoLink).toHaveAttribute("href", ENTRY.demoUrl);
    expect(demoLink).toHaveAttribute("target", "_blank");

    const rel = demoLink.getAttribute("rel") || "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("exposes the Source Code link-out with correct accessible name, href, target, and rel", () => {
    renderCard();

    const repoLink = screen.getByRole("link", {
      name: `Source repository of ${ENTRY.title}`,
    });

    expect(repoLink).toHaveAttribute("href", ENTRY.repoUrl);
    expect(repoLink).toHaveAttribute("target", "_blank");

    const rel = repoLink.getAttribute("rel") || "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("renders exactly the two expected link-outs", () => {
    renderCard();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("sets the image alt text equal to the title", () => {
    renderCard();

    const img = screen.getByRole("img", { name: ENTRY.title });
    expect(img).toHaveAttribute("alt", ENTRY.title);
    expect(img).toHaveAttribute("src", ENTRY.image);
  });

  it("preserves tech tag text, order, and count via span.bg-blue-50", () => {
    const { container } = renderCard();

    const tagSpans = container.querySelectorAll("span.bg-blue-50");
    expect(tagSpans).toHaveLength(ENTRY.tech.length);
    expect(Array.from(tagSpans).map((s) => s.textContent)).toEqual(ENTRY.tech);
  });

  it("keeps the glow-up presentation hooks present (sanity: group, card-tilt, reveal)", () => {
    const { container } = renderCard();

    // The card container carries both `group` (for hover emphasis) and
    // `card-tilt` (for the pointer-tilt transform).
    const tiltCard = container.querySelector(".card-tilt");
    expect(tiltCard).not.toBeNull();
    expect(tiltCard.classList.contains("group")).toBe(true);

    // The outer wrapper carries the scroll-reveal class.
    expect(container.querySelector(".reveal")).not.toBeNull();
  });
});
