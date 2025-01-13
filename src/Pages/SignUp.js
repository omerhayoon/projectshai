import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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
            axios.post("http://localhost:9124/api/sign-up?username="+username+"&password="+password+"&confirmPassword="+confirmPassword+"&email="+email)
                .then(response => {
                    if (response.data != null) {
                        if (response.data.success) {
                            Swal.fire({
                                icon: "success",
                                title: "Welcome "+ username,
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
        <div style={styles.container}>
            <div style={styles.form}>
                <h1>הרשמה</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="מייל"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="סיסמא"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="אשר סיסמא"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.togglePassword}
                    >
                        {showPassword ? "Hide" : "Show"} Password
                    </button>
                    <button type="submit" style={styles.submitButton}>
                        הרשמה
                    </button>
                </form>
                <button
                    type="button"
                    onClick={navigateToLogin}
                    style={styles.backButton}
                >
                    חזרה לדף הראשי
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4"
    },
    form: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "350px",
        textAlign: "center"
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "10px",
        border: "1px solid #ccc",
        fontSize: "16px",
        boxSizing: "border-box"
    },
    togglePassword: {
        background: "none",
        border: "none",
        color: "#ff6b6b",
        cursor: "pointer",
        fontSize: "14px",
        marginBottom: "20px"
    },
    submitButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#ff6b6b",
        color: "white",
        border: "none",
        borderRadius: "15px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s"
    },
    backButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "15px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        transition: "background-color 0.3s"
    }
};

export default SignUp;
