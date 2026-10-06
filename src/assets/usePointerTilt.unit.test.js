import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePointerTilt } from "./usePointerTilt.js";

// Unit tests for the `usePointerTilt` hook (Requirements 2.1, 2.3, 2.4, 2.5).
//
// The hook resolves its capability guards once on mount by reading
// `window.matchMedia` for `(prefers-reduced-motion: reduce)` and
// `(hover: hover) and (pointer: fine)`. We mock `window.matchMedia` per test
// to simulate each environment, and attach a real detached element to the
// returned `ref` so that `onPointerMove` / `onPointerLeave` can write the
// `--rx` / `--ry` CSS custom properties via `style.setProperty`.

const ORIGINAL_MATCH_MEDIA = window.matchMedia;

/**
 * Install a mocked `window.matchMedia` that reports the given matches for
 * reduced-motion and fine-pointer queries.
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
  if (rect) {
    el.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      ...rect,
    });
  }
  result.current.ref.current = el;
  return el;
};

afterEach(() => {
  window.matchMedia = ORIGINAL_MATCH_MEDIA;
  vi.restoreAllMocks();
});

describe("usePointerTilt", () => {
  it("is disabled under reduced-motion and its handlers set no transform vars (Req 2.5)", () => {
    mockMatchMedia({ reducedMotion: true, finePointer: true });

    const { result } = renderHook(() => usePointerTilt());
    expect(result.current.enabled).toBe(false);

    const el = attachElement(result, { width: 200, height: 100 });

    result.current.onPointerMove({ clientX: 150, clientY: 75 });
    result.current.onPointerLeave();

    // Handlers are no-ops when disabled: --rx/--ry are never written.
    expect(el.style.getPropertyValue("--rx")).toBe("");
    expect(el.style.getPropertyValue("--ry")).toBe("");
  });

  it("is disabled on a coarse pointer (Req 2.4)", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: false });

    const { result } = renderHook(() => usePointerTilt());
    expect(result.current.enabled).toBe(false);

    const el = attachElement(result, { width: 200, height: 100 });
    result.current.onPointerMove({ clientX: 150, clientY: 75 });

    expect(el.style.getPropertyValue("--rx")).toBe("");
    expect(el.style.getPropertyValue("--ry")).toBe("");
  });

  it("writes bounded --rx/--ry on move and resets them on leave when enabled (Req 2.1, 2.3)", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });

    const { result } = renderHook(() => usePointerTilt());
    expect(result.current.enabled).toBe(true);

    const el = attachElement(result, { left: 0, top: 0, width: 200, height: 100 });

    // Pointer at the far corner — the maximum excursion for the element.
    result.current.onPointerMove({ clientX: 200, clientY: 100 });

    const rx = parseFloat(el.style.getPropertyValue("--rx"));
    const ry = parseFloat(el.style.getPropertyValue("--ry"));

    // Both axes are written as `<deg>deg` strings.
    expect(el.style.getPropertyValue("--rx")).toMatch(/^-?\d+(\.\d+)?deg$/);
    expect(el.style.getPropertyValue("--ry")).toMatch(/^-?\d+(\.\d+)?deg$/);

    // Hard clamp: no axis ever exceeds +/-15deg (Req 2.1).
    expect(Math.abs(rx)).toBeLessThanOrEqual(15);
    expect(Math.abs(ry)).toBeLessThanOrEqual(15);

    // onPointerLeave resets both axes to exactly 0deg (Req 2.3).
    result.current.onPointerLeave();
    expect(el.style.getPropertyValue("--rx")).toBe("0deg");
    expect(el.style.getPropertyValue("--ry")).toBe("0deg");
  });

  it("respects the +/-15deg hard clamp even when maxDeg is set absurdly high (Req 2.1)", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });

    const { result } = renderHook(() => usePointerTilt({ maxDeg: 1000 }));
    expect(result.current.enabled).toBe(true);

    const el = attachElement(result, { left: 0, top: 0, width: 200, height: 100 });

    // Far corner drives each axis to its maximum magnitude.
    result.current.onPointerMove({ clientX: 0, clientY: 0 });

    const rx = parseFloat(el.style.getPropertyValue("--rx"));
    const ry = parseFloat(el.style.getPropertyValue("--ry"));

    expect(Math.abs(rx)).toBeLessThanOrEqual(15);
    expect(Math.abs(ry)).toBeLessThanOrEqual(15);
  });

  it("is disabled (no throw) when window.matchMedia is unavailable", () => {
    // Remove matchMedia entirely to simulate older browsers / bare jsdom.
    delete window.matchMedia;

    let result;
    expect(() => {
      ({ result } = renderHook(() => usePointerTilt()));
    }).not.toThrow();

    expect(result.current.enabled).toBe(false);

    const el = attachElement(result, { width: 200, height: 100 });
    expect(() => {
      result.current.onPointerMove({ clientX: 150, clientY: 75 });
      result.current.onPointerLeave();
    }).not.toThrow();

    expect(el.style.getPropertyValue("--rx")).toBe("");
    expect(el.style.getPropertyValue("--ry")).toBe("");
  });
});
