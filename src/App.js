import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./CSS/App.css";
import { axios } from "./utils/axiosConfig";
import { getSession, clearSession } from "./utils/auth";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import Game from "./Pages/Game";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = getSession();
        if (currentSession) {
          const { data } = await axios.post("/check-session");
          setSessionId(data.success ? currentSession : null);
          if (!data.success) clearSession();
        }
      } catch (error) {
        console.error("Session check failed:", error);
        clearSession();
        setSessionId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 300000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {!sessionId ? (
          <>
            <Route
              path="/login"
              element={<Login setSessionId={setSessionId} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/homepage"
              element={<HomePage setSessionId={setSessionId} />}
            />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<Navigate to="/homepage" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
