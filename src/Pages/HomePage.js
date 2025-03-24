import React, { useState, useEffect } from "react";
// import "../CSS/HomePage.css";
import ReviewsTable from "../Components/ReviewsTable";
import AboutUs from "../Components/AboutUs";
const HomePage = ({ sessionId }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="grid grid-cols-3  w-full p-4 h-full " dir="rtl">
      <div className="col-span-2 h-full">
        <AboutUs />
      </div>
      <div className="col-span-1 border">
        <ReviewsTable />
      </div>
    </div>
  );
};

export default HomePage;
