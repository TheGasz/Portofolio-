import React, { useState } from "react";
import "../index.css";
import { isValidHttpUrl } from "./url.js";
import { usePointerTilt } from "./usePointerTilt.js";
import { useScrollReveal } from "./useScrollReveal.js";
import {
    ragSupportCover,
    reimburseAgentCover,
    transitAnomalyCover,
    cityProfilerCover,
    waterLevelCover,
    floodPipelineCover,
    wasteClassifyCover,
    embeddingCover,
    faceSpoofingCover,
    cropCover,
    simulationCover,
} from "./projectCovers.js";

/**
 * A single project record rendered as a Project_Card. All content fields are
 * optional so the card can degrade gracefully when data is partial; link-out
 * URLs, when present, should be absolute http(s) URLs.
 *
 * @typedef {Object} ProjectEntry
 * @property {number|string} id    Stable unique key for list rendering.
 * @property {string}  [title]     Project title.
 * @property {string}  [description] Short description of the project.
 * @property {string}  [image]     Image URL for the project thumbnail.
 * @property {string[]} [tech]     Ordered list of technology tags.
 * @property {string}  [demoUrl]   Optional absolute http(s) URL to a live demo.
 * @property {string}  [repoUrl]   Optional absolute http(s) URL to the source repository.
 */

