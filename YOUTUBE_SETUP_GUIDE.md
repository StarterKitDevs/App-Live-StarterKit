# YouTube Video Gallery Setup Guide

## Overview
A custom video gallery page with Netflix-style layout that pulls videos from your YouTube channel using the YouTube Data API v3.

## Features
- ✨ Netflix-style grid layout
- 🎬 Fetches latest videos from your YouTube channel
- 📱 Fully responsive design
- 🎨 Beautiful hover effects and animations
- 🔗 Click-through to YouTube for full viewing experience
- 📊 Channel statistics display
- 🎯 Direct subscribe call-to-action

## Setup Instructions

### 1. Get YouTube API Credentials

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "My YouTube Video Gallery")
4. Click "Create"

#### Step 2: Enable YouTube Data API v3
1. In your project, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

#### Step 3: Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy your API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
4. (Recommended) Click "Restrict Key" to add security:
   - Under "API restrictions," select "Restrict key"
   - Check "YouTube Data API v3"
   - Under "Application restrictions," you can restrict by HTTP referrers (your domain)
   - Click "Save"

### 2. Find Your YouTube Channel ID

#### Method 1: Advanced Account Settings
1. Go to [YouTube](https://www.youtube.com/)
2. Click your profile icon → "Settings"
3. Click "Advanced settings"
4. Your Channel ID will be displayed there

#### Method 2: From Channel URL
1. Go to your YouTube channel
2. Click on "Customize channel"
3. The URL will look like: `https://www.youtube.com/channel/UC...`
4. The part after `/channel/` is your Channel ID (starts with "UC")

#### Method 3: Using YouTube Studio
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click "Settings" (gear icon)
3. Click "Channel" → "Advanced settings"
4. Your Channel ID will be displayed

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxx
   ```

### 4. Access the Video Gallery

Navigate to `/videos` in your application:
```
http://localhost:5173/videos
```

## Usage

### Adding Navigation Link
Update your Nav component to include a link to the videos page:

```jsx
import { Link } from 'react-router-dom';

// Inside your Nav component:
<Link to="/videos" className="nav-link">
  Videos
</Link>
```

### Customization Options

#### Modify Number of Videos
In `src/pages/Videos.jsx`, change the `MAX_RESULTS` constant:
```jsx
const MAX_RESULTS = 24; // Change this number (max: 50 per request)
```

#### Adjust Grid Layout
In `src/pages/Videos.jsx`, modify the grid classes:
```jsx
// Current: 4 columns on XL screens, 3 on LG, 2 on SM, 1 on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Example: More columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
```

#### Change Video Order
Modify the `order` parameter in the API request:
- `date` - Newest first (default)
- `viewCount` - Most views first
- `rating` - Highest rated first
- `title` - Alphabetically

```jsx
// In fetchVideos function:
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=${MAX_RESULTS}&type=video`
);
```

## Troubleshooting

### Error: "API Key is missing"
- Make sure your `.env` file exists in the root directory
- Verify the variable names start with `VITE_`
- Restart your development server after creating/modifying `.env`

### Error: "Quota exceeded"
YouTube Data API has daily quotas:
- Default: 10,000 units per day
- Each video search costs ~100 units
- Monitor usage in Google Cloud Console

### Videos Not Showing
1. Check that your Channel ID is correct
2. Verify your channel has public videos
3. Check browser console for error messages
4. Ensure API key has YouTube Data API v3 enabled

### Styling Issues
- Make sure Tailwind CSS is properly configured
- Check that all dependencies are installed
- Clear browser cache

## API Quota Management

Each API call uses quota units:
- Search: ~100 units
- Channel info: ~3 units
- Daily limit: 10,000 units

To reduce quota usage:
- Implement caching (localStorage/sessionStorage)
- Reduce MAX_RESULTS value
- Add pagination instead of loading all videos at once

## Security Notes

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Restrict your API key** in Google Cloud Console to your domain
3. **Monitor API usage** to prevent unauthorized access
4. Consider implementing rate limiting for production

## Support

For issues with:
- **YouTube API**: [YouTube API Documentation](https://developers.google.com/youtube/v3)
- **Google Cloud**: [Cloud Console Support](https://console.cloud.google.com/support)
- **This Implementation**: Check the component code comments

## Files Created

- `src/pages/Videos.jsx` - Main video gallery page
- `src/components/VideoCard.jsx` - Individual video card component
- Updated `src/App.jsx` - Added routing for /videos
- Updated `.env.example` - Environment variable template

## Live Demo

Visit your application and navigate to:
- **Local**: http://localhost:5173/videos
- **Production**: https://yourdomain.com/videos
