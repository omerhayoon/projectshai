import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axios } from "../utils/axiosConfig";
import "../CSS/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [inputStatus, setInputStatus] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,}$/,
    username: /^[a-zA-Z0-9]{6,}$/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    password: {
      length: /^.{6,12}$/,
      specialChar: /[!@#$%^&*]/,
      number: /\d/,
      letter: /[a-zA-Z]/,
    },
  };

  const validateField = (name, value) => {
    if (!value.trim()) return "invalid"; // בדיקה פשוטה אם השדה ריק

    switch (name) {
      case "name":
        return "valid"; // אין צורך בוולידציה נוספת
      case "username":
        return validationPatterns.username.test(value.trim()) ? "valid" : "invalid";
      case "email":
        return validationPatterns.email.test(value.trim().toLowerCase()) ? "valid" : "invalid";
      case "password":
        return validationPatterns.password.length.test(value) &&
        validationPatterns.password.specialChar.test(value) &&
        validationPatterns.password.number.test(value) &&
        validationPatterns.password.letter.test(value)
            ? "valid"
            : "invalid";
      case "confirmPassword":
        return value === formData.password ? "valid" : "invalid";
      default:
        return "invalid";
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setInputStatus((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }

    if (name === "password" && touched.confirmPassword) {
      setInputStatus((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", formData.confirmPassword),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setInputStatus((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const getInputClassName = (fieldName) => {
    if (!touched[fieldName]) return "input";
    return `input ${
        inputStatus[fieldName] ? `${inputStatus[fieldName]}-input` : ""
    }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const newStatus = {
      name: validateField("name", formData.name),
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };
    setInputStatus(newStatus);

    // Check if all fields are valid
    if (Object.values(newStatus).some((status) => status !== "valid")) {
      Swal.fire({
        icon: "error",
        title: "שגיאת קלט",
        text: "אנא וודא שכל השדות תקינים",
      });
      return;
    }

    const params = new URLSearchParams({
      name: formData.name.trim(),
      username: formData.username.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      email: formData.email.trim().toLowerCase(),
    });

    console.log("Sending signup data:", params.toString());

    try {
      const { data } = await axios.post("/api/sign-up", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Server response:", data);

      if (data && data.success) {
        await Swal.fire({
          icon: "success",
          title: `ברוך הבא ${formData.name}`,
          text: "נרשמת בהצלחה!",
          confirmButtonColor: "#4caf50",
        });
        navigate("/login");
      } else {
        throw new Error(data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Full error object:", error);
      Swal.fire({
        icon: "error",
        title: "שגיאת הרשמה",
        text:
            error.response?.data?.message ||
            error.message ||
            "ההרשמה נכשלה. אנא נסה שוב.",
      });
    }
  };

  const renderPasswordRequirements = () => (
      <div className="password-requirements">
        <ul>
          <li
              className={
                validationPatterns.password.length.test(formData.password)
                    ? "valid"
                    : "invalid"
              }
          >
            אורך בין 6 ל-12 תווים
          </li>
          <li
              className={
                validationPatterns.password.specialChar.test(formData.password)
                    ? "valid"
                    : "invalid"
              }
          >
            לפחות תו מיוחד אחד (!@#$%^&*)
          </li>
          <li
              className={
                validationPatterns.password.number.test(formData.password)
                    ? "valid"
                    : "invalid"
              }
          >
            לפחות מספר אחד
          </li>
          <li
              className={
                validationPatterns.password.letter.test(formData.password)
                    ? "valid"
                    : "invalid"
              }
          >
            לפחות אות אחת
          </li>
          {formData.password && formData.confirmPassword && (
              <li
                  className={
                    formData.password === formData.confirmPassword
                        ? "valid"
                        : "invalid"
                  }
              >
                סיסמאות תואמות
              </li>
          )}
        </ul>
      </div>
  );

  return (
      <div className="container">
        <div className="form">
          <h1>הרשמה</h1>
          <form onSubmit={handleSubmit}>
            {[
              { name: "name", type: "text", placeholder: "שם מלא" },
              { name: "username", type: "text", placeholder: "שם משתמש" },
              { name: "email", type: "email", placeholder: "מייל" },
              { name: "password", placeholder: "סיסמא" },
              { name: "confirmPassword", placeholder: "אשר סיסמא" },
            ].map((field) => (
                <div key={field.name} className="input-container">
                  <input
                      type={field.type || (showPassword ? "text" : "password")}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClassName(field.name)}
                      required
                  />
                </div>
            ))}

            {renderPasswordRequirements()}

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
              onClick={() => navigate("/login")}
              className="backButton"
          >
            Back to Login
          </button>
        </div>
      </div>
  );
};

export default SignUp;
