import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/HomePage.css";
import Swal from "sweetalert2";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const response = await axios.post(
          "http://localhost:9124/api/check-session",
          null,
          {
            withCredentials: true,
          }
        );

        console.log("Session response:", response.data);

        if (response.data.success && response.data.user) {
          console.log("Setting user:", response.data.user);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, []);

  // יתר הקוד נשאר אותו דבר...

  const handleLogout = async () => {
    console.log("Entered handleLogout");
    try {
      const response = await axios.post(
        "http://localhost:9124/api/logout",
        null,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (response.data.success) {
        setUser(null);

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out!",
          confirmButtonColor: "#4caf50",
        }).then(() => {
          navigate("/login");
        });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Failed to logout. Please try again.",
        confirmButtonColor: "#ff4444",
      });
    }
  };

  return (
    <div className="homepage-container">
      <div className="navbar">
        <h1>Welcome to Math is Fun</h1>

        <div className="button-container">
          {!user ? (
            <>
              <button className="button" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="button" onClick={() => navigate("/signup")}>
                Register
              </button>
            </>
          ) : (
            <div className="user-info">
              <span className="welcome-text">Hello, {user.username}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="content"></div>
    </div>
  );
};

export default HomePage;
