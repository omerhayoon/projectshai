import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../CSS/Login.css";
import { axios } from "../utils/axiosConfig";
import { setSession, showLoginSuccess, showLoginError } from "../utils/auth";

const Login = ({ setSessionId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/api/login",
        {},
        {
          params: {
            username: username,
            password: password,
          },
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        setSession(response.data.sessionId);
        setSessionId(response.data.sessionId);
        localStorage.setItem("username", username);

        await showLoginSuccess(username);
        navigate("/homepage", { replace: true });
      } else {
        await showLoginError();
      }
    } catch (error) {
      console.error("Error during Login:", error);
      await showLoginError();
    }
  };

  const navigateToSignUp = () => {
    navigate("/signup", { replace: true });
  };

  return (
    <div className="login-page-container">
      <div className="header">
        <p>Welcome to Math is Fun</p>
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
          <button className="login-button" onClick={handleLogin}>
            התחברות
          </button>
          <div className="signup-link">
            <p>? עדיין לא נרשמת</p>
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
