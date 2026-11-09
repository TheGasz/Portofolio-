import React from "react";
import { isValidHttpUrl } from "../../url.js";
import { useSfx } from "../../audio/SfxProvider.jsx";

/**
 * Trophy & Verified Certifications Stage Overlay.
 * Features cinematic center-stage glowing ignition, smooth slide-to-left choreography,
 * and staggered certification card dealing.
 *
 * @param {Object} props
 * @param {Array} props.certifications
 * @param {() => void} props.onClose
 * @param {string} [props.phase="settled"]
 * @param {() => void} [props.onSkip]
 * @param {React.RefObject} [props.containerRef]
 */
export const TrophyStage = ({
  certifications = [],
  onClose,
  phase = "settled",
  containerRef,
}) => {
  const { play } = useSfx();

  const linkFor = (href) =>
    typeof href === "string" && (isValidHttpUrl(href) || href.startsWith("/"))
      ? href
      : null;

  const handleCardClick = () => {
    play("ui.pop");
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="desk-overlay-heading"
      data-testid="desk-overlay-trophy"
      data-stage-phase={phase}
      className={`stage-trophy-overlay max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl border-2 border-ink bg-gradient-to-br from-[#1b2838] via-[#223448] to-[#172230] p-5 text-paper shadow-[8px_8px_0_0_#17150f] sm:p-6 transition-all duration-500`}
    >
      <div className="stage-trophy-header mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
        <div>
          <h2
            id="desk-overlay-heading"
            className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          >
            Achievements &amp; Verified Certifications
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Credentials overlay"
          className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-300 px-3.5 py-1.5 font-mono text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
        >
          <span>← Back to Room</span>
          <span aria-hidden="true">[ESC]</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Stage: Pure Glowing Trophy Showcase */}
        <div className="stage-trophy-hero flex flex-col items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-b from-amber-400/15 to-transparent p-8 text-center lg:col-span-4 transition-transform duration-500">
          <div className="relative flex h-48 w-48 items-center justify-center">
            {/* Spinning Golden Sunburst Rays */}
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="trophy-sunburst pointer-events-none absolute inset-[-20%] h-[140%] w-[140%] opacity-45"
            >
              <defs>
                <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd84d" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ffd84d" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffd84d" stopOpacity="0" />
                </radialGradient>
              </defs>
              {Array.from({ length: 12 }).map((_, i) => (
                <polygon
                  key={i}
                  points="100,100 92,0 108,0"
                  fill="url(#sunburstGrad)"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
            </svg>

            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-amber-300/35 blur-2xl"
            />

            <svg
              viewBox="0 0 140 160"
              aria-hidden="true"
              className="relative h-44 w-44 drop-shadow-[0_0_16px_rgba(255,216,77,0.6)]"
            >
              {/* Sparkle stars around the glowing trophy */}
              <circle cx="24" cy="28" r="2.5" fill="#fff3b0" />
              <circle cx="118" cy="34" r="3" fill="#ffd84d" />
              <circle cx="20" cy="88" r="2" fill="#ffd84d" />
              <circle cx="122" cy="92" r="2.5" fill="#fff3b0" />
              {/* TrophyHandles */}
              <path
                d="M38 42 C 16 42, 18 78, 44 82 M102 42 C 124 42, 122 78, 96 82"
                fill="none"
                stroke="#ffd84d"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Trophy Cup Body */}
              <path
                d="M36 28 H104 L96 84 C 92 104, 48 104, 44 84 Z"
                fill="#ffd84d"
                stroke="#17150f"
                strokeWidth="3.5"
              />
              {/* Trophy Stem & Pedestal */}
              <rect
                x="63"
                y="100"
                width="14"
                height="24"
                rx="3"
                fill="#f3c846"
                stroke="#17150f"
                strokeWidth="3"
              />
              <rect
                x="38"
                y="124"
                width="64"
                height="22"
                rx="4"
                fill="#2b261f"
                stroke="#ffd84d"
                strokeWidth="3"
              />
              <rect
                x="50"
                y="131"
                width="40"
                height="8"
                rx="1.5"
                fill="#ffd84d"
              />
            </svg>
          </div>
          <span className="sr-only">2× BOOTCAMP 1ST RUNNER UP</span>
        </div>

        {/* Right Stage: Achievements & 7 Certificates List */}
        <div className="stage-trophy-certs lg:col-span-8 transition-opacity duration-500">
          <ul className="grid gap-3 sm:grid-cols-2">
            {certifications.map((cert, idx) => {
              const href = linkFor(cert.href);
              const isExt = isValidHttpUrl(href);
              const isAward = cert.icon === "trophy";
              return (
                <li
                  key={cert.title}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={`rounded-xl border-2 p-3.5 transition-transform hover:-translate-y-0.5 ${
                    isAward
                      ? "border-amber-300 bg-amber-300/15 text-white"
                      : "border-ink bg-card text-ink"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isAward ? "text-amber-300" : "text-signal"
                        }`}
                      >
                        #{String(idx + 1).padStart(2, "0")}{" "}
                        {isAward ? "· AWARD WIN" : "· CERTIFICATE"}
                      </span>
                      <p className="mt-0.5 text-sm font-bold leading-snug">
                        {cert.title}
                      </p>
                      <p
                        className={`mt-1 font-mono text-[11px] ${
                          isAward ? "text-sky-100/80" : "text-muted"
                        }`}
                      >
                        {cert.issuer}
                        {cert.issuer && cert.date ? ` · ${cert.date}` : ""}
                      </p>
                    </div>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        onClick={handleCardClick}
                        rel={isExt ? "noopener noreferrer" : "noopener"}
                        aria-label={`Open certificate: ${cert.title} (opens in a new tab)`}
                        className="focus-ring inline-flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-amber-300 font-mono text-xs font-bold text-ink transition-transform hover:scale-105"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
