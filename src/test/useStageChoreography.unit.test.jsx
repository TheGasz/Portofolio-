import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStageChoreography } from "../assets/desk/useStageChoreography.js";

describe("useStageChoreography (Unit)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("defaults to settled when no stageId is provided", () => {
    const { result } = renderHook(() => useStageChoreography(null));
    expect(result.current.phase).toBe("settled");
    expect(result.current.isSettled).toBe(true);
  });

  it("transitions through trophy choreography phases correctly", () => {
    const play = vi.fn();
    const duck = vi.fn();
    const { result } = renderHook(() =>
      useStageChoreography("trophy", { play, duck })
    );

    expect(result.current.phase).toBe("center");
    expect(play).toHaveBeenCalledWith("trophy.ignite");
    expect(duck).toHaveBeenCalled();

    // Advance to sliding phase at 650ms
    act(() => {
      vi.advanceTimersByTime(660);
    });
    expect(result.current.phase).toBe("sliding");
    expect(play).toHaveBeenCalledWith("trophy.slide");

    // Advance to cards phase at 900ms
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current.phase).toBe("cards");
    expect(play).toHaveBeenCalledWith("trophy.cardDeal");

    // Advance to settled at 1250ms
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(result.current.phase).toBe("settled");
    expect(result.current.isSettled).toBe(true);
  });

  it("synchronously initializes initial phase when stageId transitions from null, preventing frame-1 glitch", () => {
    let stageId = null;
    const { result, rerender } = renderHook(() => useStageChoreography(stageId));
    expect(result.current.phase).toBe("settled");

    // Transition from null to trophy
    stageId = "trophy";
    rerender();
    // On the exact render of stage change, phase MUST be "center", never "settled"
    expect(result.current.phase).toBe("center");
    expect(result.current.isSettled).toBe(false);
  });

  it("allows skipping directly to settled on click / fast-forward", () => {
    const play = vi.fn();
    const { result } = renderHook(() =>
      useStageChoreography("notebook", { play })
    );

    expect(result.current.phase).toBe("pulling");
    act(() => {
      result.current.skipToSettled();
    });
    expect(result.current.phase).toBe("settled");
    expect(result.current.isSettled).toBe(true);
  });
});

