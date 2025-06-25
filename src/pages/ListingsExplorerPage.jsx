import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ListingsExplorerPage = () => {
  const location = useLocation();
  const filters = location.state?.filters;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Listings Explorer</h1>
      <p className="mb-6">This is where the rental listings will be displayed with advanced filters.</p>
      
      {filters && (
        <div className="bg-card p-4 rounded-lg shadow mb-6 border">
          <h2 className="text-xl font-semibold mb-2">AI Search Filters Applied:</h2>
          <pre className="bg-muted p-3 rounded-md text-sm">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
      )}

      <Link to="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default ListingsExplorerPage;