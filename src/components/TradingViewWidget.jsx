import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ height = '60vh', fullWidth = false, lazy = false }) {
  const container = useRef();
  const loadedRef = useRef(false);
  const observerRef = useRef(null);

  const insertWidget = () => {
    if (!container.current || loadedRef.current) return;
    loadedRef.current = true;

    // Clear any existing children to avoid duplicate charts when remounting
    try {
      container.current.innerHTML = '';
    } catch (e) {}

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "BITSTAMP:BTCUSD",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "width": "100%",
        "height": "100%"
      }
    `;

    container.current.appendChild(script);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If not lazy, insert immediately
    if (!lazy) {
      insertWidget();
      return () => {
        try { container.current && (container.current.innerHTML = ''); } catch (e) {}
      };
    }

    // Lazy: observe and insert when container scrolls into view
    if (!container.current) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          insertWidget();
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }
      });
    }, { root: null, rootMargin: '200px', threshold: 0.1 });

    observerRef.current.observe(container.current);

    return () => {
      try { if (observerRef.current) observerRef.current.disconnect(); } catch (e) {}
      try { container.current && (container.current.innerHTML = ''); } catch (e) {}
    };
  }, [lazy]);

  // When fullWidth is requested we use a positioning trick that counters any
  // parent container padding so the widget truly spans the viewport and is
  // visually centered. This is more robust than relying on calc(50% - 50vw)
  // when the parent has transforms or padding.
  const wrapperStyle = fullWidth
    ? {
        height,
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }
    : { height, width: '100%' };

  // Provide a lightweight placeholder that will be replaced when the script injects
  return (
    <div className="tradingview-widget-container" ref={container} style={wrapperStyle}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!loadedRef.current && (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        )}
      </div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BTCUSD/?exchange=BITSTAMP" rel="noopener nofollow" target="_blank"><span className="blue-text">Bitcoin price</span></a><span className="trademark"> by TradingView</span></div>
    </div>
  );
}

export default memo(TradingViewWidget);
