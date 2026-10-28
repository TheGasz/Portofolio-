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
      <div className="flex flex-col min-h-screen bg-paper text-ink">
        <Header title="Portofolio" />
        <main className="flex-grow pt-[71px]">
          <Routes>
            <Route path="/" element={<Core />} />
            <Route path="/project" element={<Projects />} />
          </Routes>
        </main>
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
