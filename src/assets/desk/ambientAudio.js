/**
 * Zero-dependency Web Audio API Serene Room Synthesizer ("Musik Syahdu").
 * Generates a warm, soothing lofi/ambient electric piano chord progression
 * (Fmaj7 -> Em7 -> Dm7 -> Cmaj7) with gentle evening bell harmonics so the
 * study room landing page feels calm and alive without external MP3 assets.
 */

const CHORD_PROGRESSION = [
  // Fmaj7 (F3, A3, C4, E4, G4)
  { notes: [174.61, 220.0, 261.63, 329.63], melody: [523.25, 659.25, 587.33] },
  // Em7 (E3, G3, B3, D4)
  { notes: [164.81, 196.0, 246.94, 293.66], melody: [493.88, 587.33, 523.25] },
  // Dm7 (D3, F3, A3, C4)
  { notes: [146.83, 174.61, 220.0, 261.63], melody: [440.0, 523.25, 659.25] },
  // Cmaj7 (C3, E3, G3, B3)
  { notes: [130.81, 164.81, 196.0, 246.94], melody: [392.0, 493.88, 523.25] },
];

/**
 * Create a controllable serene ambient audio engine instance.
 */
export function createSereneAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let intervalId = null;
  let isPlaying = false;
  let chordIndex = 0;
  let volume = 0.28;

  const getAudioContextClass = () => {
    if (typeof window === "undefined") return null;
    return window.AudioContext || window.webkitAudioContext || null;
  };

  const playWarmChord = (chord) => {
    if (!ctx || !masterGain || !isPlaying) return;
    const now = ctx.currentTime;
    const duration = 4.2;

    // Warm Rhodes-like pad layer for each chord tone
    chord.notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const noteGain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(freq * 2, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(720, now);

        const stagger = idx * 0.06;
        const peak = 0.11 / chord.notes.length;
        noteGain.gain.setValueAtTime(0.0001, now + stagger);
        noteGain.gain.linearRampToValueAtTime(peak, now + stagger + 0.65);
        noteGain.gain.exponentialRampToValueAtTime(
          0.0008,
          now + stagger + duration
        );

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + stagger);
        subOsc.start(now + stagger);
        osc.stop(now + stagger + duration + 0.1);
        subOsc.stop(now + stagger + duration + 0.1);
      } catch {
        // Ignore scheduling errors if context is closing
      }
    });

    // Gentle music-box / Rhodes bell arpeggio over the chord
    chord.melody.forEach((freq, mIdx) => {
      try {
        const bellOsc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        const onset = now + 0.9 + mIdx * 1.05;

        bellOsc.type = "sine";
        bellOsc.frequency.setValueAtTime(freq, onset);

        bellGain.gain.setValueAtTime(0.0001, onset);
        bellGain.gain.linearRampToValueAtTime(0.022, onset + 0.12);
        bellGain.gain.exponentialRampToValueAtTime(0.0005, onset + 1.9);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);

        bellOsc.start(onset);
        bellOsc.stop(onset + 2.0);
      } catch {
        // Ignore scheduling errors
      }
    });
  };

  const start = async () => {
    if (isPlaying) return true;
    const AudioCtx = getAudioContextClass();
    if (!AudioCtx) {
      // Safe fallback for test environments (jsdom) without Web Audio API
      isPlaying = true;
      return true;
    }

    try {
      if (!ctx) {
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.connect(ctx.destination);
      }
      if (ctx.state === "suspended" && typeof ctx.resume === "function") {
        await ctx.resume();
      }

      isPlaying = true;
      playWarmChord(CHORD_PROGRESSION[chordIndex % CHORD_PROGRESSION.length]);
      chordIndex += 1;

      intervalId = setInterval(() => {
        if (!isPlaying) return;
        playWarmChord(
          CHORD_PROGRESSION[chordIndex % CHORD_PROGRESSION.length]
        );
        chordIndex += 1;
      }, 4200);

      return true;
    } catch {
      isPlaying = false;
      return false;
    }
  };

  const stop = () => {
    isPlaying = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (ctx && ctx.state === "running" && typeof ctx.suspend === "function") {
      ctx.suspend().catch(() => {});
    }
  };

  const toggle = async () => {
    if (isPlaying) {
      stop();
      return false;
    }
    return start();
  };

  const setLevel = (nextVolume) => {
    volume = Math.max(0, Math.min(1, Number(nextVolume) || 0));
    if (ctx && masterGain) {
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    }
  };

  const cleanup = () => {
    stop();
    if (ctx && typeof ctx.close === "function") {
      ctx.close().catch(() => {});
    }
    ctx = null;
    masterGain = null;
  };

  return {
    start,
    stop,
    toggle,
    setLevel,
    cleanup,
    get isPlaying() {
      return isPlaying;
    },
  };
}

