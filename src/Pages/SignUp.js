import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import useNavigate for navigation
import "../CSS/SignUp.css"; // Import the external CSS file

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      axios
        .post(
          "http://localhost:9124/api/sign-up?username=" +
            username +
            "&password=" +
            password +
            "&confirmPassword=" +
            confirmPassword +
            "&email=" +
            email
        )
        .then((response) => {
          if (response.data != null) {
            if (response.data.success) {
              Swal.fire({
                icon: "success",
                title: "Welcome " + username,
                text: "You have successfully sign-up!",
                confirmButtonColor: "#4caf50", // ירוק לאישור
                background: "#f4f4f4", // רקע בהיר
              });
              navigate("/Login");
            }
          }
        });
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  const navigateToLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="container">
      <div className="form">
        <h1>הרשמה</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
          <input
            type="email"
            placeholder="מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="סיסמא"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="אשר סיסמא"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="togglePassword"
          >
            {showPassword ? "Hide" : "Show"} Password
          </button>
          <button type="submit" className="submitButton">
            Sign Up
          </button>
        </form>
        <button type="button" onClick={navigateToLogin} className="backButton">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
