import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./CSS/App.css";
import { axios } from "./utils/axiosConfig";
import { getSession, clearSession } from "./utils/auth";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import MathQuestionGenerator from "./Pages/MathQuestionGenerator";
import LearningVideos from "./Pages/LearningVideos";
import UserStatistics from "./Pages/UserStatistics";
import UserProfile from "./Pages/UserProfile";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  //this is still working
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = getSession();
        if (!currentSession) {
          clearSession();
          setSessionId(null);
          setUsername(null);
          return;
        }

        setSessionId(currentSession);
        const { data } = await axios.post("/api/check-session");
        if (data.success) {
          setUsername(data.username);
          setName(data.name);
          setProfileData(data);
        } else {
          clearSession();
          setSessionId(null);
          setUsername(null);
          setName(null);
          setProfileData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 300000);
    return () => clearInterval(interval);
  }, [sessionId]); // Add sessionId dependency

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          setSessionId={setSessionId}
          sessionId={sessionId}
          username={username}
          name={name}
          className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e] shadow-lg"
        />
        <main className="pt-20 px-6 mx-auto max-w-7xl">
          <Routes>
            <Route
              path="/homepage"
              element={
                <HomePage
                  setSessionId={setSessionId}
                  sessionId={sessionId}
                  username={username}
                  name={name}
                />
              }
            />
            <Route path="/learning-videos" element={<LearningVideos />} />
            <Route
              path="/login"
              element={<Login setSessionId={setSessionId} />}
            />
            <Route path="/signup" element={<SignUp />} />
            {sessionId && (
              <>
                <Route
                  path="/game"
                  element={<MathQuestionGenerator username={username} />}
                />
                <Route
                  path="/statistics"
                  element={<UserStatistics username={username} />}
                />

                <Route
                  path="/profile"
                  element={<UserProfile user={profileData} />}
                />
              </>
            )}
            <Route path="*" element={<Navigate to="/homepage" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
