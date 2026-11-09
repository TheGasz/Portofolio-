import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProjectDetailPage } from "./ProjectDetailPage.jsx";

afterEach(() => {
  cleanup();
});

describe("ProjectDetailPage standalone route", () => {
  it("renders case study with exactly one h1 and sets document.title", () => {
    render(
      <MemoryRouter initialEntries={["/project/enterprise-ai-support-copilot"]}>
        <Routes>
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/enterprise ai support copilot/i);

    expect(document.title).toContain("Enterprise AI Support Copilot");

    // Nav links
    expect(screen.getByRole("link", { name: /return to bagas works room/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to all projects/i })).toBeInTheDocument();
  });
});

