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
  maxGain: 0.5,
  maxDuration: 1.6,
  defaultMasterVolume: 0.75,
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
    duration: 0.04,
    gain: 0.28,
    tone: { freq: 880, type: "sine", endFreq: 960 },
    noise: { filterType: "bandpass", filterFreq: 2800, q: 2.5 },
  },
  "ui.press": {
    type: "tone",
    duration: 0.06,
    gain: 0.45,
    freq: 380,
    endFreq: 180,
    oscType: "triangle",
  },
  "ui.close": {
    type: "tone",
    duration: 0.08,
    gain: 0.42,
    freq: 460,
    endFreq: 140,
    oscType: "sine",
  },
  "ui.toggleOn": {
    type: "tone",
    duration: 0.05,
    gain: 0.38,
    freq: 480,
    endFreq: 750,
    oscType: "sine",
  },
  "ui.toggleOff": {
    type: "tone",
    duration: 0.05,
    gain: 0.38,
    freq: 750,
    endFreq: 450,
    oscType: "sine",
  },
  "ui.success": {
    type: "chord",
    duration: 0.28,
    gain: 0.48,
    notes: [1046.5, 1396.91], // C6 -> F6
    stagger: 0.07,
    oscType: "sine",
  },
  "ui.error": {
    type: "chord",
    duration: 0.2,
    gain: 0.42,
    notes: [164.81, 155.56], // E3 -> Eb3 low dissonance
    stagger: 0.08,
    oscType: "triangle",
  },
  "ui.pop": {
    type: "tone",
    duration: 0.06,
    gain: 0.42,
    freq: 340,
    endFreq: 820,
    oscType: "sine",
  },

  // --- Room & Entrance ---
  "door.handle": {
    type: "complex",
    duration: 0.05,
    gain: 0.36,
    tone: { freq: 1500, type: "triangle", endFreq: 950 },
    noise: { filterType: "highpass", filterFreq: 2600, q: 2 },
  },
  "door.open": {
    type: "complex",
    duration: 0.35,
    gain: 0.5,
    tone: { freq: 190, type: "triangle", endFreq: 110 },
    noise: { filterType: "bandpass", filterFreq: 680, q: 1.5 },
  },
  "music.needle": {
    type: "complex",
    duration: 0.08,
    gain: 0.4,
    tone: { freq: 100, type: "sine", endFreq: 55 },
    noise: { filterType: "bandpass", filterFreq: 1800, q: 1 },
  },
  "music.tapeStop": {
    type: "tone",
    duration: 0.28,
    gain: 0.42,
    freq: 460,
    endFreq: 70,
    oscType: "sawtooth",
  },

  // --- 01 Monitor & PC ---
  "monitor.powerOn": {
    type: "complex",
    duration: 0.45,
    gain: 0.5,
    tone: { freq: 1400, type: "sine", endFreq: 8000 },
    noise: { filterType: "bandpass", filterFreq: 2600, q: 2 },
  },
  "monitor.powerOff": {
    type: "tone",
    duration: 0.2,
    gain: 0.42,
    freq: 8500,
    endFreq: 110,
    oscType: "sine",
  },
  "monitor.select": {
    type: "tone",
    duration: 0.07,
    gain: 0.42,
    freq: 880,
    endFreq: 1040,
    oscType: "sine",
  },
  "monitor.back": {
    type: "tone",
    duration: 0.07,
    gain: 0.4,
    freq: 720,
    endFreq: 440,
    oscType: "sine",
  },
  "monitor.dive": {
    type: "noise",
    duration: 0.28,
    gain: 0.45,
    filterType: "lowpass",
    filterFreq: 400,
    endFilterFreq: 1800,
  },

  // --- 02 ID Name Tag ---
  "tag.swing": {
    type: "chord",
    duration: 0.2,
    gain: 0.38,
    notes: [2217.46, 3135.96], // C#7, G7 gentle chime
    stagger: 0.045,
    oscType: "sine",
  },
  "tag.flip": {
    type: "noise",
    duration: 0.1,
    gain: 0.35,
    filterType: "bandpass",
    filterFreq: 1900,
    endFilterFreq: 900,
  },

  // --- 03 Smartphone on Stand ---
  "phone.lift": {
    type: "noise",
    duration: 0.16,
    gain: 0.36,
    filterType: "lowpass",
    filterFreq: 300,
    endFilterFreq: 950,
  },
  "phone.buzz": {
    type: "chord",
    duration: 0.14,
    gain: 0.5,
    notes: [160, 160],
    stagger: 0.05,
    oscType: "triangle",
  },
  "phone.unlock": {
    type: "chord",
    duration: 0.25,
    gain: 0.48,
    notes: [659.25, 783.99, 1046.5], // E5 -> G5 -> C6
    stagger: 0.05,
    oscType: "sine",
  },
  "phone.appPop": {
    type: "tone",
    duration: 0.06,
    gain: 0.4,
    freq: 540,
    endFreq: 920,
    oscType: "sine",
  },

  // --- 04 Book (What I Do) ---
  "book.slide": {
    type: "noise",
    duration: 0.24,
    gain: 0.42,
    filterType: "bandpass",
    filterFreq: 600,
    endFilterFreq: 950,
  },
  "book.coverOpen": {
    type: "complex",
    duration: 0.26,
    gain: 0.48,
    tone: { freq: 130, type: "triangle", endFreq: 85 },
    noise: { filterType: "bandpass", filterFreq: 1200, q: 1.5 },
  },
  "book.pageFlip": {
    type: "noise",
    duration: 0.1,
    gain: 0.4,
    filterType: "bandpass",
    filterFreq: 2400,
    endFilterFreq: 1400,
  },
  "book.close": {
    type: "complex",
    duration: 0.18,
    gain: 0.45,
    tone: { freq: 120, type: "sine", endFreq: 75 },
    noise: { filterType: "lowpass", filterFreq: 950, q: 2 },
  },

  // --- 05 Trophy & Certifications ---
  "trophy.ignite": {
    type: "chord",
    duration: 0.52,
    gain: 0.5,
    notes: [698.46, 880.0, 1046.5, 1396.91, 1760.0], // F5, A5, C6, F6, A6 shimmer
    stagger: 0.065,
    oscType: "sine",
  },
  "trophy.slide": {
    type: "noise",
    duration: 0.34,
    gain: 0.42,
    filterType: "bandpass",
    filterFreq: 850,
    endFilterFreq: 1800,
  },
  "trophy.cardDeal": {
    type: "complex",
    duration: 0.05,
    gain: 0.35,
    tone: { freq: 650, type: "triangle", endFreq: 500 },
    noise: { filterType: "highpass", filterFreq: 2600, q: 2 },
  },

  // --- 06 Documents Dossier ---
  "docs.folder": {
    type: "complex",
    duration: 0.2,
    gain: 0.44,
    tone: { freq: 140, type: "triangle", endFreq: 90 },
    noise: { filterType: "bandpass", filterFreq: 1500, q: 1 },
  },
  "docs.paperSlide": {
    type: "noise",
    duration: 0.16,
    gain: 0.38,
    filterType: "bandpass",
    filterFreq: 1900,
    endFilterFreq: 1100,
  },
  "docs.stamp": {
    type: "complex",
    duration: 0.13,
    gain: 0.5,
    tone: { freq: 150, type: "triangle", endFreq: 70 },
    noise: { filterType: "lowpass", filterFreq: 1300, q: 2.5 },
  },

  // --- Global Navigation ---
  "nav.whoosh": {
    type: "noise",
    duration: 0.2,
    gain: 0.38,
    filterType: "lowpass",
    filterFreq: 450,
    endFilterFreq: 1350,
  },
};
