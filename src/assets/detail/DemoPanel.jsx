import React, { useState } from "react";
import { isValidHttpUrl } from "../url.js";

export const DemoPanel = ({ demo, title, repoUrl }) => {
  const [iframeLaunched, setIframeLaunched] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!demo || demo.type === "none" || demo.status === "coming-soon") {
    return (
      <div
        data-testid="demo-coming-soon"
        className="rounded-2xl border-2 border-dashed border-ink/30 bg-[#121924] p-6 sm:p-8 text-paper"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300">
            <span aria-hidden="true" className="font-mono text-xl">⚡</span>
          </div>
          <h4 className="text-lg font-bold text-white">Live Demo Being Hardened</h4>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
            The zero-cost live environment for <strong className="text-white">{title}</strong> is currently being prepared (Streamlit Cloud / In-Browser ONNX). You can explore the full reproducible source code, notebooks, and model weights directly on GitHub.
          </p>
          {isValidHttpUrl(repoUrl) && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Explore source code for ${title || "this project"}`}
              className="focus-ring mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-300 px-5 py-2 font-mono text-xs font-bold text-ink shadow-[3px_3px_0_0_#d93f12] transition-transform hover:-translate-y-0.5"
            >
              <span>Explore GitHub Repository</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  if (demo.type === "iframe" && isValidHttpUrl(demo.url)) {
    return (
      <div
        data-testid="demo-iframe-container"
        className="overflow-hidden rounded-2xl border-2 border-ink/40 bg-[#0e1622] text-paper shadow-[4px_4px_0_0_#17150f]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#162232] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-mono text-xs font-semibold text-white">
              LIVE APP // {title}
            </span>
          </div>
          <a
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open live demo of ${title} in a new tab`}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1 font-mono text-xs text-white/80 transition-colors hover:border-amber-300 hover:text-amber-300"
          >
            <span>Open Full Window</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {!iframeLaunched ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-md">
              <h4 className="text-xl font-bold text-white">Interactive Sandbox</h4>
              <p className="mt-2 font-mono text-xs leading-relaxed text-amber-300">
                {demo.coldStartNote || "Hosted on free serverless tier. Cloud instance spins up on demand."}
              </p>
              <button
                type="button"
                onClick={() => setIframeLaunched(true)}
                aria-label={`Launch live interactive demo for ${title}`}
                className="focus-ring mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl border-2 border-emerald-400 bg-emerald-400 px-6 py-2.5 font-mono text-xs font-bold text-ink shadow-[4px_4px_0_0_#17150f] transition-all hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                <span aria-hidden="true">▶</span>
                <span>LAUNCH INTERACTIVE DEMO</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full min-h-[480px]">
            {iframeLoading && (
              <div
                aria-live="polite"
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e1622] text-white"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent mb-3" />
                <p className="font-mono text-xs text-white/80">Connecting to cloud compute runtime...</p>
              </div>
            )}
            <iframe
              src={demo.url}
              title={`Live interactive demo of ${title}`}
              onLoad={() => setIframeLoading(false)}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }

  // Fallback for custom in-browser / playground component modes
  return (
    <div
      data-testid="demo-in-browser"
      className="rounded-2xl border-2 border-ink/40 bg-[#131d2b] p-6 text-paper"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-semibold text-emerald-400">CLIENT-SIDE INFERENCE</span>
          <h4 className="text-base font-bold text-white">In-Browser Evaluation Sandbox</h4>
        </div>
        <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
          0ms Latency · Local Compute
        </span>
      </div>
      <p className="mt-4 text-xs font-mono text-white/70 leading-relaxed">
        {demo.coldStartNote || "Running lightweight model directly inside your browser via WebAssembly."}
      </p>
    </div>
  );
};

