// src/App.js
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
import ProbabilityQuestionGenerator from "./Pages/ProbabilityQuestionGenerator";
import LearningVideos from "./Pages/LearningVideos";
import UserStatistics from "./Pages/UserStatistics";
import UserProfile from "./Pages/UserProfile";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = getSession();
        if (!currentSession) {
          clearSession();
          setSessionId(null);
          setUsername(null);
          setName(null);
          setProfileData(null);
          return;
        }

        setSessionId(currentSession);
        const { data } = await axios.post("/api/check-session");
        if (data.success) {
          setUsername(data.username);
          setName(data.name);
          setProfileData({
            username: data.username,
            name: data.name,
            email: data.email,
            profileIcon: data.profileIcon,
            isAdmin: data.isAdmin,
          });
        } else {
          clearSession();
          setSessionId(null);
          setUsername(null);
          setName(null);
          setProfileData(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 300000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Function to update profileData after profile changes
  const handleProfileUpdate = (newProfileData) => {
    setProfileData(newProfileData);
    setName(newProfileData.name); // Sync name state
    console.log("Updated profileData in App.js:", newProfileData); // Debug
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <div></div>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          setSessionId={setSessionId}
          sessionId={sessionId}
          username={username}
          name={name}
          profileIcon={profileData?.profileIcon}
          className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e] shadow-lg"
        />
        <main className="pt-10 px-6 mx-auto max-w-7xl">
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
                  path="/probability"
                  element={<ProbabilityQuestionGenerator username={username} />}
                />
                <Route
                  path="/statistics"
                  element={<UserStatistics username={username} />}
                />
                <Route
                  path="/profile"
                  element={
                    <UserProfile
                      user={profileData}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  }
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
