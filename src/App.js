import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import Game from "./Pages/Game";
import LoadingSpinner from "./Components/LoadingSpinner";

const ProtectedFromAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9124/api/check-session",
          null,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.success);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/homepage" /> : children;
};

// קומפוננטת הגנה למשתמשים לא מחוברים
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9124/api/check-session",
          null,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.success);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />

        <Route
          path="/login"
          element={
            <ProtectedFromAuth>
              <Login />
            </ProtectedFromAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedFromAuth>
              <SignUp />
            </ProtectedFromAuth>
          }
        />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />

        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
