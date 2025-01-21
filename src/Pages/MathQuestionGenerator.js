import React, { useState, useEffect } from "react";

const MathQuestionGenerator = () => {
  const [currentType, setCurrentType] = useState("addition");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState({ x: "", y: "" });
  const [userAnswer, setUserAnswer] = useState({ x: "", y: "" });
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState("");
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  const questionTypes = {
    addition: "חיבור",
    subtraction: "חיסור",
    multiplication: "כפל",
    division: "חילוק",
    linear: "משוואה עם נעלם אחד",
    system: "מערכת משוואות",
  };

  const isAnswerCorrect = () => {
    if (currentType === "system") {
      return userAnswer.x === answer.x && userAnswer.y === answer.y;
    }
    return userAnswer.x === answer.x;
  };

  const getInputStyle = (value, correctValue) => {
    if (!hasCheckedAnswer || !value) return "border-gray-300";
    return value === correctValue
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const generateQuestion = (type) => {
    let newQuestion = "";
    let correctAnswer = { x: "", y: "" };
    let solutionSteps = "";

    switch (type) {
      case "addition":
        const num1 = Math.floor(Math.random() * 20);
        const num2 = Math.floor(Math.random() * 20);
        newQuestion = `${num1} + ${num2} = ?`;
        correctAnswer = { x: (num1 + num2).toString(), y: "" };
        solutionSteps = `${num1} + ${num2} = ${correctAnswer.x}
          חיבור פשוט של שני המספרים`;
        break;

      case "subtraction":
        const minuend = Math.floor(Math.random() * 20);
        const subtrahend = Math.floor(Math.random() * minuend);
        newQuestion = `${minuend} - ${subtrahend} = ?`;
        correctAnswer = { x: (minuend - subtrahend).toString(), y: "" };
        solutionSteps = `${minuend} - ${subtrahend} = ${correctAnswer.x}
          חיסור פשוט של שני המספרים`;
        break;

      case "multiplication":
        const factor1 = Math.floor(Math.random() * 10) + 1;
        const factor2 = Math.floor(Math.random() * 10) + 1;
        newQuestion = `${factor1} × ${factor2} = ?`;
        correctAnswer = { x: (factor1 * factor2).toString(), y: "" };
        solutionSteps = `${factor1} × ${factor2} = ${correctAnswer.x}
          כפל פשוט של שני המספרים`;
        break;

      case "division":
        const divisor = Math.floor(Math.random() * 10) + 1;
        const product = divisor * (Math.floor(Math.random() * 10) + 1);
        newQuestion = `${product} ÷ ${divisor} = ?`;
        correctAnswer = { x: (product / divisor).toString(), y: "" };
        solutionSteps = `${product} ÷ ${divisor} = ${correctAnswer.x}
          חילוק פשוט של המספרים`;
        break;

      case "linear":
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 20);
        const result = Math.floor(Math.random() * 50);
        newQuestion = `${a}x + ${b} = ${result}`;
        correctAnswer = { x: ((result - b) / a).toString(), y: "" };
        solutionSteps = `נתון: ${a}x + ${b} = ${result}
          
          נחסר ${b} משני האגפים:
          ${a}x = ${result - b}
          
          נחלק ב-${a} את שני האגפים:
          x = ${correctAnswer.x}`;
        break;

      case "system":
        const x = Math.floor(Math.random() * 5) + 1;
        const y = Math.floor(Math.random() * 5) + 1;
        newQuestion = `
          2x + y = ${2 * x + y}
          x + y = ${x + y}
        `;
        correctAnswer = { x: x.toString(), y: y.toString() };
        solutionSteps = `נתון:
          2x + y = ${2 * x + y}  (1)
          x + y = ${x + y}     (2)
          
          נחסר את משוואה (2) ממשוואה (1):
          x = ${x}
          
          נציב את x במשוואה (2):
          ${x} + y = ${x + y}
          y = ${y}
          
          התשובה: x = ${x}, y = ${y}`;
        break;
    }

    setQuestion(newQuestion);
    setAnswer(correctAnswer);
    setSolution(solutionSteps);
    setShowSolution(false);
    setUserAnswer({ x: "", y: "" });
    setHasCheckedAnswer(false);
  };

  const checkAnswer = () => {
    setHasCheckedAnswer(true);
    if (isAnswerCorrect()) {
      setScore(score + 1);
      setTimeout(() => {
        generateQuestion(currentType);
      }, 1000); // מעבר לשאלה הבאה אחרי שניה
    }
  };

  useEffect(() => {
    generateQuestion(currentType);
  }, [currentType]);

  const renderAnswerInputs = () => {
    if (currentType === "system") {
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
                  answer.x
                )}`}
                placeholder="הכנס ערך ל-X"
              />
            </div>
            {hasCheckedAnswer && userAnswer.x && (
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
                  userAnswer.x === answer.x ? "text-green-500" : "text-red-500"
                }`}
              >
                {userAnswer.x === answer.x ? "✓" : "✗"}
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
                  answer.y
                )}`}
                placeholder="הכנס ערך ל-Y"
              />
            </div>
            {hasCheckedAnswer && userAnswer.y && (
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
                  userAnswer.y === answer.y ? "text-green-500" : "text-red-500"
                }`}
              >
                {userAnswer.y === answer.y ? "✓" : "✗"}
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
          className={`w-full p-3 border-2 rounded text-right text-lg transition-colors ${getInputStyle(
            userAnswer.x,
            answer.x
          )}`}
        />
        {hasCheckedAnswer && userAnswer.x && (
          <span
            className={`absolute left-2 top-1/2 -translate-y-1/2 text-xl ${
              userAnswer.x === answer.x ? "text-green-500" : "text-red-500"
            }`}
          >
            {userAnswer.x === answer.x ? "✓" : "✗"}
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
          {question}
        </div>

        <div className="mb-4">
          {renderAnswerInputs()}
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

        {showSolution && (
          <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-line text-right">
            {solution}
          </div>
        )}

        <div className="text-center mt-4">ניקוד: {score}</div>
      </div>
    </div>
  );
};

export default MathQuestionGenerator;
