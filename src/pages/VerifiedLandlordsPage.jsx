import React from 'react';
import { Link } from 'react-router-dom';

const VerifiedLandlordsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Verified Landlords</h1>
      <p>This page will feature listings from landlords who have completed the verification process.</p>
      <Link to="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default VerifiedLandlordsPage;