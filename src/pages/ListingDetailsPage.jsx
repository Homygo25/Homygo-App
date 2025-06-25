import React from 'react';
import { Link } from 'react-router-dom';

const ListingDetailsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Listing Details</h1>
      <p>This page will show the full details of a single rental property.</p>
      <Link to="/listings" className="text-primary hover:underline">
        &larr; Back to Listings
      </Link>
    </div>
  );
};

export default ListingDetailsPage;