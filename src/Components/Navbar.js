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
import { FaUser } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { PiMathOperationsFill } from "react-icons/pi";




const Navbar = ({ setSessionId, sessionId, username, name }) => {
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
  const handelProfile = () => {
    navigate("/profile", { state: { username, sessionId } }); // מעביר את שם המשתמש ומצב ה-session
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
        <h1 onClick={handleHome} style={{cursor: "pointer", display: "flex", alignItems: "center", gap: "20px"}}>
          Welcome to Math is Fun
          <PiMathOperationsFill/>
        </h1>


        <div
            className="nav-buttons"
            style={{display: "flex", alignItems: "center", gap: "10px"}}
        >
          <button
              className="nav-button"
              onClick={handleHome}
              style={{display: "flex", alignItems: "center", gap: "5px"}}
          >
            Home
            <IoHome/>
          </button>

          {sessionId && (
              <>
                <button
                    className="nav-button"
                    onClick={handleGame}
                    style={{display: "flex", alignItems: "center", gap: "5px"}}
                >
                  Play Game
                  <IoLogoGameControllerB/>
                </button>

                <button className="nav-button" onClick={handleStatistics}>
              <span
                  style={{display: "flex", alignItems: "center", gap: "5px"}}
              >
                Statistic
                <IoStatsChartSharp/>
              </span>
                </button>
                <button
                    className="nav-button"
                    onClick={handelProfile}
                    style={{display: "flex", alignItems: "center", gap: "5px"}}
                >
                  <FaUser/>
                  <span>Profile</span>
                </button>
              </>
          )}
          <div
              className="user-info"
              style={{display: "flex", alignItems: "center", gap: "10px"}}
          >
            {sessionId ? (
                <>
                  <span className="welcome-text">Hello, {name}</span>
                  <button
                      className="nav-button"
                      onClick={handleLogout}
                      style={{display: "flex", alignItems: "center", gap: "5px"}}
                  >
                    Logout
                    <CiLogout/>
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