// Real data-science / data-engineering projects imported from GitHub.
// These are notebook-based ML projects, so there are no live visual demos —
// each card links straight to its source repository on GitHub. Rather than a
// misleading stock screenshot, each `image` is a themed, on-brand SVG cover
// (see projectCovers.js) that hints at the project's domain.
/** @type {ProjectEntry[]} */
const projectsData = [
    {
        id: 8,
        title: "Enterprise AI Support Copilot (RAG)",
        description: "Enterprise support teams drown in messy Indonesian tickets — slang, typos, mixed error codes — and generic chatbots happily hallucinate fixes or approve void warranties. So I built an end-to-end copilot: an IndoBERT model fine-tuned with LoRA triages each ticket (category + urgency, 0.98 macro-F1) while a metadata-filtered hybrid RAG engine (BM25 + FAISS + cross-encoder reranker) retrieves the right SOP and answers with strict citations. A confidence router abstains and escalates to a human when it isn't sure — catching 30/30 adversarial traps — so answers stay grounded and critical tickets never get missed. Served via FastAPI with a Streamlit dual-view UI.",
        image: ragSupportCover,
        tech: ["Python", "IndoBERT", "LoRA / PEFT", "FAISS", "BM25", "FastAPI", "Streamlit"],
        repoUrl: "https://github.com/TheGasz/customerServiceTicketRAG"
    },
    {
        id: 9,
        title: "KlaimKilat — AI Reimbursement Agent",
        description: "Approving expense claims by hand is slow and error-prone, so I built an omnichannel agent that lets staff just snap a receipt (web, Telegram, or WhatsApp). A LangGraph workflow extracts the receipt, matches it against finance SOPs with hybrid RAG (pgvector + full-text search, RRF), checks each employee's monthly quota via tool calling, then auto-approves, auto-rejects, or escalates to a manager with a stateful human-in-the-loop — reaching a 0% false auto-approve rate.",
        image: reimburseAgentCover,
        tech: ["Python", "LangGraph", "DeepSeek", "pgvector", "FastAPI", "Redis"],
        repoUrl: "https://github.com/TheGasz/automation-reimburse-workflow"
    },
    {
        id: 10,
        title: "TransitSentinel — Cashless Transit Anomaly Detection",
        description: "Cashless transit taps fail in messy ways — double charges, cloned cards, fare evasion, broken settlement batches — so I built a real-time anomaly engine on 120k simulated transactions. It layers deterministic guardrails, a PyTorch variational autoencoder for novel patterns, and an Isolation Forest + LightGBM stack, then a cost-sensitive router turns alerts into auto-refunds or freezes. The hybrid model hit 0.987 PR-AUC and recovered ~98% of potential fraud losses, served under 25 ms p95 via FastAPI.",
        image: transitAnomalyCover,
        tech: ["Python", "PyTorch", "LightGBM", "Isolation Forest", "SHAP", "FastAPI"],
        repoUrl: "https://github.com/TheGasz/transit-cashless-anomaly-detection"
    },
    {
        id: 11,
        title: "The 15-Minute City Profiler",
        description: "How walkable is a city, really? I diagnosed urban accessibility against the 15-minute-city idea using real OpenStreetMap points of interest across a 25x25 grid. I implemented K-Means (with K-Means++) from scratch in NumPy, measured amenity balance with a normalized Shannon diversity index, and added neighbor-aware spatial smoothing — then mapped which Jakarta sub-districts hit the 15-minute mark and which lack economic and health facilities.",
        image: cityProfilerCover,
        tech: ["Python", "NumPy", "OSMnx", "GeoPandas", "Folium", "Matplotlib"],
        repoUrl: "https://github.com/TheGasz/15-Minutes-City"
    },
    {
        id: 1,
        title: "River Water-Level Forecasting (Bengawan Solo)",
        description: "Flood monitoring needs lead time, so I forecast water level across 30 river stations over a 242-day horizon with no future observations. I engineered ~187 leak-free hydrological features (rainfall, soil moisture, upstream routing) and blended a 7-member LightGBM + XGBoost + CatBoost ensemble, validated with 4-fold rolling-origin CV (mean RMSE 1.39).",
        image: waterLevelCover,
        tech: ["Python", "LightGBM", "XGBoost", "CatBoost", "Pandas", "HydroRIVERS"],
        repoUrl: "https://github.com/TheGasz/Prediksi_TinggiMukaAir_BengawanSolo"
    },
    {
        id: 6,
        title: "Jakarta Flood Risk Data Pipeline",
        description: "Flood risk data for Jakarta was scattered across agencies and riddled with errors, so I built an end-to-end spatial-temporal pipeline that fuses 7 open datasets (BPBD disaster logs, 10-minute water-level telemetry, demographics, weather, land cover) across 267 urban villages. I ran a forensic data audit — fixing Excel date corruption, masking frozen sensors, and reprojecting geometry to UTM — then built a daily spatio-temporal feature store (97k rows, 0 missing) that surfaced a 41x relative flood-risk jump along the Ciliwung corridor.",
        image: floodPipelineCover,
        tech: ["Python", "Pandas", "GeoPandas", "scikit-learn (PCA)", "NumPy", "Matplotlib"],
        repoUrl: "https://github.com/TheGasz/Data-Engineer-Jakarta-Flood-Spatial-Temporal-"
    },
    {
        id: 2,
        title: "Hierarchical Waste Classification (AI PilahYuk)",
        description: "Sorting waste into Recyclable, Organic, and B3 (hazardous) is high-stakes when a hazardous item slips through. I froze a SigLIP so400m vision backbone, cached 1152-dim embeddings, then trained lightweight MLP heads with class-weighted focal loss and Mixup — reaching ~0.99 macro F1 while keeping hazardous-class recall near-perfect.",
        image: wasteClassifyCover,
        tech: ["Python", "PyTorch", "SigLIP", "Optuna", "scikit-learn", "NumPy"],
        repoUrl: "https://github.com/TheGasz/AI_PilahYuk"
    },
    {
        id: 3,
        title: "Waste Image Classification (Satria Data 2026)",
        description: "A big-data competition to classify waste into three classes. I concatenated frozen SigLIP v1 + v2 embeddings (3456-dim) with a patch-max pooling trick to catch small recyclable regions, then tuned a two-stage MLP head with Optuna, GroupKFold, and TTA ensembling — scoring 0.9962 F1 on the test set.",
        image: embeddingCover,
        tech: ["Python", "SigLIP 2", "Optuna", "Focal Loss", "GroupKFold"],
        repoUrl: "https://github.com/TheGasz/Satria-Data_IdentifikasiJenisSampah"
    },
    {
        id: 7,
        title: "Face Anti-Spoofing Detection",
        description: "Face recognition is only as safe as its ability to tell a real face from a photo, screen, or mask, so I built a 6-class anti-spoofing pipeline (real vs. printed, screen, mask, mannequin, unknown). I trained a ConvNeXt-Tiny backbone with 5-fold cross-validation, Optuna tuning, and a corrected focal loss, and I used SigLIP embeddings with leave-one-out trimmed centroids to catch mislabeled data and prevent cross-class duplicate leakage before training.",
        image: faceSpoofingCover,
        tech: ["Python", "PyTorch", "ConvNeXt", "Optuna", "SigLIP", "Grad-CAM"],
        repoUrl: "https://github.com/TheGasz/faceSpoofingDetection"
    },
    {
        id: 4,
        title: "Crop Yield Prediction",
        description: "A full-stack ML app that predicts agricultural yield from environmental and farming features. I served a TensorFlow/Keras model behind a Flask API and wired it to a React front end, turning raw field inputs into an actionable yield estimate for the end user.",
        image: cropCover,
        tech: ["Python", "TensorFlow", "Keras", "Flask", "React"],
        repoUrl: "https://github.com/TheGasz/Crop-Yield-Prediction"
    },
    {
        id: 5,
        title: "Agent-Based Exposure Simulation",
        description: "An interactive agent-based model of a waiting room, built to study visual exposure. Agents arrive via a Poisson process and navigate with ray-casting field-of-view, while the simulation tracks which obstacles get seen most and renders it as an interactive heatmap.",
        image: simulationCover,
        tech: ["Python", "Streamlit", "NumPy", "Plotly", "Matplotlib"],
        repoUrl: "https://github.com/TheGasz/ABM_ExposureSim"
    }
];


