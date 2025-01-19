import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import { axios } from "../utils/axiosConfig";
import {
  clearSession,
  showLogoutSuccess,
  showLogoutError,
} from "../utils/auth";
import Reviews from "../Components/Reviews";
import AboutUs from "../Components/AboutUs";

const HomePage = ({ setSessionId, sessionId }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout", null, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        clearSession();
        localStorage.removeItem("username"); // מחיקת שם המשתמש בהתנתקות
        setSessionId(null);
        await showLogoutSuccess();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      await showLogoutError();
    }
  };

  return (
    <div className="homepage-container">
      <div className="navbar">
        <h1>Welcome to Math is Fun</h1>
        <div className="button-container">
          <div className="user-info">
            {sessionId ? (
              <>
                <span className="welcome-text">Hello, {username}</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="logout-button" onClick={handleLogin}>
                  Login
                </button>
                <button className="logout-button" onClick={handleRegister}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <AboutUs />
      </div>
      <div className="main-content">
        <Reviews username={username} />
      </div>
    </div>
  );
};

export default HomePage;
