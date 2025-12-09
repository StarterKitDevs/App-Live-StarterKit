import React, { useEffect, useState, useRef } from 'react';

// Wrapper component to load CoinGecko heatmap widget script and render the custom element
const SCRIPT_SRC = 'https://widgets.coingecko.com/gecko-coin-heatmap-widget.js';

const CoinGeckoHeatmap = ({ locale = 'en', darkMode = true, top = 50 }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // If script already present, mark loaded (widget registers itself globally on load)
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      // If script already loaded, still set loaded true after a short tick
      try {
        if ((existing.dataset && existing.dataset.loaded === 'true') || existing.getAttribute('data-loaded') === 'true') {
          setLoaded(true);
          return;
        }
      } catch (e) {
        // ignore
      }
      // attach load listener
      existing.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    // mark when loaded
    script.onload = () => {
      try { script.setAttribute('data-loaded', 'true'); } catch (e) {}
      setLoaded(true);
    };
    script.onerror = () => {
      // still set loaded to allow fallback UI to show
      setLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // keep script in DOM for reuse; we don't remove it to avoid reloading when navigating.
    };
  }, []);

  const containerRef = useRef(null);

  // When the widget script is loaded, create and append the custom element with attributes
  useEffect(() => {
    if (!loaded) return;
    if (!containerRef.current) return;

    // create the element and set attributes (avoid using JSX attribute names with hyphens)
    const el = document.createElement('gecko-coin-heatmap-widget');
    el.setAttribute('locale', locale);
    el.setAttribute('dark-mode', darkMode ? 'true' : 'false');
    el.setAttribute('top', String(top));

    // replace any existing children
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);

    return () => {
      // cleanup element when unmounting or when attrs change
      try { containerRef.current && (containerRef.current.innerHTML = ''); } catch (e) {}
    };
  }, [loaded, locale, darkMode, top]);

  return (
  <div>
      {!loaded && (
        <div className="text-gray-300">Loading widget…</div>
      )}

      {/* Render the custom element. The widget will hydrate it when script loads. */}
  <div style={{ width: '100%' }} className="mt-3" ref={containerRef} />
    </div>
  );
};

export default CoinGeckoHeatmap;
