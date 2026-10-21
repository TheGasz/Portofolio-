import React, { useState } from "react";
import "../index.css";
import { isValidHttpUrl } from "./url.js";
import { usePointerTilt } from "./usePointerTilt.js";
import { useScrollReveal } from "./useScrollReveal.js";
import {
    ragSupportCover,
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

// Reusable animated ProjectCard component.
// All content fields are optional so a partial Project_Entry degrades
// gracefully: present fields render, absent fields are omitted without error.
export const ProjectCard = ({ title, description, image, tech, demoUrl, repoUrl, revealDelayMs = 0 }) => {
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
                className="card-tilt gradient-border group glass rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
                <div className="relative overflow-hidden h-60">
                {showImage ? (
                    <img
                        src={image}
                        alt={title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    // Same-size placeholder occupying the image box when the
                    // image is missing or fails to load. Decorative only.
                    <div
                        aria-hidden="true"
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400"
                    >
                        <svg
                            className="w-16 h-16 text-white/80"
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
                <div className="absolute inset-0 bg-gradient-to-t from-night-900/85 via-night-900/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300"></div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
                {title && (
                    <h3 className="text-2xl font-bold text-slate-50 mb-3 group-hover:text-teal-200 transition-colors">
                        {title}
                    </h3>
                )}
                {description && (
                    <p className="text-slate-300/90 mb-6 flex-grow leading-relaxed">
                        {description}
                    </p>
                )}
                {Array.isArray(tech) && tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tech.map((t, index) => (
                            <span key={index} className="shimmer-pill motion-reduce:animate-none px-3 py-1 bg-white/10 text-slate-100 text-xs font-semibold rounded-full ring-1 ring-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-white group-hover:ring-teal-300/40">
                                {t}
                            </span>
                        ))}
                    </div>
                )}
                {(isValidHttpUrl(demoUrl) || isValidHttpUrl(repoUrl)) && (
                    <div className="mt-auto flex flex-wrap gap-3">
                        {isValidHttpUrl(demoUrl) && (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Live demo of ${title || "this project"}`}
                                className="focus-ring flex-1 min-h-[44px] inline-flex items-center justify-center py-3 px-4 bg-gradient-to-r from-sky-700 to-teal-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-semibold rounded-lg transition-all duration-300"
                            >
                                Live Demo
                            </a>
                        )}
                        {isValidHttpUrl(repoUrl) && (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Source repository of ${title || "this project"}`}
                                className="focus-ring flex-1 min-h-[44px] inline-flex items-center justify-center py-3 px-4 glass border border-white/15 text-slate-200 font-semibold rounded-lg hover:border-teal-300/40 hover:text-white transition-all duration-300"
                            >
                                Source Code
                            </a>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

// Presentational grid: renders one ProjectCard per entry in array order using a
// responsive column layout, or the empty-state message when there are no
// entries. Extracted from Projects so the ordered-grid and empty-state behavior
// (Req 5.2, 5.5) can be exercised directly with injected `projects` arrays.
export const ProjectGrid = ({ projects = [] }) => {
    if (projects.length === 0) {
        return (
            <p className="text-lg text-gray-500">
                No projects are currently available.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    tech={project.tech}
                    demoUrl={project.demoUrl}
                    repoUrl={project.repoUrl}
                    // Index-derived stagger so cards reveal in document order.
                    // Cycle 0/120/240/360ms; max delay (360) + the 600ms
                    // .reveal transition stays within the 1000ms budget.
                    revealDelayMs={(index % 4) * 120}
                />
            ))}
        </div>
    );
};

export const Projects = () => {
    return (
        <div className="aurora-bg bg-grid-pattern min-h-screen py-24 px-6 text-slate-200 relative overflow-hidden">
            {/* Decorative ambient blobs behind the grid. */}
            <div aria-hidden="true" className="absolute -top-10 right-0 w-80 h-80 bg-slate-500 rounded-full mix-blend-screen blur-3xl opacity-20 animate-blob motion-reduce:animate-none"></div>
            <div aria-hidden="true" className="absolute bottom-0 -left-10 w-80 h-80 bg-teal-700 rounded-full mix-blend-screen blur-3xl opacity-20 animate-blob motion-reduce:animate-none animation-delay-4000"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16 text-center md:text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300/70 mb-4">
                        Portfolio
                    </p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-50 mb-4">
                        Featured{" "}
                        <span className="animated-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-200">
                            Works
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300/90 max-w-2xl mx-auto md:mx-0">
                        A collection of data science and data engineering projects I've built.
                    </p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8 text-center md:text-left">
                    Selected Projects
                </h2>
                <ProjectGrid projects={projectsData} />
            </div>
        </div>
    );
};
export default Projects;