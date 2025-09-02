import React from "react";
import { Link } from "react-router-dom";

import "../index.css";

export const Core = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-gray-700 mb-6">
          This is a simple portfolio page built with React and Tailwind CSS.
        </p>
         <Link to="/project" className="text-blue-500 hover:underline">
          View Projects
        </Link>
      </div>
    </div>
  );
};
export default Core;
