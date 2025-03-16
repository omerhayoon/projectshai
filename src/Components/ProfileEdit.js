// src/Components/ProfileEdit.js
import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import {
  profileIcons,
  iconCategories,
  getIconById,
} from "../utils/profileIcons";
import "../CSS/ProfileEdit.css";

const ProfileEdit = ({ user, onProfileUpdate }) => {
  const [privateName, setPrivateName] = useState("");
  const [selectedIconId, setSelectedIconId] = useState("default");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [filteredIcons, setFilteredIcons] = useState(profileIcons);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setPrivateName(user.name || "");
      setSelectedIconId(user.profileIcon || "default");
    }
  }, [user]);

  // Filter icons when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredIcons(profileIcons);
    } else {
      setFilteredIcons(
        profileIcons.filter((icon) => icon.category === activeCategory)
      );
    }
  }, [activeCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!privateName.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "שם פרטי הוא שדה חובה",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/user/update-profile", {
        username: user.username,
        name: privateName,
        profileIcon: selectedIconId,
      });

      if (response.status === 200) {
        setNotification({
          show: true,
          type: "success",
          message: "הפרופיל עודכן בהצלחה!",
        });

        // Update parent component with new profile data
        if (onProfileUpdate) {
          onProfileUpdate({
            ...user,
            name: privateName,
            profileIcon: selectedIconId,
          });
        }

        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, type: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        show: true,
        type: "error",
        message: "אירעה שגיאה בעדכון הפרופיל",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIcon = getIconById(selectedIconId);

  return (
    <div className="profile-edit-container">
      <h1 className="profile-edit-title">עדכון פרופיל</h1>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-group">
          <label htmlFor="privateName" className="form-label">
            שם פרטי
          </label>
          <input
            type="text"
            id="privateName"
            value={privateName}
            onChange={(e) => setPrivateName(e.target.value)}
            className="name-input"
            placeholder="הזן את שמך הפרטי"
          />
        </div>
      </form>

      <div className="profile-icon-section">
        <h2 className="form-label">בחר אייקון פרופיל</h2>

        <div className="current-icon">
          <img
            src={selectedIcon.src}
            alt={selectedIcon.alt}
            className="current-icon-img"
          />
          <p>האייקון הנוכחי שלך</p>
        </div>

        <div className="icon-category-filter">
          {iconCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-button ${
                activeCategory === category.id ? "active" : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="icons-grid">
          {filteredIcons.map((icon) => (
            <div
              key={icon.id}
              className={`icon-item ${
                selectedIconId === icon.id ? "selected" : ""
              }`}
              onClick={() => setSelectedIconId(icon.id)}
            >
              <img src={icon.src} alt={icon.alt} className="icon-image" />
              <span className="icon-name">{icon.alt}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="save-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "מעדכן פרופיל..." : "שמור שינויים"}
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
