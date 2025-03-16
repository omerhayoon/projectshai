// Components/MathLayout.js
import React from "react";
import { questionTypes } from "../utils/constants";

const MathLayout = ({ currentType, setCurrentType, children }) => {
  // Filter out the probability types to only get math question types
  const mathQuestionTypes = Object.entries(questionTypes).filter(
    ([type, _]) => !type.startsWith("probability")
  );

  const SidebarButton = ({ type, label }) => (
    <button
      onClick={() => setCurrentType(type)}
      className={`w-full p-4 text-right transition-all duration-200 rounded-lg mb-2
          ${
            currentType === type
              ? "bg-blue-500 text-white shadow-lg transform -translate-x-2"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-row-reverse gap-6 p-6 min-h-[400] bg-gray-50">
      <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-right">נושאים</h2>
        <div className="space-y-2">
          {mathQuestionTypes.map(([type, label]) => (
            <SidebarButton key={type} type={type} label={label} />
          ))}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MathLayout;
