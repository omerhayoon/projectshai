import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import "../CSS/Login.css"; 
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const navigateToLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9124/api/login",
        null,
        {
          params: {
            username: username,
            password: password,
          },
          withCredentials: true, 
        }
      );

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Welcome " + username,
          text: "You have successfully logged in!",
          confirmButtonColor: "#4caf50",
          background: "#f4f4f4",
        });

        navigate("/HomePage");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The password or username is incorrect!",
        });
      }
    } catch (error) {
      console.error("Error during Login:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Failed to login. Please try again.",
      });
    }
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
