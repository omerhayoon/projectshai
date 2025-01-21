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

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null); // New state to store username
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = getSession();
        if (currentSession) {
          const { data } = await axios.post("/api/check-session");
          if (data.success) {
            setSessionId(currentSession);
            setUsername(data.username); // Set the username from the server
          } else {
            clearSession();
            setSessionId(null);
            setUsername(null);
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        clearSession();
        setSessionId(null);
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 300000); // Check session every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar
          setSessionId={setSessionId}
          sessionId={sessionId}
          username={username}
        />{" "}
        {/* Pass the username to Navbar */}
        <div className="main-content">
          <Routes>
            <Route
              path="/homepage"
              element={
                <HomePage
                  setSessionId={setSessionId}
                  sessionId={sessionId}
                  username={username}
                />
              } // Pass username to HomePage
            />
            <Route path="LearningVideos" element={<LearningVideos />} />
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
              </>
            )}
            <Route path="*" element={<Navigate to="/homepage" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
