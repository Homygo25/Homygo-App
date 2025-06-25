import React from 'react';
import PropertyCard from '@/components/PropertyCard';

const PropertyListSection = ({
  title,
  properties,
  loading,
  isCarousel = false,
  openPropertyDetails,
  toggleFavorite,
  favorites,
  showEmptyMessage = true,
}) => {
  return (
    <section className={`mb-10 sm:mb-12 ${isCarousel ? '' : 'px-4 sm:px-0'}`}>
      <h2 className={`text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4 ${isCarousel ? 'px-4 sm:px-0' : ''}`}>{title}</h2>
      {loading && properties.length === 0 ? (
        <div className={`grid ${isCarousel ? 'grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 px-4 sm:px-0 no-scrollbar' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'}`}>
          {[...Array(4)].map((_, i) => (<div key={i} className={`h-72 bg-muted rounded-xl animate-pulse ${isCarousel ? 'w-64 sm:w-72 flex-shrink-0' : ''}`}></div>))}
        </div>
      ) : properties.length > 0 ? (
        <div className={`grid ${isCarousel ? 'grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 px-4 sm:px-0 no-scrollbar' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'}`}>
          {properties.map((property, idx) => (
            <div key={property.id || `prop-${idx}`} className={isCarousel ? 'w-64 sm:w-72 flex-shrink-0' : ''}>
              <PropertyCard property={property} index={idx} openPropertyDetailsModal={openPropertyDetails} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(property.id)} />
            </div>
          ))}
        </div>
      ) : (
        showEmptyMessage && <p className={`text-muted-foreground ${isCarousel ? 'px-4 sm:px-0' : ''}`}>No properties found for this section yet. Check back soon!</p>
      )}
    </section>
  );
};

export default PropertyListSection;