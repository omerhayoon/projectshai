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
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        טוען...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        {error}
      </div>
    );
  }

  const getAllVideos = () => {
    return Object.values(videoCategories).flat();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <header className="text-center mb-10">
        <header className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-extrabold text-blue-800 flex items-center gap-3">
            <BiSolidMoviePlay className="text-6xl" />
            סרטוני לימוד
          </h1>
        </header>
        <p className="text-lg text-blue-600 mt-2">
          בחרו קטגוריה לצפייה בסרטונים הרלוונטיים
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* כפתור "הצג את כל הסרטונים" */}

        {/* כפתורים של קטגוריות */}
        {Object.keys(videoCategories).map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-blue-200 text-blue-800"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
            !selectedCategory
              ? "bg-blue-600 text-white"
              : "bg-blue-200 text-blue-800"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          כל הסרטונים
        </button>
      </div>

      {/* הצגת הסרטונים */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {selectedCategory ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto items-start max-h-[800px] rtl px-5">
            {videoCategories[selectedCategory].map((video, index) => (
              <Video key={index} url={video.url} title={video.title} />
            ))}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-y-auto items-start max-h-[800px] rtl px-5">
            {getAllVideos().map((video, index) => (
              <Video key={index} url={video.url} title={video.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningVideos;
