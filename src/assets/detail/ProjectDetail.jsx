import React, { useState, useEffect, useRef } from "react";
import { getProjectDetail } from "../projectDetails.js";
import { ArchitectureDiagram, TradeoffList } from "./ArchitectureDiagram.jsx";
import { DemoPanel } from "./DemoPanel.jsx";

const TOC_SECTIONS = [
  { id: "problem", label: "01. Problem", title: "Problem & Business Context" },
  { id: "data", label: "02. Data", title: "Data Pipeline & Forensic Audit" },
  { id: "architecture", label: "03. Architecture", title: "Architecture & Trade-offs" },
  { id: "validation", label: "04. Metrics", title: "Evaluation & Business Impact" },
  { id: "demo", label: "05. Live Demo", title: "Interactive Model Demo" },
  { id: "artifacts", label: "06. Artifacts", title: "Code & Artifacts" },
];

export const ProjectDetail = ({
  slug,
  headingLevel = 2,
  onBack,
  isMaximized = false,
  onToggleMaximize,
}) => {
  const detail = getProjectDetail(slug);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState("problem");
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll container to top when switching projects
    if (containerRef.current) {
      if (typeof containerRef.current.scrollTo === "function") {
        try {
          containerRef.current.scrollTo({ top: 0, behavior: "instant" });
        } catch {
          containerRef.current.scrollTop = 0;
        }
      } else {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [slug]);

  if (!detail) {
    return (
      <div
        data-testid="project-not-found"
        className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center text-ink"
      >
        <span aria-hidden="true" className="font-mono text-3xl">🔍</span>
        <h3 className="mt-3 text-2xl font-bold">Project Not Found</h3>
        <p className="mt-2 text-sm text-ink-soft">
          No case study found for identifier: <code className="font-mono text-signal">{slug}</code>
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="focus-ring mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border-2 border-ink bg-card px-5 py-2 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_#17150f] hover:-translate-y-0.5 hover:bg-amber-300"
          >
            ← Return to Projects
          </button>
        )}
      </div>
    );
  }

  // Heading tags based on headingLevel prop
  const TitleTag = headingLevel === 1 ? "h1" : "h2";
  const SectionTag = headingLevel === 1 ? "h2" : "h3";
  const SubSectionTag = headingLevel === 1 ? "h3" : "h4";

  const handleCopyLink = () => {
    const url = `${window.location.origin}/project/${slug}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }).catch(() => {});
    }
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const repoUrl = detail.artifacts?.find((a) => a.label.toLowerCase().includes("github") || a.label.toLowerCase().includes("repo"))?.url;

  return (
    <article
      ref={containerRef}
      data-testid="project-case-study"
      className="flex min-h-0 flex-1 w-full flex-col overflow-y-auto overflow-x-hidden bg-paper text-ink"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Top Breadcrumb & Action Bar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-card px-4 py-2.5 sm:px-6 shadow-sm">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Return to all projects"
              className="focus-ring group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink/30 px-2.5 py-1 font-bold text-ink transition-colors hover:bg-amber-300 hover:text-ink"
            >
              <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
              <span>All Projects</span>
            </button>
          )}
          <span aria-hidden="true" className="text-ink/30">/</span>
          <span className="rounded bg-signal/10 px-2 py-0.5 font-bold text-signal">
            {detail.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy direct link to this project"
            className="focus-ring inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg border border-ink/30 bg-paper px-3 py-1 font-mono text-xs font-semibold text-ink transition-all hover:border-ink hover:bg-paper-2"
          >
            <span aria-hidden="true">{copiedLink ? "✓" : "🔗"}</span>
            <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
          </button>

          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              aria-label={isMaximized ? "Restore monitor view" : "Maximize to fullscreen"}
              aria-pressed={isMaximized}
              className="focus-ring inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg border-2 border-ink bg-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_#17150f] transition-transform hover:-translate-y-0.5 hover:bg-amber-400"
            >
              <span aria-hidden="true">{isMaximized ? "⤡" : "⤢"}</span>
              <span className="hidden sm:inline">{isMaximized ? "Restore View" : "Maximize Screen"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">
        {/* Header Block */}
        <header className="mb-8 border-b-2 border-ink/15 pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-xs font-bold text-signal">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal" />
              CASE STUDY // ANATOMY SPEC
            </span>
            {detail.meta?.context && (
              <span className="font-mono text-xs text-muted">
                • {detail.meta.context}
              </span>
            )}
          </div>

          <TitleTag className="mb-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {detail.title}
          </TitleTag>

          <p className="max-w-3xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            {detail.tagline}
          </p>

          {/* Quick Metrics Cards */}
          <div className="mt-6 flex flex-wrap gap-3">
            {detail.metrics?.map((metric, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-ink/20 bg-card px-3.5 py-2 font-mono text-xs shadow-sm"
              >
                <span className="font-semibold text-muted">{metric.name}:</span>
                <span className="font-bold text-signal">{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source repository of ${detail.title}`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper shadow-[3px_3px_0_0_#ffd84d] transition-transform hover:-translate-y-0.5 hover:bg-black"
              >
                <span>View Source Code on GitHub</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {detail.demo?.status === "live" && detail.demo.url && (
              <a
                href={detail.demo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${detail.title}`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink bg-signal px-5 py-2.5 font-mono text-xs font-bold text-white shadow-[3px_3px_0_0_#17150f] transition-transform hover:-translate-y-0.5 hover:bg-[#b5340f]"
              >
                <span>Direct Live App</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </header>

        {/* Sticky Mini TOC Bar */}
        <nav
          aria-label="Case study sections navigation"
          className="sticky top-12 z-20 mb-10 -mx-4 overflow-x-auto bg-paper/95 px-4 py-2.5 backdrop-blur-sm sm:-mx-8 sm:px-8 border-b border-ink/10"
        >
          <div className="flex gap-2">
            {TOC_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                aria-current={activeSection === sec.id ? "true" : undefined}
                className={`focus-ring shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  activeSection === sec.id
                    ? "border-2 border-ink bg-ink text-paper shadow-[2px_2px_0_0_#ffd84d]"
                    : "border border-ink/20 bg-card text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ========================================== */}
        {/* SECTION 1: PROBLEM & CONTEXT */}
        {/* ========================================== */}
        <section id="section-problem" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">01 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Problem & Business Context
            </SectionTag>
          </div>

          <div className="rounded-2xl border-2 border-ink/20 bg-card p-6 sm:p-8 shadow-[4px_4px_0_0_#17150f]">
            <p className="text-base leading-relaxed text-ink sm:text-lg">
              {detail.problem?.statement}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-ink/10 pt-6">
              <div>
                <SubSectionTag className="font-mono text-xs font-bold text-signal uppercase tracking-wider mb-2">
                  Who is Affected
                </SubSectionTag>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {detail.problem?.whoIsAffected}
                </p>
              </div>

              <div>
                <SubSectionTag className="font-mono text-xs font-bold text-signal uppercase tracking-wider mb-2">
                  Why Machine Learning?
                </SubSectionTag>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {detail.problem?.whyML}
                </p>
              </div>
            </div>

            {detail.problem?.constraints && (
              <div className="mt-6 border-t border-ink/10 pt-6">
                <SubSectionTag className="font-mono text-xs font-bold text-ink uppercase tracking-wider mb-3">
                  System Constraints & Requirements
                </SubSectionTag>
                <ul className="space-y-2">
                  {detail.problem.constraints.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-soft">
                      <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 2: DATA PIPELINE */}
        {/* ========================================== */}
        <section id="section-data" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">02 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Data Pipeline & Forensic Audit
            </SectionTag>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {detail.data?.sources?.map((source, i) => (
                <div key={i} className="rounded-xl border border-ink/20 bg-card p-5 shadow-sm">
                  <span className="font-mono text-[11px] font-bold text-muted block mb-1">
                    DATA SOURCE #{i + 1}
                  </span>
                  <h4 className="font-bold text-sm text-ink">{source.name}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">{source.detail}</p>
                </div>
              ))}
            </div>

            {/* Challenges & Engineering Fixes Table */}
            <div className="overflow-hidden rounded-2xl border-2 border-ink/20 bg-card shadow-[4px_4px_0_0_#17150f]">
              <div className="border-b border-ink/10 bg-paper-2 px-6 py-3 font-mono text-xs font-bold text-ink">
                DATASET CHALLENGES & ENGINEERING MITIGATIONS
              </div>
              <div className="divide-y divide-ink/10">
                {detail.data?.challenges?.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 gap-3 p-5 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-5">
                      <span className="font-mono text-[10px] font-bold text-rose-600 block mb-1">
                        CHALLENGE
                      </span>
                      <p className="font-semibold text-sm text-ink">{item.issue}</p>
                    </div>
                    <div className="md:col-span-7">
                      <span className="font-mono text-[10px] font-bold text-emerald-700 block mb-1">
                        ENGINEERING RESOLUTION
                      </span>
                      <p className="text-xs leading-relaxed text-ink-soft">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 3: ARCHITECTURE & TRADEOFFS */}
        {/* ========================================== */}
        <section id="section-architecture" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">03 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Architecture & Technical Trade-offs
            </SectionTag>
          </div>

          <ArchitectureDiagram
            nodes={detail.architecture?.nodes}
            edges={detail.architecture?.edges}
          />

          <TradeoffList tradeoffs={detail.tradeoffs} />
        </section>

        {/* ========================================== */}
        {/* SECTION 4: VALIDATION & IMPACT */}
        {/* ========================================== */}
        <section id="section-validation" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">04 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Evaluation & Business Impact
            </SectionTag>
          </div>

          {/* Metrics Table */}
          <div className="overflow-hidden rounded-2xl border-2 border-ink/20 bg-card shadow-[4px_4px_0_0_#17150f] mb-6">
            <div className="border-b border-ink/10 bg-paper-2 px-6 py-3 font-mono text-xs font-bold text-ink">
              BENCHMARK EVALUATION & BASELINE COMPARISONS
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ink/10 font-mono text-muted">
                    <th className="px-6 py-3 font-semibold">METRIC NAME</th>
                    <th className="px-6 py-3 font-semibold text-signal">RESULT</th>
                    <th className="px-6 py-3 font-semibold">BASELINE BENCHMARK</th>
                    <th className="px-6 py-3 font-semibold">EVALUATION CONTEXT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 font-mono">
                  {detail.metrics?.map((m, i) => (
                    <tr key={i} className="hover:bg-paper-2/40 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-ink">{m.name}</td>
                      <td className="px-6 py-3.5 font-extrabold text-signal text-sm">{m.value}</td>
                      <td className="px-6 py-3.5 text-muted">{m.baseline || "—"}</td>
                      <td className="px-6 py-3.5 font-sans text-xs text-ink-soft">{m.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Real Impact */}
            <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-500/5 p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-emerald-700 block mb-3">
                BUSINESS & OPERATIONAL IMPACT
              </span>
              <ul className="space-y-2.5">
                {detail.impact?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                    <span aria-hidden="true" className="font-bold text-emerald-600">✓</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations & Future Work */}
            <div className="rounded-2xl border-2 border-amber-600/30 bg-amber-500/5 p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-amber-800 block mb-3">
                LIMITATIONS & ROADMAP (HONEST TRADEOFFS)
              </span>
              <ul className="space-y-2.5">
                {detail.limitations?.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="font-bold text-amber-600">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 5: LIVE DEMO */}
        {/* ========================================== */}
        <section id="section-demo" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">05 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Interactive Model Demo
            </SectionTag>
          </div>

          <DemoPanel demo={detail.demo} title={detail.title} repoUrl={repoUrl} />
        </section>

        {/* ========================================== */}
        {/* SECTION 6: CODE & ARTIFACTS */}
        {/* ========================================== */}
        <section id="section-artifacts" className="mb-14 scroll-mt-28">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-signal">06 //</span>
            <SectionTag className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Code & Artifacts
            </SectionTag>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {detail.artifacts?.map((artifact, i) => (
              <a
                key={i}
                href={artifact.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${artifact.label}`}
                className="focus-ring group flex items-center justify-between rounded-xl border-2 border-ink bg-card p-4 font-mono text-xs font-bold text-ink shadow-[3px_3px_0_0_#17150f] transition-all hover:-translate-y-0.5 hover:bg-amber-300"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-base text-signal">📦</span>
                  <span>{artifact.label}</span>
                </div>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom Back Button */}
        {onBack && (
          <div className="mt-12 border-t-2 border-ink/15 pt-8 flex justify-center">
            <button
              type="button"
              onClick={onBack}
              aria-label="Return to all projects"
              className="focus-ring inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border-2 border-ink bg-card px-6 py-2.5 font-mono text-xs font-bold text-ink shadow-[4px_4px_0_0_#17150f] hover:-translate-y-0.5 hover:bg-amber-300"
            >
              ← Return to All Projects
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectDetail;
