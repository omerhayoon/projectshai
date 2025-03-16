import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";

// Types of learning modes
export const LEARNING_MODES = {
  MANUAL: "manual", // User manually selects level
  ADAPTIVE: "adaptive", // System adapts level based on performance
};

/**
 * A component for selecting learning mode (manual or adaptive)
 *
 * Props:
 * - username: The current user's username
 * - subjectType: The subject type (e.g., "addition", "probability")
 * - onSelectMode: Callback when mode is selected, receives (mode, level)
 */
const LearningModeSelector = ({ username, subjectType, onSelectMode }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [recommendedLevel, setRecommendedLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch recommended level when component mounts
  useEffect(() => {
    if (username && subjectType) {
      fetchRecommendedLevel();
    }
  }, [username, subjectType]);

  const fetchRecommendedLevel = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get("/api/learning/recommended-level", {
        params: {
          username,
          subjectType,
        },
      });

      setRecommendedLevel(response.data.recommendedLevel || 1);
    } catch (err) {
      console.error("Error fetching recommended level:", err);
      setError("שגיאה בטעינת הרמה המומלצת");
      setRecommendedLevel(1); // Default to level 1 on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);

    // If adaptive mode is selected, use the recommended level
    if (mode === LEARNING_MODES.ADAPTIVE) {
      onSelectMode(mode, recommendedLevel);
    }
  };

  const handleSelectManualLevel = (level) => {
    // For manual mode, user selects the level
    onSelectMode(LEARNING_MODES.MANUAL, level);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">טוען נתונים...</p>
      </div>
    );
  }

  // If mode is not selected yet, show the mode selection screen
  if (!selectedMode) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md" dir="rtl">
        <h2 className="text-2xl font-bold mb-6">בחר מצב למידה</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleSelectMode(LEARNING_MODES.MANUAL)}
            className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              בחירה ידנית
            </h3>
            <p className="text-gray-600">בחר בעצמך את רמת הקושי של השאלות</p>
          </button>

          <button
            onClick={() => handleSelectMode(LEARNING_MODES.ADAPTIVE)}
            className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              למידה מסתגלת
            </h3>
            <p className="text-gray-600">
              המערכת תתאים את רמת הקושי באופן אוטומטי לפי הביצועים שלך
            </p>
            <p className="mt-2 font-medium">
              הרמה המומלצת עבורך: {recommendedLevel}
            </p>
          </button>
        </div>
      </div>
    );
  }

  // If manual mode is selected, show level selection
  if (selectedMode === LEARNING_MODES.MANUAL) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md" dir="rtl">
        <h2 className="text-2xl font-bold mb-6">בחר רמת קושי</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => handleSelectManualLevel(level)}
              className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl font-bold text-blue-600">
                רמה {level}
              </span>
              {level === recommendedLevel && (
                <span className="block mt-1 text-xs text-green-600 font-medium">
                  (מומלץ עבורך)
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedMode(null)}
          className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          חזור
        </button>
      </div>
    );
  }

  // This should not happen, but just in case
  return null;
};

export default LearningModeSelector;
