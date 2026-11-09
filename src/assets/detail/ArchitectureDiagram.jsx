import React from "react";

const KIND_STYLES = {
  input: {
    badge: "INPUT",
    chipClass: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    cardClass: "border-sky-400/30 bg-[#101b2b] text-sky-100",
  },
  model: {
    badge: "ML MODEL",
    chipClass: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    cardClass: "border-violet-500/30 bg-[#19142e] text-violet-100",
  },
  process: {
    badge: "PIPELINE",
    chipClass: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    cardClass: "border-amber-500/30 bg-[#211a12] text-amber-100",
  },
  guard: {
    badge: "GUARDRAIL",
    chipClass: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    cardClass: "border-rose-500/30 bg-[#2b1016] text-rose-100",
  },
  output: {
    badge: "OUTPUT",
    chipClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    cardClass: "border-emerald-500/30 bg-[#0f241a] text-emerald-100",
  },
};

export const ArchitectureDiagram = ({ nodes = [], edges = [] }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border-2 border-ink/40 bg-[#0b1119] p-5 sm:p-7 text-paper shadow-[4px_4px_0_0_#17150f]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400">
            SYSTEM TOPOLOGY & PIPELINE
          </span>
          <h4 className="text-lg font-bold text-white tracking-tight">End-to-End Data & Model Flow</h4>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          {Object.entries(KIND_STYLES).map(([kind, style]) => (
            <span
              key={kind}
              className={`rounded-md border px-2 py-0.5 font-semibold ${style.chipClass}`}
            >
              {style.badge}
            </span>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div
        data-testid="architecture-pipeline"
        className="flex flex-col gap-3 md:flex-row md:items-stretch md:overflow-x-auto md:pb-3"
      >
        {nodes.map((node, index) => {
          const style = KIND_STYLES[node.kind] || KIND_STYLES.process;
          const incomingEdge = edges.find((e) => e.to === node.id);

          return (
            <React.Fragment key={node.id}>
              {index > 0 && (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center py-1 md:py-0 md:px-1 text-muted"
                >
                  <div className="flex items-center gap-1">
                    {incomingEdge?.label && (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                        {incomingEdge.label}
                      </span>
                    )}
                    <span className="hidden md:inline font-mono text-lg text-emerald-400">→</span>
                    <span className="md:hidden font-mono text-lg text-emerald-400">↓</span>
                  </div>
                </div>
              )}

              <div
                className={`flex flex-1 flex-col justify-between rounded-xl border p-4 transition-transform hover:-translate-y-0.5 md:min-w-[190px] ${style.cardClass}`}
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${style.chipClass}`}
                    >
                      {style.badge}
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm leading-snug text-white">{node.label}</h5>
                </div>
                {node.detail && (
                  <p className="mt-2.5 font-mono text-xs leading-relaxed text-white/70">
                    {node.detail}
                  </p>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Screen Reader Accessible Narrative Flow */}
      <figcaption className="sr-only">
        Pipeline sequence:{" "}
        {nodes
          .map((n, i) => `Step ${i + 1} (${n.kind}): ${n.label}${n.detail ? ` - ${n.detail}` : ""}`)
          .join(". Next: ")}
      </figcaption>
    </figure>
  );
};

export const TradeoffList = ({ tradeoffs = [] }) => {
  if (!tradeoffs || tradeoffs.length === 0) return null;

  return (
    <div className="my-6">
      <h4 className="mb-4 font-mono text-xs font-bold tracking-wider text-signal uppercase">
        Key Architectural Trade-Offs & Decisions
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tradeoffs.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border-2 border-ink/20 bg-card p-5 text-ink shadow-[3px_3px_0_0_#17150f] transition-all hover:border-ink hover:shadow-[5px_5px_0_0_#17150f]"
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-signal">
                  DECISION #{idx + 1}
                </span>
              </div>
              <h5 className="text-base font-bold leading-tight text-ink">{item.decision}</h5>

              <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
                <div className="rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-2.5 text-emerald-900 dark:text-emerald-200">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    ✓ CHOSEN:
                  </span>
                  {item.chosen}
                </div>
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-900 dark:text-rose-200">
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                    ✗ ALTERNATIVE:
                  </span>
                  {item.alternative}
                </div>
              </div>
            </div>

            <p className="mt-3.5 border-t border-ink/10 pt-3 text-xs leading-relaxed text-ink-soft">
              <strong className="text-ink font-semibold">Technical Rationale:</strong> {item.why}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

