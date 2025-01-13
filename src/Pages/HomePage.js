import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="homepage-container">
      <div className="navbar">
        <h1>Welcome to Math is Fun</h1>
        <div className="button-container">
          <button className="button" onClick={navigateToLogin}>
            Login
          </button>
          <button className="button" onClick={navigateToSignUp}>
            Register
          </button>
        </div>
      </div>
      <div className="content"></div>
    </div>
  );
};

export default HomePage;
