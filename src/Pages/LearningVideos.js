import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import Video from "../Components/Video";
import { BiSolidMoviePlay } from "react-icons/bi";
import { videoCategories } from "../Pages/videoCategories"; // ייבוא המידע מהקובץ החדש

const LearningVideos = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("api/videos");
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
    return <div className="min-h-screen flex items-center justify-center text-xl">טוען...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <header className="text-center mb-10">
          <header className="flex flex-col items-center justify-center min-h-[20vh] text-center">
            <h1 className="text-5xl font-extrabold text-blue-800 flex items-center gap-3">
              <BiSolidMoviePlay className="text-6xl" />
              סרטוני לימוד
            </h1>
          </header>
          <p className="text-lg text-blue-600 mt-2">בחרו קטגוריה לצפייה בסרטונים הרלוונטיים</p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {Object.keys(videoCategories).map((category) => (
              <button
                  key={category}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-md ${selectedCategory === category ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-800"}`}
                  onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
          ))}
        </div>

        {selectedCategory && (
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {videoCategories[selectedCategory].map((video, index) => (
                  <Video key={index} url={video.url} title={video.title} />
              ))}
            </div>
        )}
      </div>
  );
};

export default LearningVideos;
