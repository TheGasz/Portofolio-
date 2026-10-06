import { describe, it, expect, afterEach, vi } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal.js";

// Unit tests for the `useScrollReveal` hook (Requirements 4.1, 4.5, 4.7).
//
// The hook resolves its capability guards once on mount via
// `shouldStartRevealed`, which reads `window.IntersectionObserver` and
// `window.matchMedia('(prefers-reduced-motion: reduce)')`. When it starts
// revealed (reduced-motion or missing APIs) no observer is created. Otherwise
// it attaches an `IntersectionObserver` to `ref.current` and flips `revealed`
// to `true` exactly once on the first intersecting entry, then disconnects.
//
// To exercise the observer path the ref must point at a real DOM node *before*
// the mount effect runs. `renderHook` does not attach the ref to any element,
// so we render a small component via `render()` that applies `ref` to a
// `<div>`, and mock `IntersectionObserver` to capture its callback and the
// observed element. We then invoke the captured callback inside `act()` to
// simulate intersection.

const ORIGINAL_MATCH_MEDIA = window.matchMedia;
const ORIGINAL_IO = window.IntersectionObserver;

/**
 * Install a mocked `window.matchMedia` reporting the given reduced-motion
 * preference. All other queries report `matches: false`.
 */
const mockMatchMedia = ({ reducedMotion = false } = {}) => {
  window.matchMedia = vi.fn((query) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
};

/**
 * Install a mocked `IntersectionObserver` class that captures the most recent
 * instance (its callback, observed element, and observe/disconnect spies) on
 * the returned `captured` object.
 */
const mockIntersectionObserver = () => {
  const captured = { callback: null, observed: null, observe: null, disconnect: null };

  class MockIO {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observe = vi.fn((el) => {
        captured.observed = el;
      });
      this.disconnect = vi.fn();
      captured.callback = callback;
      captured.observe = this.observe;
      captured.disconnect = this.disconnect;
    }
  }

  window.IntersectionObserver = MockIO;
  return captured;
};

/** Small component that attaches the hook's ref to a real DOM node. */
const Reveal = ({ onRender }) => {
  const { ref, revealed } = useScrollReveal();
  onRender(revealed);
  return <div ref={ref} data-revealed={revealed} />;
};

afterEach(() => {
  window.matchMedia = ORIGINAL_MATCH_MEDIA;
  window.IntersectionObserver = ORIGINAL_IO;
  vi.restoreAllMocks();
});

describe("useScrollReveal", () => {
  it("starts revealed and creates no observer under reduced-motion (Req 4.5)", () => {
    mockMatchMedia({ reducedMotion: true });
    const captured = mockIntersectionObserver();

    const { result } = renderHook(() => useScrollReveal());

    expect(result.current.revealed).toBe(true);
    // No observer was ever constructed, so nothing was observed.
    expect(captured.observe).toBeNull();
  });

  it("starts revealed when IntersectionObserver is unavailable (Req 4.7)", () => {
    mockMatchMedia({ reducedMotion: false });
    // Simulate an environment without IntersectionObserver.
    delete window.IntersectionObserver;

    let result;
    expect(() => {
      ({ result } = renderHook(() => useScrollReveal()));
    }).not.toThrow();

    expect(result.current.revealed).toBe(true);
  });

  it("starts revealed when matchMedia is unavailable (Req 4.7)", () => {
    delete window.matchMedia;
    mockIntersectionObserver();

    let result;
    expect(() => {
      ({ result } = renderHook(() => useScrollReveal()));
    }).not.toThrow();

    expect(result.current.revealed).toBe(true);
  });

  it("starts false, flips to true once on intersection, disconnects, and never reverts (Req 4.1)", () => {
    mockMatchMedia({ reducedMotion: false });
    const captured = mockIntersectionObserver();

    const states = [];
    render(<Reveal onRender={(revealed) => states.push(revealed)} />);

    // Lazy initial state resolves to false (observer path active).
    expect(states[0]).toBe(false);

    // The effect observed the real <div> the ref was attached to.
    expect(captured.observe).toHaveBeenCalledTimes(1);
    expect(captured.observed).toBeInstanceOf(HTMLElement);
    expect(captured.disconnect).not.toHaveBeenCalled();

    // Fire a non-intersecting callback first: revealed must stay false.
    act(() => {
      captured.callback([{ isIntersecting: false, target: captured.observed }]);
    });
    expect(states[states.length - 1]).toBe(false);
    expect(captured.disconnect).not.toHaveBeenCalled();

    // Fire an intersecting callback: revealed flips to true exactly once and
    // the observer disconnects.
    act(() => {
      captured.callback([{ isIntersecting: true, target: captured.observed }]);
    });
    expect(states[states.length - 1]).toBe(true);
    expect(captured.disconnect).toHaveBeenCalled();

    const disconnectCountAfterReveal = captured.disconnect.mock.calls.length;
    const renderCountAfterReveal = states.length;

    // A later non-intersecting callback must NOT revert revealed back to false.
    act(() => {
      captured.callback([{ isIntersecting: false, target: captured.observed }]);
    });
    expect(states[states.length - 1]).toBe(true);

    // The monotonic flip happened exactly once: no re-render toggled it back,
    // and no additional disconnect was triggered by the stale callback.
    expect(states.filter((s) => s === true)).toHaveLength(
      states.length - renderCountAfterReveal + 1
    );
    expect(captured.disconnect.mock.calls.length).toBe(disconnectCountAfterReveal);
    expect(states.includes(true)).toBe(true);
    // Confirm there is no false after the first true (monotonicity).
    const firstTrueIdx = states.indexOf(true);
    expect(states.slice(firstTrueIdx).every((s) => s === true)).toBe(true);
  });
});
