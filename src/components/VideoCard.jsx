import React from 'react';

const VideoCard = ({ video }) => {
  const { id, snippet } = video;
  const { title, description, thumbnails } = snippet;
  
  // Get the video ID from different response types
  const videoId = typeof id === 'object' ? id.videoId : id;
  
  // Create YouTube URL
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  // Truncate description
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="group relative cursor-pointer transition-all duration-300 hover:scale-105">
      <a 
        href={youtubeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-900">
          <img
            src={thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url}
            alt={title}
            className="w-full h-48 object-cover transition-all duration-300 group-hover:opacity-80"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40">
            <svg 
              className="w-20 h-20 text-red-600 drop-shadow-lg" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {truncateText(description, 100)}
          </p>
        </div>
      </a>
    </div>
  );
};

export default VideoCard;
