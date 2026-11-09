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
  notebook: {
    phases: [
      { name: "pulling", at: 0, sfx: "book.slide" },
      { name: "coverOpen", at: 450, sfx: "book.coverOpen" },
      { name: "flipping", at: 750, sfx: "book.pageFlip" },
      { name: "flipping2", at: 950, sfx: "book.pageFlip" },
      { name: "settled", at: 1200 },
    ],
    totalDuration: 1200,
  },
  monitor: {
    phases: [
      { name: "powerOn", at: 0, sfx: "monitor.powerOn", duck: true },
      { name: "settled", at: 420 },
    ],
    totalDuration: 420,
  },
  phone: {
    phases: [
      { name: "lifting", at: 0, sfx: "phone.lift" },
      { name: "buzz", at: 350, sfx: "phone.buzz" },
      { name: "unlock", at: 550, sfx: "phone.unlock" },
      { name: "settled", at: 850 },
    ],
    totalDuration: 850,
  },
  photo: {
    phases: [
      { name: "swinging", at: 0, sfx: "tag.swing" },
      { name: "flipping", at: 550, sfx: "tag.flip" },
      { name: "settled", at: 1000 },
    ],
    totalDuration: 1000,
  },
  documents: {
    phases: [
      { name: "folderOpen", at: 0, sfx: "docs.folder" },
      { name: "fanOut", at: 400, sfx: "docs.paperSlide" },
      { name: "settled", at: 850 },
    ],
    totalDuration: 850,
  },
};

