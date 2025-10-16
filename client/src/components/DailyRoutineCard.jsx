import React, { useState, useEffect } from "react";
import { Edit3, PlusCircle } from "lucide-react";
import GoalModal from "../components/GoalModal";
import {
  requestNotificationPermission,
  scheduleReadingNotifications,
} from "../utils/notifications";

const DailyRoutineCard = () => {
  const [goal, setGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) {
      setGoal(JSON.parse(savedGoal));
    }
  }, []);

  useEffect(() => {
    if (goal) {
      localStorage.setItem("dailyGoal", JSON.stringify(goal));
      setupNotifications(goal);
    }
  }, [goal]);

  const handleSaveGoal = (newGoal) => {
    setGoal(newGoal);
    setIsModalOpen(false);
  };
  const setupNotifications = async (goal) => {
    const granted = await requestNotificationPermission();
    if (granted) scheduleReadingNotifications(goal);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-3 text-indigo-600">
        🗓️ Daily Routine
      </h3>

      {!goal ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4 italic">
            You haven’t set your daily reading goal yet.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Set Your Daily Goal
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Routine:</strong>{" "}
            {goal.routineType === "daily"
              ? "Every day"
              : `${goal.daysPerWeek} days per week`}
          </p>
          <p className="text-gray-700">
            <strong>Pages per day:</strong> {goal.pagesPerDay}
          </p>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm italic text-gray-500"></p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
            >
              <Edit3 className="w-4 h-4 mr-1" /> Edit
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <GoalModal
          initialGoal={goal}
          onSave={handleSaveGoal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DailyRoutineCard;
