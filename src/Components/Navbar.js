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

const Navbar = ({ setSessionId, sessionId, username }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/signup");
  };
  const handleStatistics = () => {
    navigate("/statistics");
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
          <div>
            <button className="nav-button" onClick={handleGame}>
              Play Game
            </button>
            <button className="nav-button" onClick={handleStatistics}>
              Statistic
            </button>
          </div>
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
