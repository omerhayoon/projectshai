import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import Video from "../Components/Video";

const LearningVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("api/videos"); 
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
          .ברוכים הבאים! כאן תוכלו למצוא סרטוני לימוד מעניינים במתמטיקה
        </p>
      </header>
      <main className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <Video
            url="https://www.youtube.com/watch?v=AGuYqyz6bo0"
            title="חילוק"
          />
          <Video
            url="https://www.youtube.com/watch?v=9Z4WF8Yjv1Q"
            title="חיסור"
          />
          <Video
            url="https://www.youtube.com/watch?v=l-dZ1_rjd9M"
            title="חיבור"
          />
        </div>
      </main>
    </div>
  );
};

export default LearningVideos;
