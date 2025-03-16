// Pages/ProbabilityQuestionGenerator.js
import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import "../CSS/Probability.css";
import LearningModeSelector, {
  LEARNING_MODES,
} from "../Components/LearningModeSelector";

const difficultyLevels = {
  "probability-1": "הסתברות - רמה קלה",
  "probability-2": "הסתברות - רמה קלה-בינונית",
  "probability-3": "הסתברות - רמה בינונית",
  "probability-4": "הסתברות - רמה בינונית-קשה",
  "probability-5": "הסתברות - רמה קשה",
  "probability-6": "הסתברות - רמה מתקדמת",
};

const ProbabilityQuestionGenerator = ({ username }) => {
  const [learningMode, setLearningMode] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState({ x: "", y: "" });
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [levelUpMessage, setLevelUpMessage] = useState("");
  const [levelDownMessage, setLevelDownMessage] = useState("");

  // Load user's current level on component mount
  useEffect(() => {
    if (username) {
      fetchUserCurrentLevel();
    }
  }, [username]);

  const fetchUserCurrentLevel = async () => {
    try {
      const response = await axios.get("/api/learning/recommended-level", {
        params: {
          username,
          subjectType: "probability",
        },
      });

      if (response.data && response.data.recommendedLevel) {
        setCurrentLevel(response.data.recommendedLevel);
      }
    } catch (error) {
      console.error("Error fetching user's current level:", error);
    }
  };

  // Function to handle learning mode selection
  const handleSelectMode = (mode, level) => {
    setLearningMode(mode);
    setCurrentLevel(level);

    // Reset any existing game state
    setQuestion(null);
    setUserAnswer({ x: "", y: "" });
    setScore(0);
    setShowSolution(false);
    setHasCheckedAnswer(false);
    setShowWrongMessage(false);
    setShowCorrectMessage(false);
    setLevelUpMessage("");
    setLevelDownMessage("");

    // Fetch a question for the selected level
    fetchNewQuestion(level);
  };

  const fetchNewQuestion = async (level = currentLevel) => {
    try {
      setIsLoading(true);
      // Use the specified level or current level, ensure it's explicitly defined
      const numericLevel = level !== undefined ? level : currentLevel;

      // Add timestamp to URL to prevent caching (force new question each time)
      const timestamp = new Date().getTime();

      console.log(`Fetching probability question for level: ${numericLevel}`);
      const response = await axios.get(
        `/api/probability/generate/${numericLevel}?t=${timestamp}`
      );

      if (response.data) {
        // Force the level to be the requested level in the question data
        const questionData = {
          ...response.data,
          level: numericLevel,
        };
        setQuestion(questionData);
        setUserAnswer({ x: "", y: "" });
        setShowSolution(false);
        setHasCheckedAnswer(false);
        setShowWrongMessage(false);
        setShowCorrectMessage(false);
        setLevelUpMessage("");
        setLevelDownMessage("");
      } else {
        console.error("Empty response data when fetching probability question");
      }
    } catch (error) {
      console.error(
        `Error fetching probability question for level ${
          level || currentLevel
        }:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to normalize answers for comparison
  const normalizeAnswer = (answer) => {
    if (answer === undefined || answer === null || answer === "") return "";

    // Convert to string first
    const str = String(answer).trim();

    // Check if it's a fraction like "1/4"
    if (str.includes("/")) {
      const [numerator, denominator] = str
        .split("/")
        .map((part) => part.trim());
      if (
        !isNaN(Number(numerator)) &&
        !isNaN(Number(denominator)) &&
        Number(denominator) !== 0
      ) {
        // Convert fraction to decimal
        return (Number(numerator) / Number(denominator)).toFixed(2);
      }
    }

    // Handle the case where answer is a number
    if (!isNaN(Number(str))) {
      const num = parseFloat(str);

      // For whole numbers, accept both "5" and "5.0"
      if (Number.isInteger(num)) {
        return String(num);
      }

      // For decimals, round to 2 places
      return num.toFixed(2);
    }

    return str;
  };

  const checkAnswer = async () => {
    if (!question || isLoading) return;

    // Normalize both user answer and correct answer for comparison
    const normalizedUserAnswerX = normalizeAnswer(userAnswer.x);
    const normalizedCorrectAnswerX = normalizeAnswer(question.answer.x);

    // Check if the answer is correct - compare normalized answers
    const isCorrect = normalizedUserAnswerX === normalizedCorrectAnswerX;

    const subjectType = `probability-${currentLevel}`;

    try {
      // Record the answer in statistics
      const statsResponse = await axios.post("/api/probability/check", {
        username: username,
        subjectType: subjectType,
        userAnswer,
        correct: isCorrect,
        question: question.question,
        correctAnswer: question.answer,
        solution: question.solution,
        level: currentLevel, // Include level information
      });

      let adaptiveResponse = null;

      // If in adaptive mode, process the answer to potentially adjust level
      if (learningMode === LEARNING_MODES.ADAPTIVE) {
        adaptiveResponse = await axios.post("/api/learning/process-answer", {
          username,
          subjectType: "probability",
          currentLevel,
          isCorrect,
        });

        const newLevel = adaptiveResponse.data.newLevel;
        const levelChanged = adaptiveResponse.data.levelChanged;

        // Save the user level in the database
        await axios.post("/api/learning/save-user-level", {
          username,
          subjectType: "probability",
          level: newLevel,
        });

        // If level changed, show appropriate message
        if (levelChanged) {
          if (newLevel > currentLevel) {
            setLevelUpMessage(`כל הכבוד! עלית לרמה ${newLevel}`);
            setTimeout(() => setLevelUpMessage(""), 3000);
          } else {
            setLevelDownMessage(
              `ירדת לרמה ${newLevel} - בואו ננסה שאלות קצת יותר קלות`
            );
            setTimeout(() => setLevelDownMessage(""), 3000);
          }

          // Update current level
          setCurrentLevel(newLevel);
        }
      }

      setHasCheckedAnswer(true);

      if (isCorrect) {
        setScore(score + 1);
        setShowCorrectMessage(true);
        setTimeout(() => {
          setShowCorrectMessage(false);
        }, 1500);
      } else {
        setShowWrongMessage(true);
        setTimeout(() => {
          setShowWrongMessage(false);
          setShowSolution(true); // Show solution automatically when wrong
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const getInputStyle = (value, correctValue) => {
    if (!hasCheckedAnswer || !value) return "border-gray-300";

    const normalizedUserValue = normalizeAnswer(value);
    const normalizedCorrectValue = normalizeAnswer(correctValue);

    return normalizedUserValue === normalizedCorrectValue
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const handleNextQuestion = () => {
    fetchNewQuestion(currentLevel);
  };

  // Function to return to learning mode selection
  const handleReturnToModeSelection = () => {
    setLearningMode(null);
  };

  const renderAnswerInput = () => {
    if (!question) return null;

    return (
      <div className="relative w-full">
        <input
          type="text"
          value={userAnswer.x}
          onChange={(e) => setUserAnswer({ ...userAnswer, x: e.target.value })}
          placeholder="הכנס את תשובתך (למשל: 1/4, 0.25)"
          className={`w-full p-3 border-2 rounded text-right text-lg transition-colors rtl ${getInputStyle(
            userAnswer.x,
            question?.answer?.x
          )}`}
          dir="rtl"
        />
        {hasCheckedAnswer && userAnswer.x && (
          <span
            className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
              normalizeAnswer(userAnswer.x) ===
              normalizeAnswer(question?.answer?.x)
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {normalizeAnswer(userAnswer.x) ===
            normalizeAnswer(question?.answer?.x)
              ? "✓"
              : "✗"}
          </span>
        )}
      </div>
    );
  };

  // If learning mode not selected, show the learning mode selector
  if (!learningMode) {
    return (
      <div className="p-6 bg-gray-50">
        <LearningModeSelector
          username={username}
          subjectType="probability"
          onSelectMode={handleSelectMode}
        />
      </div>
    );
  }

  // Create sidebar with difficulty levels (only shown in manual mode)
  const ProbabilitySidebar = () => {
    if (learningMode !== LEARNING_MODES.MANUAL) {
      return (
        <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-right">
            מצב למידה מסתגלת
          </h2>
          <div className="p-4 bg-purple-100 rounded-lg">
            <p className="text-purple-800 font-semibold text-lg">
              רמה נוכחית: {currentLevel}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              המערכת תתאים את רמת הקושי לפי הביצועים שלך
            </p>
          </div>
          <button
            onClick={handleReturnToModeSelection}
            className="w-full mt-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
          >
            החלף מצב למידה
          </button>
        </div>
      );
    }

    return (
      <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-right">רמות קושי</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={`probability-${level}`}
              onClick={() => {
                setCurrentLevel(level);
                fetchNewQuestion(level);
              }}
              className={`probability-sidebar-button ${
                currentLevel === level ? "active" : ""
              }`}
            >
              {difficultyLevels[`probability-${level}`]}
            </button>
          ))}
        </div>
        <button
          onClick={handleReturnToModeSelection}
          className="w-full mt-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          החלף מצב למידה
        </button>
      </div>
    );
  };

  return (
    <div className="probability-container flex flex-row-reverse gap-6 p-6 min-h-[400] bg-gray-50">
      <ProbabilitySidebar />
      <div className="flex-1">
        <div className="h-full p-6 bg-white rounded-lg shadow-lg flex flex-col">
          {/* Add prominent question level display at the top */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg text-center font-bold text-xl mb-4">
            רמת קושי: {currentLevel} -{" "}
            {difficultyLevels[`probability-${currentLevel}`]}
          </div>

          <div className="text-3xl font-bold text-center mb-4 text-blue-500">
            {difficultyLevels[`probability-${currentLevel}`]}
          </div>

          {/* Remove redundant level display since we show it more prominently at the top */}

          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {levelUpMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center font-bold">
                  {levelUpMessage}
                </div>
              )}

              {levelDownMessage && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md text-center font-bold">
                  {levelDownMessage}
                </div>
              )}

              <div
                className="text-2xl text-center py-4 whitespace-pre-line probability-question"
                dir="rtl"
              >
                {question?.question}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-4">
                  {renderAnswerInput()}
                  {showWrongMessage && (
                    <div className="feedback-message incorrect">לא נכון!</div>
                  )}
                  {showCorrectMessage && (
                    <div className="feedback-message correct">נכון!</div>
                  )}
                </div>

                <button
                  onClick={checkAnswer}
                  disabled={hasCheckedAnswer}
                  className={`w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-300 ease-in-out ${
                    hasCheckedAnswer ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  בדוק תשובה
                </button>

                {hasCheckedAnswer && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 ease-in-out"
                  >
                    שאלה הבאה
                  </button>
                )}

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all duration-300 ease-in-out"
                >
                  {showSolution ? "הסתר פתרון" : "הצג פתרון"}
                </button>

                {showSolution && question?.solution && (
                  <div
                    className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-line text-right probability-solution"
                    dir="rtl"
                  >
                    {question.solution}
                  </div>
                )}

                <div className="mt-4 text-center text-xl font-semibold text-gray-700 bg-gray-100 py-2 px-4 rounded-lg shadow-sm">
                  ניקוד: {score}
                </div>

                {/* Return button */}
                <button
                  onClick={handleReturnToModeSelection}
                  className="w-full mt-8 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out"
                >
                  חזור לבחירת רמת קושי
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProbabilityQuestionGenerator;
