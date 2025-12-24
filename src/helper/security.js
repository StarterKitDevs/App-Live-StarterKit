/**
 * Security Utilities - Enterprise Grade
 * Provides encryption, validation, and security helpers
 * @module security
 */

/**
 * Validates environment variables are present and properly formatted
 * @throws {Error} If required variables are missing
 */
export const validateEnvVariables = () => {
  const required = {
    VITE_YOUTUBE_API_KEY: 'YouTube API Key',
    VITE_YOUTUBE_CHANNEL_ID: 'YouTube Channel ID',
  };

  const missing = [];
  const errors = [];

  Object.entries(required).forEach(([key, name]) => {
    const value = import.meta.env[key];
    
    if (!value) {
      missing.push(name);
      return;
    }

    // Validate format
    if (key === 'VITE_YOUTUBE_API_KEY' && !value.startsWith('AIza')) {
      errors.push(`${name} appears to be invalid format`);
    }
    
    if (key === 'VITE_YOUTUBE_CHANNEL_ID' && !value.startsWith('UC')) {
      errors.push(`${name} should start with 'UC'`);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file and ensure all variables are set.'
    );
  }

  if (errors.length > 0) {
    console.warn('Environment variable validation warnings:', errors);
  }

  return true;
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validates URL is from trusted domain
 * @param {string} url - URL to validate
 * @param {string[]} allowedDomains - Allowed domains
 * @returns {boolean}
 */
export const isValidUrl = (url, allowedDomains = ['youtube.com', 'googleapis.com']) => {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Rate limiting helper using localStorage
 * @param {string} key - Unique key for this rate limit
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if request is allowed
 */
export const checkRateLimit = (key, maxRequests = 10, windowMs = 60000) => {
  try {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '{"requests":[],"blocked":0}');
    
    // Remove old requests outside window
    data.requests = data.requests.filter(time => now - time < windowMs);
    
    // Check if blocked
    if (data.blocked && now - data.blocked < windowMs * 2) {
      console.warn(`Rate limit exceeded for ${key}. Please try again later.`);
      return false;
    }
    
    // Check request count
    if (data.requests.length >= maxRequests) {
      data.blocked = now;
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.warn(`Rate limit reached for ${key}`);
      return false;
    }
    
    // Add current request
    data.requests.push(now);
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open to not break functionality
  }
};

/**
 * Securely logs errors without exposing sensitive data
 * @param {Error} error - Error object
 * @param {Object} context - Additional context (will be sanitized)
 */
export const logError = (error, context = {}) => {
  const sanitizedContext = Object.keys(context).reduce((acc, key) => {
    const value = context[key];
    // Mask potential API keys or tokens
    if (typeof value === 'string' && (
      key.toLowerCase().includes('key') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('secret') ||
      value.length > 30
    )) {
      acc[key] = '***REDACTED***';
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  console.error('[Security Log]', {
    message: error.message,
    timestamp: new Date().toISOString(),
    context: sanitizedContext,
    // In production, send to monitoring service
  });
};

/**
 * Content Security Policy headers helper
 * Use this configuration in your deployment
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://www.youtube.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:", "https://i.ytimg.com"],
  'font-src': ["'self'", "data:"],
  'connect-src': ["'self'", "https://www.googleapis.com", "https://www.youtube.com"],
  'frame-src': ["https://www.youtube.com"],
  'media-src': ["'self'", "https://www.youtube.com"],
};

/**
 * Generate CSP header string
 * @returns {string} CSP header value
 */
export const generateCSPHeader = () => {
  return Object.entries(CSP_CONFIG)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};
