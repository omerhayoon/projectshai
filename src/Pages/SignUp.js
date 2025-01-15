import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axios } from "../utils/axiosConfig";
import "../CSS/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const { data } = await axios.post("/sign-up", null, {
        params: {
          username: formData.username,
          password: formData.password,
          email: formData.email,
        },
      });

      if (data?.success) {
        await Swal.fire({
          icon: "success",
          title: `Welcome ${formData.username}`,
          text: "You have successfully signed up!",
          confirmButtonColor: "#4caf50",
          background: "#f4f4f4",
        });
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text: "Failed to sign up. Please try again.",
      });
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h1>הרשמה</h1>
        <form onSubmit={handleSubmit}>
          {[
            { name: "username", type: "text", placeholder: "שם משתמש" },
            { name: "email", type: "email", placeholder: "מייל" },
            { name: "password", placeholder: "סיסמא" },
            { name: "confirmPassword", placeholder: "אשר סיסמא" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type || (showPassword ? "text" : "password")}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="input"
              required
            />
          ))}
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
        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="backButton"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
