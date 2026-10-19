import "./App.css";
import React from "react";
import "./index.css";
import Header from "./assets/Navbar.jsx";
import Core from "./assets/core.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./assets/project.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-night-900 text-slate-200">
        <Header title="Bagas." />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Core />} />
            <Route path="/project" element={<Projects />} />
          </Routes>
        </main>
        <footer className="relative py-8 bg-night-900 border-t border-white/10 text-center overflow-hidden">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"></div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-sky-200 to-teal-200 bg-clip-text text-transparent font-semibold">
              Bagas
            </span>
            . Crafted with care &amp; a little motion.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
