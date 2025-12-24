import { useState, useEffect, useRef } from 'react';
import './BottomSearchBar.css';

const BottomSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  const prevScrollRef = useRef(0);

  // Auto-hide on scroll (disabled when input is focused)
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide when input is focused (mobile keyboard might trigger scroll)
      if (isFocused) {
        return;
      }
      
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > prevScrollRef.current && currentScroll > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      prevScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFocused]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchVideos(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchVideos = async (searchTerm) => {
    try {
      const CHANNEL_ID = 'UCBdWQ1bvfUWXCz6je9Ep7wg';
      const API_KEY = 'AIzaSyC2iYJeKOlObkFDnL40S3WQBEvNlXy810Y';
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${CHANNEL_ID}&q=${encodeURIComponent(searchTerm)}&maxResults=10&order=relevance&key=${API_KEY}`
      );
      
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className={`search-bar-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
      {/* Results Panel */}
      {results.length > 0 && (
        <div className="search-results">
          {results.map((video) => (
            <a
              key={video.id.videoId}
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-result"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="video-thumbnail"
              />
              <div className="video-info">
                <div className="video-title">{video.snippet.title}</div>
                <div className="video-description">
                  {video.snippet.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar-container expanded">
        <input
          type="text"
          className="search-input"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setIsVisible(true);
          }}
          onBlur={() => setIsFocused(false)}
        />

        {query && (
          <button
            className="close-button"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomSearchBar;
