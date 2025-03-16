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
    <div
      className="flex flex-row-reverse justify-center items-start w-full p-4 gap-8"
      dir="rtl"
    >
      {/* Reviews on the right side */}
      <div className="w-1/3 sticky top-4">
        <ReviewsTable />
      </div>

      {/* About Us in the center */}
      <div className="w-1/2">
        <AboutUs />
      </div>
    </div>
  );
};

export default HomePage;
