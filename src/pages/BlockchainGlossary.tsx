/**
 * BlockchainGlossary.tsx
 * MIT License. Uses only React and Fuse.js (MIT).
 * Data structure inspired by block-foundation/glossary (MIT).
 * All data is local and public domain.
 */
import React, { useState, useMemo, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import glossaryDataRaw from "./glossaryData.json";
import styles from "./BlockchainGlossary.module.css";
import { motion, AnimatePresence } from "framer-motion";

// Deduplicate terms by lowercase
const glossaryData = Array.from(
  new Map(
    glossaryDataRaw.map((item) => [item.term.toLowerCase(), item])
  ).values()
);

const categories = Array.from(
  new Set(glossaryData.map((t) => t.category))
).sort();

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const fuse = new Fuse(glossaryData, {
  keys: ["term", "definition"],
  threshold: 0.3,
  includeScore: true,
});

export default function BlockchainGlossary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [results, setResults] = useState(glossaryData);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);

  // Voice input
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
    };
    recognition.start();
  };

  // Search/filter logic
  useEffect(() => {
    setLoading(true);
    let filtered = glossaryData;
    if (category) filtered = filtered.filter((t) => t.category === category);
    if (activeLetter)
      filtered = filtered.filter((t) =>
        t.term.toUpperCase().startsWith(activeLetter)
      );
    if (query) {
      const fuseResults = fuse.search(query).map((r) => r.item);
      filtered = filtered.filter((t) => fuseResults.includes(t));
    }
    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
    }, 300);
  }, [query, category, activeLetter]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        searchBarRef.current?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
      {/* Search Bar */}
      <motion.div
        className="fixed top-0 left-0 w-full z-50 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(30,30,30,0.9)" }}
      >
        <div className="w-full max-w-2xl flex items-center p-2">
          <input
            ref={searchBarRef}
            aria-label="Search glossary"
            className="flex-1 rounded-l px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white outline-none"
            placeholder="Search blockchain terms (try 'smart contract' or 'DeFi')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            aria-label="Voice search"
            className="bg-blue-500 text-white px-3 py-2 rounded-r"
            onClick={handleVoice}
          >
            🎤
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mt-20 flex flex-wrap gap-2 justify-center">
        <select
          aria-label="Filter by category"
          className="rounded px-3 py-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-1 flex-wrap">
          {alphabet.map((l) => (
            <button
              key={l}
              aria-label={`Filter by ${l}`}
              className={`px-2 py-1 rounded ${activeLetter === l ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              onClick={() => setActiveLetter(l === activeLetter ? "" : l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Spinner */}
      {loading && (
        <div className={styles.spinner}>
          <svg className="animate-spin w-8 h-8 text-blue-500 mx-auto my-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          No results. Try "smart contract" or "DeFi".
        </div>
      )}

      {/* Glossary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <AnimatePresence>
          {results.map((item) => (
            <motion.div
              key={item.term}
              className={styles.glossaryCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              tabIndex={0}
              aria-label={item.term}
            >
              <div className="font-bold text-lg">{item.term}</div>
              <div className="text-xs text-gray-400 mb-2">{item.category}</div>
              <div className="text-gray-700 dark:text-gray-200 mb-2">
                {expanded === item.term
                  ? item.definition
                  : item.definition.split(" ").slice(0, 18).join(" ") + (item.definition.split(" ").length > 18 ? "..." : "")}
              </div>
              <button
                className={styles.readMore}
                aria-expanded={expanded === item.term}
                onClick={() => setExpanded(expanded === item.term ? null : item.term)}
              >
                {expanded === item.term ? "Show Less" : "Read More"}
              </button>
              {/* Related carousel */}
              {item.related && item.related.length > 0 && (
                <div className={styles.carousel} aria-label="Related terms">
                  {item.related.map((rel) => (
                    <span key={rel} className={styles.carouselItem}>{rel}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
