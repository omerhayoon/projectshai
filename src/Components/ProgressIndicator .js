import React from "react";

const ProgressIndicator = ({ progress = 0 }) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  // Calculate the stroke dash properties
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset =
    circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative">
        {/* Background circle */}
        <svg className="w-12 h-12">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
          />
          {/* Progress circle */}
          <circle
            className="text-blue-600 transition-all duration-300 ease-in-out"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-sm font-semibold">{normalizedProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
