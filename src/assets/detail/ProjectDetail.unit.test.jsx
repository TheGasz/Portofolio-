import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProjectDetail } from "./ProjectDetail.jsx";
import { DemoPanel } from "./DemoPanel.jsx";

afterEach(() => {
  cleanup();
});

describe("ProjectDetail component", () => {
  it("renders all 6 case study sections for a valid slug", () => {
    render(
      <MemoryRouter>
        <ProjectDetail slug="enterprise-ai-support-copilot" headingLevel={2} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /enterprise ai support copilot/i })
    ).toBeInTheDocument();

    // Verify all 6 section headings exist
    expect(screen.getByRole("heading", { name: /problem & business context/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /data pipeline & forensic audit/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /architecture & technical trade-offs/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /evaluation & business impact/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /interactive model demo/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /code & artifacts/i })).toBeInTheDocument();

    // Verify architecture pipeline diagram
    expect(screen.getByTestId("architecture-pipeline")).toBeInTheDocument();
  });

  it("respects headingLevel={1} on standalone route and renders exactly one h1", () => {
    render(
      <MemoryRouter>
        <ProjectDetail slug="enterprise-ai-support-copilot" headingLevel={1} />
      </MemoryRouter>
    );

    const h1Elements = screen.getAllByRole("heading", { level: 1 });
    expect(h1Elements).toHaveLength(1);
    expect(h1Elements[0]).toHaveTextContent(/enterprise ai support copilot/i);
  });

  it("renders project not found state when slug does not exist", () => {
    const handleBack = vi.fn();
    render(
      <MemoryRouter>
        <ProjectDetail slug="non-existent-project" onBack={handleBack} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("project-not-found")).toBeInTheDocument();
    expect(screen.getByText(/project not found/i)).toBeInTheDocument();
  });

  it("fires onBack and onToggleMaximize when buttons are clicked", async () => {
    const handleBack = vi.fn();
    const handleMaximize = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProjectDetail
          slug="enterprise-ai-support-copilot"
          onBack={handleBack}
          onToggleMaximize={handleMaximize}
          isMaximized={false}
        />
      </MemoryRouter>
    );

    const backButtons = screen.getAllByRole("button", { name: /return to all projects/i });
    expect(backButtons.length).toBeGreaterThan(0);
    await user.click(backButtons[0]);
    expect(handleBack).toHaveBeenCalled();

    const maxButton = screen.getByRole("button", { name: /maximize to fullscreen/i });
    await user.click(maxButton);
    expect(handleMaximize).toHaveBeenCalled();
  });
});

describe("DemoPanel component", () => {
  it("renders coming-soon state cleanly with github link", () => {
    render(
      <DemoPanel
        demo={{ type: "iframe", status: "coming-soon", url: "https://example.com" }}
        title="Sample Model"
        repoUrl="https://github.com/TheGasz/test"
      />
    );

    expect(screen.getByTestId("demo-coming-soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore source code for sample model/i })).toHaveAttribute(
      "href",
      "https://github.com/TheGasz/test"
    );
  });

  it("renders iframe launch button and mounts iframe on click", async () => {
    const user = userEvent.setup();
    render(
      <DemoPanel
        demo={{ type: "iframe", status: "live", url: "https://example.com/demo" }}
        title="Live Model"
        repoUrl="https://github.com/TheGasz/test"
      />
    );

    expect(screen.getByTestId("demo-iframe-container")).toBeInTheDocument();
    const launchBtn = screen.getByRole("button", { name: /launch live interactive demo/i });
    expect(launchBtn).toBeInTheDocument();

    await user.click(launchBtn);
    expect(screen.getByTitle(/live interactive demo of live model/i)).toBeInTheDocument();
  });
});
