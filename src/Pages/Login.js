import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../CSS/Login.css"; // Import CSS file for styling
import { FaUser } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [validFields, setValidFields] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState(-1);
  const navigate = useNavigate(); // Initialize useNavigate
  const SERVER_URL = "";

  const navigateToLogin = () => {
    navigate("/HomePage");
  };

  const navigateToSignUp = () => {
    navigate("/SignUp");
  };

  return (
    <div>
      <div className="header">
        <p>ברוכים הבאים לאתר</p>
        <p>"לומדים ונהנים"</p>
      </div>
      <div className="login-container">
        <div className="login-form">
          <h1>התחברות</h1>
          <input
            type="text"
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="סיסמא"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"} Password
          </button>
          <button className="login-button" onClick={() => navigateToLogin()}>
            התחברות
          </button>
          <div className="signup-link">
            <p> ? עדיין לא נרשמת </p>
            <button className="signup-button" onClick={navigateToSignUp}>
              הרשמה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
