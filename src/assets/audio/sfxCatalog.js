/**
 * Pure data definitions for Web Audio SFX sound design catalog.
 * Resonant, soothing palette designed to blend seamlessly with the serene
 * F-major ambient lofi music ("Musik Syahdu").
 */

/**
 * Pentatonic pitch map for room interactive hotspots (F major pentatonic scale).
 */
export const HOTSPOT_PITCH_MAP = {
  monitor: 698.46, // F5
  photo: 783.99, // G5
  phone: 880.0, // A5
  notebook: 1046.5, // C6
  trophy: 1174.66, // D6
  documents: 1396.91, // F6
};

/**
 * Maximum volume limits and durations to guarantee pleasant listening.
 */
export const SFX_SAFETY_LIMITS = {
  maxGain: 0.35,
  maxDuration: 1.6,
  defaultMasterVolume: 0.22,
};

/**
 * Complete sound catalog recipe mapping.
 * Each entry specifies synthesis instructions:
 * - type: "tone" | "noise" | "chord" | "complex" | "click"
 * - duration: duration in seconds
 * - gain: relative gain multiplier
 */
export const SFX_CATALOG = {
  // --- UI Common ---
  "ui.hover": {
    type: "complex",
    duration: 0.035,
    gain: 0.08,
    tone: { freq: 880, type: "sine", endFreq: 920 },
    noise: { filterType: "bandpass", filterFreq: 3200, q: 3 },
  },
  "ui.press": {
    type: "tone",
    duration: 0.05,
    gain: 0.16,
    freq: 360,
    endFreq: 180,
    oscType: "triangle",
  },
  "ui.close": {
    type: "tone",
    duration: 0.065,
    gain: 0.15,
    freq: 420,
    endFreq: 150,
    oscType: "sine",
  },
  "ui.toggleOn": {
    type: "tone",
    duration: 0.045,
    gain: 0.14,
    freq: 440,
    endFreq: 680,
    oscType: "sine",
  },
  "ui.toggleOff": {
    type: "tone",
    duration: 0.045,
    gain: 0.14,
    freq: 680,
    endFreq: 440,
    oscType: "sine",
  },
  "ui.success": {
    type: "chord",
    duration: 0.25,
    gain: 0.18,
    notes: [1046.5, 1396.91], // C6 -> F6
    stagger: 0.07,
    oscType: "sine",
  },
  "ui.error": {
    type: "chord",
    duration: 0.18,
    gain: 0.14,
    notes: [164.81, 155.56], // E3 -> Eb3 low dissonance
    stagger: 0.08,
    oscType: "triangle",
  },
  "ui.pop": {
    type: "tone",
    duration: 0.05,
    gain: 0.16,
    freq: 320,
    endFreq: 780,
    oscType: "sine",
  },

  // --- Room & Entrance ---
  "door.handle": {
    type: "complex",
    duration: 0.04,
    gain: 0.14,
    tone: { freq: 1400, type: "triangle", endFreq: 900 },
    noise: { filterType: "highpass", filterFreq: 2800, q: 2 },
  },
  "door.open": {
    type: "complex",
    duration: 0.32,
    gain: 0.2,
    tone: { freq: 175, type: "triangle", endFreq: 115 },
    noise: { filterType: "bandpass", filterFreq: 650, q: 1.5 },
  },
  "music.needle": {
    type: "complex",
    duration: 0.06,
    gain: 0.15,
    tone: { freq: 95, type: "sine", endFreq: 60 },
    noise: { filterType: "bandpass", filterFreq: 1800, q: 1 },
  },
  "music.tapeStop": {
    type: "tone",
    duration: 0.26,
    gain: 0.18,
    freq: 440,
    endFreq: 75,
    oscType: "sawtooth",
  },

  // --- 01 Monitor & PC ---
  "monitor.powerOn": {
    type: "complex",
    duration: 0.42,
    gain: 0.22,
    tone: { freq: 1200, type: "sine", endFreq: 7500 },
    noise: { filterType: "bandpass", filterFreq: 2400, q: 2 },
  },
  "monitor.powerOff": {
    type: "tone",
    duration: 0.18,
    gain: 0.18,
    freq: 8500,
    endFreq: 110,
    oscType: "sine",
  },
  "monitor.select": {
    type: "tone",
    duration: 0.06,
    gain: 0.15,
    freq: 880,
    endFreq: 960,
    oscType: "sine",
  },
  "monitor.back": {
    type: "tone",
    duration: 0.06,
    gain: 0.14,
    freq: 660,
    endFreq: 440,
    oscType: "sine",
  },
  "monitor.dive": {
    type: "noise",
    duration: 0.26,
    gain: 0.18,
    filterType: "lowpass",
    filterFreq: 350,
    endFilterFreq: 1600,
  },

  // --- 02 ID Name Tag ---
  "tag.swing": {
    type: "chord",
    duration: 0.16,
    gain: 0.12,
    notes: [2217.46, 3135.96], // C#7, G7 gentle chime
    stagger: 0.04,
    oscType: "sine",
  },
  "tag.flip": {
    type: "noise",
    duration: 0.09,
    gain: 0.12,
    filterType: "bandpass",
    filterFreq: 1800,
    endFilterFreq: 900,
  },

  // --- 03 Smartphone on Stand ---
  "phone.lift": {
    type: "noise",
    duration: 0.15,
    gain: 0.12,
    filterType: "lowpass",
    filterFreq: 250,
    endFilterFreq: 850,
  },
  "phone.buzz": {
    type: "chord",
    duration: 0.12,
    gain: 0.22,
    notes: [160, 160],
    stagger: 0.05,
    oscType: "triangle",
  },
  "phone.unlock": {
    type: "chord",
    duration: 0.22,
    gain: 0.18,
    notes: [659.25, 783.99, 1046.5], // E5 -> G5 -> C6
    stagger: 0.05,
    oscType: "sine",
  },
  "phone.appPop": {
    type: "tone",
    duration: 0.05,
    gain: 0.15,
    freq: 540,
    endFreq: 880,
    oscType: "sine",
  },

  // --- 04 Book (What I Do) ---
  "book.slide": {
    type: "noise",
    duration: 0.22,
    gain: 0.16,
    filterType: "bandpass",
    filterFreq: 550,
    endFilterFreq: 850,
  },
  "book.coverOpen": {
    type: "complex",
    duration: 0.24,
    gain: 0.18,
    tone: { freq: 110, type: "triangle", endFreq: 80 },
    noise: { filterType: "bandpass", filterFreq: 1100, q: 1.5 },
  },
  "book.pageFlip": {
    type: "noise",
    duration: 0.085,
    gain: 0.14,
    filterType: "bandpass",
    filterFreq: 2200,
    endFilterFreq: 1400,
  },
  "book.close": {
    type: "complex",
    duration: 0.16,
    gain: 0.18,
    tone: { freq: 115, type: "sine", endFreq: 75 },
    noise: { filterType: "lowpass", filterFreq: 900, q: 2 },
  },

  // --- 05 Trophy & Certifications ---
  "trophy.ignite": {
    type: "chord",
    duration: 0.48,
    gain: 0.22,
    notes: [698.46, 880.0, 1046.5, 1396.91, 1760.0], // F5, A5, C6, F6, A6 shimmer
    stagger: 0.065,
    oscType: "sine",
  },
  "trophy.slide": {
    type: "noise",
    duration: 0.32,
    gain: 0.16,
    filterType: "bandpass",
    filterFreq: 800,
    endFilterFreq: 1600,
  },
  "trophy.cardDeal": {
    type: "complex",
    duration: 0.045,
    gain: 0.11,
    tone: { freq: 620, type: "triangle", endFreq: 520 },
    noise: { filterType: "highpass", filterFreq: 2600, q: 2 },
  },

  // --- 06 Documents Dossier ---
  "docs.folder": {
    type: "complex",
    duration: 0.18,
    gain: 0.16,
    tone: { freq: 130, type: "triangle", endFreq: 90 },
    noise: { filterType: "bandpass", filterFreq: 1400, q: 1 },
  },
  "docs.paperSlide": {
    type: "noise",
    duration: 0.14,
    gain: 0.13,
    filterType: "bandpass",
    filterFreq: 1800,
    endFilterFreq: 1100,
  },
  "docs.stamp": {
    type: "complex",
    duration: 0.11,
    gain: 0.2,
    tone: { freq: 135, type: "triangle", endFreq: 70 },
    noise: { filterType: "lowpass", filterFreq: 1200, q: 2.5 },
  },

  // --- Global Navigation ---
  "nav.whoosh": {
    type: "noise",
    duration: 0.18,
    gain: 0.12,
    filterType: "lowpass",
    filterFreq: 400,
    endFilterFreq: 1200,
  },
};

