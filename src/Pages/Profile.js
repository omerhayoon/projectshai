import React from "react";
import { useLocation } from "react-router-dom";
import "../CSS/Profile.css";

const Profile = () => {
    const location = useLocation();
    const { username } = location.state || {}; // קריאה למידע מה-location

    return (
        <div className="profile-background">
            <div className="profile-box">
                <br/>
                <br/>
                <h1>
                    PROFILE:
                </h1>
                <br/>
                <br/>
                <h1>Welcome, {username}</h1>
            </div>
        </div>
    );


};

export default Profile;
