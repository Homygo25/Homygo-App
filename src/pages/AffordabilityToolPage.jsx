import React from 'react';
import { Link } from 'react-router-dom';

const AffordabilityToolPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Affordability Checker</h1>
      <p>This tool will help renters determine their budget.</p>
      <Link to="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default AffordabilityToolPage;