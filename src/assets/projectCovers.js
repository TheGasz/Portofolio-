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

// 8. Customer-support RAG — ticket flows into retrieval docs + grounded reply.
export const ragSupportCover = cover(
  "rag",
  `<text x="40" y="66" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Support RAG Copilot</text>
   <g font-family="system-ui, sans-serif">
     <rect x="60" y="130" width="120" height="150" rx="12" fill="#0e7490" opacity="0.4" stroke="#7dd3fc" stroke-width="2"/>
     <text x="120" y="118" fill="#7dd3fc" font-size="15" font-weight="600" text-anchor="middle">Ticket</text>
     <g stroke="#7dd3fc" stroke-width="3" stroke-linecap="round" opacity="0.8">
       <line x1="78" y1="158" x2="162" y2="158"/><line x1="78" y1="178" x2="162" y2="178"/>
       <line x1="78" y1="198" x2="140" y2="198"/><line x1="78" y1="226" x2="162" y2="226"/>
       <line x1="78" y1="246" x2="130" y2="246"/>
     </g>
   </g>
   <g stroke="#5eead4" stroke-width="3" fill="none" marker-end="url(#a)">
     <path d="M188 205 H250"/><path d="M372 205 H434"/>
   </g>
   <g>
     <rect x="258" y="150" width="104" height="30" rx="6" fill="#15803d" opacity="0.4" stroke="#86efac" stroke-width="1.5"/>
     <rect x="258" y="190" width="104" height="30" rx="6" fill="#15803d" opacity="0.3" stroke="#86efac" stroke-width="1.5"/>
     <rect x="258" y="230" width="104" height="30" rx="6" fill="#15803d" opacity="0.2" stroke="#86efac" stroke-width="1.5"/>
     <text x="310" y="138" fill="#86efac" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Retrieve</text>
   </g>
   <g>
     <rect x="440" y="150" width="110" height="120" rx="12" fill="#b45309" opacity="0.35" stroke="#fcd34d" stroke-width="2"/>
     <text x="495" y="138" fill="#fcd34d" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Answer</text>
     <g stroke="#fcd34d" stroke-width="3" stroke-linecap="round" opacity="0.85">
       <line x1="456" y1="178" x2="534" y2="178"/><line x1="456" y1="198" x2="534" y2="198"/>
       <line x1="456" y1="218" x2="510" y2="218"/>
     </g>
     <text x="456" y="250" fill="#fcd34d" font-family="system-ui, sans-serif" font-size="12">[cite: SOP]</text>
   </g>`
);

// 9. 15-minute city — city grid tinted into two accessibility clusters + pins.
export const cityProfilerCover = cover(
  "city",
  `<text x="40" y="60" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="26" font-weight="700">15-Minute City</text>
   <g>
     ${Array.from({ length: 6 * 5 }, (_, i) => {
       const c = i % 6, r = Math.floor(i / 6);
       // Two clusters: well-served (teal) vs developing (slate).
       const served = [1, 2, 7, 8, 9, 13, 14, 15, 20, 21].includes(i);
       const fill = served ? "#0e7490" : "#334155";
       const op = served ? 0.55 : 0.4;
       return `<rect x="${90 + c * 70}" y="${95 + r * 40}" width="62" height="32" rx="5" fill="${fill}" opacity="${op}" stroke="#5eead4" stroke-width="0.8"/>`;
     }).join("")}
   </g>
   <g fill="#fcd34d">
     <circle cx="150" cy="150" r="5"/><circle cx="330" cy="135" r="5"/><circle cx="470" cy="190" r="5"/><circle cx="260" cy="250" r="5"/>
   </g>`
);

// 10. Transit anomaly detection — tap-event stream with a flagged spike.
export const transitAnomalyCover = cover(
  "transit",
  `<text x="40" y="60" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Transit Anomaly Detection</text>
   <path d="M60 220 L120 200 L180 210 L240 180 L300 195 L360 110 L360 110 L420 205 L480 185 L540 200"
         fill="none" stroke="#5eead4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
   <line x1="60" y1="250" x2="540" y2="250" stroke="#334155" stroke-width="2"/>
   <g>
     <circle cx="360" cy="110" r="12" fill="none" stroke="#f87171" stroke-width="3"/>
     <circle cx="360" cy="110" r="5" fill="#f87171"/>
     <text x="360" y="92" fill="#f87171" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">anomaly</text>
   </g>
   <g fill="#7dd3fc">
     <rect x="96" y="275" width="26" height="26" rx="5" opacity="0.5"/>
     <rect x="132" y="275" width="26" height="26" rx="5" opacity="0.5"/>
     <text x="175" y="293" fill="#7dd3fc" font-family="system-ui, sans-serif" font-size="13">tap events</text>
   </g>`
);

// 11. Reimbursement agent — receipt feeding an agent that routes a decision.
export const reimburseAgentCover = cover(
  "reimburse",
  `<text x="40" y="58" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="25" font-weight="700">Reimbursement Agent</text>
   <g>
     <rect x="64" y="110" width="96" height="140" rx="8" fill="#0e7490" opacity="0.35" stroke="#7dd3fc" stroke-width="2"/>
     <text x="112" y="100" fill="#7dd3fc" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Receipt</text>
     <g stroke="#7dd3fc" stroke-width="2.5" stroke-linecap="round" opacity="0.8">
       <line x1="80" y1="136" x2="144" y2="136"/><line x1="80" y1="156" x2="144" y2="156"/>
       <line x1="80" y1="176" x2="126" y2="176"/><line x1="80" y1="200" x2="144" y2="200"/><line x1="80" y1="220" x2="120" y2="220"/>
     </g>
   </g>
   <g stroke="#5eead4" stroke-width="3" fill="none"><path d="M168 180 H236"/></g>
   <g>
     <circle cx="300" cy="180" r="34" fill="#132033" stroke="#5eead4" stroke-width="2.5"/>
     <text x="300" y="186" fill="#5eead4" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">AI</text>
   </g>
   <g stroke="#5eead4" stroke-width="3" fill="none">
     <path d="M338 160 L400 120"/><path d="M338 180 H400"/><path d="M338 200 L400 240"/>
   </g>
   <g font-family="system-ui, sans-serif" font-size="14" font-weight="600">
     <rect x="406" y="104" width="120" height="30" rx="8" fill="#15803d" opacity="0.4" stroke="#86efac" stroke-width="1.5"/>
     <text x="466" y="124" fill="#86efac" text-anchor="middle">Approve</text>
     <rect x="406" y="164" width="120" height="30" rx="8" fill="#b45309" opacity="0.4" stroke="#fcd34d" stroke-width="1.5"/>
     <text x="466" y="184" fill="#fcd34d" text-anchor="middle">Escalate</text>
     <rect x="406" y="224" width="120" height="30" rx="8" fill="#7f1d1d" opacity="0.5" stroke="#f87171" stroke-width="1.5"/>
     <text x="466" y="244" fill="#fca5a5" text-anchor="middle">Reject</text>
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
