import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import { questionTypes } from "../utils/constants";
import SubjectCard from "../Components/StatisticsComponents/SubjectCard";
import MistakeCard from "../Components/StatisticsComponents/MistakeCard";

const UserStatistics = ({ username }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/statistics/${username}`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveQuestion = async (mistakeId) => {
    try {
      await axios.delete(`/api/statistics/mistakes/${mistakeId}`);
      fetchStatistics(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting mistake:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          טוען נתונים...
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out
        ${
          active
            ? "bg-blue-500 text-white shadow-lg"
            : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
    >
      {label}
    </button>
  );

  const StatCard = ({ title, value, color }) => (
    <div className="flex flex-col rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:shadow-lg">
      <h3 className="mb-3 text-lg font-medium text-gray-600">{title}</h3>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );

  // Get all available subjects from questionTypes
  const allSubjects = Object.keys(questionTypes);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          סטטיסטיקות משתמש
        </h1>

        {/* Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <TabButton
            id="overview"
            label="סקירה כללית"
            active={activeTab === "overview"}
          />
          <TabButton
            id="mistakes"
            label="שגיאות לתיקון"
            active={activeTab === "mistakes"}
          />
          <TabButton
            id="subjects"
            label="לפי נושא"
            active={activeTab === "subjects"}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="סה״כ שאלות"
              value={statistics?.totalQuestions || 0}
              color="text-blue-600"
            />
            <StatCard
              title="תשובות נכונות"
              value={statistics?.totalCorrect || 0}
              color="text-green-600"
            />
            <StatCard
              title="אחוז הצלחה"
              value={`${statistics?.overallSuccessRate?.toFixed(1) || 0}%`}
              color="text-purple-600"
            />
          </div>
        )}

        {/* Mistakes Tab */}
        {activeTab === "mistakes" && (
          <div className="grid gap-6 md:grid-cols-2">
            {statistics?.unresolvedMistakes?.map((mistake) => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                onResolve={resolveQuestion}
              />
            ))}
            {!statistics?.unresolvedMistakes?.length && (
              <div className="col-span-2 rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-lg text-gray-500">אין שגיאות לתיקון</p>
              </div>
            )}
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <div className="grid gap-6 md:grid-cols-2">
            {allSubjects.map((subject) => (
              <SubjectCard
                key={subject}
                subject={questionTypes[subject]}
                data={
                  statistics?.subjectStatistics?.[subject] || {
                    totalQuestions: 0,
                  }
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatistics;
