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
import { projectsData } from "./project.jsx";

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
              projects={projectsData}
            />
          }
        />
        <Route path="/project" element={<div>Routed Projects Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("Bagas's Study Room 3D Workstation & 5 Cinematic Stage Animations", () => {
  it("renders the SVG study room with all 5 interactive hotspots, default readout, and Musik Syahdu toggle", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    const svgGroup = screen.getByRole("group", {
      name: /Interactive 3D Isometric Workstation/i,
    });
    expect(svgGroup).toBeInTheDocument();
    expect(svgGroup).toHaveAttribute("data-zoomed", "false");

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

    // Speaker icon toggle button for Musik Syahdu works cleanly.
    const musicBtn = screen.getByRole("button", {
      name: /serene room ambient music/i,
    });
    expect(musicBtn).toHaveAttribute("aria-pressed", "false");
    await user.click(musicBtn);
    expect(musicBtn).toHaveAttribute("aria-pressed", "true");
    await user.click(musicBtn);
    expect(musicBtn).toHaveAttribute("aria-pressed", "false");
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
    expect(readout).toHaveTextContent(/03 \/ SMARTPHONE ON STAND/i);
  });

  it("powers on the Monitor and dives into all 11 ProjectCards when [01] Monitor is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    const monitorHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="monitor"]'
    );
    await user.click(monitorHotspot);

    const svgGroup = screen.getByRole("group", {
      name: /Interactive 3D Isometric Workstation/i,
    });
    expect(svgGroup).toHaveAttribute("data-zoomed", "true");

    const monitorDialog = screen.getByTestId("desk-overlay-monitor");
    expect(monitorDialog).toBeInTheDocument();
    expect(
      within(monitorDialog).getByRole("heading", {
        name: /BagasOS — Project Explorer/i,
      })
    ).toBeInTheDocument();

    // Displays ProjectCards inside the monitor screen and supports category filtering
    expect(within(monitorDialog).getByText(/Showing 11 of 11 projects/i)).toBeInTheDocument();
    const ragFilterBtn = within(monitorDialog).getByRole("button", {
      name: "GenAI & Agents",
    });
    await user.click(ragFilterBtn);
    expect(within(monitorDialog).getByText(/Showing 2 of 11 projects/i)).toBeInTheDocument();

    // Exit monitor returns to room
    const exitBtn = within(monitorDialog).getByRole("button", {
      name: /Exit Monitor/i,
    });
    await user.click(exitBtn);
    expect(screen.queryByTestId("desk-overlay-monitor")).not.toBeInTheDocument();
  });

  it("opens and closes the [02] About Me portrait stage when Wall Portrait is clicked or Escape is pressed", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    const photoHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="photo"]'
    );
    await user.click(photoHotspot);

    const dialog = screen.getByTestId("desk-overlay-photo");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: /About Me/i })
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/data enthusiast who loves turning raw/i)
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("desk-overlay-photo")).not.toBeInTheDocument();
  });

  it("zooms into [03] Smartphone on Stand with mailto, Copy email, LinkedIn, and GitHub when clicked", async () => {
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

    const mailtoLink = within(dialog).getByRole("link", {
      name: /bagasadjie2006@gmail\.com/i,
    });
    expect(mailtoLink).toHaveAttribute(
      "href",
      "mailto:bagasadjie2006@gmail.com"
    );
    expect(mailtoLink).not.toHaveAttribute("target", "_blank");

    const copyBtn = within(dialog).getByRole("button", { name: /copy email/i });
    await user.click(copyBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("bagasadjie2006@gmail.com");
    expect(copyBtn).toHaveTextContent(/Copied!/i);

    const githubLink = within(dialog).getByRole("link", { name: /GitHub/i });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = within(dialog).getByRole("link", { name: /LinkedIn/i });
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("pulls out & opens [04] Book from Left Cabinet for What I Do, and ignites [05] Trophy on Top-Left Cabinet for Credentials", async () => {
    const user = userEvent.setup();
    const { container } = renderWorkstation();

    // Click [04] Left Cabinet Bookshelf
    const notebookHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="notebook"]'
    );
    await user.click(notebookHotspot);

    const bookDialog = screen.getByTestId("desk-overlay-notebook");
    expect(bookDialog).toBeInTheDocument();
    expect(within(bookDialog).getByText(/Data Science & ML/i)).toBeInTheDocument();
    expect(within(bookDialog).getByText("FastAPI")).toBeInTheDocument();

    // Click [05] Top-Left Cabinet Trophy
    const trophyHotspot = container.querySelector(
      'g.desk-hotspot[data-hotspot="trophy"]'
    );
    await user.click(trophyHotspot);

    expect(
      screen.queryByTestId("desk-overlay-notebook")
    ).not.toBeInTheDocument();
    const trophyDialog = screen.getByTestId("desk-overlay-trophy");
    expect(trophyDialog).toBeInTheDocument();
    expect(
      within(trophyDialog).getByText(/Pelatihan Data Science/i)
    ).toBeInTheDocument();
    expect(
      within(trophyDialog).getByText(/BOOTCAMP 1ST RUNNER UP/i)
    ).toBeInTheDocument();
  });

  it("supports keyboard shortcuts 1–5 and toggling callout pins", async () => {
    const user = userEvent.setup();
    renderWorkstation();

    // Press "5" to open Glowing Trophy stage
    await user.keyboard("5");
    expect(screen.getByTestId("desk-overlay-trophy")).toBeInTheDocument();

    // Toggle Pins button
    const pinsBtn = screen.getByRole("button", {
      name: /hotspot callout pins/i,
    });
    expect(pinsBtn).toHaveTextContent(/Pins: ON/i);
    await user.click(pinsBtn);
    expect(pinsBtn).toHaveTextContent(/Pins: OFF/i);

    // Press "1" to switch directly to Monitor Project Explorer
    await user.keyboard("1");
    expect(screen.getByTestId("desk-overlay-monitor")).toBeInTheDocument();
  });

  it("greets visitors with the 'My Portofolio' bedroom entrance door and enters Bagas Works Room on click", async () => {
    const user = userEvent.setup();
    renderWorkstation();

    const entranceDoor = screen.getByTestId("room-entrance-door");
    expect(entranceDoor).toBeInTheDocument();
    expect(within(entranceDoor).getByText("My Portofolio")).toBeInTheDocument();

    const doorButton = within(entranceDoor).getByRole("button", {
      name: /My Portofolio/i,
    });
    await user.click(doorButton);
    expect(entranceDoor).toHaveAttribute("data-opening", "true");
  });

  it("renders inside Core on Home (/) as a consolidated single-page room", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Core />
      </MemoryRouter>
    );

    expect(screen.getByTestId("desk-workstation")).toBeInTheDocument();
  });
});
