import React from "react";

const ProgressTracker = ({ current, total, className = "" }) => {
  const safeCurrent = Math.max(0, current);
  const safeTotal = Math.max(1, total);

  const percentage = Math.floor((safeCurrent / safeTotal) * 100);

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span>
          Page <span className="font-semibold">{safeCurrent}</span> of{" "}
          <span className="font-semibold">{safeTotal}</span>
        </span>
        <span className="font-bold text-indigo-600">{percentage}% Read</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          aria-valuenow={safeCurrent}
          aria-valuemin="0"
          aria-valuemax={safeTotal}
          aria-label={`Reading progress: ${percentage} percent`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;
