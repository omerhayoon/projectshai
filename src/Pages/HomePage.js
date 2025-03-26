import React, { useState, useEffect } from "react";
import ReviewsTable from "../Components/ReviewsTable";
import AboutUs from "../Components/AboutUs";

const HomePage = ({ sessionId }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  // Determine logged-in status from the username (if available)
  const isLoggedIn = Boolean(username);

  return (
    <div className="grid grid-cols-3 w-full p-4 h-full" dir="rtl">
      <div className="col-span-2 h-full">
        <AboutUs />
      </div>
      <div className="col-span-1 border">
        <ReviewsTable isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

export default HomePage;
