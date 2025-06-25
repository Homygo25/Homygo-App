import React from 'react';
import { Link } from 'react-router-dom';

const PostListingPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Post a Listing</h1>
      <p>This is the form for landlords to post their rental properties.</p>
      <Link to="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default PostListingPage;