import React from "react";
import { User, Mail, Shield } from "lucide-react";

const UserProfile = ({ user }) => {
  const { username, name, email } = user;

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <User className="h-5 w-5 text-gray-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-lg font-semibold">{username}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Shield className="h-5 w-5 text-gray-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Private Name</p>
            <p className="text-lg font-semibold">{name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Mail className="h-5 w-5 text-gray-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
