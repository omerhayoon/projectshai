import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9124/api/check-session"
      );
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

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
            "&email=" +
            email,
          null,
          { withCredentials: true }
        )
        .then((response) => {
          console.log("Entered response");
          console.log(response.data);
          if (response.data != null) {
            if (response.data.success) {
              console.log("success");
              Swal.fire({
                icon: "success",
                title: "Welcome " + username,
                text: "You have successfully sign-up!",
                confirmButtonColor: "#4caf50",
                background: "#f4f4f4",
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
