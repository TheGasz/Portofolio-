import React from "react";
import { Icon } from "../../icons.jsx";

/**
 * What I Do Book Stage Overlay (Original Presentation).
 *
 * @param {Object} props
 * @param {Array} props.skills
 * @param {string[]} props.toolbelt
 * @param {() => void} props.onClose
 * @param {React.RefObject} [props.containerRef]
 */
export const BookStage = ({
  skills = [],
  toolbelt = [],
  onClose,
  containerRef,
}) => {
  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="desk-overlay-heading"
      data-testid="desk-overlay-notebook"
      className="stage-book-unfold max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl border-4 border-[#6e3b14] bg-[#8f4e1e] p-3 shadow-[10px_12px_0_0_#17150f] sm:p-5"
    >
      {/* Open 2-Page Hardcover Book Spread */}
      <div className="relative grid overflow-hidden rounded-xl border-2 border-ink bg-[#fbf8f1] md:grid-cols-12">
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
