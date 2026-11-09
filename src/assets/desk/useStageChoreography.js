import { useState, useEffect, useRef, useCallback } from "react";
import { STAGE_TIMELINES } from "./stageTimelines.js";

/**
 * Hook to manage multi-phase stage choreography, sync with SFX sound cues,
 * and support reduced-motion / skip-on-click.
 *
 * @param {string|null} stageId
 * @param {Object} [sfx]
 * @param {(cue: string, opts?: any) => boolean} [sfx.play]
 * @param {(durationMs?: number, gain?: number) => void} [sfx.duck]
 */
export function useStageChoreography(stageId, { play, duck } = {}) {
  const [prevStageId, setPrevStageId] = useState(stageId);

  const getInitialPhase = (id) => {
    if (!id) return "settled";
    const timeline = STAGE_TIMELINES[id];
    return timeline?.phases?.[0]?.name || "settled";
  };

  const [phase, setPhase] = useState(() => getInitialPhase(stageId));
  const timeoutsRef = useRef([]);

  // Adjust state synchronously during render when stageId changes
  // Prevents frame-1 "settled" flash / glitch
  if (stageId !== prevStageId) {
    setPrevStageId(stageId);
    setPhase(getInitialPhase(stageId));
  }

  const isReducedMotion = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const skipToSettled = useCallback(() => {
    clearAllTimeouts();
    setPhase("settled");
  }, [clearAllTimeouts]);

  useEffect(() => {
    clearAllTimeouts();

    if (!stageId) {
      setPhase("settled");
      return;
    }

    const timeline = STAGE_TIMELINES[stageId];
    if (!timeline || isReducedMotion()) {
      setPhase("settled");
      if (timeline?.phases?.[0]?.sfx && typeof play === "function") {
        play(timeline.phases[0].sfx);
      }
      return;
    }

    const { phases } = timeline;

    // Trigger initial phase SFX and ducking immediately
    if (phases[0].sfx && typeof play === "function") {
      play(phases[0].sfx);
    }
    if (phases[0].duck && typeof duck === "function") {
      duck(600, 0.35);
    }

    // Schedule subsequent phases
    phases.slice(1).forEach((p) => {
      const timeoutId = setTimeout(() => {
        setPhase(p.name);
        if (p.sfx && typeof play === "function") {
          play(p.sfx);
        }
        if (p.duck && typeof duck === "function") {
          duck(600, 0.35);
        }
      }, p.at);
      timeoutsRef.current.push(timeoutId);
    });

    return () => {
      clearAllTimeouts();
    };
  }, [stageId, isReducedMotion, clearAllTimeouts, play, duck]);

  return {
    phase,
    isSettled: phase === "settled",
    skipToSettled,
  };
}
