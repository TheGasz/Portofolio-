import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Navbar.jsx";

afterEach(() => {
  cleanup();
});

// Unit tests for client-side navigation (Requirements 8.5, 8.7).
//
// The Navigation_Bar links are react-router-dom <Link>s, which render as
// native anchors (<a href="...">) with relative, in-app hrefs. Relative
// hrefs (not absolute http(s) URLs) confirm these are client-routed links
// rather than external full-page navigations (Req 8.5). The links carry the
// shared `focus-ring` focus-visible utility and, being native anchors with
// an href, are keyboard-focusable (Req 8.7).
describe("Navbar client-side navigation", () => {
  const renderHeader = () =>
    render(
      <MemoryRouter>
        <Header title="Bagas" />
      </MemoryRouter>
    );

  it("renders Home and Projects links as router anchors with relative hrefs", () => {
    renderHeader();

    const homeLink = screen.getByRole("link", { name: "Home" });
    const projectsLink = screen.getByRole("link", { name: "Projects" });

    // Rendered as native anchors by react-router <Link> (Req 8.5).
    expect(homeLink.tagName).toBe("A");
    expect(projectsLink.tagName).toBe("A");

    // Relative in-app targets => client-side routing, not external reload.
    expect(homeLink).toHaveAttribute("href", "/");
    expect(projectsLink).toHaveAttribute("href", "/project");

    // Guard: these are not absolute http(s) URLs (which would be external).
    expect(homeLink.getAttribute("href")).not.toMatch(/^https?:\/\//i);
    expect(projectsLink.getAttribute("href")).not.toMatch(/^https?:\/\//i);
  });

  it("applies the focus-ring focus-visible class to nav links (Req 8.7)", () => {
    renderHeader();

    const homeLink = screen.getByRole("link", { name: "Home" });
    const projectsLink = screen.getByRole("link", { name: "Projects" });

    expect(homeLink.classList.contains("focus-ring")).toBe(true);
    expect(projectsLink.classList.contains("focus-ring")).toBe(true);
  });

  it("exposes nav links as keyboard-focusable elements (Req 8.7)", () => {
    renderHeader();

    const homeLink = screen.getByRole("link", { name: "Home" });
    const projectsLink = screen.getByRole("link", { name: "Projects" });

    // Native anchors with an href are reachable in the tab order; focusing
    // them makes them the active element.
    homeLink.focus();
    expect(document.activeElement).toBe(homeLink);

    projectsLink.focus();
    expect(document.activeElement).toBe(projectsLink);
  });
});
