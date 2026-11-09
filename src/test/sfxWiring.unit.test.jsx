import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DeskWorkstation } from "../assets/desk/DeskWorkstation.jsx";
import { SfxProvider, useSfx } from "../assets/audio/SfxProvider.jsx";
import { HOTSPOT_PITCH_MAP } from "../assets/audio/sfxCatalog.js";

describe("SFX Wiring (DeskWorkstation & Interactivity)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables SFX by default without requiring an explicit toggle button", () => {
    let sfx;
    const Inspector = () => {
      sfx = useSfx();
      return null;
    };

    render(
      <MemoryRouter>
        <SfxProvider>
          <Inspector />
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

    // SFX is enabled by default
    expect(sfx.isSfxEnabled).toBe(true);
    expect(typeof sfx.play).toBe("function");

    // Button is cleanly removed from top bar
    const sfxButton = screen.queryByRole("button", {
      name: /mute interaction sound effects|enable interaction sound effects/i,
    });
    expect(sfxButton).not.toBeInTheDocument();
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

