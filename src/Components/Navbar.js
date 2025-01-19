// src/Components/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../utils/axiosConfig";
import {
  clearSession,
  showLogoutSuccess,
  showLogoutError,
} from "../utils/auth";
import "../CSS/Navbar.css";

const Navbar = ({ setSessionId, sessionId }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Update username whenever sessionId changes
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [sessionId]); // Add sessionId as dependency

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  const handleHome = () => {
    navigate("/homepage");
  };

  const handleGame = () => {
    if (sessionId) {
      navigate("/game");
    } else {
      navigate("/login");
    }
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
        localStorage.removeItem("username");
        setUsername(""); // Clear username state
        setSessionId(null);
        await showLogoutSuccess();
        navigate("/homepage");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      await showLogoutError();
    }
  };

  return (
    <div className="navbar">
      <h1 onClick={handleHome} style={{ cursor: "pointer" }}>
        Welcome to Math is Fun
      </h1>
      <div className="nav-buttons">
        <button className="nav-button" onClick={handleHome}>
          Home
        </button>
        {sessionId && (
          <button className="nav-button" onClick={handleGame}>
            Play Game
          </button>
        )}
        <div className="user-info">
          {sessionId ? (
            <>
              <span className="welcome-text">Hello, {username}</span>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={handleLogin}>
                Login
              </button>
              <button className="nav-button" onClick={handleRegister}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