// Reusable ProjectCard: a paper card with an ink border that lifts onto a hard
// offset shadow on hover, plus the pointer tilt and scroll reveal. All content
// fields are optional so a partial Project_Entry degrades gracefully.
export const ProjectCard = ({ title, description, image, tech, demoUrl, repoUrl, revealDelayMs = 0, number }) => {
    const [imgError, setImgError] = useState(false);
    const { ref, onPointerMove, onPointerLeave } = usePointerTilt();
    const { ref: revealRef, revealed } = useScrollReveal();
    const showImage = image && !imgError;

    return (
        <div
            ref={revealRef}
            style={{ transitionDelay: `${revealDelayMs}ms` }}
            className={`reveal${revealed ? " reveal-visible" : ""} h-full`}
        >
            <div
                ref={ref}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                className="card-tilt group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#17150f] motion-reduce:hover:translate-y-0"
            >
                {/* Matches the 600x340 cover viewBox so covers are never cropped. */}
                <div className="relative aspect-[600/340] overflow-hidden border-b-2 border-ink">
                    {showImage ? (
                        <img
                            src={image}
                            alt={title}
                            onError={() => setImgError(true)}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                        />
                    ) : (
                        // Same-size decorative placeholder when the image is
                        // missing or fails to load. (`from-blue-500` is a stable
                        // hook for tests; the visible fill is paper-2.)
                        <div
                            aria-hidden="true"
                            className="from-blue-500 paper-dots flex h-full w-full items-center justify-center bg-paper-2"
                        >
                            <svg
                                className="h-14 w-14 text-muted"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                        </div>
                    )}
                    {number !== undefined && (
                        <span
                            aria-hidden="true"
                            className="absolute bottom-3 right-3 rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-xs font-medium text-ink"
                        >
                            No. {String(number).padStart(2, "0")}
                        </span>
                    )}
                </div>
                <div className="flex flex-grow flex-col p-6 md:p-8">
                    {title && (
                        <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-ink">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="mb-6 flex-grow leading-relaxed text-ink-soft">
                            {description}
                        </p>
                    )}
                    {Array.isArray(tech) && tech.length > 0 && (
                        <div className="mb-7 flex flex-wrap gap-2">
                            {tech.map((t, index) => (
                                <span
                                    key={index}
                                    className="shimmer-pill rounded-full border border-ink/25 px-2.5 py-1 font-mono text-xs text-ink-soft transition-colors duration-300 group-hover:border-ink group-hover:text-ink"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                    {(isValidHttpUrl(demoUrl) || isValidHttpUrl(repoUrl)) && (
                        <div className="mt-auto flex gap-3">
                            {isValidHttpUrl(demoUrl) && (
                                <a
                                    href={demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Live demo of ${title || "this project"}`}
                                    className="focus-ring inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-signal px-4 py-2.5 font-semibold text-white transition-colors duration-200 hover:bg-ink"
                                >
                                    Live Demo <span aria-hidden="true">↗</span>
                                </a>
                            )}
                            {isValidHttpUrl(repoUrl) && (
                                <a
                                    href={repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Source repository of ${title || "this project"}`}
                                    className="focus-ring inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 py-2.5 font-semibold text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
                                >
                                    Source Code <span aria-hidden="true">↗</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Presentational grid: renders one ProjectCard per entry in array order, or
// the empty-state message when there are no entries (Req 5.2, 5.5).
export const ProjectGrid = ({ projects = [] }) => {
    if (projects.length === 0) {
        return (
            <p className="text-lg text-muted">
                No projects are currently available.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    number={index + 1}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    tech={project.tech}
                    demoUrl={project.demoUrl}
                    repoUrl={project.repoUrl}
                    // 0/120/240ms stagger matches the 3-column rows; max
                    // delay + 600ms transition stays within the 1000ms budget.
                    revealDelayMs={(index % 3) * 120}
                />
            ))}
        </div>
    );
};

export const Projects = () => {
    return (
        <div className="min-h-screen bg-paper text-ink">
            <header className="paper-dots border-b border-ink px-6 pb-16 pt-14 md:pb-20 md:pt-20">
                <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-8">
                        <p className="font-mono text-sm text-muted">
                            <span className="text-signal">index</span> / projects
                        </p>
                        <h1 className="mt-5 text-6xl font-extrabold leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[7.5rem]">
                            Featured{" "}
                            <span className="animated-gradient-text bg-[linear-gradient(90deg,#d93f12,#f06a2a,#d93f12)] pr-3 font-serif font-normal italic">
                                Works
                            </span>
                        </h1>
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
                            A collection of data science and data engineering projects I've built.
                        </p>
                    </div>
                    <div className="md:col-span-4 md:text-right">
                        <p className="font-serif text-8xl leading-none text-ink">{projectsData.length}</p>
                        <p className="mt-2 font-mono text-sm text-muted">projects, all open source</p>
                    </div>
                </div>
            </header>
            <section className="px-6 py-16 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-10 flex items-center gap-4 font-mono text-sm font-medium uppercase tracking-wider text-ink-soft">
                        Selected Projects
                        <span aria-hidden="true" className="h-px flex-1 bg-ink/30"></span>
                    </h2>
                    <ProjectGrid projects={projectsData} />
                </div>
            </section>
        </div>
    );
};
export default Projects;
