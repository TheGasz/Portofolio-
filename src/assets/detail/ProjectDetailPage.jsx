import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProjectDetail } from "./ProjectDetail.jsx";
import { getProjectDetail } from "../projectDetails.js";

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const detail = getProjectDetail(slug);

  useEffect(() => {
    if (detail?.title) {
      document.title = `${detail.title} — Bagas Case Study`;
    } else {
      document.title = "Project Case Study — Bagas";
    }
  }, [detail]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top Navbar */}
      <nav
        aria-label="Main project navigation"
        className="sticky top-0 z-40 border-b-2 border-ink/15 bg-paper/95 px-4 py-3 backdrop-blur-md sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Return to Bagas Works Room"
              className="focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/20 bg-card px-3.5 py-1.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_#17150f] transition-all hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <span aria-hidden="true" className="text-signal transition-transform group-hover:-translate-x-1">←</span>
              <span>Bagas Works Room</span>
            </Link>

            <span aria-hidden="true" className="text-ink/30">/</span>

            <Link
              to="/project"
              aria-label="Return to all projects"
              className="focus-ring inline-flex cursor-pointer items-center gap-1 font-mono text-xs font-semibold text-muted hover:text-ink"
            >
              <span>Projects</span>
            </Link>
          </div>

          <div className="font-mono text-xs text-signal font-bold">
            CASE STUDY // ARCHITECTURE SPEC
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <ProjectDetail
          slug={slug}
          headingLevel={1}
          onBack={() => navigate("/project")}
        />
      </main>
    </div>
  );
};

export default ProjectDetailPage;

