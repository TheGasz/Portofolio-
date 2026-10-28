import React from "react";

// Clean, consistent line-style icons used across the Home page (Skills and
// Certifications). They replace the earlier emoji glyphs so the UI reads as
// deliberate and on-brand. Each icon is a 24x24 stroke SVG that inherits the
// current text color, is decorative (aria-hidden), and scales to its container.
//
// Usage: pass an icon *key* (string) in the data, then look it up via `Icon`.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  className: "w-7 h-7",
};

/** Brain / model — data science & ML. */
const BrainIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5a2.5 2.5 0 0 0-4.5-1.5A2.5 2.5 0 0 0 4 6a2.5 2.5 0 0 0-1 4.5A2.5 2.5 0 0 0 4.5 15 2.5 2.5 0 0 0 9 16.5 2.5 2.5 0 0 0 12 18Z" />
    <path d="M12 5a2.5 2.5 0 0 1 4.5-1.5A2.5 2.5 0 0 1 20 6a2.5 2.5 0 0 1 1 4.5A2.5 2.5 0 0 1 19.5 15 2.5 2.5 0 0 1 15 16.5 2.5 2.5 0 0 1 12 18Z" />
    <path d="M12 5v13" />
  </svg>
);

/** Pipeline / nodes connected — data engineering. */
const PipelineIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="5" height="5" rx="1" />
    <rect x="16" y="15" width="5" height="5" rx="1" />
    <rect x="16" y="4" width="5" height="5" rx="1" />
    <path d="M8 6.5h4.5a2 2 0 0 1 2 2V17" />
    <path d="M8 6.5H6.5" />
  </svg>
);

/** Bar chart — EDA & feature engineering. */
const ChartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <rect x="7" y="12" width="3" height="5" rx="0.5" />
    <rect x="12" y="9" width="3" height="8" rx="0.5" />
    <rect x="17" y="6" width="3" height="11" rx="0.5" />
  </svg>
);

/** Circular arrows — evaluation & reproducibility. */
const CycleIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 11a8 8 0 0 0-14-5l-2 2" />
    <path d="M4 5v4h4" />
    <path d="M4 13a8 8 0 0 0 14 5l2-2" />
    <path d="M20 19v-4h-4" />
  </svg>
);

/** Broom / sparkle — data cleaning. */
const CleanIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M19 4 9 14" />
    <path d="M14 7 7 14c-1 1-1.5 3-2 5 2-.5 4-1 5-2l7-7" />
    <path d="m5 19 1-1" />
    <path d="M17 3.5 18 2M20.5 7 22 6M19 10l1.5 1" />
  </svg>
);

/** Document / certificate — training & courses. */
const CertIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3h7l5 5v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 16h4" />
  </svg>
);

/** Dimensionality reduction — axes compressing to a line. */
const ReduceIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="m7 16 4-5 3 2 4-7" />
    <circle cx="7" cy="16" r="0.6" fill="currentColor" />
    <circle cx="11" cy="11" r="0.6" fill="currentColor" />
    <circle cx="14" cy="13" r="0.6" fill="currentColor" />
    <circle cx="18" cy="6" r="0.6" fill="currentColor" />
  </svg>
);

/** Trophy — competition award. */
const TrophyIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    <path d="M12 13v3" />
    <path d="M9 20h6M10 20v-2.5a2 2 0 0 1 4 0V20" />
  </svg>
);

/** Cloud — cloud / AWS. */
const CloudIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9a3.5 3.5 0 0 1 1 6.9" />
    <path d="M7 18h9.5" />
  </svg>
);

/** Rocket — deployment & serving. */
const RocketIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4c3-1 5-1 6 0 1 1 1 3 0 6l-6 6-6-6 6-6Z" />
    <circle cx="15.5" cy="8.5" r="1.5" />
    <path d="M8 10H5l-2 3 4 1" />
    <path d="M14 16v3l-3 2-1-4" />
    <path d="M6.5 17.5 4 20" />
  </svg>
);

const ICONS = {
  rocket: RocketIcon,
  brain: BrainIcon,
  pipeline: PipelineIcon,
  chart: ChartIcon,
  cycle: CycleIcon,
  clean: CleanIcon,
  cert: CertIcon,
  reduce: ReduceIcon,
  trophy: TrophyIcon,
  cloud: CloudIcon,
};

/**
 * Render an icon by key. Falls back to a generic certificate icon for unknown
 * keys so a card is never left without a glyph.
 *
 * @param {{ name?: string, className?: string }} props
 */
export const Icon = ({ name, className }) => {
  const Cmp = ICONS[name] || CertIcon;
  return <Cmp className={className || base.className} />;
};

export default Icon;
