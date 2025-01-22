import React, { useState, useEffect } from "react";
import "../CSS/HomePage.css";
import Reviews from "../Components/Reviews";
import AboutUs from "../Components/AboutUs";
import Video from "../Components/Video";

const HomePage = ({ sessionId }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="homepage-container"><div>
        <AboutUs />
      </div>
      <div className="main-content">
        <Reviews username={username} />
      </div>
      <div>
        <Video
          url="https://www.youtube.com/watch?v=ewNSCHsoUbc"
          title="Learn Math"
          customTitle="Another video"
        />
      </div>
      <div>
        <p>SessionID: {sessionId} {localStorage.getItem("username")};
        </p>
      </div>
    </div>
  );
};

export default HomePage;
