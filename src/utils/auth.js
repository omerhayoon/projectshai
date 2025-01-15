import Cookies from "universal-cookie";
import Swal from "sweetalert2";

const cookies = new Cookies();

export const setSession = (sessionId) => {
  cookies.set("session_id", sessionId, {
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    domain: "localhost",
    secure: false,
    sameSite: "lax",
  });
};

export const getSession = () => {
  return cookies.get("session_id");
};

export const clearSession = () => {
  cookies.remove("session_id", { path: "/" });
};

export const showLogoutSuccess = () => {
  return Swal.fire({
    icon: "success",
    title: "Logged Out",
    text: "You have been successfully logged out!",
    confirmButtonColor: "#4caf50",
  });
};

export const showLogoutError = () => {
  return Swal.fire({
    icon: "error",
    title: "Logout Failed",
    text: "Failed to logout. Please try again.",
    confirmButtonColor: "#ff4444",
  });
};

export const showLoginSuccess = (username) => {
  return Swal.fire({
    icon: "success",
    title: "Welcome " + username,
    text: "You have successfully logged in!",
    confirmButtonColor: "#4caf50",
    background: "#f4f4f4",
  });
};

export const showLoginError = () => {
  return Swal.fire({
    icon: "error",
    title: "Login Failed",
    text: "Invalid username or password.",
  });
};
