import "./App.css";
import React from "react";
import "./index.css";
import Header from "./assets/Navbar.jsx";
import Main from "./assets/core.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./assets/project.jsx";

function App() {
  return (
    <>
      <Header title="Portfolio" />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/project" element={<Projects />} />
        </Routes>
      </Router>
    
 

    
 
    </>
  
      
    
  );
}

export default App;
