import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./desk.css";
import { DESK_HOTSPOTS, getHotspotById, getReadoutText } from "./deskModel.js";
import { buildDeskScene } from "./deskGeometry.js";
import { createSereneAudioEngine } from "./ambientAudio.js";
import { isValidHttpUrl } from "../url.js";
import { Icon } from "../icons.jsx";
import { projectsData, ProjectCard, PROJECT_CATEGORIES } from "../project.jsx";

const LAYER_ORDER = [
  { type: "static", key: "deskAndWall" },
  { type: "hotspot", id: "notebook" },
  { type: "static", key: "cabinetFrontAndCrown" },
  { type: "hotspot", id: "photo" },
  { type: "hotspot", id: "trophy" },
  { type: "hotspot", id: "monitor" },
  { type: "static", key: "keyboardAndMouse" },
  { type: "hotspot", id: "phone" },
];

/**
 * Isolated memoized components for high-frequency 60fps rendering.
 * Prevents full-SVG reconciliation when cursor hovers or pins toggle.
 */
const StaticLayer = React.memo(({ html }) => (
  <g aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
));

const HotspotLayer = React.memo(
  ({
    hotspot,
    isActive,
    isOpen,
    html,
    onActivate,
    onHover,
    onLeave,
    onFocus,
    onBlur,
  }) => (
    <g
      className="desk-hotspot"
      data-hotspot={hotspot.id}
      data-active={isActive ? "true" : "false"}
      role="button"
      tabIndex={0}
      aria-label={hotspot.ariaLabel}
      aria-expanded={isOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      <g aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
    </g>
  )
);

const CalloutPin = React.memo(({ hotspot, pin, isActive }) => (
  <g
    aria-hidden="true"
    transform={`translate(${pin.x}, ${pin.y})`}
    className="pointer-events-none"
  >
    <circle
      r="13.5"
      fill={isActive ? "#d93f12" : "#17150f"}
      stroke="#ffd84d"
      strokeWidth="2.2"
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
));

/**
 * Single-Page Interactive 3D Bedroom & Real Study Desk ("Bagas's Room").
 * Features a cool-toned bedroom with a scenic twilight window, Bagas's real
 * teak wooden cabinet & study desk setup, serene Web Audio API ambient music
 * ("Musik Syahdu"), and 5 object-first cinematic zoom-in stage transitions.
 */
export const DeskWorkstation = ({
  siteConfig = { contactEmail: null, socials: [] },
  skills = [],
  certifications = [],
  aboutNarrative = "",
  aboutFacts = [],
  toolbelt = [],
  profilePhoto = "",
  projects = projectsData,
}) => {
  const navigate = useNavigate();
  const [activeHotspotId, setActiveHotspotId] = useState(null);
  const [openStageId, setOpenStageId] = useState(null);
  const [showPins, setShowPins] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasEnteredRoom, setHasEnteredRoom] = useState(false);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isDivingIntoProject, setIsDivingIntoProject] = useState(false);

  const handleOpenFullProjectPage = () => {
    if (isDivingIntoProject) return;
    setIsDivingIntoProject(true);
    setTimeout(() => {
      navigate("/project");
    }, 380);
  };

  const audioEngineRef = useRef(null);

  useEffect(() => {
    const engine = createSereneAudioEngine();
    audioEngineRef.current = engine;
    return () => {
      engine.cleanup();
    };
  }, []);

  const handleToggleMusic = async () => {
    if (!audioEngineRef.current) return;
    const playing = await audioEngineRef.current.toggle();
    setIsMusicPlaying(playing);
  };

  const handleEnterRoom = () => {
    if (isDoorOpening || hasEnteredRoom) return;
    setIsDoorOpening(true);
    setTimeout(() => {
      setHasEnteredRoom(true);
    }, 520);
  };

  const scene = useMemo(() => buildDeskScene(profilePhoto), [profilePhoto]);

  const handleActivateHotspot = useCallback((id) => {
    const hotspot = getHotspotById(id);
    if (!hotspot) return;

    setActiveHotspotId(id);
    setOpenStageId((prev) => (prev === id ? null : id));
  }, []);

  const handleHoverHotspot = useCallback((id) => {
    setActiveHotspotId((curr) => (curr === id ? curr : id));
  }, []);

  const handleLeaveHotspot = useCallback((id) => {
    setActiveHotspotId((curr) => (curr === id ? null : curr));
  }, []);

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

      if (!hasEnteredRoom && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        setIsDoorOpening(true);
        setTimeout(() => {
          setHasEnteredRoom(true);
        }, 520);
        return;
      }

      if (event.key === "Escape" && openStageId) {
        event.preventDefault();
        setOpenStageId(null);
        return;
      }

      const matched = DESK_HOTSPOTS.find((h) => h.key === event.key);
      if (matched) {
        event.preventDefault();
        setHasEnteredRoom(true);
        setActiveHotspotId(matched.id);
        setOpenStageId((prev) => (prev === matched.id ? null : matched.id));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openStageId, hasEnteredRoom]);

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

  const readoutText = getReadoutText(activeHotspotId, openStageId);
  const openHotspot = getHotspotById(openStageId);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const cameraStyle = openHotspot?.cameraZoom
    ? {
        "--cam-scale": openHotspot.cameraZoom.scale,
        "--cam-origin-x": openHotspot.cameraZoom.originX,
        "--cam-origin-y": openHotspot.cameraZoom.originY,
      }
    : undefined;

  const renderCinematicStage = () => {
    if (!openHotspot) return null;

    // ------------------------------------------------------------------------
    // 01. MONITOR DIVE-IN: Screen Powers On & Opens All 11 ProjectCards Inside
    // ------------------------------------------------------------------------
    if (openStageId === "monitor") {
      return (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="desk-overlay-heading"
          data-testid="desk-overlay-monitor"
          className={`stage-monitor-dive flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border-4 border-[#252830] bg-[#0f1722] text-paper shadow-[0_24px_60px_rgba(0,0,0,0.65)] ${
            isDivingIntoProject ? "is-diving-thru" : ""
          }`}
        >
          {/* Monitor Bezel Top Status Bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-sky-400/25 bg-[#162232] px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
              />
              <div>
                <h2
                  id="desk-overlay-heading"
                  className="text-lg font-extrabold tracking-tight text-white sm:text-xl"
                >
                  BagasOS — Project Explorer ({projects.length} Repositories)
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenFullProjectPage}
                aria-label="Open Full Project Page"
                className="focus-ring inline-flex min-h-[38px] cursor-pointer items-center rounded-xl border border-sky-300/40 bg-sky-500/20 px-3.5 py-1.5 font-mono text-xs font-semibold text-sky-200 transition-all hover:bg-sky-500/35 hover:scale-105 active:scale-95"
              >
                <span>Open Full Project Page</span>
              </button>
              <button
                type="button"
                onClick={() => setOpenStageId(null)}
                aria-label="Exit Monitor and return to room"
                className="focus-ring inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-300 px-3.5 py-1.5 font-mono text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                <span>← Exit Monitor</span>
                <span aria-hidden="true">[ESC]</span>
              </button>
            </div>
          </div>

          {/* Category Filter Bar inside Monitor */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#121d2b] px-4 py-2.5 sm:px-6">
            <div
              role="group"
              aria-label="Filter projects inside monitor"
              className="flex flex-wrap gap-2"
            >
              {PROJECT_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={active}
                    className={`focus-ring min-h-[34px] rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-all ${
                      active
                        ? "bg-amber-300 text-ink shadow-[2px_2px_0_0_#d93f12]"
                        : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/15"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-xs text-sky-200/80">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
          </div>

          {/* Scrollable Monitor Screen Viewport with All ProjectCards */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-paper p-4 text-ink sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  number={idx + 1}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  tech={project.tech}
                  demoUrl={project.demoUrl}
                  repoUrl={project.repoUrl}
                  metric={project.metric}
                  revealDelayMs={0}
                />
              ))}
            </div>
          </div>

          {/* Monitor Bezel Bottom Chin */}
          <div className="flex shrink-0 items-center justify-between bg-[#1c2026] px-6 py-1.5 font-mono text-[11px] text-white/60">
            <span>BAGAS-VISION PRO // 144HZ IPS</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
              SIGNAL LOCKED
            </span>
          </div>
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // 05. TROPHY ZOOM & SLIDE-ASIDE: Glowing Trophy on Left, Certs on Right
    // ------------------------------------------------------------------------
    if (openStageId === "trophy") {
      const linkFor = (href) =>
        typeof href === "string" &&
        (isValidHttpUrl(href) || href.startsWith("/"))
          ? href
          : null;

      return (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="desk-overlay-heading"
          data-testid="desk-overlay-trophy"
          className="max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl border-2 border-ink bg-gradient-to-br from-[#1b2838] via-[#223448] to-[#172230] p-5 text-paper shadow-[8px_8px_0_0_#17150f] sm:p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
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
              onClick={() => setOpenStageId(null)}
              aria-label="Close Credentials overlay"
              className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-300 px-3.5 py-1.5 font-mono text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              <span>← Back to Room</span>
              <span aria-hidden="true">[ESC]</span>
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Stage: Pure Glowing Trophy Showcase (no visible text) */}
            <div className="stage-trophy-hero flex flex-col items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-b from-amber-400/15 to-transparent p-8 text-center lg:col-span-4">
              <div className="relative flex h-48 w-48 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-amber-300/30 blur-2xl"
                />
                <svg
                  viewBox="0 0 140 160"
                  aria-hidden="true"
                  className="relative h-44 w-44"
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
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {certifications.map((cert, idx) => {
                const href = linkFor(cert.href);
                const isExt = isValidHttpUrl(href);
                const isAward = cert.icon === "trophy";
                return (
                  <li
                    key={cert.title}
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
      );
    }

    // ------------------------------------------------------------------------
    // 04. BOOK PULL-OUT & 2-PAGE UNFOLD: Left Cabinet Book Opens "What I Do"
    // ------------------------------------------------------------------------
    if (openStageId === "notebook") {
      return (
        <div
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
                    onClick={() => setOpenStageId(null)}
                    aria-label="Close What I Do book overlay"
                    className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-ink bg-marker px-3 py-1.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_#17150f]"
                  >
                    <span>Close Book</span>
                    <span aria-hidden="true">[ESC]</span>
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Buku ini diambil dari rak terbuka lemari kayu sebelah kiri
                  meja belajar. Berikut tumpukan teknologi yang saya gunakan di
                  produksi &amp; riset:
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
                <p className="font-bold text-ink">
                  ▸ LAB PRINCIPLE // LEAK-FREE VALIDATION
                </p>
                <p className="mt-1">
                  Split before preprocessing · Rolling/Stratified CV · Seeded
                  reproducible pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // 03. SMARTPHONE ON STAND ZOOM-IN: Interactive Phone Screen for Contact Me
    // ------------------------------------------------------------------------
    if (openStageId === "phone") {
      return (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="desk-overlay-heading"
          data-testid="desk-overlay-phone"
          className="stage-phone-zoom flex w-full max-w-md justify-center py-2"
        >
          {/* Zoomed-In Smartphone Bezel */}
          <div className="w-full max-w-md overflow-hidden rounded-[2.25rem] border-[6px] border-[#1f242d] bg-[#121824] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            {/* Phone Dynamic Island / Speaker Notch & Status Bar */}
            <div className="flex items-center justify-between px-2 font-mono text-[11px] text-sky-200/80">
              <span>21:00 · ID</span>
              <span
                aria-hidden="true"
                className="h-4 w-24 rounded-full bg-black"
              />
              <span>5G 100%</span>
            </div>

            {/* Phone App Header */}
            <div className="mt-5 flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <h2
                  id="desk-overlay-heading"
                  className="text-2xl font-extrabold tracking-tight text-white"
                >
                  Contact Me
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenStageId(null)}
                aria-label="Put smartphone back on stand"
                className="focus-ring inline-flex min-h-[40px] items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-white hover:bg-white/20"
              >
                <span>Lock</span>
                <span aria-hidden="true">[ESC]</span>
              </button>
            </div>

            {/* Phone Screen Contact Cards */}
            <div className="mt-5 space-y-3.5">
              {hasContactEmail && (
                <div className="rounded-2xl border border-sky-400/30 bg-[#1a2639] p-4">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-sky-300">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="focus-ring mt-1 inline-block break-all text-base font-bold text-amber-300 underline decoration-amber-300/60 underline-offset-4 hover:text-white sm:text-lg"
                  >
                    {siteConfig.contactEmail}
                  </a>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCopyOverlayEmail}
                      aria-label={
                        copiedEmail
                          ? "Email address copied to clipboard"
                          : "Copy email address from smartphone"
                      }
                      className="focus-ring inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-amber-300 bg-amber-300 px-4 py-2 font-mono text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
                    >
                      <span aria-hidden="true">{copiedEmail ? "✓" : "📋"}</span>
                      <span>{copiedEmail ? "Copied!" : "Copy email"}</span>
                    </button>
                  </div>
                </div>
              )}

              {validSocials.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {validSocials.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} profile (opens in a new tab)`}
                      className="focus-ring flex min-h-[52px] items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-sm font-bold text-white transition-colors hover:bg-amber-300 hover:text-ink"
                    >
                      <span>{social.label}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Bottom Home Indicator Bar */}
            <div className="mt-6 flex justify-center">
              <span
                aria-hidden="true"
                className="h-1.5 w-28 rounded-full bg-white/30"
              />
            </div>
          </div>
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // 02. WALL PORTRAIT ZOOM & SLIDE-ASIDE: About Me Profile Dossier
    // ------------------------------------------------------------------------
    if (openStageId === "photo") {
      return (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="desk-overlay-heading"
          data-testid="desk-overlay-photo"
          className="max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border-2 border-ink bg-card p-5 shadow-[8px_8px_0_0_#17150f] sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
            <div>
              <h2
                id="desk-overlay-heading"
                className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
              >
                About Me
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setOpenStageId(null)}
              aria-label="Close About Me overlay"
              className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold text-ink transition-colors hover:bg-marker"
            >
              <span>← Back to Room</span>
              <span aria-hidden="true">[ESC]</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="stage-portrait-slide mx-auto w-full max-w-[14.5rem] md:col-span-4">
              {/* Zoomed-in Hanging ID Name Tag Badge */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-3 pb-4 shadow-[6px_6px_0_0_#d93f12]">
                {/* ID Badge Lanyard Slot & Header Bar */}
                <div className="mb-2.5 flex flex-col items-center rounded-lg bg-[#1b2d3e] py-2 text-white">
                  <span
                    aria-hidden="true"
                    className="mb-1 h-2 w-12 rounded-full border border-white/30 bg-slate-900"
                  />
                </div>
                {imgError || !profilePhoto ? (
                  <div
                    aria-hidden="true"
                    className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-paper-2 font-mono text-xs text-muted"
                  >
                    PORTRAIT
                  </div>
                ) : (
                  <img
                    src={profilePhoto}
                    alt="Bagas Adjie Pamungkas portrait"
                    onError={() => setImgError(true)}
                    className="aspect-[4/5] w-full rounded-lg border border-ink/20 object-cover object-[center_30%]"
                  />
                )}
                <p className="mt-2.5 text-center font-mono text-xs font-bold text-ink">
                  BAGAS ADJIE PAMUNGKAS
                </p>
                <p className="text-center font-mono text-[10px] text-muted">
                  DATA SCIENTIST &amp; ENGINEER
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
                      className="rounded-xl border border-ink bg-paper px-3.5 py-2.5 shadow-[2px_2px_0_0_#17150f]"
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
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="iso-desk relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-card"
      data-testid="desk-workstation"
    >
      {/* Bedroom Entrance Door ("My Portofolio") — Click once to enter Bagas Works Room */}
      {!hasEnteredRoom && (
        <div
          data-testid="room-entrance-door"
          data-opening={isDoorOpening ? "true" : "false"}
          className={`room-entrance-backdrop absolute inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none ${
            isDoorOpening ? "pointer-events-none" : ""
          }`}
        >
          {/* Cool-Toned Bedroom Hallway Wall & Vertical Stripes */}
          <div
            aria-hidden="true"
            className="room-entrance-wall pointer-events-none absolute inset-0"
          />

          {/* Top Spacer */}
          <div aria-hidden="true" className="h-4 shrink-0" />

          {/* Centerpiece Teak Wooden Bedroom Door Frame & Interactive Door */}
          <div className="relative z-10 flex flex-1 items-end justify-center px-4 pt-6">
            <div className="room-door-frame relative flex rounded-t-2xl border-x-[10px] border-t-[10px] border-[#17150f] bg-[#7d4516] p-3 pb-0 shadow-[0_24px_60px_rgba(23,21,15,0.45)] sm:p-4 sm:pb-0">
              {/* Warm Glow Inside the Room Behind the Door (visible when swinging open) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 bottom-0 rounded-t-lg bg-gradient-to-b from-[#d5e3ed] via-[#e5eef5] to-[#f4f6f8]"
              />

              {/* Interactive Teak Wood Bedroom Door Panel */}
              <button
                type="button"
                onClick={handleEnterRoom}
                aria-label="My Portofolio — Klik pintu untuk masuk ke Bagas Works Room"
                className={`room-door-leaf focus-ring group relative flex h-[450px] w-[280px] cursor-pointer flex-col items-center justify-between rounded-t-lg border-4 border-[#17150f] bg-gradient-to-b from-[#d48842] via-[#c87b36] to-[#b56d2f] p-5 text-left shadow-inner sm:h-[520px] sm:w-[336px] sm:p-6 ${
                  isDoorOpening ? "is-opening" : ""
                }`}
              >
                {/* Upper Recessed Wooden Door Panel with "My Portofolio" Nameplate */}
                <div className="flex w-full flex-col items-center justify-center rounded-lg border-[3px] border-[#7d4516] bg-[#d8904c] px-4 py-6 shadow-[inset_0_3px_0_rgba(255,255,255,0.22),inset_0_-3px_0_rgba(94,51,14,0.45)] sm:py-8">
                  {/* Hanging Signplate on the Door */}
                  <div className="relative w-full rounded-xl border-[3px] border-[#17150f] bg-[#fbf9f4] px-4 py-4 text-center shadow-[5px_5px_0_0_#17150f] transition-transform duration-300 group-hover:-translate-y-1">
                    {/* Brass Mounting Screws */}
                    <span
                      aria-hidden="true"
                      className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full border border-[#17150f] bg-amber-300"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-[#17150f] bg-amber-300"
                    />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
                      WELCOME TO
                    </p>
                    <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                      My Portofolio
                    </p>
                    <div
                      aria-hidden="true"
                      className="mx-auto my-2 h-0.5 w-16 bg-ink/20"
                    />
                    <p className="font-mono text-xs font-bold tracking-wider text-ink-soft">
                      BAGAS WORKS ROOM
                    </p>
                  </div>
                </div>

                {/* Middle Door Section with Realistic Silver Lever Handle on the Right (like real photo!) */}
                <div className="relative flex w-full items-center justify-between py-2">
                  <span className="rounded-lg border-2 border-[#17150f] bg-[#1b2d3e] px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider text-amber-300 shadow-[3px_3px_0_0_#17150f] transition-all group-hover:bg-amber-300 group-hover:text-ink">
                    ▸ KLIK PINTU UNTUK MASUK
                  </span>

                  {/* Silver Door Escutcheon Plate & Lever Handle */}
                  <div
                    aria-hidden="true"
                    className="relative flex h-24 w-8 flex-col items-center justify-between rounded-md border-2 border-[#17150f] bg-gradient-to-b from-[#eef2f6] to-[#b0bcc8] py-2.5 shadow-[2px_3px_0_0_#17150f]"
                  >
                    {/* Lever Handle Bar */}
                    <div className="room-door-handle absolute right-2 top-5 h-3.5 w-14 origin-right rounded-l-full border-2 border-[#17150f] bg-gradient-to-b from-[#ffffff] to-[#cfd8e3] shadow-[2px_2px_0_0_#17150f] transition-transform duration-200 group-hover: -rotate-12" />
                    <span className="h-2 w-2 rounded-full bg-[#17150f]" />
                    {/* Keyhole */}
                    <span className="h-3.5 w-1.5 rounded-full bg-[#17150f]" />
                  </div>
                </div>

                {/* Lower Recessed Wooden Door Panel */}
                <div
                  aria-hidden="true"
                  className="h-36 w-full rounded-lg border-[3px] border-[#7d4516] bg-[#d8904c] shadow-[inset_0_3px_0_rgba(255,255,255,0.2),inset_0_-3px_0_rgba(94,51,14,0.45)] sm:h-44"
                />
              </button>
            </div>
          </div>

          {/* White Ceramic Tiled Hallway Floor Threshold at Bottom */}
          <div
            aria-hidden="true"
            className="room-entrance-floor relative z-10 h-14 w-full shrink-0 border-t-4 border-[#17150f] sm:h-16"
          />
        </div>
      )}

      {/* Floating Top Room Status & Speaker Icon Ambient Music Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-paper sm:px-6">
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#1b2d3e]/90 px-3.5 py-2 shadow-lg backdrop-blur-md">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]"
          />
          <span className="font-mono text-xs font-semibold tracking-wider text-white sm:text-sm">
            BAGAS WORKS ROOM
          </span>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2.5">
          {/* Speaker Icon Button for Serene Ambient Music ("Musik Syahdu") */}
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-pressed={isMusicPlaying}
            aria-label={
              isMusicPlaying
                ? "Pause serene room ambient music"
                : "Play serene room ambient music"
            }
            title={isMusicPlaying ? "Musik Syahdu: ON" : "Musik Syahdu: OFF"}
            className={`focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md transition-all ${
              isMusicPlaying
                ? "border-amber-300 bg-amber-300 text-ink shadow-[2px_2px_0_0_#d93f12]"
                : "border-white/30 bg-[#1b2d3e]/90 text-white hover:bg-[#1b2d3e]"
            }`}
          >
            {isMusicPlaying ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowPins((prev) => !prev)}
            aria-pressed={showPins}
            aria-label={
              showPins
                ? "Hide numbered hotspot callout pins"
                : "Show numbered hotspot callout pins"
            }
            className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/30 bg-[#1b2d3e]/90 px-3 font-mono text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#1b2d3e]"
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                showPins ? "bg-amber-300" : "bg-white/40"
              }`}
            />
            <span>Pins: {showPins ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Cool-Toned Bedroom & Study Desk Full-Screen Stage */}
      <div className="iso-desk-stage relative flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <svg
            className="iso-svg h-full w-full"
            viewBox={scene.viewBox}
            preserveAspectRatio="xMidYMid meet"
            data-zoomed={openStageId ? "true" : "false"}
            style={cameraStyle}
            role="group"
            aria-label="Interactive 3D Isometric Workstation of Bagas Adjie Pamungkas"
          >
            {LAYER_ORDER.map((item) => {
              if (item.type === "static") {
                return (
                  <StaticLayer
                    key={item.key}
                    html={scene.layers[item.key]}
                  />
                );
              }

              const hotspot = getHotspotById(item.id);
              if (!hotspot) return null;
              const isActive =
                activeHotspotId === hotspot.id || openStageId === hotspot.id;

              return (
                <HotspotLayer
                  key={hotspot.id}
                  hotspot={hotspot}
                  isActive={isActive}
                  isOpen={openStageId === hotspot.id}
                  html={scene.layers[hotspot.id]}
                  onActivate={() => handleActivateHotspot(hotspot.id)}
                  onHover={() => handleHoverHotspot(hotspot.id)}
                  onLeave={() => handleLeaveHotspot(hotspot.id)}
                  onFocus={() => handleHoverHotspot(hotspot.id)}
                  onBlur={() => handleLeaveHotspot(hotspot.id)}
                />
              );
            })}

            {/* Numbered Callout Badges on the 3D Room Objects */}
            {showPins &&
              DESK_HOTSPOTS.map((hotspot) => {
                const pin = scene.pins[hotspot.id];
                if (!pin) return null;
                const isActive =
                  activeHotspotId === hotspot.id || openStageId === hotspot.id;

                return (
                  <CalloutPin
                    key={`pin-${hotspot.id}`}
                    hotspot={hotspot}
                    pin={pin}
                    isActive={isActive}
                  />
                );
              })}
          </svg>
        </div>

        {/* Active Cinematic Object Stage View Overlaid on the Full-Screen Room */}
        {openHotspot && (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-slate-950/60 p-3 transition-opacity duration-300 sm:p-5">
            {renderCinematicStage()}
          </div>
        )}
      </div>

      {/* Screen-Reader-Only Live Readout & Room Object Controls (visually hidden per user request) */}
      <div className="sr-only">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
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
            aria-label="Study room interactive objects dock"
            className="flex flex-wrap gap-1.5 sm:gap-2"
          >
            {DESK_HOTSPOTS.map((hotspot) => {
              const isSelected =
                activeHotspotId === hotspot.id || openStageId === hotspot.id;
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
                  aria-label={`${hotspot.number} ${hotspot.objectName}: ${hotspot.label}`}
                  className={`focus-ring inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
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
