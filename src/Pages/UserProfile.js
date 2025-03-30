// src/Pages/UserProfile.js
import React, { useState } from "react";
import { User, Mail, Shield, Edit, Check } from "lucide-react";
import ProfileEdit from "../Components/ProfileEdit";
import { getIconById } from "../utils/profileIcons";

const UserProfile = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleProfileUpdate = (newProfileData) => {
    setUpdatedUser(newProfileData);
    onProfileUpdate(newProfileData); // Notify App.js of the update
  };

  // Get profile icon based on the icon ID (default if not found)
  const profileIcon = getIconById(updatedUser.profileIcon || "default");

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 -mt-10">
      {isEditing ? (
        <div>
          <ProfileEdit
            user={updatedUser}
            setIsEditing={setIsEditing}שם פרטי
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden text-right">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-white hover:text-blue-100"
              >
                <Edit size={18} />
                <span>ערוך</span>
              </button>
              <h2 className="text-2xl font-bold">פרופיל המשתמש</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6 directionHebrew">
              <div className="mb-4 md:mb-0">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500">
                  <img
                    src={profileIcon.src}
                    alt={`${updatedUser.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-4 text-right">
                <div className="flex items-center space-x-4 gap-1 space-x-reverse">
                  <User className="h-5 w-5 text-gray-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      שם משתמש
                    </p>
                    <p className="text-lg font-semibold">
                      {updatedUser.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 gap-1 space-x-reverse">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">שם פרטי</p>
                    <p className="text-lg font-semibold">{updatedUser.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 gap-1 space-x-reverse">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">אימייל</p>
                    <p className="text-lg font-semibold">{updatedUser.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
