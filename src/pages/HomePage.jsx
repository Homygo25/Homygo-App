
import React from 'react';
import HeroSection from '@/components/HeroSection';
import PropertyList from '@/components/PropertyList';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const HomePage = ({
  selectedLocation,
  setSelectedLocation,
  priceRange, 
  setPriceRange, 
  propertyType,
  setPropertyType,
  handleSearch,
  barangays,
  propertyTypesList,
  properties,
  favorites,
  toggleFavorite,
  handleContact,
  handleResetFilters,
  searchMode, 
  setSearchMode,
}) => {
  const { isAuthenticated, loading: authLoading, userRole } = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (userRole === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/user/listings" replace />;
  }

  return (
    <>
      <HeroSection
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        priceRange={priceRange} 
        setPriceRange={setPriceRange} 
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        handleSearch={handleSearch}
        barangays={barangays}
        propertyTypesList={propertyTypesList}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />
      <PropertyList
        properties={properties}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleContact={handleContact}
        showFilters={false} 
        setShowFilters={() => {}} 
        selectedLocation={selectedLocation}
        propertyType={propertyType}
        handleResetFilters={handleResetFilters}
        isHomePage={true}
      />
    </>
  );
};

export default HomePage;
