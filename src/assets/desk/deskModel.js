/**
 * Pure model and hotspot definitions for Bagas's Interactive 3D Bedroom & Study Desk
 * (modeled after src/assets/WhatsApp Image 2026-11-07 at 20.53.34.jpeg).
 */

export const DEFAULT_READOUT =
  "BAGAS'S STUDY ROOM ONLINE · 5 INTERACTIVE OBJECTS · CLICK OBJECT OR PRESS [1–5]";

/**
 * @typedef {Object} CameraZoom
 * @property {number} scale
 * @property {string} originX
 * @property {string} originY
 */

/**
 * @typedef {Object} DeskHotspot
 * @property {"monitor"|"photo"|"phone"|"notebook"|"trophy"} id
 * @property {string} number          2-digit figure callout ("01".."05")
 * @property {string} key             Keyboard shortcut ("1".."5")
 * @property {string} label           Short navigation label
 * @property {string} objectName      Physical object on the desk/cabinet/wall
 * @property {string} summary         One-line description shown in tooltips/headers
 * @property {"stage"} actionType     All 5 objects trigger cinematic in-room stage animations
 * @property {string} target          Section/route reference ("#featured-works", "#about", etc.)
 * @property {string} ariaLabel       Full accessible name for screen readers
 * @property {string} readout         Live readout bar text on hover/focus/active
 * @property {[number, number, number]} pinWorld  3D world coordinate [x, y, z] for callout pin
 * @property {CameraZoom} cameraZoom  CSS transform-origin and scale when diving into the object
 */

/** @type {DeskHotspot[]} */
export const DESK_HOTSPOTS = [
  {
    id: "monitor",
    number: "01",
    key: "1",
    label: "Projects",
    objectName: "Monitor & Gaming Laptop",
    summary: "Power on the monitor and dive into all 11 ML & Data Engineering projects",
    actionType: "stage",
    target: "/project",
    ariaLabel:
      "01 Monitor and Gaming Laptop: Power on screen and explore all 11 Data Science and Data Engineering projects",
    readout:
      "01 / MONITOR & GAMING LAPTOP · CLICK TO POWER ON & ENTER PROJECT EXPLORER",
    pinWorld: [4, -44, 52],
    cameraZoom: { scale: 2.5, originX: "54%", originY: "52%" },
  },
  {
    id: "photo",
    number: "02",
    key: "2",
    label: "About Me",
    objectName: "Hanging Name Tag",
    summary: "Zoom in on my hanging ID name tag and read my story, focus areas, and toolkit",
    actionType: "stage",
    target: "#about",
    ariaLabel: "02 Hanging ID Name Tag: Open About Me profile and bio",
    readout:
      "02 / HANGING ID NAME TAG & LANYARD · BAGAS ADJIE PAMUNGKAS · CLICK FOR ABOUT ME",
    pinWorld: [-108, 61, 27],
    cameraZoom: { scale: 2.35, originX: "31%", originY: "58%" },
  },
  {
    id: "phone",
    number: "03",
    key: "3",
    label: "Contact Me",
    objectName: "Smartphone on Stand",
    summary: "Zoom into my phone screen for direct Email, 1-click Copy, LinkedIn & GitHub",
    actionType: "stage",
    target: "#contact",
    ariaLabel:
      "03 Smartphone on Stand: Open Contact Me with Email, LinkedIn, and GitHub",
    readout:
      "03 / SMARTPHONE ON STAND · EMAIL · LINKEDIN · GITHUB · CLICK TO ZOOM IN",
    pinWorld: [-58, 16, 26],
    cameraZoom: { scale: 2.35, originX: "42%", originY: "62%" },
  },
  {
    id: "notebook",
    number: "04",
    key: "4",
    label: "What I Do",
    objectName: "Bookshelf (Left Cabinet)",
    summary: "Pull out a book from the left shelf and open it to view my 5 core disciplines",
    actionType: "stage",
    target: "#skills",
    ariaLabel:
      "04 Bookshelf in Left Cabinet: Pull out and open book to view What I Do skills and toolbelt",
    readout:
      "04 / LEFT CABINET BOOKSHELF · CLICK TO PULL OUT & OPEN 'WHAT I DO' BOOK",
    pinWorld: [-174, 34, 102],
    cameraZoom: { scale: 2.2, originX: "24%", originY: "46%" },
  },
  {
    id: "trophy",
    number: "05",
    key: "5",
    label: "Credentials",
    objectName: "Trophy (Top-Left Cabinet)",
    summary: "Zoom in on the glowing trophy and inspect my achievements & 7 certificates",
    actionType: "stage",
    target: "#credentials",
    ariaLabel:
      "05 Trophy on Top-Left Cabinet: Open 7 Certifications and Competition Awards",
    readout:
      "05 / TOP-LEFT CABINET TROPHY · CLICK TO IGNITE TROPHY & VIEW 7 CERTIFICATES",
    pinWorld: [-134, -36, 156],
    cameraZoom: { scale: 2.2, originX: "28%", originY: "20%" },
  },
];

/**
 * Lookup a hotspot definition by its id.
 * @param {string|null|undefined} id
 * @returns {DeskHotspot|null}
 */
export function getHotspotById(id) {
  if (!id) return null;
  return DESK_HOTSPOTS.find((h) => h.id === id) || null;
}

/**
 * Compute the live readout string for the bottom bar of the workstation plate.
 * @param {string|null|undefined} activeHotspotId
 * @param {string|null|undefined} openStageId
 * @returns {string}
 */
export function getReadoutText(activeHotspotId, openStageId) {
  const active = getHotspotById(activeHotspotId) || getHotspotById(openStageId);
  if (active) return active.readout;
  return DEFAULT_READOUT;
}
