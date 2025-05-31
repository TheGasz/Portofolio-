import React from "react";
import "../index.css";

export const header = ({ tittle }) => {
  return (
    <div className="bg-black  flex-row  items-center justify-between">
      <span className="text-2xl text-white">{tittle}</span>
    </div>
  );
};
export default header;
