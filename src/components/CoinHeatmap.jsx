import React, { useEffect, useState } from 'react';

const CoinHeatmap = ({ perPage = 36, refreshInterval = 60000 }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`
        );
        if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
        const data = await res.json();
        if (mounted) setCoins(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCoins();
    const id = setInterval(fetchCoins, refreshInterval);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [perPage, refreshInterval]);

  const renderTile = (coin) => {
    const change = coin.price_change_percentage_24h ?? 0;
    const intensity = Math.min(Math.abs(change) / 10, 1); // normalize against 10%
    const alpha = 0.15 + intensity * 0.6; // keep visible color
    const bg = change >= 0 ? `rgba(16,185,129,${alpha})` : `rgba(239,68,68,${alpha})`;

    return (
      <a
        key={coin.id}
        href={`https://www.coingecko.com/en/coins/${coin.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-3 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-[1.02]"
        style={{ backgroundColor: bg }}
        aria-label={`${coin.name} ${change.toFixed(2)}%`}
      >
        <div className="text-sm font-bold text-white uppercase">{coin.symbol}</div>
        <div className="text-xs text-white/90">${Number(coin.current_price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div className={`text-sm font-semibold ${change >= 0 ? 'text-white' : 'text-white'}`}>{change >= 0 ? '+' : ''}{change ? change.toFixed(2) : '0.00'}%</div>
      </a>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-4">Cryptocurrency Heat Map</h3>

      {loading && (
        <div className="text-gray-300">Loading heatmap...</div>
      )}

      {error && (
        <div className="text-red-400">
          Error loading heatmap: {error}. You can still open CoinGecko directly.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {coins.map((c) => renderTile(c))}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-400">
        Data powered by CoinGecko API. Tiles refresh every {Math.round(refreshInterval/1000)}s.
      </div>
    </div>
  );
};

export default CoinHeatmap;
