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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header title="Bagas." />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Core />} />
            <Route path="/project" element={<Projects />} />
          </Routes>
        </main>
        <footer className="py-6 bg-black text-white text-center">
          <p>&copy; {new Date().getFullYear()} Bagas. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
