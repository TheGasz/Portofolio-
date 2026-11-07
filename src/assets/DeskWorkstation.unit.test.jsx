import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  Core,
  siteConfig,
  skills,
  certifications,
  aboutNarrative,
} from "./core.jsx";
import { DeskWorkstation } from "./desk/DeskWorkstation.jsx";
import { DESK_HOTSPOTS, DEFAULT_READOUT } from "./desk/deskModel.js";

afterEach(() => {
  cleanup();
});

const renderWorkstation = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <DeskWorkstation
              siteConfig={siteConfig}
              skills={skills}
              certifications={certifications}
              aboutNarrative={aboutNarrative}
              aboutFacts={[
                { label: "Focus", value: "ML models + pipelines" },
                { label: "Toolkit", value: "Python, PyTorch" },
              ]}
              toolbelt={["Python", "PyTorch", "FastAPI"]}
              profilePhoto="/test-profile.jpg"
              projectCount={11}
            />
          }
        />
        <Route path="/project" element={<div>Routed Projects Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("DeskWorkstation 3D Isometric Scene & Hotspots", () => {
  it("renders the SVG workstation with all 5 interactive hotspots and default readout", () => {
    const { container } = renderWorkstation();

    const svgGroup = screen.getByRole("group", {
      name: /Interactive 3D Isometric Workstation/i,
    });
    expect(svgGroup).toBeInTheDocument();

    // All 5 SVG hotspot groups are present, focusable, and named.
    for (const hotspot of DESK_HOTSPOTS) {
      const node = container.querySelector(
        `g.desk-hotspot[data-hotspot="${hotspot.id}"]`
      );
      expect(node).not.toBeNull();
      expect(node).toHaveAttribute("role", "button");
      expect(node).toHaveAttribute("tabindex", "0");
      expect(node).toHaveAttribute("aria-label", hotspot.ariaLabel);
    }

    // Default readout text is displayed.
    const readout = screen.getByTestId("desk-readout");
    expect(readout).toHaveTextContent(DEFAULT_READOUT);
  });

  it("updates the live readout bar on hotspot hover and focus", () => {
    const { container } = renderWorkstation();
    const readout = screen.getByTestId("desk-readout");

    const monitorHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="monitor"]'
    );
    fireEvent.mouseEnter(monitorHotspot);
    expect(readout).toHaveTextContent(/01 \/ MONITOR/i);

    fireEvent.mouseLeave(monitorHotspot);
    expect(readout).toHaveTextContent(DEFAULT_READOUT);

    const phoneHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="phone"]'
    );
    fireEvent.focus(phoneHotspot);
    expect(readout).toHaveTextContent(/03 \/ DESK PHONE/i);
  });

  it("navigates to /project when [01] Monitor & PC hotspot is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    const monitorHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="monitor"]'
    );
    await user.click(monitorHotspot);

    expect(screen.getByText("Routed Projects Page")).toBeInTheDocument();
  });

  it("opens and closes the [02] About Me overlay when Wall Portrait is clicked or Escape is pressed", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    const photoHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="photo"]'
    );
    await user.click(photoHotspot);

    const dialog = screen.getByTestId("desk-overlay-photo");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
    expect(within(dialog).getByText(/data enthusiast who loves turning raw/i)).toBeInTheDocument();

    const jumpLink = within(dialog).getByRole("link", {
      name: /Jump to Full About Section/i,
    });
    expect(jumpLink).toHaveAttribute("href", "#about");

    // Pressing Escape closes the overlay.
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("desk-overlay-photo")).not.toBeInTheDocument();
  });

  it("opens [03] Contact Me overlay with mailto, Copy email, LinkedIn, and GitHub when Desk Telephone is clicked", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      configurable: true,
      writable: true,
    });

    const { container } = renderWorkstation();

    const phoneHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="phone"]'
    );
    await user.click(phoneHotspot);

    const dialog = screen.getByTestId("desk-overlay-phone");
    expect(dialog).toBeInTheDocument();

    // Direct mailto link (never target="_blank").
    const mailtoLink = within(dialog).getByRole("link", {
      name: /bagasadjie2006@gmail\.com/i,
    });
    expect(mailtoLink).toHaveAttribute("href", "mailto:bagasadjie2006@gmail.com");
    expect(mailtoLink).not.toHaveAttribute("target", "_blank");

    // Copy email button inside overlay.
    const copyBtn = within(dialog).getByRole("button", { name: /copy email/i });
    await user.click(copyBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("bagasadjie2006@gmail.com");
    expect(copyBtn).toHaveTextContent(/Copied!/i);

    // Social links with target="_blank" and rel="noopener noreferrer".
    const githubLink = within(dialog).getByRole("link", { name: /GitHub/i });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = within(dialog).getByRole("link", { name: /LinkedIn/i });
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("opens [04] Skills overlay when Lab Notebook is clicked and [05] Credentials overlay when Trophy Shelf is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    // Click [04] Lab Notebook
    const notebookHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="notebook"]'
    );
    await user.click(notebookHotspot);

    const skillsDialog = screen.getByTestId("desk-overlay-notebook");
    expect(skillsDialog).toBeInTheDocument();
    expect(within(skillsDialog).getByText("Data Science & ML")).toBeInTheDocument();
    expect(
      within(skillsDialog).getByRole("link", { name: /Jump to Full Skills Section/i })
    ).toHaveAttribute("href", "#skills");

    // Switch directly to [05] Trophy Shelf
    const trophyHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="trophy"]'
    );
    await user.click(trophyHotspot);

    expect(screen.queryByTestId("desk-overlay-notebook")).not.toBeInTheDocument();
    const trophyDialog = screen.getByTestId("desk-overlay-trophy");
    expect(trophyDialog).toBeInTheDocument();
    expect(within(trophyDialog).getByText(/Pelatihan Data Science/i)).toBeInTheDocument();
    expect(
      within(trophyDialog).getByRole("link", {
        name: /Jump to Full Credentials Section/i,
      })
    ).toHaveAttribute("href", "#credentials");
  });

  it("supports keyboard shortcuts 1–5 and toggling callout pins", async () => {
    const user = userEvent.setup();
    renderWorkstation();

    // Press "2" to open About Me overlay
    await user.keyboard("2");
    expect(screen.getByTestId("desk-overlay-photo")).toBeInTheDocument();

    // Toggle Pins button
    const pinsBtn = screen.getByRole("button", {
      name: /hotspot callout pins/i,
    });
    expect(pinsBtn).toHaveTextContent(/Pins: ON/i);
    await user.click(pinsBtn);
    expect(pinsBtn).toHaveTextContent(/Pins: OFF/i);

    // Press "1" to navigate to /project
    await user.keyboard("1");
    expect(screen.getByText("Routed Projects Page")).toBeInTheDocument();
  });

  it("renders inside Core on Home (/) with all anchor sections present", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Core />
      </MemoryRouter>
    );

    expect(screen.getByTestId("desk-workstation")).toBeInTheDocument();
    expect(container.querySelector("#skills")).not.toBeNull();
    expect(container.querySelector("#featured-works")).not.toBeNull();
    expect(container.querySelector("#credentials")).not.toBeNull();
    expect(container.querySelector("#about")).not.toBeNull();
    expect(container.querySelector("#contact")).not.toBeNull();
  });
});

