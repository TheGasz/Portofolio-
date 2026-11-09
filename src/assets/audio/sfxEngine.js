import { SFX_CATALOG, SFX_SAFETY_LIMITS } from "./sfxCatalog.js";

/**
 * Zero-dependency Web Audio API SFX Engine.
 * Synthesizes organic, satisfying micro-interactions using oscillators,
 * filtered noise buffers, and ADSR gain envelopes.
 */

export function createSfxEngine({ onDuckAmbient } = {}) {
  let ctx = null;
  let masterGain = null;
  let noiseBuffer = null;
  let isUnlocked = false;
  let isEnabled = true;
  let masterVolume = SFX_SAFETY_LIMITS.defaultMasterVolume;
  let lastPlayTimes = new Map();
  let activeVoiceCount = 0;
  const MAX_VOICES = 8;
  const THROTTLE_MS = {
    "ui.hover": 90,
    "book.pageFlip": 60,
  };

  const getAudioContextClass = () => {
    if (typeof window === "undefined") return null;
    return window.AudioContext || window.webkitAudioContext || null;
  };

  const initContext = () => {
    if (ctx) return ctx;
    const AudioCtx = getAudioContextClass();
    if (!AudioCtx) return null;
    try {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      return ctx;
    } catch {
      return null;
    }
  };

  const getNoiseBuffer = () => {
    if (noiseBuffer) return noiseBuffer;
    if (!ctx) return null;
    try {
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      return noiseBuffer;
    } catch {
      return null;
    }
  };

  const unlock = async () => {
    const context = initContext();
    if (!context) {
      isUnlocked = true;
      return true;
    }
    try {
      if (context.state === "suspended" && typeof context.resume === "function") {
        await context.resume();
      }
      isUnlocked = true;
      return true;
    } catch {
      isUnlocked = true;
      return false;
    }
  };

  const duck = (durationMs = 600, duckLevel = 0.4) => {
    if (typeof onDuckAmbient === "function") {
      onDuckAmbient(duckLevel, durationMs);
    }
  };

  /**
   * Play a sound cue from the catalog.
   *
   * @param {string} name
   * @param {Object} [opts]
   * @param {number} [opts.pitch] Freq override or multiplier
   * @param {number} [opts.gain] Gain multiplier
   * @param {number} [opts.delay] Delay in seconds
   */
  const play = (name, opts = {}) => {
    if (!isEnabled) return false;
    const recipe = SFX_CATALOG[name];
    if (!recipe) return false;

    // Check throttle
    const now = Date.now();
    const throttleLimit = THROTTLE_MS[name] || 0;
    if (throttleLimit > 0) {
      const lastTime = lastPlayTimes.get(name) || 0;
      if (now - lastTime < throttleLimit) {
        return false;
      }
      lastPlayTimes.set(name, now);
    }

    if (!ctx || !masterGain) {
      initContext();
    }
    if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
      ctx.resume().catch(() => {});
      isUnlocked = true;
    }
    if (!ctx || !masterGain) return false;

    if (activeVoiceCount >= MAX_VOICES) {
      return false; // drop to prevent clipping & audio starvation
    }

    const audioNow = ctx.currentTime + (opts.delay || 0);
    const gainMul = Math.max(0, Math.min(2, opts.gain ?? 1));
    const targetGain = Math.min(
      recipe.gain * gainMul,
      SFX_SAFETY_LIMITS.maxGain
    );
    const duration = Math.min(recipe.duration, SFX_SAFETY_LIMITS.maxDuration);

    activeVoiceCount++;
    const releaseVoice = () => {
      activeVoiceCount = Math.max(0, activeVoiceCount - 1);
    };

    try {
      if (recipe.type === "tone") {
        playToneVoice(recipe, targetGain, duration, audioNow, opts, releaseVoice);
      } else if (recipe.type === "noise") {
        playNoiseVoice(recipe, targetGain, duration, audioNow, opts, releaseVoice);
      } else if (recipe.type === "chord") {
        playChordVoice(recipe, targetGain, duration, audioNow, opts, releaseVoice);
      } else if (recipe.type === "complex") {
        playComplexVoice(recipe, targetGain, duration, audioNow, opts, releaseVoice);
      } else {
        releaseVoice();
      }
      return true;
    } catch {
      releaseVoice();
      return false;
    }
  };

  const playToneVoice = (recipe, gain, duration, start, opts, onEnd) => {
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();

    osc.type = recipe.oscType || "sine";
    const startFreq = (opts.pitch ? (recipe.freq ? (opts.pitch > 20 ? opts.pitch : recipe.freq * opts.pitch) : opts.pitch) : recipe.freq) || 440;
    const endFreq = recipe.endFreq
      ? (opts.pitch && opts.pitch <= 20 ? recipe.endFreq * opts.pitch : recipe.endFreq)
      : startFreq;

    osc.frequency.setValueAtTime(startFreq, start);
    if (endFreq !== startFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, endFreq),
        start + duration
      );
    }

    voiceGain.gain.setValueAtTime(0.0001, start);
    voiceGain.gain.linearRampToValueAtTime(gain, start + Math.min(0.015, duration * 0.25));
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(voiceGain);
    voiceGain.connect(masterGain);

    osc.start(start);
    osc.stop(start + duration + 0.05);
    setTimeout(onEnd, (duration + 0.05) * 1000);
  };

  const playNoiseVoice = (recipe, gain, duration, start, opts, onEnd) => {
    const buf = getNoiseBuffer();
    if (!buf) {
      onEnd();
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = recipe.filterType || "bandpass";
    filter.frequency.setValueAtTime(recipe.filterFreq || 1000, start);
    if (recipe.endFilterFreq) {
      filter.frequency.exponentialRampToValueAtTime(
        recipe.endFilterFreq,
        start + duration
      );
    }
    if (recipe.q) filter.Q.setValueAtTime(recipe.q, start);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, start);
    voiceGain.gain.linearRampToValueAtTime(gain, start + Math.min(0.015, duration * 0.2));
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    src.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(masterGain);

    src.start(start);
    src.stop(start + duration + 0.05);
    setTimeout(onEnd, (duration + 0.05) * 1000);
  };

  const playChordVoice = (recipe, gain, duration, start, opts, onEnd) => {
    const notes = recipe.notes || [440];
    const stagger = recipe.stagger || 0;
    const noteGainVal = gain / Math.sqrt(notes.length);

    notes.forEach((freq, idx) => {
      const noteStart = start + idx * stagger;
      const osc = ctx.createOscillator();
      const voiceGain = ctx.createGain();

      osc.type = recipe.oscType || "sine";
      const targetFreq = opts.pitch && opts.pitch <= 20 ? freq * opts.pitch : freq;
      osc.frequency.setValueAtTime(targetFreq, noteStart);

      voiceGain.gain.setValueAtTime(0.0001, noteStart);
      voiceGain.gain.linearRampToValueAtTime(
        noteGainVal,
        noteStart + Math.min(0.02, duration * 0.2)
      );
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      osc.connect(voiceGain);
      voiceGain.connect(masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + duration + 0.05);
    });

    const totalDuration = duration + notes.length * stagger;
    setTimeout(onEnd, totalDuration * 1000);
  };

  const playComplexVoice = (recipe, gain, duration, start, opts, onEnd) => {
    if (recipe.tone) {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();
      osc.type = recipe.tone.type || "sine";
      const sf = (opts.pitch && opts.pitch > 20) ? opts.pitch : (recipe.tone.freq || 440);
      const ef = recipe.tone.endFreq || sf;
      osc.frequency.setValueAtTime(sf, start);
      if (ef !== sf) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, ef), start + duration);
      }
      toneGain.gain.setValueAtTime(0.0001, start);
      toneGain.gain.linearRampToValueAtTime(gain * 0.7, start + 0.01);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(toneGain);
      toneGain.connect(masterGain);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    if (recipe.noise) {
      const buf = getNoiseBuffer();
      if (buf) {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = recipe.noise.filterType || "bandpass";
        filter.frequency.setValueAtTime(recipe.noise.filterFreq || 1200, start);
        if (recipe.noise.q) filter.Q.setValueAtTime(recipe.noise.q, start);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, start);
        noiseGain.gain.linearRampToValueAtTime(gain * 0.6, start + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        src.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        src.start(start);
        src.stop(start + duration + 0.05);
      }
    }

    setTimeout(onEnd, (duration + 0.05) * 1000);
  };

  const setEnabled = (enabled) => {
    isEnabled = Boolean(enabled);
  };

  const setVolume = (val) => {
    masterVolume = Math.max(0, Math.min(1, Number(val) || 0));
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
    }
  };

  const cleanup = () => {
    if (ctx && typeof ctx.close === "function") {
      ctx.close().catch(() => {});
    }
    ctx = null;
    masterGain = null;
    noiseBuffer = null;
    isUnlocked = false;
  };

  return {
    unlock,
    play,
    duck,
    setEnabled,
    setVolume,
    cleanup,
    get isUnlocked() {
      return isUnlocked;
    },
    get isEnabled() {
      return isEnabled;
    },
    get volume() {
      return masterVolume;
    },
  };
}

