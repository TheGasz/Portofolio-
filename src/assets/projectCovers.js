// Themed, on-brand SVG "cover" graphics for the project cards.
//
// These projects are notebook-based (no live UI to screenshot), so instead of
// a misleading stock photo each card gets a lightweight vector illustration
// that hints at the project's domain. Each cover is returned as a data-URI so
// it can be dropped straight into an <img src> with no extra asset files to
// manage, and it stays crisp at any size.
//
// Palette mirrors the site's gradient language (sky / teal / amber on a deep
// night backdrop) so the covers feel native to the rest of the page.

/**
 * Wrap inner SVG markup in a 600x340 viewBox with a shared dark gradient
 * backdrop, then encode it as a data URI suitable for an <img src>.
 *
 * @param {string} id     Unique gradient id so multiple inline SVGs don't clash.
 * @param {string} inner  SVG markup drawn on top of the backdrop.
 * @returns {string} A `data:image/svg+xml,...` URI.
 */
const cover = (id, inner) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="1" stop-color="#132033"/>
    </linearGradient>
  </defs>
  <rect width="600" height="340" fill="url(#bg-${id})"/>
  ${inner}
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// 1. River water-level forecasting — layered water waves + rising gauge line.
export const waterLevelCover = cover(
  "water",
  `<path d="M0 250 Q75 220 150 245 T300 245 T450 245 T600 240 V340 H0 Z" fill="#0ea5b7" opacity="0.35"/>
   <path d="M0 275 Q75 250 150 272 T300 272 T450 272 T600 268 V340 H0 Z" fill="#0891b2" opacity="0.45"/>
   <path d="M0 300 Q75 282 150 298 T300 298 T450 298 T600 296 V340 H0 Z" fill="#0e7490" opacity="0.6"/>
   <polyline points="40,210 140,180 240,195 340,140 440,120 560,80" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
   <g fill="#fcd34d">
     <circle cx="140" cy="180" r="6"/><circle cx="240" cy="195" r="6"/><circle cx="340" cy="140" r="6"/><circle cx="440" cy="120" r="6"/>
   </g>
   <text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="30" font-weight="700">River TMA Forecast</text>`
);

// 2. Hierarchical waste classification — three sorted bins + classify arrow.
export const wasteClassifyCover = cover(
  "waste",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="28" font-weight="700">Waste Classifier</text>
   <g font-family="system-ui, sans-serif" font-size="18" font-weight="600" text-anchor="middle">
     <rect x="90" y="150" width="110" height="130" rx="14" fill="#0e7490" opacity="0.5" stroke="#5eead4" stroke-width="2"/>
     <text x="145" y="315" fill="#5eead4">Recyclable</text>
     <rect x="245" y="150" width="110" height="130" rx="14" fill="#15803d" opacity="0.5" stroke="#86efac" stroke-width="2"/>
     <text x="300" y="315" fill="#86efac">Organic</text>
     <rect x="400" y="150" width="110" height="130" rx="14" fill="#b45309" opacity="0.5" stroke="#fcd34d" stroke-width="2"/>
     <text x="455" y="315" fill="#fcd34d">Hazardous</text>
   </g>
   <circle cx="300" cy="115" r="26" fill="none" stroke="#7dd3fc" stroke-width="4"/>
   <line x1="320" y1="135" x2="345" y2="160" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round"/>`
);

// 3. Waste image classification (competition) — embedding grid + feature dots.
export const embeddingCover = cover(
  "embed",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="28" font-weight="700">SigLIP Embeddings</text>
   <g fill="#1e293b" stroke="#334155" stroke-width="1">
     ${Array.from({ length: 5 * 9 }, (_, i) => {
       const c = i % 9, r = Math.floor(i / 9);
       return `<rect x="${60 + c * 52}" y="${120 + r * 34}" width="44" height="26" rx="5"/>`;
     }).join("")}
   </g>
   <g fill="#5eead4">
     ${[3, 12, 19, 25, 31, 38, 42].map((i) => {
       const c = i % 9, r = Math.floor(i / 9);
       return `<rect x="${60 + c * 52}" y="${120 + r * 34}" width="44" height="26" rx="5" opacity="0.9"/>`;
     }).join("")}
   </g>
   <g fill="#fcd34d">
     ${[7, 15, 28, 40].map((i) => {
       const c = i % 9, r = Math.floor(i / 9);
       return `<rect x="${60 + c * 52}" y="${120 + r * 34}" width="44" height="26" rx="5" opacity="0.9"/>`;
     }).join("")}
   </g>`
);

// 4. Crop yield prediction — sprouting plant + upward prediction trend.
export const cropCover = cover(
  "crop",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="28" font-weight="700">Crop Yield Model</text>
   <g stroke="#86efac" stroke-width="5" fill="none" stroke-linecap="round">
     <path d="M300 300 V190"/>
     <path d="M300 230 C255 215 235 180 235 150 C280 155 300 190 300 225"/>
     <path d="M300 215 C345 200 365 165 365 135 C320 140 300 175 300 210"/>
   </g>
   <polyline points="420,290 460,250 500,260 540,200" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="540" cy="200" r="6" fill="#fcd34d"/>
   <line x1="120" y1="305" x2="560" y2="305" stroke="#334155" stroke-width="3"/>`
);

