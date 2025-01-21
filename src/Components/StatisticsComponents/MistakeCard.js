import React from "react";

const hebrewTerms = {
  addition: "חיבור",
  subtraction: "חיסור",
  multiplication: "כפל",
  division: "חילוק",
  linear: "משוואה עם נעלם אחד",
  system: "מערכת משוואות",
};

const MistakeCard = ({ mistake, onResolve }) => {
  return (
    <div
      dir="rtl"
      className="rounded-xl bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
          {hebrewTerms[mistake.subjectType] || mistake.subjectType}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(mistake.mistakeDate).toLocaleDateString("he-IL")}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-bold text-black-500">שאלה</label>
          <div dir="ltr" className="text-right">
            <p className="mt-1 text-lg text-gray-900 inline-block">
              {mistake.question}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              התשובה שלך
            </label>
            <div dir="ltr" className="text-right">
              <p className="mt-1 text-lg font-medium text-red-600 inline-block">
                {mistake.userAnswer}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              התשובה הנכונה
            </label>
            <div dir="ltr" className="text-right">
              <p className="mt-1 text-lg font-medium text-green-600 inline-block">
                {mistake.correctAnswer}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            פתרון
          </label>
          <div dir="ltr" className="text-right">
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-800 inline-block">
              {mistake.solution}
            </pre>
          </div>
        </div>
      </div>

      <button
        onClick={() => onResolve(mistake.id)}
        className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        מחיקה
      </button>
    </div>
  );
};

export default MistakeCard;
