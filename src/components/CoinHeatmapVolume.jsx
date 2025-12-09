import React, { useEffect, useState } from 'react';

// Clean Coin360-like heatmap implementation
const CoinHeatmapVolume = ({ perPage = 72, refreshInterval = 60000, maxSpan = 8 }) => {
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

  const metrics = coins.map(c => (c.market_cap || c.total_volume || 0));
  const logMetrics = metrics.map(m => Math.log10((m || 1)));
  const minLog = logMetrics.length ? Math.min(...logMetrics) : 0;
  const maxLog = logMetrics.length ? Math.max(...logMetrics) : 1;

  const getSpan = (metric) => {
    const log = Math.log10((metric || 1));
    if (maxLog === minLog) return Math.ceil(maxSpan / 3);
    const ratio = (log - minLog) / (maxLog - minLog);
    return Math.max(1, Math.round(ratio * (maxSpan - 1)) + 1);
  };

  const renderTile = (coin) => {
    const change = coin.price_change_percentage_24h ?? 0;
    const intensity = Math.min(Math.abs(change) / 10, 1);
    const alpha = 0.22 + intensity * 0.72;
    const bg = change >= 0 ? `rgba(16,185,129,${alpha})` : `rgba(239,68,68,${alpha})`;
    const metric = coin.market_cap || coin.total_volume || 0;
    const span = getSpan(metric);

    return (
      <a
        key={coin.id}
        href={`https://www.coingecko.com/en/coins/${coin.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden rounded-sm text-white transition-transform transform hover:scale-[1.02]"
        style={{
          backgroundColor: bg,
          gridColumnEnd: `span ${span}`,
          gridRowEnd: `span ${span}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px'
        }}
      >
        <div className="text-center pointer-events-none">
          <div className="text-sm font-bold uppercase tracking-wide">{coin.symbol}</div>
          <div className="text-xs mt-1">{change >= 0 ? '+' : ''}{change ? change.toFixed(2) : '0.00'}%</div>
        </div>

        <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/70 text-white p-3 flex flex-col justify-center items-center text-center transition-opacity">
          <div className="font-bold text-sm">{coin.name}</div>
          <div className="text-xs mt-1">${Number(coin.current_price).toLocaleString()}</div>
          <div className="text-xs mt-1">24h: {change >= 0 ? '+' : ''}{change ? change.toFixed(2) : '0.00'}%</div>
          <div className="text-xs mt-1">Vol: {Number(coin.total_volume || 0).toLocaleString()}</div>
          <div className="text-xs mt-1">Mkt Cap: {coin.market_cap ? Number(coin.market_cap).toLocaleString() : '—'}</div>
        </div>
      </a>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-4">Cryptocurrency Heat Map — Coin360 style (sized by market cap/volume)</h3>

      {loading && <div className="text-gray-300">Loading heatmap...</div>}
      {error && <div className="text-red-400">Error loading heatmap: {error}</div>}

      {!loading && !error && (
        <div
          className="grid gap-[4px]"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: '16px',
            gridAutoFlow: 'dense'
          }}
        >
          {coins.map(c => renderTile(c))}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-400">Data powered by CoinGecko API. Tiles sized by market cap (fallback: volume). Refreshes every {Math.round(refreshInterval/1000)}s.</div>
    </div>
  );
};

export default CoinHeatmapVolume;

