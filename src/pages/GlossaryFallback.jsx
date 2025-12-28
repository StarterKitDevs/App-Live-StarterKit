import React from 'react';

const GlossaryFallback = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
    <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-2xl w-full text-center">
      <h1 className="text-4xl font-bold mb-4">Glossary</h1>
      <p className="text-lg text-gray-200 mb-6">Select a term from the directory or search bar to view its details.</p>
    </div>
  </div>
);

export default GlossaryFallback;
