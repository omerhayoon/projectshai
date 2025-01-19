import React, { useState, useEffect } from "react";
import "../CSS/HomePage.css";
import Reviews from "../Components/Reviews";
import AboutUs from "../Components/AboutUs";

const HomePage = ({ sessionId }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="homepage-container">
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
