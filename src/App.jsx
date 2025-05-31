import "./App.css";
import React from "react";
import "./index.css";
import Header from "./assets/header.jsx";

function App() {
  return (
    <main>
      <div className="bg-black h-20 flex items-center justify-between px-4">
        <Header tittle="Portofolio" />
      </div>
    </main>
  );
}

export default App;
