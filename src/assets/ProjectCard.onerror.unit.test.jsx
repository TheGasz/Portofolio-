import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProjectCard } from "./project.jsx";

afterEach(() => {
  cleanup();
});

// Unit test for the image onError fallback (Requirements 5.6, 6.5).
//
// When a project image fails to load, the card's onError handler flips the
// per-card imgError state so the <img> is replaced by a same-size decorative
// placeholder (an aria-hidden div with the gradient classes containing an
// svg). The textual content — title, description, and tech tags — must remain
// rendered so the card stays informative even without a working image.
describe("ProjectCard image onError fallback", () => {
  const renderCard = () =>
    render(
      <MemoryRouter>
        <ProjectCard
          title="E-commerce"
          description="A store"
          tech={["React", "Tailwind"]}
          image="https://broken.example/x.png"
        />
      </MemoryRouter>
    );

  it("replaces the broken image with the placeholder while keeping content", () => {
    const { container } = renderCard();

    // Initially the image renders (alt equals the title).
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "E-commerce");

    // Simulate the image failing to load.
    fireEvent.error(img);

    // The image is gone, replaced by the gradient placeholder.
    expect(screen.queryByRole("img")).toBeNull();

    const placeholder = container.querySelector(".from-blue-500");
    expect(placeholder).not.toBeNull();
    expect(placeholder.getAttribute("aria-hidden")).toBe("true");
    expect(placeholder.querySelector("svg")).not.toBeNull();

    // Title, description, and tags remain in the document.
    expect(screen.getByText("E-commerce")).toBeInTheDocument();
    expect(screen.getByText("A store")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });
});
