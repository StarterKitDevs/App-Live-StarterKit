

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const GlossaryTerm = () => {
  const { term: termParam } = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!termParam) {
      setError('No term specified.');
      setLoading(false);
      return;
    }
    fetch('/data/glossary.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(t => t.name.toLowerCase() === decodeURIComponent(termParam).toLowerCase());
        setTerm(found);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load glossary.');
        setLoading(false);
      });
  }, [termParam]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading term...</div>;
  }
  if (error || !term) {
    return <div className="text-center py-20 text-red-400">{error || 'Term not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2">{term.name}</h1>
        <div className="mb-4 text-gray-400">{term.category}</div>
        <p className="text-lg text-gray-200 mb-6">{term.definition}</p>
        <button
          className="mt-8 text-blue-400 underline"
          onClick={() => navigate('/glossary')}
        >
          ← Back to Directory
        </button>
      </div>
    </div>
  );
};

export default GlossaryTerm;
