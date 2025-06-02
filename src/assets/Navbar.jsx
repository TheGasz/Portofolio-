import React from "react";
import "../index.css";

export const header = ({ tittle }) => {
  return (
    <div className="bg-black flex items-center justify-between px-6 py-4">
      <span className="text-2xl text-white">{tittle}</span>
      <div className="flex gap-6">
        <a href="#home" className="text-white hover:text-gray-400">
          Home
        </a>
        <a href="#about" className="text-white hover:text-gray-400">
          About
        </a>
        <a href="#projects" className="text-white hover:text-gray-400">
          Projects
        </a>
        <a href="#contact" className="text-white hover:text-gray-400">
          Contact
        </a>
      </div>
    </div>
  );
};
export default header;
