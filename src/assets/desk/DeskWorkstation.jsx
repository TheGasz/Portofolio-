import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./desk.css";
import { DESK_HOTSPOTS, getHotspotById, getReadoutText } from "./deskModel.js";
import { buildDeskScene } from "./deskGeometry.js";
import { isValidHttpUrl } from "../url.js";
import { Icon } from "../icons.jsx";

const LAYER_ORDER = [
  { type: "static", key: "deskAndWall" },
  { type: "hotspot", id: "photo" },
  { type: "hotspot", id: "trophy" },
  { type: "hotspot", id: "notebook" },
  { type: "hotspot", id: "monitor" },
  { type: "static", key: "keyboardAndMouse" },
  { type: "hotspot", id: "phone" },
];

/**
 * Interactive 3D/Isometric Workstation ("Bagas's Desk") built with the Anatomy
 * procedural isometric engine. Renders 5 clickable 3D hotspots (Monitor & PC,
 * Framed Wall Photo, Desk Telephone, Lab Notebook, and Trophy Shelf) with
 * keyboard navigation, live readout bar, and Lab Notebook overlay cards.
 */
export const DeskWorkstation = ({
  siteConfig = { contactEmail: null, socials: [] },
  skills = [],
  certifications = [],
  aboutNarrative = "",
  aboutFacts = [],
  toolbelt = [],
  profilePhoto = "",
  projectCount = 11,
}) => {
  const navigate = useNavigate();
  const [activeHotspotId, setActiveHotspotId] = useState(null);
  const [openOverlayId, setOpenOverlayId] = useState(null);
  const [showPins, setShowPins] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scene = useMemo(() => buildDeskScene(profilePhoto), [profilePhoto]);

  const handleActivateHotspot = (id) => {
    const hotspot = getHotspotById(id);
    if (!hotspot) return;

    if (hotspot.actionType === "route") {
      setOpenOverlayId(null);
      navigate(hotspot.target);
      return;
    }

    setActiveHotspotId(id);
    setOpenOverlayId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target;
      const tagName = target?.tagName;
      if (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "Escape" && openOverlayId) {
        event.preventDefault();
        setOpenOverlayId(null);
        return;
      }

      const matched = DESK_HOTSPOTS.find((h) => h.key === event.key);
      if (matched) {
        event.preventDefault();
        if (matched.actionType === "route") {
          setOpenOverlayId(null);
          navigate(matched.target);
        } else {
          setActiveHotspotId(matched.id);
          setOpenOverlayId((prev) => (prev === matched.id ? null : matched.id));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, openOverlayId]);

  const handleCopyOverlayEmail = async () => {
    if (!siteConfig?.contactEmail) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteConfig.contactEmail);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const hasContactEmail =
    typeof siteConfig?.contactEmail === "string" &&
    siteConfig.contactEmail.trim() !== "";

  const validSocials = (siteConfig?.socials || []).filter((s) =>
    isValidHttpUrl(s.href)
  );

  const readoutText = getReadoutText(activeHotspotId, openOverlayId);
  const openHotspot = getHotspotById(openOverlayId);

  const renderOverlayContent = () => {
    if (!openHotspot) return null;

    if (openOverlayId === "photo") {
      return (
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="mx-auto w-full max-w-[13rem] md:col-span-4">
            <div className="rotate-[-2deg] border-2 border-ink bg-paper p-2.5 pb-6 shadow-[4px_4px_0_0_#17150f]">
              {imgError || !profilePhoto ? (
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/5] w-full items-center justify-center bg-paper-2 font-mono text-xs text-muted"
                >
                  PORTRAIT
                </div>
              ) : (
                <img
                  src={profilePhoto}
                  alt="Bagas Adjie Pamungkas portrait"
                  onError={() => setImgError(true)}
                  className="aspect-[4/5] w-full object-cover object-[center_30%]"
                />
              )}
              <p className="mt-2 text-center font-mono text-[11px] font-semibold text-ink">
                BAGAS A. PAMUNGKAS
              </p>
            </div>
          </div>

          <div className="space-y-4 md:col-span-8">
            <p className="text-base leading-relaxed text-ink md:text-lg">
              {aboutNarrative}
            </p>
            {aboutFacts.length > 0 && (
              <dl className="grid gap-3 border-t border-ink/20 pt-4 sm:grid-cols-3">
                {aboutFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-lg border border-ink/20 bg-paper px-3 py-2"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#about"
                onClick={() => setOpenOverlayId(null)}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-semibold text-paper shadow-[3px_3px_0_0_#d93f12] transition-transform hover:-translate-y-0.5"
              >
                Jump to Full About Section ↓
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (openOverlayId === "phone") {
      return (
        <div className="space-y-5">
          <p className="text-base leading-relaxed text-ink-soft">
            Direct line to collaborate on data science models, ML pipelines, or
            research engineering roles.
          </p>

          {hasContactEmail && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border-2 border-ink bg-paper p-4 sm:flex-row sm:items-center">
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-muted">
                  Direct Email
                </span>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="focus-ring mt-1 inline-block break-all text-lg font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-signal sm:text-xl"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyOverlayEmail}
                aria-label={
                  copiedEmail
                    ? "Email address copied to clipboard"
                    : "Copy email address from workstation"
                }
                className="focus-ring inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border-2 border-ink bg-card px-4 py-2 font-mono text-xs font-semibold text-ink shadow-[3px_3px_0_0_#17150f] transition-colors hover:bg-marker"
              >
                <span aria-hidden="true">{copiedEmail ? "✓" : "📋"}</span>
                <span>{copiedEmail ? "Copied!" : "Copy email"}</span>
              </button>
            </div>
          )}

          {validSocials.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {validSocials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} profile (opens in a new tab)`}
                  className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-card px-4 py-2 font-mono text-xs font-semibold text-ink transition-colors hover:bg-marker"
                >
                  <span>{social.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}

          <div className="border-t border-ink/20 pt-3">
            <a
              href="#contact"
              onClick={() => setOpenOverlayId(null)}
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-semibold text-paper shadow-[3px_3px_0_0_#d93f12] transition-transform hover:-translate-y-0.5"
            >
              Jump to Full Contact Section ↓
            </a>
          </div>
        </div>
      );
    }

    if (openOverlayId === "notebook") {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill, idx) => (
              <div
                key={skill.title}
                className="rounded-xl border border-ink bg-paper p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-signal">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="text-ink">
                    <Icon name={skill.icon} className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-1.5 text-base font-bold text-ink">
                  {skill.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>

          {toolbelt.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                Core Toolbelt
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {toolbelt.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-md border border-ink/40 bg-paper px-2.5 py-1 font-mono text-xs font-medium text-ink"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-ink/20 pt-3">
            <a
              href="#skills"
              onClick={() => setOpenOverlayId(null)}
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-semibold text-paper shadow-[3px_3px_0_0_#d93f12] transition-transform hover:-translate-y-0.5"
            >
              Jump to Full Skills Section ↓
            </a>
          </div>
        </div>
      );
    }

    if (openOverlayId === "trophy") {
      const linkFor = (href) =>
        typeof href === "string" &&
        (isValidHttpUrl(href) || href.startsWith("/"))
          ? href
          : null;

      return (
        <div className="space-y-4">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {certifications.map((cert, idx) => {
              const href = linkFor(cert.href);
              const isExt = isValidHttpUrl(href);
              return (
                <li
                  key={cert.title}
                  className="rounded-xl border border-ink bg-paper p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-signal">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-bold leading-snug text-ink">
                        {cert.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted">
                        {cert.issuer}
                        {cert.issuer && cert.date ? ` · ${cert.date}` : ""}
                      </p>
                    </div>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel={isExt ? "noopener noreferrer" : "noopener"}
                        aria-label={`Open certificate: ${cert.title} (opens in a new tab)`}
                        className="focus-ring inline-flex min-h-[36px] min-w-[36px] shrink-0 items-center justify-center rounded-lg border border-ink bg-card font-mono text-xs font-bold text-ink transition-colors hover:bg-marker"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-ink/20 pt-3">
            <a
              href="#credentials"
              onClick={() => setOpenOverlayId(null)}
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-semibold text-paper shadow-[3px_3px_0_0_#d93f12] transition-transform hover:-translate-y-0.5"
            >
              Jump to Full Credentials Section ↓
            </a>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="iso-desk relative rounded-2xl border-2 border-ink bg-card shadow-[8px_8px_0_0_#17150f]"
      data-testid="desk-workstation"
    >
      {/* Top Technical Plate Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-signal"
          />
          <span className="font-mono text-xs font-semibold tracking-wider text-ink sm:text-sm">
            FIG 01 / INTERACTIVE 3D WORKSTATION
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-muted md:inline">
            Click objects on the desk or press{" "}
            <kbd className="rounded border border-ink/40 bg-card px-1.5 py-0.5 font-mono text-[11px] text-ink">
              1
            </kbd>
            –
            <kbd className="rounded border border-ink/40 bg-card px-1.5 py-0.5 font-mono text-[11px] text-ink">
              5
            </kbd>
          </span>
          <button
            type="button"
            onClick={() => setShowPins((prev) => !prev)}
            aria-pressed={showPins}
            aria-label={
              showPins
                ? "Hide numbered hotspot callout pins"
                : "Show numbered hotspot callout pins"
            }
            className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-ink bg-card px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-colors hover:bg-marker"
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                showPins ? "bg-signal" : "bg-muted"
              }`}
            />
            <span>Pins: {showPins ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Isometric SVG Stage + Interactive Overlay Drawer */}
      <div className="relative overflow-hidden px-2 py-3 sm:px-6 sm:py-5">
        <svg
          className="iso-svg"
          viewBox={scene.viewBox}
          role="group"
          aria-label="Interactive 3D Isometric Workstation of Bagas Adjie Pamungkas"
        >
          {LAYER_ORDER.map((item) => {
            if (item.type === "static") {
              return (
                <g
                  key={item.key}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{
                    __html: scene.layers[item.key],
                  }}
                />
              );
            }

            const hotspot = getHotspotById(item.id);
            if (!hotspot) return null;
            const isActive =
              activeHotspotId === hotspot.id || openOverlayId === hotspot.id;

            return (
              <g
                key={hotspot.id}
                className="desk-hotspot"
                data-hotspot={hotspot.id}
                data-active={isActive ? "true" : "false"}
                role="button"
                tabIndex={0}
                aria-label={hotspot.ariaLabel}
                aria-expanded={
                  hotspot.actionType === "overlay"
                    ? openOverlayId === hotspot.id
                    : undefined
                }
                onMouseEnter={() => setActiveHotspotId(hotspot.id)}
                onMouseLeave={() =>
                  setActiveHotspotId((curr) =>
                    curr === hotspot.id ? null : curr
                  )
                }
                onFocus={() => setActiveHotspotId(hotspot.id)}
                onBlur={() =>
                  setActiveHotspotId((curr) =>
                    curr === hotspot.id ? null : curr
                  )
                }
                onClick={() => handleActivateHotspot(hotspot.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleActivateHotspot(hotspot.id);
                  }
                }}
              >
                <g
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{
                    __html: scene.layers[hotspot.id],
                  }}
                />
              </g>
            );
          })}

          {/* Numbered Callout Badges on the 3D Scene */}
          {showPins &&
            DESK_HOTSPOTS.map((hotspot) => {
              const pin = scene.pins[hotspot.id];
              if (!pin) return null;
              const isActive =
                activeHotspotId === hotspot.id || openOverlayId === hotspot.id;

              return (
                <g
                  key={`pin-${hotspot.id}`}
                  aria-hidden="true"
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className="pointer-events-none"
                >
                  <circle
                    r="13"
                    fill={isActive ? "#d93f12" : "#17150f"}
                    stroke="#fbf9f4"
                    strokeWidth="2"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fbf9f4"
                    fontFamily="var(--font-mono)"
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {hotspot.number}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Interactive Overlay Card (About Me / Contact / Skills / Credentials) */}
        {openHotspot && (
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="desk-overlay-heading"
            data-testid={`desk-overlay-${openHotspot.id}`}
            className="mt-3 rounded-2xl border-2 border-ink bg-card p-5 shadow-[6px_6px_0_0_#17150f] sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <p className="font-mono text-xs font-semibold text-signal">
                  HOTSPOT {openHotspot.number} · {openHotspot.objectName.toUpperCase()}
                </p>
                <h2
                  id="desk-overlay-heading"
                  className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
                >
                  {openHotspot.label}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpenOverlayId(null)}
                aria-label={`Close ${openHotspot.label} overlay`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold text-ink transition-colors hover:bg-marker"
              >
                <span>Close</span>
                <span aria-hidden="true" className="text-muted">
                  [ESC]
                </span>
              </button>
            </div>

            {renderOverlayContent()}
          </div>
        )}
      </div>

      {/* Bottom Live Readout & Quick Hotspot Dock */}
      <div className="border-t-2 border-ink bg-paper-2 px-4 py-3.5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p
            data-readout
            data-testid="desk-readout"
            aria-live="polite"
            className="font-mono text-xs font-semibold tracking-wider text-ink sm:text-sm"
          >
            <span aria-hidden="true" className="mr-2 text-signal">
              ▸
            </span>
            {readoutText}
          </p>

          <div
            role="group"
            aria-label="Workstation quick hotspot dock"
            className="flex flex-wrap gap-2"
          >
            {DESK_HOTSPOTS.map((hotspot) => {
              const isSelected =
                activeHotspotId === hotspot.id || openOverlayId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => handleActivateHotspot(hotspot.id)}
                  onMouseEnter={() => setActiveHotspotId(hotspot.id)}
                  onMouseLeave={() =>
                    setActiveHotspotId((curr) =>
                      curr === hotspot.id ? null : curr
                    )
                  }
                  aria-label={`${hotspot.number} ${hotspot.objectName}: ${
                    hotspot.id === "monitor"
                      ? `Open all ${projectCount} projects`
                      : hotspot.label
                  }`}
                  className={`focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-ink bg-ink text-paper shadow-[3px_3px_0_0_#d93f12]"
                      : "border-ink bg-card text-ink hover:bg-marker"
                  }`}
                >
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                      isSelected
                        ? "bg-signal text-paper"
                        : "bg-paper-2 text-signal"
                    }`}
                  >
                    {hotspot.number}
                  </span>
                  <span>{hotspot.objectName}</span>
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                  <span className="underline decoration-signal decoration-2 underline-offset-4">
                    {hotspot.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskWorkstation;

