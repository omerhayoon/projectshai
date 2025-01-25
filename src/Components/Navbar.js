// src/Components/Navbar.js
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {axios} from "../utils/axiosConfig";
import {
    clearSession,
    showLogoutSuccess,
    showLogoutError,
} from "../utils/auth";
import "../CSS/Navbar.css";
import {FaUser} from "react-icons/fa";
import {IoStatsChartSharp} from "react-icons/io5";
import {IoLogoGameControllerB} from "react-icons/io";
import {IoHome} from "react-icons/io5";
import {CiLogout} from "react-icons/ci";
import {PiMathOperationsFill} from "react-icons/pi";
import {MdOutlineOndemandVideo} from "react-icons/md";


const Navbar = ({setSessionId, sessionId, username, name}) => {
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
        navigate("/profile", {state: {username, sessionId}}); // מעביר את שם המשתמש ומצב ה-session
    };
    const handleVideos = () => {
        navigate("/learning-videos");
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
        } catch (error) {console.error("Logout failed:", error);
            await showLogoutError();
        }
    };

    return (
        <div className="navbar">
            <h1 className="custom-button" onClick={handleHome}>Welcome to Math is Fun<PiMathOperationsFill/></h1>
            <div className="nav-buttons">
                {sessionId && (
                    <>
                        <button className="sutton-style" onClick={handleGame}>Play Game<IoLogoGameControllerB/></button>
                        <button className="sutton-style" onClick={handleStatistics}>Statistic<IoStatsChartSharp/></button>
                        <button className="sutton-style" onClick={handelProfile}><FaUser/>Profile</button>
                    </>
                )}
                <div className="user-info">
                    {sessionId ? (
                        <>
                            <button onClick={handleVideos} className="sutton-style">Videos<MdOutlineOndemandVideo/></button>
                            <button className="sutton-logout-style" onClick={handleLogout}>Logout<CiLogout/></button>
                            <span className="welcome-text text-3xl font-semibold text-red-600" style={{fontFamily: "'Roboto', sans-serif",}}>Hello, {name}</span>
                        </>
                    ) : (
                        <>
                            <button className="nav-button" onClick={handleLogin}>Login</button>
                            <button className="nav-button" onClick={handleRegister}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
