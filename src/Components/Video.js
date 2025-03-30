import React from "react";
import { PlayCircle } from "lucide-react";

const Video = ({ url, title, customTitle }) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get thumbnail URL from video ID
  const getThumbnailUrl = (url) => {
    const videoId = getVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 w-[160px] cursor-pointer"
      aria-label={`Watch ${title} on YouTube`}
    >
      <div className="w-full relative">
        <img
          src={getThumbnailUrl(url)}
          alt={title}
          className="w-full object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-1">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="p-2">
        <h2 className="text-sm font-bold mb-1 line-clamp-2 text-right">
          {title}
        </h2>
        {customTitle && (
          <p className="text-xs text-gray-600 line-clamp-1 text-right">
            {customTitle}
          </p>
        )}
      </div>
    </a>
  );
};

export default Video;
