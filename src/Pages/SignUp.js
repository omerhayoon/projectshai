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
  const [inputStatus, setInputStatus] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Validation patterns
  const validationPatterns = {
    password: {
      length: /^.{6,12}$/,
      specialChar: /[!@#$%^&*]/,
      number: /\d/,
      letter: /[a-zA-Z]/,
    },
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    username: /^[a-zA-Z0-9]{6,}$/,
  };

  const validateField = (name, value) => {
    let isValid = false;

    switch (name) {
      case "username":
        isValid = value.length >= 6 && validationPatterns.username.test(value);
        break;

      case "email":
        isValid = validationPatterns.email.test(value);
        break;

      case "password":
        isValid =
          validationPatterns.password.length.test(value) &&
          validationPatterns.password.specialChar.test(value) &&
          validationPatterns.password.number.test(value) &&
          validationPatterns.password.letter.test(value);
        break;

      case "confirmPassword":
        isValid = value === formData.password && value !== "";
        break;

      default:
        break;
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only set status if there's a value
    if (value) {
      const isValid = validateField(name, value);
      setInputStatus((prev) => ({
        ...prev,
        [name]: isValid ? "valid" : "invalid",
      }));

      // Special handling for confirmPassword
      if (name === "password") {
        const confirmIsValid =
          formData.confirmPassword === value && value !== "";
        setInputStatus((prev) => ({
          ...prev,
          confirmPassword: formData.confirmPassword
            ? confirmIsValid
              ? "valid"
              : "invalid"
            : "",
        }));
      }
      if (name === "confirmPassword") {
        const confirmIsValid = value === formData.password && value !== "";
        setInputStatus((prev) => ({
          ...prev,
          confirmPassword: confirmIsValid ? "valid" : "invalid",
        }));
      }
    } else {
      // If the field is empty, reset its status
      setInputStatus((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "input";
    switch (inputStatus[fieldName]) {
      case "valid":
        return `${baseClass} valid-input`;
      case "invalid":
        return `${baseClass} invalid-input`;
      default:
        return baseClass;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are valid
    const isFormValid = Object.keys(formData).every(
      (key) => inputStatus[key] === "valid"
    );

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "שגיאת קלט",
        text: "אנא וודא שכל השדות תקינים",
      });
      return;
    }

    try {
      const { data } = await axios.post("/sign-up", null, {
        params: {
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          email: formData.email,
        },
      });

      if (data?.success) {
        await Swal.fire({
          icon: "success",
          title: `ברוך הבא ${formData.username}`,
          text: "נרשמת בהצלחה!",
          confirmButtonColor: "#4caf50",
          background: "#f4f4f4",
        });
        navigate("/login", { replace: true });
      } else {
        await Swal.fire({
          icon: "error",
          title: "שגיאה",
          text: data.message,
          confirmButtonColor: "#4caf50",
          background: "#f4f4f4",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "שגיאת הרשמה",
        text: "ההרשמה נכשלה. אנא נסה שוב.",
      });
    }
  };

  const renderValidationIcons = () => (
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
                className={getInputClassName(field.name)}
                required
              />
            </div>
          ))}

          {formData.password && renderValidationIcons()}

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
