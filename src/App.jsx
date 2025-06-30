import "./App.css";
import React from "react";
import "./index.css";
import Header from "./assets/Navbar.jsx";
import Main from "./assets/main.jsx"

function App() {
  return (
    <>
    <navbar>
    <div >
        <Header tittle="Portofolio" />
      </div>
  </navbar>

  <main>
  <Main />
  </main>
    </>
  
      
    
  );
}

export default App;
