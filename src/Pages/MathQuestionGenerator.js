// Pages/MathQuestionGenerator.js
import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import MathLayout from "../Components/MathLayout";
import { questionTypes } from "../utils/constants";
import LearningModeSelector, {
  LEARNING_MODES,
} from "../Components/LearningModeSelector";


// Helper function to format math expressions for prettier display.
// It removes extra spaces between numbers and letters, formats the division symbol,
// and trims the string to remove any redundant blank lines.
const formatMathExpression = (expr) => {
  if (!expr) return "";
  // Only remove spaces (and tabs) between digits and a variable, but not newlines.
  return expr
    .trim()
    .replace(/(\d+)[ \t]+([xy])/gi, "$1$2")
    .replace(/\s*÷\s*/g, " ÷ ");
};

const mathFontStyle = {
  fontFamily: "'Cambria Math', 'STIX Two Math', 'Latin Modern Math', serif",
};

const MathQuestionGenerator = ({ username }) => {
  const [learningMode, setLearningMode] = useState(null);
  const [currentType, setCurrentType] = useState("addition");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState({ x: "", y: "" });
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");
  const [levelDownMessage, setLevelDownMessage] = useState("");

  useEffect(() => {
    if (username) {
      fetchUserCurrentLevel();
    }
  }, [username]);

  const fetchUserCurrentLevel = async () => {
    try {
      const response = await axios.get("/api/learning/recommended-level", {
        params: { username, subjectType: "math" },
      });
      if (response.data && response.data.recommendedLevel) {
        setCurrentLevel(response.data.recommendedLevel);
      }
    } catch (error) {
      console.error("Error fetching user's current level:", error);
    }
  };

  const mathOnlyQuestionTypes = Object.keys(questionTypes).filter(
    (type) => !type.startsWith("probability")
  );

  const subjects = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
    "linear",
    "system",
  ];

  const handleSelectMode = (mode, level) => {
    setLearningMode(mode);
    setCurrentLevel(level);
    setQuestion(null);
    setUserAnswer({ x: "", y: "" });
    setScore(0);
    setShowSolution(false);
    setHasCheckedAnswer(false);
    setShowWrongMessage(false);
    setShowCorrectMessage(false);
    setLevelUpMessage("");
    setLevelDownMessage("");

    if (mode === LEARNING_MODES.ADAPTIVE) {
      const randomSubject =
          subjects[Math.floor(Math.random() * subjects.length)] || "addition";
      setCurrentType(randomSubject);
      fetchNewQuestion(currentType, level);
    }
  };

  const fetchNewQuestion = async (type, level) => {
    try {
      setIsLoading(true);
      if (type.startsWith("probability")) type = "addition";
      const questionLevel = level !== undefined ? level : currentLevel;
      const timestamp = new Date().getTime();
      const url = `/api/questions/generate/${type}/${questionLevel}?t=${timestamp}`;
      console.log(`Fetching question from: ${url} (Level: ${questionLevel})`);
      const response = await axios.get(url);
      if (response.data) {
        const questionData = { ...response.data, level: questionLevel };
        setQuestion(questionData);
        setUserAnswer({ x: "", y: "" });
        setShowSolution(false);
        setHasCheckedAnswer(false);
        setShowWrongMessage(false);
        setShowCorrectMessage(false);
        // Only clear the level messages in manual mode
        if (learningMode !== LEARNING_MODES.ADAPTIVE) {
          setLevelUpMessage("");
          setLevelDownMessage("");
        }
      } else {
        console.error("Empty response data when fetching question");
      }
    } catch (error) {
      console.error(
        `Error fetching question for type ${type} and level ${
          level || currentLevel
        }:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (learningMode === LEARNING_MODES.MANUAL) {
      fetchNewQuestion(currentType, currentLevel);
    }
  }, [currentType, currentLevel, learningMode]);

  const normalizeAnswer = (answer) => {
    if (answer === undefined || answer === null || answer === "") return "";
    const str = String(answer).trim();
    if (!isNaN(Number(str))) {
      const num = parseFloat(str);
      if (Number.isInteger(num)) return String(num);
      return num.toFixed(2);
    }
    return str;
  };

  const checkAnswer = async () => {
    if (!question || isLoading) return;
    const normalizedUserAnswerX = normalizeAnswer(userAnswer.x);
    const normalizedUserAnswerY = userAnswer.y
      ? normalizeAnswer(userAnswer.y)
      : "";
    const normalizedCorrectAnswerX = normalizeAnswer(question.answer.x);
    const normalizedCorrectAnswerY = question.answer.y
      ? normalizeAnswer(question.answer.y)
      : "";
    const isCorrect =
      question.type === "system"
        ? normalizedUserAnswerX === normalizedCorrectAnswerX &&
          normalizedUserAnswerY === normalizedCorrectAnswerY
        : normalizedUserAnswerX === normalizedCorrectAnswerX;
    try {
      const response = await axios.post("/api/questions/check", {
        username,
        subjectType: question.type,
        userAnswer,
        correct: isCorrect,
        question: question.question,
        correctAnswer: question.answer,
        solution: question.solution,
        level: currentLevel,
      });
      let adaptiveResponse = null;
      if (learningMode === LEARNING_MODES.ADAPTIVE) {
        const currentMathLevel = currentLevel || 1;
        adaptiveResponse = await axios.post("/api/learning/process-answer", {
          username,
          subjectType: "math",
          currentLevel: currentMathLevel,
          isCorrect,
        });
        const newLevel = adaptiveResponse.data.newLevel;
        const levelChanged = adaptiveResponse.data.levelChanged;
        await axios.post("/api/learning/save-user-level", {
          username,
          subjectType: "math",
          level: newLevel,
        });
        if (levelChanged) {
          if (newLevel > currentMathLevel) {
            setLevelUpMessage(`כל הכבוד! עלית לרמה ${newLevel}`);
            setTimeout(() => setLevelUpMessage(""), 3000);
          } else {
            setLevelDownMessage(
              `ירדת לרמה ${newLevel} - בואו ננסה שאלות קצת יותר קלות`
            );
            setTimeout(() => setLevelDownMessage(""), 3000);
          }
          setCurrentLevel(newLevel);
          const newType =
              subjects[Math.floor(Math.random() * subjects.length)] || "addition";
          // Delay updating the type and fetching a new question for 3000ms so the messages remain visible
          setTimeout(() => {
            setCurrentType(newType);
            fetchNewQuestion(newType, newLevel);
          }, 3000);
          return;
        }
      }
      setHasCheckedAnswer(true);
      if (isCorrect) {
        setScore(score + 1);
        setShowCorrectMessage(true);
        setTimeout(() => setShowCorrectMessage(false), 1500);
      } else {
        setShowWrongMessage(true);
        setShowSolution(true);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const getInputStyle = (value, correctValue) => {
    if (!hasCheckedAnswer || value === "") return "border-gray-300";
    const normalizedUserValue = normalizeAnswer(value);
    const normalizedCorrectValue = normalizeAnswer(correctValue);
    return normalizedUserValue === normalizedCorrectValue
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const renderAnswerInputs = () => {
    if (!question) return null;
    if (question.type === "system" || currentType === "system") {
      return (
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="flex gap-2 items-center">
              <label className="text-lg font-bold">X = </label>
              <input
                type="text"
                value={userAnswer.x}
                onChange={(e) =>
                  setUserAnswer({ ...userAnswer, x: e.target.value })
                }
                className={`w-full p-3 border-2 rounded text-right text-lg transition-colors rtl ${getInputStyle(
                  userAnswer.x,
                  question.answer.x
                )}`}
                placeholder="X"
              />
            </div>
            {hasCheckedAnswer && userAnswer.x && (
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
                  normalizeAnswer(userAnswer.x) ===
                  normalizeAnswer(question.answer.x)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {normalizeAnswer(userAnswer.x) ===
                normalizeAnswer(question.answer.x)
                  ? "✓"
                  : "✗"}
              </span>
            )}
          </div>
          <div className="relative w-full">
            <div className="flex gap-2 items-center">
              <label className="text-lg font-bold">Y = </label>
              <input
                type="text"
                value={userAnswer.y}
                onChange={(e) =>
                  setUserAnswer({ ...userAnswer, y: e.target.value })
                }
                className={`w-full p-3 border-2 rounded text-right text-lg transition-colors rtl ${getInputStyle(
                  userAnswer.y,
                  question.answer.y
                )}`}
                placeholder="Y"
              />
            </div>
            {hasCheckedAnswer && userAnswer.y && (
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
                  normalizeAnswer(userAnswer.y) ===
                  normalizeAnswer(question.answer.y)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {normalizeAnswer(userAnswer.y) ===
                normalizeAnswer(question.answer.y)
                  ? "✓"
                  : "✗"}
              </span>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-full">
        <input
          type="text"
          value={userAnswer.x}
          onChange={(e) => setUserAnswer({ ...userAnswer, x: e.target.value })}
          placeholder="הכנס את תשובתך"
          className={`w-full p-3 border-2 rounded text-right text-lg transition-colors rtl ${getInputStyle(
            userAnswer.x,
            question?.answer?.x
          )}`}
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

  const handleNextQuestion = () => {
    fetchNewQuestion(currentType, currentLevel);
  };

  const handleReturnToModeSelection = () => {
    setLearningMode(null);
  };

  if (!learningMode) {
    return (
      <div className="p-6 bg-gray-50">
        <LearningModeSelector
          username={username}
          subjectType="math"
          onSelectMode={handleSelectMode}
        />
      </div>
    );
  }

  const questionContent = (
    <div className="h-full p-6 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg text-center font-bold text-xl mb-4">
        רמת קושי: {currentLevel} - {questionTypes[currentType]}
      </div>

      <div className="text-3xl font-bold text-center mb-4 text-blue-500">
        {learningMode === LEARNING_MODES.ADAPTIVE
          ? `רמה ${currentLevel}: ${questionTypes[currentType]}`
          : questionTypes[currentType]}
      </div>

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

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div
            className="text-2xl text-center py-4 whitespace-pre-line"
            style={mathFontStyle}
            dangerouslySetInnerHTML={{
              __html: formatMathExpression(question?.question),
            }}
          ></div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-4">
              {renderAnswerInputs()}
              {showWrongMessage && (
                <div className="mt-2 text-center font-bold text-red-500 text-xl">
                  לא נכון!
                </div>
              )}
              {showCorrectMessage && (
                <div className="mt-2 text-center font-bold text-green-500 text-xl">
                  נכון!
                </div>
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
                className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-line text-right"
                style={mathFontStyle}
                dangerouslySetInnerHTML={{
                  __html: formatMathExpression(question.solution),
                }}
              ></div>
            )}
            <div className="mt-4 text-center text-xl font-semibold text-gray-700 bg-gray-100 py-2 px-4 rounded-lg shadow-sm">
              ניקוד: {score}
            </div>

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
  );

  if (learningMode === LEARNING_MODES.ADAPTIVE) {
    return (
      <div className="flex flex-row-reverse gap-6 p-6 min-h-[400] bg-gray-50">
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
        <div className="flex-1">{questionContent}</div>
      </div>
    );
  }

  return (
    <MathLayout currentType={currentType} setCurrentType={setCurrentType}>
      {questionContent}
    </MathLayout>
  );
};
//small change
export default MathQuestionGenerator;
