import React, { useState, useEffect } from "react";

export default function GoalModal({ initialGoal, onSave, onClose }) {
  const [routineType, setRoutineType] = useState(
    initialGoal?.routineType || "daily"
  );
  const [daysPerWeek, setDaysPerWeek] = useState(initialGoal?.daysPerWeek || 3);
  const [pagesPerDay, setPagesPerDay] = useState(
    initialGoal?.pagesPerDay || 10
  );

  useEffect(() => {
    if (routineType === "daily") {
      setDaysPerWeek(7);
    }
  }, [routineType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ routineType, daysPerWeek, pagesPerDay });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
        <div className="mb-6">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {initialGoal ? "Edit Your Goal" : "Set Your Daily Goal"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customize your reading routine
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Routine Type
            </label>
            <select
              value={routineType}
              onChange={(e) => setRoutineType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-700 font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232563eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="daily">Daily</option>
              <option value="custom">Custom Days per Week</option>
            </select>
          </div>

          {routineType === "custom" && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Days per Week
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-700"
                />
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  {daysPerWeek}/7 days
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pages per Day
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={pagesPerDay}
                onChange={(e) => setPagesPerDay(Number(e.target.value))}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-700"
              />
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                {pagesPerDay} pages
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Reading Goal
            </p>
            <p className="text-lg font-bold text-blue-700">
              {routineType === "daily"
                ? `${pagesPerDay} pages daily`
                : `${(pagesPerDay * daysPerWeek).toFixed(0)} pages per week`}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-95"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
