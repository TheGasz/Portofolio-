import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DeskWorkstation } from "./DeskWorkstation.jsx";

afterEach(() => {
  cleanup();
});

describe("DeskWorkstation in-monitor project detail and maximize flow", () => {
  it("navigates into project case study inside monitor, toggles maximize, and handles ESC stack", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DeskWorkstation />
      </MemoryRouter>
    );

    // 1. Open monitor by clicking hotspot or pressing '1'
    fireEvent.keyDown(window, { key: "1" });

    // Verify monitor screen overlay is active
    expect(screen.getByTestId("desk-overlay-monitor")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /bagasos — project explorer/i })
    ).toBeInTheDocument();

    // 2. Click "View case study for Enterprise AI Support Copilot (RAG)"
    const exploreBtn = screen.getByRole("button", {
      name: /view case study for enterprise ai support copilot/i,
    });
    expect(exploreBtn).toBeInTheDocument();
    await user.click(exploreBtn);

    // 3. Verify in-monitor case study is displayed
    expect(screen.getByTestId("project-case-study")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /enterprise ai support copilot/i })
    ).toBeInTheDocument();

    // 4. Test Maximize toggle
    const maxBtn = screen.getByRole("button", { name: /maximize monitor window size/i });
    await user.click(maxBtn);

    // Monitor should now have aria-pressed=true
    expect(screen.getByRole("button", { name: /restore monitor window size/i })).toBeInTheDocument();

    // 5. Test ESC stack:
    // First ESC: restores monitor (stays in detail)
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByTestId("project-case-study")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /maximize monitor window size/i })).toBeInTheDocument();

    // Second ESC: returns from detail to grid
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("project-case-study")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /bagasos — project explorer/i })
    ).toBeInTheDocument();

    // Third ESC: closes monitor and returns to room
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("desk-overlay-monitor")).not.toBeInTheDocument();
  });

  it("returns to grid when clicking '← Back to Grid' button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DeskWorkstation />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: "1" });
    const exploreBtn = screen.getByRole("button", {
      name: /view case study for enterprise ai support copilot/i,
    });
    await user.click(exploreBtn);

    expect(screen.getByTestId("project-case-study")).toBeInTheDocument();

    const backToGridBtn = screen.getByRole("button", {
      name: /back to project list inside monitor/i,
    });
    await user.click(backToGridBtn);

    expect(screen.queryByTestId("project-case-study")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /bagasos — project explorer/i })
    ).toBeInTheDocument();
  });
});
