import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import { axios } from "../utils/axiosConfig";
import {
  clearSession,
  showLogoutSuccess,
  showLogoutError,
} from "../utils/auth";

const HomePage = ({ setSessionId }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout", null, {
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
        navigate("/login", { replace: true });
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
            <span className="welcome-text">Hello, {username}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="content"></div>
    </div>
  );
};

export default HomePage;
