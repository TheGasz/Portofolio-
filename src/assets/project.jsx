import React, { useState } from "react";
import "../index.css";
import { isValidHttpUrl } from "./url.js";

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

// Data projects with more details and working placeholder images.
/** @type {ProjectEntry[]} */
const projectsData = [
    {
        id: 1,
        title: "E-commerce Website",
        description: "A modern, fully-functional online store features seamless checkout, shopping cart, and interactive UI.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tech: ["React", "Tailwind", "Node.js"],
        demoUrl: "https://ecommerce-demo.bagas.dev",
        repoUrl: "https://github.com/bagas/ecommerce-website"
    },
    {
        id: 2,
        title: "Finance Mobile App",
        description: "A financial tracking app that helps users manage their budget, expenses, and savings with beautiful charts.",
        image: "https://images.unsplash.com/photo-1616077168079-7e09a6a38f4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tech: ["React Native", "Firebase"],
        // No live demo for a native mobile app; only the source repository is linked.
        repoUrl: "https://github.com/bagas/finance-mobile-app"
    },
    {
        id: 3,
        title: "Analytics Dashboard",
        description: "A clean internal dashboard for data management, presenting real-time user statistics and reports.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tech: ["React", "Chart.js", "Express"],
        // Internal/private project: a live demo is available but the repo stays private.
        demoUrl: "https://analytics-dashboard.bagas.dev"
    },
    {
        id: 4,
        title: "Social Media Platform",
        description: "A community platform with real-time chat, posting, and user interaction mechanics.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tech: ["Next.js", "Socket.io", "MongoDB"]
        // Intentionally no demoUrl/repoUrl to exercise optional link-out handling.
    }
];

// Reusable animated ProjectCard component.
// All content fields are optional so a partial Project_Entry degrades
// gracefully: present fields render, absent fields are omitted without error.
export const ProjectCard = ({ title, description, image, tech, demoUrl, repoUrl }) => {
    const [imgError, setImgError] = useState(false);
    const showImage = image && !imgError;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col">
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
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
                {title && (
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                )}
                {description && (
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {description}
                    </p>
                )}
                {Array.isArray(tech) && tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tech.map((t, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
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
                                className="focus-ring flex-1 min-h-[44px] inline-flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
                                className="focus-ring flex-1 min-h-[44px] inline-flex items-center justify-center py-3 px-4 bg-blue-50 border border-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                Source Code
                            </a>
                        )}
                    </div>
                )}
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
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    tech={project.tech}
                    demoUrl={project.demoUrl}
                    repoUrl={project.repoUrl}
                />
            ))}
        </div>
    );
};

export const Projects = () => {
    return (
        <div className="bg-white min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Featured Works
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        A collection of projects showcasing my journey and skills in software development.
                    </p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
                    Selected Projects
                </h2>
                <ProjectGrid projects={projectsData} />
            </div>
        </div>
    );
};
export default Projects;