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
    title: "התנתקת",
    text: "!התנתקת בהצלחה",
    confirmButtonColor: "#4caf50",
  });
};

export const showLogoutError = () => {
  return Swal.fire({
    icon: "error",
    title: "ההתנתקות נכשלה",
    text: "ההתנתקות נכשלה, נסה שוב מאוחר יותר",
    confirmButtonColor: "#ff4444",
  });
};

export const showLoginSuccess = (name) => {
  return Swal.fire({
    icon: "success",
    title: name + " ברוך הבא ",
    text: "!התחברת בהצלחה",
    confirmButtonColor: "#4caf50",
    background: "#f4f4f4",
  });
};

export const showLoginError = () => {
  return Swal.fire({
    icon: "error",
    title: "ההתחברות נכשלה",
    text: "שם משתמש/סיסמא שגויים",
  });
};
