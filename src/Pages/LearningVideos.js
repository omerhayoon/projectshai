import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig"; // Using your custom axios instance
import Video from "../Components/Video";

const LearningVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("api/videos"); // Note: removed http://localhost:8080 since it's in baseURL
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError("שגיאה בטעינת הסרטונים");
        setLoading(false);
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800">
            🎥 סרטוני לימוד
          </h1>
          <p className="text-lg text-blue-600 mt-2">
            ברוכים הבאים! כאן תוכלו למצוא סרטוני לימוד מעניינים במתמטיקה.
          </p>
        </header>
        <main className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <Video
                url="https://www.youtube.com/watch?v=AGuYqyz6bo0&ab_channel=%D7%9E%D7%9B%D7%95%D7%9F%D7%A0%D7%95%D7%A2%D7%9D-%D7%94%D7%9B%D7%A0%D7%94%D7%9C%D7%9E%D7%91%D7%97%D7%A0%D7%99%D7%9E%D7%97%D7%95%D7%A0%D7%A0%D7%99%D7%9D%2C%D7%A6%D7%95%D7%A8%D7%90%D7%A9%D7%95%D7%9F%D7%95%D7%A2%D7%95%D7%93"
                title="חילוק"
            />
            <Video
                url="https://www.youtube.com/watch?v=9Z4WF8Yjv1Q&ab_channel=%D7%95%D7%A8%D7%93%D7%99%D7%A0%D7%95%D7%9F%D7%90%D7%9E%D7%9F%D7%94%D7%99%D7%9C%D7%93%D7%99%D7%9D"
                title="חיסור"
            />
            <Video
                url="https://www.youtube.com/watch?v=l-dZ1_rjd9M&ab_channel=%D7%95%D7%A8%D7%93%D7%99%D7%A0%D7%95%D7%9F%D7%90%D7%9E%D7%9F%D7%94%D7%99%D7%9C%D7%93%D7%99%D7%9D"
                title="חיבור"
            />
          </div>
        </main>
      </div>
  );


};

export default LearningVideos;
