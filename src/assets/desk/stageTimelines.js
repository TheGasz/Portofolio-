/**
 * Pure stage choreography timeline configurations for interactive hotspots.
 * Controls sequence timing, phase transitions, and associated SFX cues.
 */

export const STAGE_TIMELINES = {
  trophy: {
    phases: [
      { name: "center", at: 0, sfx: "trophy.ignite", duck: true },
      { name: "sliding", at: 650, sfx: "trophy.slide" },
      { name: "cards", at: 900, sfx: "trophy.cardDeal" },
      { name: "settled", at: 1250 },
    ],
    totalDuration: 1250,
  },
};
