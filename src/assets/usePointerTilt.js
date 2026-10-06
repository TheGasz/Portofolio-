/**
 * `usePointerTilt` — a tiny, dependency-free React hook that drives the
 * pointer-driven 3D tilt Micro_Interaction on Project_Cards (Requirement 2).
 *
 * The hook computes a bounded tilt toward the current pointer position and
 * writes it to the element as two CSS custom properties, `--rx` and `--ry`.
 * The actual `rotateX`/`rotateY` lives in the `.card-tilt` CSS class (see
 * `src/index.css`), so the transform stays entirely in CSS, composes with
 * hover translate/scale, and never triggers layout reflow (Req 2.6). The hook
 * writes only CSS variables — it never mutates DOM content, order, or
 * attributes (Req 2.7) and never uses React state, so pointer moves do not
 * cause re-renders.
 *
 * Capability guards (evaluated once on mount):
 * - If `prefers-reduced-motion: reduce` is set, the hook is disabled (Req 2.5).
 * - If `(hover: hover) and (pointer: fine)` is NOT matched (e.g. a touch /
 *   coarse pointer), the hook is disabled (Req 2.4).
 * - If `window.matchMedia` is unavailable (older browsers / jsdom), the hook is
 *   disabled so nothing throws and no tilt is applied.
 *
 * When disabled (`enabled === false`), every handler is a no-op, so attaching
 * them is harmless.
 *
 * @param {{ maxDeg?: number }} [options] - Optional configuration.
 * @param {number} [options.maxDeg=10] - Target maximum rotation in degrees for
 *   each axis. Hard-clamped so no axis ever exceeds +/-15 degrees (Req 2.1).
 * @returns {{
 *   ref: import("react").RefObject<HTMLElement>,
 *   onPointerMove: (event: import("react").PointerEvent) => void,
 *   onPointerLeave: () => void,
 *   enabled: boolean,
 * }} Handlers and ref to spread onto the tilt container, plus the `enabled`
 *   flag describing whether the environment supports the tilt.
 */
import { useEffect, useRef, useState } from "react";

/** Absolute hard cap on rotation per axis, in degrees (Req 2.1). */
const HARD_MAX_DEG = 15;

/** Clamp `value` into the inclusive range [min, max]. */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const usePointerTilt = ({ maxDeg = 10 } = {}) => {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Resolve capability guards once on mount. matchMedia is read lazily so the
  // hook is safe in environments where it is undefined (older browsers/jsdom).
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setEnabled(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    setEnabled(!prefersReducedMotion && finePointer);
  }, []);

  // Effective per-axis bound: the caller's preference, hard-capped at 15deg.
  const bound = clamp(Math.abs(maxDeg), 0, HARD_MAX_DEG);

  const onPointerMove = (event) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    // Normalize the pointer position within the element to [-0.5, 0.5] on each
    // axis (0 at the element's center), then scale to the clamped bound.
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    // Horizontal pointer position -> Y rotation; vertical -> X rotation.
    // Invert the vertical axis so moving the pointer up tilts the top back.
    const ry = clamp(px * 2 * bound, -bound, bound);
    const rx = clamp(-py * 2 * bound, -bound, bound);

    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--rx", `${rx}deg`);
  };

  const onPointerLeave = () => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return { ref, onPointerMove, onPointerLeave, enabled };
};

export default usePointerTilt;
