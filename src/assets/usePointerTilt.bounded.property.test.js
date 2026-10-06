import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import fc from "fast-check";
import { usePointerTilt } from "./usePointerTilt.js";

// Feature: portfolio-glow-up, Property 7: Bounded, guarded tilt
//
// For any in-bounds pointer position, the pointer-driven tilt stays within
// +/-15deg on each axis; and the tilt is fully disabled (zero / absent tilt)
// whenever the environment prefers reduced motion or exposes a coarse pointer.
//
// Validates: Requirements 2.1, 2.4, 2.5
//
// Strategy:
//   ENABLED case (fine pointer, no reduced motion): generate an arbitrary
//   element rect with positive width/height, a maxDeg (including values well
//   above the 15deg hard cap), and an IN-BOUNDS pointer coordinate (clientX in
//   [left, left+width], clientY in [top, top+height]). After onPointerMove the
//   parsed --rx/--ry must each satisfy |value| <= 15 (Req 2.1).
//
//   GUARDED case (reduced motion OR coarse pointer): with the same generators,
//   `enabled` must be false and onPointerMove must write NO --rx/--ry (the tilt
//   is absent / zero), Reqs 2.4 and 2.5.
//
// Because `enabled` is resolved in a useEffect that reads window.matchMedia, the
// mock is installed BEFORE renderHook inside each property run and restored
// after every run (and in afterEach) so runs never leak into one another.

const ORIGINAL_MATCH_MEDIA = window.matchMedia;

/**
 * Install a mocked `window.matchMedia` reporting the given matches for the
 * reduced-motion and fine-pointer queries the hook reads on mount.
 */
const mockMatchMedia = ({ reducedMotion = false, finePointer = true } = {}) => {
  window.matchMedia = vi.fn((query) => {
    let matches = false;
    if (query === "(prefers-reduced-motion: reduce)") matches = reducedMotion;
    else if (query === "(hover: hover) and (pointer: fine)") matches = finePointer;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  });
};

/** Attach a detached <div> to the hook's ref and stub its bounding rect. */
const attachElement = (result, rect) => {
  const el = document.createElement("div");
  el.getBoundingClientRect = () => ({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
  });
  result.current.ref.current = el;
  return el;
};

afterEach(() => {
  window.matchMedia = ORIGINAL_MATCH_MEDIA;
  vi.restoreAllMocks();
});

// A rect with strictly positive dimensions plus an in-bounds pointer position.
// clientX/clientY are expressed as [0,1] fractions of the width/height so they
// always land within (and on the edges of) the element bounds after scaling.
const scenarioArb = fc.record({
  left: fc.integer({ min: -2000, max: 2000 }),
  top: fc.integer({ min: -2000, max: 2000 }),
  width: fc.integer({ min: 1, max: 4000 }),
  height: fc.integer({ min: 1, max: 4000 }),
  fx: fc.double({ min: 0, max: 1, noNaN: true }),
  fy: fc.double({ min: 0, max: 1, noNaN: true }),
  maxDeg: fc.double({ min: 0, max: 1000, noNaN: true }),
});

const inBoundsPoint = ({ left, top, width, height, fx, fy }) => ({
  clientX: left + fx * width,
  clientY: top + fy * height,
});

describe("usePointerTilt — bounded, guarded tilt (Property 7)", () => {
  it("keeps the tilt within +/-15deg on each axis for any in-bounds pointer when enabled (Req 2.1)", () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        mockMatchMedia({ reducedMotion: false, finePointer: true });
        try {
          const { result, unmount } = renderHook(() =>
            usePointerTilt({ maxDeg: scenario.maxDeg })
          );
          expect(result.current.enabled).toBe(true);

          const el = attachElement(result, scenario);
          result.current.onPointerMove(inBoundsPoint(scenario));

          const rxRaw = el.style.getPropertyValue("--rx");
          const ryRaw = el.style.getPropertyValue("--ry");

          // Both axes are written as finite `<number>deg` strings. The numeric
          // part may be in scientific notation for extreme-but-tiny maxDeg
          // values (e.g. "5e-324deg"), so match a general finite-number form.
          expect(rxRaw).toMatch(/^-?(\d+(\.\d+)?|\d(\.\d+)?e-?\d+)deg$/);
          expect(ryRaw).toMatch(/^-?(\d+(\.\d+)?|\d(\.\d+)?e-?\d+)deg$/);

          const rx = parseFloat(rxRaw);
          const ry = parseFloat(ryRaw);

          // The written values are finite numbers.
          expect(Number.isFinite(rx)).toBe(true);
          expect(Number.isFinite(ry)).toBe(true);

          // Hard bound: no axis ever exceeds +/-15deg (Req 2.1).
          expect(Math.abs(rx)).toBeLessThanOrEqual(15);
          expect(Math.abs(ry)).toBeLessThanOrEqual(15);

          unmount();
        } finally {
          window.matchMedia = ORIGINAL_MATCH_MEDIA;
        }
      }),
      { numRuns: 100 }
    );
  });

  it("is disabled with zero/absent tilt under reduced-motion or a coarse pointer (Req 2.4, 2.5)", () => {
    fc.assert(
      fc.property(
        scenarioArb,
        // Guarded environments: reduced-motion on, OR fine-pointer off, OR both.
        fc.constantFrom(
          { reducedMotion: true, finePointer: true },
          { reducedMotion: false, finePointer: false },
          { reducedMotion: true, finePointer: false }
        ),
        (scenario, env) => {
          mockMatchMedia(env);
          try {
            const { result, unmount } = renderHook(() =>
              usePointerTilt({ maxDeg: scenario.maxDeg })
            );
            expect(result.current.enabled).toBe(false);

            const el = attachElement(result, scenario);
            result.current.onPointerMove(inBoundsPoint(scenario));
            result.current.onPointerLeave();

            // Handlers are no-ops when disabled: --rx/--ry are never written.
            expect(el.style.getPropertyValue("--rx")).toBe("");
            expect(el.style.getPropertyValue("--ry")).toBe("");

            unmount();
          } finally {
            window.matchMedia = ORIGINAL_MATCH_MEDIA;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
