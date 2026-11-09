import "./App.css";
import React, { useEffect } from "react";
import "./index.css";
import Core from "./assets/core.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SfxProvider } from "./assets/audio/SfxProvider.jsx";
import Projects from "./assets/project.jsx";
import ProjectDetailPage from "./assets/detail/ProjectDetailPage.jsx";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash && typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
}

function MainContent() {
  const location = useLocation();

  return (
    <main className="flex-grow">
      <ScrollToTop />
      <div key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Core />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <SfxProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-paper text-ink">
          <MainContent />
        </div>
      </Router>
    </SfxProvider>
  );
}

export default App;
