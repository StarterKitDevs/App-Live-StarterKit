import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { validateEnvVariables, checkRateLimit, logError } from '../helper/security';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);

  // YouTube API Configuration - Loaded from environment variables
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
  const MAX_RESULTS = 24; // Number of videos to fetch

  useEffect(() => {
    // Validate environment variables on mount
    try {
      validateEnvVariables();
      fetchChannelInfo();
      fetchVideos();
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logError(err, { component: 'Videos', action: 'initialization' });
    }
  }, []);

  const fetchChannelInfo = async () => {
    // Rate limiting check
    if (!checkRateLimit('channelInfo', 5, 60000)) {
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      if (data.items && data.items.length > 0) {
        setChannelInfo(data.items[0]);
      }
    } catch (err) {
      logError(err, { component: 'Videos', action: 'fetchChannelInfo' });
      console.error('Error fetching channel info:', err);
    }
  };

  const fetchVideos = async () => {
    if (!API_KEY || !CHANNEL_ID) {
      setError('YouTube API Key or Channel ID is missing. Please check your environment variables.');
      setLoading(false);
      return;
    }

    // Rate limiting check
    if (!checkRateLimit('fetchVideos', 10, 60000)) {
      setError('Too many requests. Please wait a moment and try again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        // Handle quota exceeded specifically
        if (data.error.code === 403) {
          throw new Error('YouTube API quota exceeded. Please try again later.');
        }
        throw new Error(data.error.message);
      }
      
      if (data.items) {
        setVideos(data.items);
      } else {
        setError('No videos found');
      }
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch videos. Please try again later.';
      setError(errorMessage);
      setLoading(false);
      logError(err, { component: 'Videos', action: 'fetchVideos' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Header Section */}
      <div className="relative">
        {/* Background Banner */}
        <div className="h-64 bg-gradient-to-r from-red-900 via-purple-900 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent"></div>
        </div>

        {/* Channel Info */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {channelInfo && channelInfo.snippet.thumbnails && (
              <img
                src={channelInfo.snippet.thumbnails.high.url}
                alt={channelInfo.snippet.title}
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
              />
            )}
            <div className="text-center md:text-left mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {channelInfo ? channelInfo.snippet.title : 'Video Gallery'}
              </h1>
              {channelInfo && channelInfo.statistics && (
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-300">
                  <span>{parseInt(channelInfo.statistics.subscriberCount).toLocaleString()} subscribers</span>
                  <span>•</span>
                  <span>{parseInt(channelInfo.statistics.videoCount).toLocaleString()} videos</span>
                  <span>•</span>
                  <span>{parseInt(channelInfo.statistics.viewCount).toLocaleString()} views</span>
                </div>
              )}
              <p className="mt-2 text-gray-400 max-w-2xl">
                {channelInfo?.snippet.description?.substring(0, 150)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
              <p className="text-xl text-gray-400">Loading videos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 text-white px-6 py-4 rounded-lg mb-8">
            <h3 className="font-bold text-xl mb-2">Error</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm text-gray-300">
              Make sure you have set up your YouTube API credentials in the .env file.
            </p>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Latest Videos</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-purple-600"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id.videoId || video.id} video={video} />
              ))}
            </div>
          </>
        )}

        {/* No Videos State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20">
            <svg 
              className="w-24 h-24 mx-auto text-gray-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="text-xl text-gray-400">No videos found</h3>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {!loading && !error && videos.length > 0 && channelInfo && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Want to see more?</h2>
            <p className="text-lg mb-6">Subscribe to our YouTube channel for the latest updates!</p>
            <a
              href={`https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
