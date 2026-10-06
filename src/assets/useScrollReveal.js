/**
 * `useScrollReveal` — a tiny, dependency-free React hook that drives the
 * one-shot Scroll_Reveal entrance on Project_Cards (Requirement 4).
 *
 * The hook attaches an `IntersectionObserver` to the element referenced by
 * `ref` and flips a single `revealed` boolean to `true` the first time the
 * element intersects the viewport by the configured `threshold`. The reveal is
 * monotonic — once revealed it never reverts, so scrolling away does not
 * re-hide content (Req 4.1). The entrance/resting visuals live entirely in CSS
 * (`.reveal` -> `.reveal-visible`) using only `transform`/`opacity`, so the
 * hook toggles only a class flag and never gates content presence (Req 4.4,
 * 4.6).
 *
 * jsdom-safe capability guards (evaluated once on mount, before any observer is
 * created):
 * - If `prefers-reduced-motion: reduce` is set, `revealed` initializes to
 *   `true` so the element renders in its full Resting_State immediately and no
 *   observer is created (Req 4.5).
 * - If `IntersectionObserver` or `window.matchMedia` is unavailable (older
 *   browsers / jsdom), `revealed` initializes to `true` and no observer is
 *   created, so nothing throws and content is fully visible (Req 4.7).
 *
 * In every "immediately revealed" case the observer is skipped entirely, which
 * keeps the hook safe in environments where layout/observer APIs are stubbed.
 *
 * @param {{ threshold?: number }} [options] - Optional configuration.
 * @param {number} [options.threshold=0.15] - The `IntersectionObserver`
 *   threshold at which the element is considered revealed.
 * @returns {{
 *   ref: import("react").RefObject<HTMLElement>,
 *   revealed: boolean,
 * }} A ref to attach to the element to reveal, plus the `revealed` flag used to
 *   toggle `.reveal` / `.reveal-visible`.
 */
import { useEffect, useRef, useState } from "react";

/**
 * Resolve, once, whether the element should start already revealed. Returns
 * `true` under reduced-motion or when `IntersectionObserver` / `matchMedia`
 * are unavailable (jsdom-safe), in which case no observer should be created.
 */
const shouldStartRevealed = () => {
  if (typeof window === "undefined") return true;
  if (typeof window.IntersectionObserver !== "function") return true;
  if (typeof window.matchMedia !== "function") return true;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const useScrollReveal = ({ threshold = 0.15 } = {}) => {
  const ref = useRef(null);
  // Resolve the capability guards lazily on first render so the initial state
  // is correct without an extra paint. `shouldStartRevealed` is side-effect
  // free and safe to call during render.
  const [revealed, setRevealed] = useState(shouldStartRevealed);

  useEffect(() => {
    // When already revealed (reduced-motion or missing APIs), there is nothing
    // to observe — leave the element in its resting state.
    if (revealed) return;

    const el = ref.current;
    if (!el) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        // Reveal is monotonic: flip to true on the first intersection, then
        // stop observing so later callbacks cannot revert it.
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);

    // Clean up the observer on unmount (or if dependencies change).
    return () => observer.disconnect();
  }, [revealed, threshold]);

  return { ref, revealed };
};

export default useScrollReveal;
