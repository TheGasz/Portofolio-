import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DeskWorkstation } from "../assets/desk/DeskWorkstation.jsx";
import { SfxProvider } from "../assets/audio/SfxProvider.jsx";
import { HOTSPOT_PITCH_MAP } from "../assets/audio/sfxCatalog.js";

describe("SFX Wiring (DeskWorkstation & Interactivity)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SFX toggle button with accessible state and toggles on click", () => {
    render(
      <MemoryRouter>
        <SfxProvider>
          <DeskWorkstation
            siteConfig={{ contactEmail: "test@example.com" }}
            skills={[]}
            certifications={[]}
            aboutNarrative="About me"
            aboutFacts={[]}
          />
        </SfxProvider>
      </MemoryRouter>
    );

    const sfxButton = screen.getByRole("button", {
      name: /mute interaction sound effects|enable interaction sound effects/i,
    });
    expect(sfxButton).toBeInTheDocument();
    expect(sfxButton).toHaveAttribute("aria-pressed", "true");

    // Click to mute
    fireEvent.click(sfxButton);
    expect(sfxButton).toHaveAttribute("aria-pressed", "false");
  });

  it("handles door hover and room entrance interaction", () => {
    render(
      <MemoryRouter>
        <SfxProvider>
          <DeskWorkstation
            siteConfig={{ contactEmail: "test@example.com" }}
            skills={[]}
            certifications={[]}
            aboutNarrative="About me"
            aboutFacts={[]}
          />
        </SfxProvider>
      </MemoryRouter>
    );

    const door = screen.getByRole("button", {
      name: /my portofolio — klik pintu untuk masuk/i,
    });
    expect(door).toBeInTheDocument();

    fireEvent.mouseEnter(door);
    fireEvent.click(door);

    // After clicking door, door leaf has is-opening class
    expect(door.className).toContain("is-opening");
  });

  it("has valid pitch mapping for all 6 hotspots", () => {
    const keys = ["monitor", "photo", "phone", "notebook", "trophy", "documents"];
    keys.forEach((key) => {
      expect(HOTSPOT_PITCH_MAP[key]).toBeGreaterThan(0);
    });
  });
});

