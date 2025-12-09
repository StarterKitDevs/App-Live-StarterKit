import { useEffect, useState, useRef } from 'react';
import CoinGeckoHeatmap from './CoinGeckoHeatmap';
import TradingViewWidget from './TradingViewWidget';
// Replace the video ID below with the YouTube video you want to show
const FEATURE_VIDEO_ID = 'ARRTKwA6dEg';

const MarketDashboard = () => {
  // Ref for marquee widget container
  const marqueeRef = useRef(null);

  useEffect(() => {
    // Inject the CoinGecko script only once
    if (marqueeRef.current && !marqueeRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js';
      script.async = true;
      marqueeRef.current.appendChild(script);

      const widget = document.createElement('gecko-coin-price-marquee-widget');
      widget.setAttribute('locale', 'en');
      widget.setAttribute('coin-ids', 'bitcoin,ethereum,qubit-2,solana,tectum,aave,chainlink,ripple,tron');
      widget.setAttribute('initial-currency', 'usd');
      marqueeRef.current.appendChild(widget);
    }
  }, []);
  const [marketData, setMarketData] = useState([
    { 
      symbol: 'TET', 
      name: 'Tectum',
      tokenAddress: '0x75921196b0ba3d190c438912e55f87f69cc584e8',
      chain: 'ethereum',
      price: '0.00',
      change: '0.0',
      url: 'https://www.coingecko.com/en/coins/tectum'
    },
    { 
      symbol: 'MiT',
      name: 'MiToken',
      tokenAddress: '0xbf45372ad6f9b7a805cbc1ae3aeaa366eeb74da5',
      chain: 'base',
      price: '0.00',
      change: '0.0',
      url: 'https://www.dextools.io/app/en/base/pair-explorer/0xdb90557f4d0697e4ef8a7221a84b4e44262cd7e3?t=1761271579651'
    },
    { 
      symbol: 'AAVE',
      name: 'Aave',
      tokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      chain: 'ethereum',
      price: '0.00',
      change: '0.0',
      url: 'https://www.coingecko.com/en/coins/aave'
    },
    { 
      symbol: 'QBIT',
      name: 'Qubit',
      tokenAddress: '0x17b7163cf1dbd286e262ddc68b553d899b93f526',
      chain: 'bsc',
      price: '0.00',
      change: '0.0',
      url: 'https://www.coingecko.com/en/coins/qubit-2'
    },
    { 
      symbol: 'FLOCKA',
      name: 'Waka Flocka',
      tokenAddress: '0x5344c20fd242545f31723689662ac12b9556fc3d',
      chain: 'ethereum',
      price: '0.00',
      change: '0.0',
      url: 'https://www.coingecko.com/en/coins/waka-flocka'
    },
    { 
      symbol: 'WEALTHY',
      name: 'Wealthy',
      tokenAddress: '0x0000000000000000000000000000000000000000', // Will update with correct address
      chain: 'base',
      price: '0.00',
      change: '0.0',
      url: 'https://www.dextools.io/app/en/base/pair-explorer/0xfeb11a6659814cf10d53d9046a7b4c26d9698a42'
    }
  ]);

  // Chart toggle removed; always show heatmap in the main area and chart at the bottom

  useEffect(() => {
    const fetchPrices = async () => {
      console.log('Fetching new prices...');
      try {
        const prices = await Promise.all(
          marketData.map(async (token) => {
            try {
              console.log(`Fetching ${token.symbol} data...`);
              
              // First try to get token data by address
              const response = await fetch(
                `https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`,
                {
                  headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                  }
                }
              );
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              const data = await response.json();
              console.log(`${token.symbol} data:`, data);
              
              // Get the best pair by volume
              let bestPair = null;
              if (data.pairs && data.pairs.length > 0) {
                bestPair = data.pairs
                  .filter(pair => pair.chainId === token.chain)
                  .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
              }

              if (bestPair) {
                return {
                  symbol: token.symbol,
                  price: bestPair.priceUsd,
                  change: bestPair.priceChange?.h24 || '0.00',
                  volume24h: bestPair.volume?.h24 || '0'
                };
              }

              // If no data found by address, try searching by symbol
              const searchResponse = await fetch(
                `https://api.dexscreener.com/latest/dex/search/?q=${token.symbol}`,
                {
                  headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                  }
                }
              );

              const searchData = await searchResponse.json();
              console.log(`${token.symbol} search data:`, searchData);

              if (searchData.pairs && searchData.pairs.length > 0) {
                const relevantPair = searchData.pairs
                  .filter(pair => 
                    pair.chainId === token.chain && 
                    (pair.baseToken.symbol === token.symbol || pair.quoteToken.symbol === token.symbol)
                  )
                  .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];

                if (relevantPair) {
                  return {
                    symbol: token.symbol,
                    price: relevantPair.priceUsd,
                    change: relevantPair.priceChange?.h24 || '0.00',
                    volume24h: relevantPair.volume?.h24 || '0'
                  };
                }
              }
              
              console.log(`No data found for ${token.symbol}`);
              return null;
            } catch (err) {
              console.error(`Error fetching ${token.symbol}:`, err);
              return null;
            }
          })
        );

        // Filter out null values and update market data
        const validPrices = prices.filter(price => price !== null);
        console.log('Valid prices:', validPrices);

        if (validPrices.length > 0) {
          setMarketData(prevData => 
            prevData.map(token => {
              const priceData = validPrices.find(p => p.symbol === token.symbol);
              if (priceData) {
                console.log(`Updating ${token.symbol} with:`, priceData);
                return {
                  ...token,
                  price: priceData.price,
                  change: priceData.change,
                  volume24h: priceData.volume24h
                };
              }
              return token;
            })
          );
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    // Initial fetch
    fetchPrices();

    // Set up interval for updates (every 10 seconds)
    const interval = setInterval(fetchPrices, 10000);

    // Cleanup interval on component unmount
    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="md:text-6xl sm:text-4xl text-2xl font-bold text-center text-white mb-3">Current Market Dashboard</h2>
          <p className="md:text-2xl sm:text-xl px-4 font-medium text-center text-gray-400">Education On-Demand | 24/7 Community</p>

          <div className="grid grid-cols-3 md:max-w-[600px] max-w-[400px] gap-2 mx-auto md:mt-10 sm:mt-5 mt-3 px-2">
            <a className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold" href="http://localhost:5173/">Home</a>
            <a className="md:text-lg text-sm truncate sm:flex sm:items-center sm:justify-center rounded-md p-2 bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold" href="https://www.youtube.com/@GetStarterKit" target="_blank" rel="noopener noreferrer">Subscribe</a>
            <a className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold" href="https://basedrop.fun" target="_blank" rel="noopener noreferrer">Basedop</a>
          </div>
        </div>

        {/* Toggle removed: heatmap is shown here by default */}
      </div>

      {/* CoinGecko price marquee widget above heatmap, no space in between */}
      <div className="w-full max-w-7xl mx-auto p-4">
        <div ref={marqueeRef} />
        <CoinGeckoHeatmap locale="en" darkMode={true} top={50} />
      </div>

      {/* TradingView chart now directly below the heatmap */}
      {typeof window !== 'undefined' && (
        <div className="w-full" style={{ background: 'transparent' }}>
          <div className="w-full max-w-7xl mx-auto p-4">
            {/* Parent controls height responsively; widget fills 100% of this container */}
            <div className="h-[40vh] md:h-[60vh]">
              <TradingViewWidget height="100%" fullWidth={false} lazy={true} />
            </div>
          </div>
        </div>
      )}

      {/* Feature video section (adds a large responsive YouTube embed at the bottom) */}
      <div className="w-full bg-black">
        <div className="w-full max-w-7xl mx-auto p-4 py-12">
          <div className="text-center mb-6">
            <h3 className="text-white text-3xl md:text-5xl font-bold">StarterKit Ecosystem</h3>
            <p className="text-gray-400 mt-2">Education On-Demand | 24/7 Community</p>
          </div>

          {/* Responsive iframe wrapper */}
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              title="StarterKit Feature Video"
              src={`https://www.youtube.com/embed/${FEATURE_VIDEO_ID}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-6 text-center">
            <a href={`https://www.youtube.com/watch?v=${FEATURE_VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white">
              Watch on YouTube
            </a>
          </div>
        </div>
        {/* Token tiles grid below the YouTube video */}
        <div className="w-full max-w-7xl mx-auto p-4">
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marketData.map((coin) => (
              <a
                key={coin.symbol}
                href={coin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="flex flex-col items-center p-6">
                  <h3 className="text-white font-bold text-xl tracking-wide">${coin.symbol}</h3>
                  {/* price removed as requested */}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketDashboard;