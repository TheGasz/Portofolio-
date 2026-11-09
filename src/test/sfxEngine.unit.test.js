import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SFX_CATALOG,
  SFX_SAFETY_LIMITS,
  HOTSPOT_PITCH_MAP,
} from "../assets/audio/sfxCatalog.js";
import { createSfxEngine } from "../assets/audio/sfxEngine.js";

describe("SFX Catalog Safety & Spec Compliance", () => {
  it("defines safe limits", () => {
    expect(SFX_SAFETY_LIMITS.maxGain).toBeLessThanOrEqual(0.5);
    expect(SFX_SAFETY_LIMITS.maxDuration).toBeLessThanOrEqual(2.0);
  });

  it("contains all 6 hotspot pitch mappings in F-major pentatonic", () => {
    const requiredHotspots = [
      "monitor",
      "photo",
      "phone",
      "notebook",
      "trophy",
      "documents",
    ];
    requiredHotspots.forEach((id) => {
      expect(HOTSPOT_PITCH_MAP[id]).toBeDefined();
      expect(HOTSPOT_PITCH_MAP[id]).toBeGreaterThan(200);
    });
  });

  it("verifies all catalog cues adhere to duration and gain limits", () => {
    const cueNames = Object.keys(SFX_CATALOG);
    expect(cueNames.length).toBeGreaterThanOrEqual(25);

    cueNames.forEach((cue) => {
      const recipe = SFX_CATALOG[cue];
      expect(["tone", "noise", "chord", "complex"]).toContain(recipe.type);
      expect(recipe.duration).toBeGreaterThan(0);
      expect(recipe.duration).toBeLessThanOrEqual(SFX_SAFETY_LIMITS.maxDuration);
      expect(recipe.gain).toBeGreaterThan(0);
      expect(recipe.gain).toBeLessThanOrEqual(SFX_SAFETY_LIMITS.maxGain);
    });
  });
});

describe("SFX Engine (Unit & Safe Fallbacks)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("initializes without throwing in environments without AudioContext", () => {
    const engine = createSfxEngine();
    expect(engine).toBeDefined();
    expect(engine.isUnlocked).toBe(false);
    expect(engine.isEnabled).toBe(true);
  });

  it("unlocks safely without AudioContext", async () => {
    const engine = createSfxEngine();
    const result = await engine.unlock();
    expect(result).toBe(true);
    expect(engine.isUnlocked).toBe(true);
  });

  it("respects setEnabled(false)", async () => {
    const engine = createSfxEngine();
    await engine.unlock();
    engine.setEnabled(false);
    expect(engine.isEnabled).toBe(false);
    const played = engine.play("ui.hover");
    expect(played).toBe(false);
  });

  it("allows setting volume safely within [0, 1]", () => {
    const engine = createSfxEngine();
    engine.setVolume(0.5);
    expect(engine.volume).toBe(0.5);
    engine.setVolume(1.8);
    expect(engine.volume).toBe(1);
    engine.setVolume(-0.5);
    expect(engine.volume).toBe(0);
  });

  it("calls duck ambient callback when duck is invoked", () => {
    const onDuckAmbient = vi.fn();
    const engine = createSfxEngine({ onDuckAmbient });
    engine.duck(500, 0.3);
    expect(onDuckAmbient).toHaveBeenCalledWith(0.3, 500);
  });
});

