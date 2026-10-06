import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects, { ProjectGrid } from "./project.jsx";

// Unit tests for the Projects page heading/intro order and the empty state.
//
// Requirement 5.1: the Projects_Page displays a section heading and an
// introductory description text block positioned ABOVE the Project_Card grid.
// Requirement 5.5: when the projects data array is empty, the page displays a
// message indicating no projects are currently available in place of the grid.
//
// The empty state is exercised via the extracted presentational `ProjectGrid`
// component (rendered by Projects with `projectsData`), which lets us inject an
// empty array without mutating the module-level `projectsData` const (Req 5.4).

afterEach(() => {
  cleanup();
});

const EMPTY_STATE_MESSAGE = "No projects are currently available.";

describe("Projects page: heading/intro order (Req 5.1)", () => {
  it("renders an h1 'Featured Works' and an intro paragraph", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Featured Works",
    });
    expect(heading).toBeInTheDocument();

    // Intro description text block is present above the grid.
    const intro = screen.getByText(
      /A collection of projects showcasing my journey and skills/i
    );
    expect(intro).toBeInTheDocument();
  });

  it("places the heading and intro before the first project card in DOM order", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Featured Works",
    });
    const intro = screen.getByText(
      /A collection of projects showcasing my journey and skills/i
    );

    // The first project card's title renders as an <h3> heading.
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(cardHeadings.length).toBeGreaterThan(0);
    const firstCardHeading = cardHeadings[0];

    // DOCUMENT_POSITION_FOLLOWING on the result means the argument node
    // (firstCardHeading) comes AFTER the reference node in document order,
    // i.e. the h1 precedes the first card.
    expect(
      heading.compareDocumentPosition(firstCardHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    // The intro paragraph also precedes the first card.
    expect(
      intro.compareDocumentPosition(firstCardHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    // The h1 precedes the intro, confirming the heading-then-intro order.
    expect(
      heading.compareDocumentPosition(intro) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("does not show the empty-state message when projects exist", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    expect(screen.queryByText(EMPTY_STATE_MESSAGE)).not.toBeInTheDocument();
  });
});

describe("Projects grid: empty state (Req 5.5)", () => {
  it("shows the empty-state message and no project cards when projects is empty", () => {
    render(
      <MemoryRouter>
        <ProjectGrid projects={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText(EMPTY_STATE_MESSAGE)).toBeInTheDocument();

    // The empty state replaces the grid: no project-card title headings.
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });

  it("defaults to the empty state when no projects prop is provided", () => {
    render(
      <MemoryRouter>
        <ProjectGrid />
      </MemoryRouter>
    );

    expect(screen.getByText(EMPTY_STATE_MESSAGE)).toBeInTheDocument();
  });

  it("renders one card per entry and no empty-state message when projects exist", () => {
    const projects = [
      { id: 1, title: "Alpha", description: "First", tech: ["React"] },
      { id: 2, title: "Beta", description: "Second", tech: ["Vite"] },
    ];

    render(
      <MemoryRouter>
        <ProjectGrid projects={projects} />
      </MemoryRouter>
    );

    expect(screen.queryByText(EMPTY_STATE_MESSAGE)).not.toBeInTheDocument();

    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(cardHeadings).toHaveLength(2);
    expect(cardHeadings.map((h) => h.textContent)).toEqual(["Alpha", "Beta"]);
  });
});
