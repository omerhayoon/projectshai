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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">סרטוני לימוד</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {videos.map((video) => (
          <Video
            key={video.id}
            url={video.videoUrl}
            title={video.title}
            customTitle={video.customTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default LearningVideos;
