// YouTube Search API endpoint for Vercel serverless function
export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query required' });
  }

  const CHANNEL_ID = 'UCBdWQ1bvfUWXCz6je9Ep7wg'; // @GetStarterKit channel
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error('YouTube API key not found in environment variables');
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${CHANNEL_ID}&q=${encodeURIComponent(q)}&maxResults=10&order=relevance&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
}
