/**
 * Pure model and hotspot definitions for Bagas's Interactive 3D/Isometric Workstation.
 * Separates domain metadata, accessible labels, shortcut keys, and live readout strings
 * from the SVG geometry and React presentation layer.
 */

export const DEFAULT_READOUT =
  "WORKSTATION ONLINE · 5 HOTSPOTS · CLICK OBJECT OR PRESS [1–5]";

/**
 * @typedef {Object} DeskHotspot
 * @property {"monitor"|"photo"|"phone"|"notebook"|"trophy"} id
 * @property {string} number          2-digit figure callout ("01".."05")
 * @property {string} key             Keyboard shortcut ("1".."5")
 * @property {string} label           Short navigation label
 * @property {string} objectName      Physical object on the desk/wall
 * @property {string} summary         One-line description shown in tooltips/overlays
 * @property {"route"|"overlay"} actionType
 * @property {string} target          Route path ("/project") or section hash ("#about", etc.)
 * @property {string} ariaLabel       Full accessible name for screen readers
 * @property {string} readout         Live readout bar text on hover/focus
 * @property {[number, number, number]} pinWorld  3D world coordinate [x, y, z] for callout pin
 */

/** @type {DeskHotspot[]} */
export const DESK_HOTSPOTS = [
  {
    id: "monitor",
    number: "01",
    key: "1",
    label: "Projects",
    objectName: "Monitor & PC",
    summary: "Open all 11 ML & Data Engineering repositories",
    actionType: "route",
    target: "/project",
    ariaLabel: "01 Monitor and PC: View all 11 Data Science and Data Engineering projects",
    readout: "01 / MONITOR · 11 ML & DATA PIPELINES · CLICK TO OPEN /PROJECT",
    pinWorld: [0, -18, 138],
  },
  {
    id: "photo",
    number: "02",
    key: "2",
    label: "About Me",
    objectName: "Wall Portrait",
    summary: "Read my story, focus areas, and core toolkit",
    actionType: "overlay",
    target: "#about",
    ariaLabel: "02 Framed Wall Photo: Open About Me profile and bio",
    readout: "02 / WALL PORTRAIT · BAGAS ADJIE PAMUNGKAS · CLICK FOR ABOUT ME",
    pinWorld: [-108, -88, 145],
  },
  {
    id: "phone",
    number: "03",
    key: "3",
    label: "Contact Me",
    objectName: "Desk Telephone",
    summary: "Direct email, 1-click copy address, LinkedIn & GitHub",
    actionType: "overlay",
    target: "#contact",
    ariaLabel: "03 Desk Telephone: Open Contact Me with Email, LinkedIn, and GitHub",
    readout: "03 / DESK PHONE · EMAIL · LINKEDIN · GITHUB · CLICK TO CONNECT",
    pinWorld: [122, 42, 42],
  },
  {
    id: "notebook",
    number: "04",
    key: "4",
    label: "Skills",
    objectName: "Lab Notebook",
    summary: "Explore my 5 core Data Science & Engineering disciplines",
    actionType: "overlay",
    target: "#skills",
    ariaLabel: "04 Lab Notebook and Pen: Open What I Do skills and toolbelt",
    readout: "04 / LAB NOTEBOOK · 5 CORE DISCIPLINES & 16 TOOLS · CLICK TO INSPECT",
    pinWorld: [-118, 48, 22],
  },
  {
    id: "trophy",
    number: "05",
    key: "5",
    label: "Credentials",
    objectName: "Trophy & Certs",
    summary: "View 7 verified certificates and competition awards",
    actionType: "overlay",
    target: "#credentials",
    ariaLabel: "05 Trophy and Shelf: Open 7 Certifications and Competition Awards",
    readout: "05 / TROPHY SHELF · 7 VERIFIED CERTIFICATES & WINS · CLICK TO VIEW",
    pinWorld: [110, -82, 148],
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
 * @param {string|null|undefined} openOverlayId
 * @returns {string}
 */
export function getReadoutText(activeHotspotId, openOverlayId) {
  const active = getHotspotById(activeHotspotId) || getHotspotById(openOverlayId);
  if (active) return active.readout;
  return DEFAULT_READOUT;
}

