import { useState, useEffect, useRef } from 'react';
import './BottomSearchBar.css';

const BottomSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  const prevScrollRef = useRef(0);
  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const mouseMoveTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);

  // Handle global keypress to show search bar
  useEffect(() => {
    const handleGlobalKeyPress = (event) => {
      // Ignore if user is typing in an input, textarea, or contenteditable element
      const target = event.target;
      const isTypingInField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      // Ignore modifier keys and special keys
      const isModifierKey = event.ctrlKey || event.metaKey || event.altKey;
      const isSpecialKey = event.key.length > 1 && event.key !== 'Space';

      if (!isTypingInField && !isModifierKey && !isSpecialKey) {
        // Show search bar and focus input
        setIsVisible(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            // Add the typed character to the search
            if (event.key.length === 1) {
              setQuery(event.key);
            }
          }
        }, 100);
      }
    };

    document.addEventListener('keypress', handleGlobalKeyPress);
    return () => document.removeEventListener('keypress', handleGlobalKeyPress);
  }, []);

  // Handle clicks outside to hide search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsVisible(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-hide on scroll or mouse movement (disabled when input is focused)
  useEffect(() => {
    const handleScroll = () => {
      if (!isFocused) {
        setIsVisible(false);
        setQuery('');
        setResults([]);
      }
    };

    const handleMouseMove = () => {
      if (!isFocused) {
        setIsVisible(false);
        setQuery('');
        setResults([]);
      }
    };

    if (isVisible) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFocused, isVisible]);

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
    <>
      {/* Floating Search Button - Shows when search is hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="floating-search-button"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Open search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      )}

      <div ref={searchBarRef} className={`search-bar-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
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
          ref={inputRef}
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
    </>
  );
};

export default BottomSearchBar;
