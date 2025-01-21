import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";

const MathQuestionGenerator = ({ username }) => {
  const [currentType, setCurrentType] = useState("addition");
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState({ x: "", y: "" });
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);

  const questionTypes = {
    addition: "חיבור",
    subtraction: "חיסור",
    multiplication: "כפל",
    division: "חילוק",
    linear: "משוואה עם נעלם אחד",
    system: "מערכת משוואות",
  };

  const fetchNewQuestion = async (type) => {
    try {
      const response = await axios.get(`/api/questions/generate/${type}`);
      setQuestion(response.data);
      setUserAnswer({ x: "", y: "" });
      setShowSolution(false);
      setHasCheckedAnswer(false);
      setShowWrongMessage(false);
      setShowCorrectMessage(false);
    } catch (error) {
      console.error("Error fetching question from fetchNewQuestion:", error);
    }
  };

  const checkAnswer = async () => {
    if (!question) return;

    const isCorrect =
      question.type === "system"
        ? userAnswer.x === question.answer.x &&
          userAnswer.y === question.answer.y
        : userAnswer.x === question.answer.x;

    try {
      const response = await axios.post("/api/questions/check", {
        username: username,
        subjectType: currentType,
        userAnswer,
        correct: isCorrect,
        question: question.question,
        correctAnswer: question.answer,
        solution: question.solution,
      });

      setHasCheckedAnswer(true);

      if (isCorrect) {
        setScore(score + 1);
        setShowCorrectMessage(true);
        setTimeout(() => {
          setShowCorrectMessage(false);
          setQuestion(response.data.nextQuestion);
          setUserAnswer({ x: "", y: "" });
          setShowSolution(false);
          setHasCheckedAnswer(false);
        }, 1000);
      } else {
        setShowWrongMessage(true);
        setTimeout(() => {
          setShowWrongMessage(false);
          setQuestion(response.data.nextQuestion);
          setUserAnswer({ x: "", y: "" });
          setShowSolution(false);
          setHasCheckedAnswer(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  useEffect(() => {
    fetchNewQuestion(currentType);
  }, [currentType]);

  const getInputStyle = (value, correctValue) => {
    if (!hasCheckedAnswer || !value) return "border-gray-300";
    return value === correctValue
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
                  userAnswer.x === question.answer.x
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {userAnswer.x === question.answer.x ? "✓" : "✗"}
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
                  userAnswer.y === question.answer.y
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {userAnswer.y === question.answer.y ? "✓" : "✗"}
              </span>
            )}
          </div>
        </div>
      );
    } else {
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
              userAnswer.x === question?.answer?.x
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {userAnswer.x === question?.answer?.x ? "✓" : "✗"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="mt-20">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md rtl">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
            בחר סוג שאלה:
          </label>
          <select
            className="w-full p-2 border rounded text-right"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
          >
            {Object.entries(questionTypes).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-2xl text-center py-4 whitespace-pre-line">
          {question?.question}
        </div>

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
          <button
            onClick={checkAnswer}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            בדוק תשובה
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {showSolution ? "הסתר פתרון" : "הצג פתרון"}
          </button>
        </div>

        {showSolution && question?.solution && (
          <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-line text-right">
            {question.solution}
          </div>
        )}

        <div className="text-center mt-4">ניקוד: {score}</div>
        <p>{userAnswer.x}</p>
        {userAnswer && console.log(userAnswer)}
      </div>
    </div>
  );
};

export default MathQuestionGenerator;
