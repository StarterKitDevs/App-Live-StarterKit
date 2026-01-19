import React from 'react';

const Docs = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg text-gray-300 mb-4">Welcome to the StarterKit documentation page.</p>
      <ul className="list-disc pl-6 text-gray-200">
        <li>How to use StarterKit</li>
        <li>Glossary Terms</li>
        <li>Membership Features</li>
        <li>Contact & Support</li>
      </ul>
    </div>
  );
};

export default Docs;
