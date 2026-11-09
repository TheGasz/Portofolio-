import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProjectCard } from "../project.jsx";

afterEach(() => {
  cleanup();
});

describe("ProjectCard onOpenDetail prop", () => {
  it("renders Explore Architecture & Case Study button when onOpenDetail is provided and fires callback on click", async () => {
    const handleOpen = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProjectCard
          title="Enterprise AI Support Copilot"
          description="High performance RAG system."
          onOpenDetail={handleOpen}
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /view case study for enterprise ai support copilot/i,
    });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });
});

