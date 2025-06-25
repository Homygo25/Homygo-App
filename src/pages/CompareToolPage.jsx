import React from 'react';
import { Link } from 'react-router-dom';

const CompareToolPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Rental Comparison Tool</h1>
      <p>This tool will allow users to compare up to 3 listings side-by-side.</p>
      <Link to="/listings" className="text-primary hover:underline">
        &larr; Back to Listings
      </Link>
    </div>
  );
};

export default CompareToolPage;