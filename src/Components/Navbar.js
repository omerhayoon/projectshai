import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../utils/axiosConfig";

import {
  clearSession,
  showLogoutSuccess,
  showLogoutError,
} from "../utils/auth";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { PiMathOperationsFill } from "react-icons/pi";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { getIconById } from "../utils/profileIcons";

const Navbar = ({ setSessionId, sessionId, username, name, profileIcon }) => {
  const navigate = useNavigate();
  const [studyDropdown, setStudyDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const studyDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const toggleStudyDropdown = () => {
    setStudyDropdown(!studyDropdown);
    if (userDropdown) setUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdown(!userDropdown);
    if (studyDropdown) setStudyDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        studyDropdownRef.current &&
        !studyDropdownRef.current.contains(event.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setStudyDropdown(false);
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setStudyDropdown(false);
    setUserDropdown(false);
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

  const userIcon = getIconById(profileIcon || "default");

  return (
    <div className="flex items-center justify-between p-4 bg-blue-500">
      <p
        className="flex items-center gap-2 text-2xl font-semibold text-white cursor-pointer transition-all"
        onClick={() => handleNavigation("/homepage")}
      >
        Welcome to Math is Fun <PiMathOperationsFill />
      </p>

      <div className="flex items-center gap-5">
        {sessionId ? (
          <>
            {/* Study Dropdown */}
            <div className="relative" ref={studyDropdownRef}>
              <button
                className="flex items-center gap-2 bg-transparent border border-white text-white px-3 py-2 rounded-md hover:bg-white/10 transition-all"
                onClick={toggleStudyDropdown}
              >
                <FaCaretDown /> למידה
              </button>
              {studyDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 bg-blue-600 rounded-md shadow-md w-44 flex flex-col z-10"
                  dir="rtl"
                >
                  <button
                    onClick={() => handleNavigation("/math")}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    <IoLogoGameControllerB />
                    מתמטיקה
                  </button>
                  <button
                    onClick={() => handleNavigation("/probability")}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    <IoLogoGameControllerB />
                    הסתברות
                  </button>
                  <button
                    onClick={() => handleNavigation("/statistics")}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    <IoStatsChartSharp />
                    נתונים סטטיסטיים
                  </button>
                  <button
                    onClick={() => handleNavigation("/learning-videos")}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    <MdOutlineOndemandVideo />
                    סרטוני למידה
                  </button>
                </div>
              )}
            </div>

            {/* User Dropdown - Fix for longer usernames */}
            <div className="relative ml-4" dir="rtl" ref={userDropdownRef}>
              <button
                className="flex items-center gap-2 bg-transparent border border-white text-white px-3 py-2 rounded-md hover:bg-white/10 transition-all"
                onClick={toggleUserDropdown}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500 bg-white">
                  <img
                    src={userIcon.src}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {name}
                </span>
                <FaCaretDown />
              </button>
              {userDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-blue-600 rounded-md shadow-md w-44 flex flex-col z-10">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    פרופיל <FaUser />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-800 text-sm"
                  >
                    התנתקות <CiLogout />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-6" dir="rtl">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-sm"
              onClick={() => handleNavigation("/login")}
            >
              התחברות
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-sm"
              onClick={() => handleNavigation("/signup")}
            >
              הרשמה
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
