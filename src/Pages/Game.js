import React, { useState } from "react";
import "../CSS/Game.css";

const generateQuestion = (level) => {
  const num1 = Math.floor(Math.random() * (level + 1) * 10) + 1;
  const num2 = Math.floor(Math.random() * (level + 1) * 10) + 1;

  switch (level) {
    case 0:
      return { question: `${num1} + ${num2}`, answer: num1 + num2 };
    case 1:
      return { question: `${num1} - ${num2}`, answer: num1 - num2 };
    case 2:
      return { question: `${num1} * ${num2}`, answer: num1 * num2 };
    case 3:
      return {
        question: `${num1} / ${num2}`,
        answer: parseFloat((num1 / num2).toFixed(2)),
      };
    default:
      return { question: `${num1} + ${num2}`, answer: num1 + num2 };
  }
};

const Game = () => {
  const [level, setLevel] = useState(0);
  const [question, setQuestion] = useState(generateQuestion(0));
  const [userAnswer, setUserAnswer] = useState("");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userAnswerParsed = parseFloat(userAnswer);
    if (userAnswerParsed === question.answer) {
      alert("Correct!");
      setStats((prevStats) => ({
        ...prevStats,
        correct: prevStats.correct + 1,
      }));
      setCorrectStreak((streak) => streak + 1);

      if (correctStreak + 1 >= 3 && level < 3) {
        setLevel((prevLevel) => prevLevel + 1);
        alert("Level up!");
      }
    } else {
      alert(`Incorrect. The correct answer was ${question.answer}`);
      setStats((prevStats) => ({
        ...prevStats,
        incorrect: prevStats.incorrect + 1,
      }));
      setCorrectStreak(0);

      if (level > 0) {
        setLevel((prevLevel) => prevLevel - 1);
        alert("Level down.");
      }
    }
    setQuestion(generateQuestion(level));
    setUserAnswer("");
  };

  return (
    <div>

      <h1>Math Game</h1>
      <h2>Level: {level}</h2>
      <h3>{question.question}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Statistics:</h3>
        <p>Correct Answers: {stats.correct}</p>
        <p>Incorrect Answers: {stats.incorrect}</p>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Game;
