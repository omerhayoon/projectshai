import React from "react";

const SubjectCard = ({ subject, data }) => {
  const hasData = data && data.totalQuestions > 0;

  return (
    <div
      dir="rtl"
      className="rounded-xl bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <h3 className="mb-4 text-xl font-bold text-gray-900">{subject}</h3>

      {hasData ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">סה״כ שאלות</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {data.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">תשובות נכונות</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {data.correctAnswers}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">אחוז הצלחה</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {data.successRate?.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500">ניסיון אחרון</p>
            <p className="mt-1 text-gray-900">
              {data.lastAttempt
                ? new Date(data.lastAttempt).toLocaleString("he-IL")
                : "אין מידע"}
            </p>
          </div>
        </>
      ) : (
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-lg text-gray-500">המשתמש טרם התאמן בנושא זה</p>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