// 6. Jakarta flood risk pipeline — city grid + flood overlay + merging sources.
export const floodPipelineCover = cover(
  "flood",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="27" font-weight="700">Jakarta Flood Pipeline</text>
   <g stroke="#334155" stroke-width="2">
     ${Array.from({ length: 5 }, (_, i) => `<line x1="${120 + i * 90}" y1="110" x2="${120 + i * 90}" y2="300"/>`).join("")}
     ${Array.from({ length: 4 }, (_, i) => `<line x1="110" y1="${120 + i * 48}" x2="560" y2="${120 + i * 48}"/>`).join("")}
   </g>
   <path d="M110 230 Q200 210 290 232 T470 232 T560 226 V300 H110 Z" fill="#0891b2" opacity="0.45"/>
   <path d="M110 258 Q200 242 290 260 T470 260 T560 256 V300 H110 Z" fill="#0e7490" opacity="0.6"/>
   <g fill="#fcd34d">
     <circle cx="200" cy="150" r="7"/><circle cx="380" cy="168" r="7"/><circle cx="470" cy="150" r="7"/>
   </g>
   <g stroke="#5eead4" stroke-width="3" fill="none" opacity="0.8">
     <path d="M70 100 C 100 120 100 150 130 160"/>
     <path d="M70 130 C 100 145 100 160 130 168"/>
   </g>`
);

// 7. Face anti-spoofing — face outline inside a detection frame + scan line.
export const faceSpoofingCover = cover(
  "face",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="27" font-weight="700">Face Anti-Spoofing</text>
   <g stroke="#5eead4" stroke-width="4" fill="none" stroke-linecap="round">
     <path d="M230 120 H200 V150"/><path d="M370 120 H400 V150"/>
     <path d="M230 290 H200 V260"/><path d="M370 290 H400 V260"/>
   </g>
   <g stroke="#7dd3fc" stroke-width="4" fill="none">
     <ellipse cx="300" cy="205" rx="55" ry="68"/>
     <circle cx="282" cy="195" r="5" fill="#7dd3fc" stroke="none"/>
     <circle cx="318" cy="195" r="5" fill="#7dd3fc" stroke="none"/>
     <path d="M284 232 Q300 244 316 232"/>
   </g>
   <rect x="200" y="200" width="200" height="4" rx="2" fill="#fcd34d" opacity="0.9"/>
   <g font-family="system-ui, sans-serif" font-size="15" font-weight="600">
     <rect x="60" y="280" width="78" height="26" rx="13" fill="#15803d" opacity="0.5" stroke="#86efac" stroke-width="1.5"/>
     <text x="99" y="298" fill="#86efac" text-anchor="middle">real</text>
     <rect x="150" y="280" width="78" height="26" rx="13" fill="#b45309" opacity="0.5" stroke="#fcd34d" stroke-width="1.5"/>
     <text x="189" y="298" fill="#fcd34d" text-anchor="middle">spoof</text>
   </g>`
);

// 5. Agent-based exposure simulation — agents, vision cone + heatmap grid.
export const simulationCover = cover(
  "sim",
  `<text x="40" y="70" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="28" font-weight="700">Agent Simulation</text>
   <g>
     ${Array.from({ length: 4 * 7 }, (_, i) => {
       const c = i % 7, r = Math.floor(i / 7);
       const heat = [5, 6, 12, 13, 19, 20].includes(i) ? 0.55 : 0.12;
       return `<rect x="${60 + c * 54}" y="${120 + r * 42}" width="46" height="34" rx="6" fill="#f59e0b" opacity="${heat}"/>`;
     }).join("")}
   </g>
   <path d="M160 300 L250 160 L300 200 Z" fill="#7dd3fc" opacity="0.25"/>
   <circle cx="160" cy="300" r="10" fill="#5eead4"/>
   <circle cx="430" cy="150" r="10" fill="#fcd34d"/>`
);
