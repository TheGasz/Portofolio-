import "./App.css";
import React, { useEffect } from "react";
import "./index.css";
import Header from "./assets/Navbar.jsx";
import Core from "./assets/core.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Projects from "./assets/project.jsx";

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
    <main className="flex-grow pt-[71px]">
      <ScrollToTop />
      <div key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Core />} />
          <Route path="/project" element={<Projects />} />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-paper text-ink">
        <Header title="Portofolio" />
        <MainContent />
        <footer className="border-t border-paper/15 bg-ink px-6 py-8 text-paper/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 font-mono text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Bagas Adjie Pamungkas</p>
            <p>Built with React, Tailwind, and too much coffee.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
