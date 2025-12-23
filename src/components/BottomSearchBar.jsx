import { useState, useEffect, useRef } from 'react';
import './BottomSearchBar.css';

const BottomSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const recognitionRef = useRef(null);
  const prevScrollRef = useRef(0);
  const typingIntervalRef = useRef(null);

  // Initialize Speech Recognition only when needed
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsExpanded(true);
    };

    recognition.onresult = (event) => {
      let transcript = '';

      // Build the full transcript from all results
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // Update search bar in real-time
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      setIsTyping(false);
      setQuery(transcript.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        alert('Microphone access was denied. Please allow microphone access to use voice search.');
      } else if (event.error === 'no-speech') {
        console.log('No speech detected');
      } else {
        alert(`Voice recognition error: ${event.error}`);
      }
      
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    return recognition;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Request microphone permission on page load
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        // Always request permission on page load
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone permission requested on page load');
      } catch (error) {
        console.log('Microphone access:', error.name);
      }
    };
    
    // Request immediately on mount
    requestMicPermission();
    
    // Also request when user returns to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        requestMicPermission();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Animate typing effect (Perplexity-style)
  const animateTyping = (text) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setIsTyping(true);
    let currentIndex = 0;
    setQuery('');

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex <= text.length) {
        setQuery(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 30);
  };

  // Toggle voice recognition with permission request
  const toggleVoice = async () => {
    if (isListening && recognitionRef.current) {
      // Stop listening
      recognitionRef.current.stop();
      recognitionRef.current = null;
      return;
    }

    // Request microphone permission and start listening
    try {
      // Request microphone permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately - we only needed to trigger permission
      stream.getTracks().forEach(track => track.stop());
      
      // Initialize and start speech recognition
      const recognition = initializeSpeechRecognition();
      
      if (!recognition) {
        return;
      }
      
      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Microphone permission error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('Microphone access denied. Please allow microphone access in your browser settings to use voice search.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone to use voice search.');
      } else {
        alert('Could not access microphone. Please check your browser settings.');
      }
    }
  };

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
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
  }, []);

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
      const API_KEY = 'AIzaSyBQkDvBbsmVGEYDDgs0IV4AWgNiBrr8Seo';
      
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
      {results.length > 0 && isExpanded && (
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
      <div className={`search-bar-container ${isExpanded ? 'expanded' : 'minimized'}`}>
        {!isExpanded ? (
          <button 
            className="mic-button-minimized"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        ) : (
          <>
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoice}
              aria-label={isListening ? 'Stop listening' : 'Start voice search'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>

            <input
              type="text"
              className="search-input"
              placeholder="Search or speak..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />

            <button
              className="close-button"
              onClick={() => {
                setIsExpanded(false);
                setQuery('');
                setResults([]);
                if (isListening) recognitionRef.current?.stop();
              }}
              aria-label="Close search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomSearchBar;
