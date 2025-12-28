import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlossaryDirectory = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/glossary.json')
      .then((res) => res.json())
      .then((data) => {
        setTerms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load glossary.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading glossary...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Blockchain Glossary Index</h1>
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
        <ul className="divide-y divide-gray-700">
          {terms.map((term) => (
            <li key={term.id} className="py-4">
              <button
                className="text-left w-full hover:text-orange-400 focus:text-orange-400 transition-colors"
                onClick={() => navigate(`/glossary/${encodeURIComponent(term.name)}`)}
              >
                <span className="font-semibold text-lg">{term.name}</span>
                {term.category && (
                  <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">{term.category}</span>
                )}
                <div className="text-gray-400 text-sm mt-1">{term.definition}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GlossaryDirectory;
