import React from "react";
import { Icon } from "../../icons.jsx";

/**
 * What I Do Book Stage Overlay.
 * Features 3D closed book pull-out, hardcover swing open, and sequential page flip animation.
 *
 * @param {Object} props
 * @param {Array} props.skills
 * @param {string[]} props.toolbelt
 * @param {() => void} props.onClose
 * @param {string} [props.phase="settled"]
 * @param {() => void} [props.onSkip]
 * @param {React.RefObject} [props.containerRef]
 */
export const BookStage = ({
  skills = [],
  toolbelt = [],
  onClose,
  phase = "settled",
  onSkip,
  containerRef,
}) => {
  const isIntro = phase !== "settled";

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="desk-overlay-heading"
      data-testid="desk-overlay-notebook"
      data-stage-phase={phase}
      onClick={isIntro ? onSkip : undefined}
      className="stage-book-unfold max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl border-4 border-[#6e3b14] bg-[#8f4e1e] p-3 shadow-[10px_12px_0_0_#17150f] sm:p-5 relative"
    >
      {/* 3D Book Cover & Flipping Leaves Overlay (during intro animation) */}
      {isIntro && (
        <div
          aria-hidden="true"
          className="book-stage-3d pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#8f4e1e]/95 rounded-xl backdrop-blur-sm transition-opacity duration-300"
        >
          <div className="relative h-80 w-64 rounded-r-xl border-4 border-[#4a260c] bg-[#5c3010] p-6 shadow-2xl text-amber-100 flex flex-col justify-between">
            {/* Book Spine Stitching */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#3b1c06] border-r-2 border-[#ffdb7d]/30" />

            {/* Embossed Gold Title on Closed Cover */}
            <div className="ml-4 border-2 border-amber-300/40 p-4 text-center rounded-lg bg-[#45220a]">
              <span className="font-mono text-[10px] tracking-widest text-amber-300">
                LAB NOTEBOOK · VOL. 04
              </span>
              <h3 className="mt-2 font-serif text-2xl font-bold italic tracking-wide text-amber-200">
                What I Do
              </h3>
              <p className="mt-1 font-mono text-[10px] text-amber-100/70">
                BAGAS ADJIE PAMUNGKAS
              </p>
            </div>

            {/* Flipping Page Leaf simulation */}
            <div
              className={`absolute inset-0 bg-[#fbf8f1] rounded-r-lg border border-amber-900/20 shadow-lg ${
                phase === "flipping"
                  ? "book-page-leaf-1"
                  : phase === "flipping2"
                  ? "book-page-leaf-2"
                  : "opacity-0"
              }`}
            />

            {/* Bookmark ribbon */}
            <div className="absolute -bottom-4 right-10 h-10 w-4 bg-red-700 shadow-md" />
            <div className="text-center font-mono text-[11px] text-amber-300/80 animate-pulse">
              [Click anywhere to open immediately]
            </div>
          </div>
        </div>
      )}

      {/* Open 2-Page Hardcover Book Spread */}
      <div className="relative grid overflow-hidden rounded-xl border-2 border-ink bg-[#fbf8f1] md:grid-cols-12 transition-opacity duration-300">
        {/* Left Book Page: Chapter 01 — What I Do */}
        <div className="border-b-2 border-ink/20 p-5 sm:p-6 md:col-span-7 md:border-b-0 md:border-r-2">
          <div className="flex items-center justify-between border-b border-ink/20 pb-3">
            <div>
              <h2
                id="desk-overlay-heading"
                className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
              >
                What I <span className="font-serif italic">Do</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">CH. I</span>
          </div>

          <div className="mt-4 space-y-3">
            {skills.map((skill, idx) => (
              <div
                key={skill.title}
                className="rounded-xl border border-ink/25 bg-paper p-3.5 transition-colors hover:bg-marker/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-signal">
                    0{idx + 1} · {skill.title}
                  </span>
                  <span aria-hidden="true" className="text-ink">
                    <Icon name={skill.icon} className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Book Page: Chapter 02 — Core Toolbelt & Close Book */}
        <div className="flex flex-col justify-between bg-[#f6f1e5] p-5 sm:p-6 md:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-ink/20 pb-3">
              <div>
                <p className="text-xl font-extrabold tracking-tight text-ink">
                  Engineering Toolbelt
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close What I Do book overlay"
                className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-ink bg-marker px-3 py-1.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_#17150f]"
              >
                <span>Close Book</span>
                <span aria-hidden="true">[ESC]</span>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Buku ini diambil dari rak terbuka lemari kayu sebelah kiri meja belajar.
              Berikut tumpukan teknologi yang saya gunakan di produksi &amp; riset:
            </p>

            {toolbelt.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {toolbelt.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-ink bg-card px-3 py-1.5 font-mono text-xs font-semibold text-ink shadow-[2px_2px_0_0_#17150f]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-ink/25 bg-card p-3.5 font-mono text-xs text-ink-soft">
            <p className="font-bold text-ink">▸ LAB PRINCIPLE // LEAK-FREE VALIDATION</p>
            <p className="mt-1">
              Split before preprocessing · Rolling/Stratified CV · Seeded
              reproducible pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
