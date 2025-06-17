
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Bed, Bath, Square, Heart, Building, Info, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const StarRating = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 dark:text-gray-600" />
      ))}
      <span className="text-xs sm:text-sm font-medium text-muted-foreground ml-1.5">({rating ? rating.toFixed(1) : 'N/A'})</span>
    </div>
  );
};


const PropertyCard = ({ property, isFavorite, toggleFavorite, openPropertyDetailsModal, index }) => {
  
  const handleBookNowClick = (e) => {
    e.stopPropagation(); 
    if (property.availabilityStatus === "Available") {
      openPropertyDetailsModal(property); 
    } else {
      toast({
        title: "Property Unavailable",
        description: `"${property.title}" is currently ${property.availabilityStatus?.toLowerCase()} and cannot be booked.`,
        variant: "destructive",
      });
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    openPropertyDetailsModal(property);
  };

  const propertyTypeDisplay = property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : (property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'N/A');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="property-card glass-effect rounded-xl overflow-hidden shadow-lg border border-border flex flex-col h-full cursor-pointer hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300"
      onClick={handleDetailsClick} 
    >
      {property.featured && (
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 text-xs font-semibold absolute top-0 left-0 m-2 rounded-full z-10">
          Featured
        </div>
      )}

      <div className="relative">
        <img  
          className="w-full h-48 sm:h-56 object-cover"
          alt={`${property.title} - ${propertyTypeDisplay} in ${property.location}`}
           src={property.image_paths && property.image_paths.length > 0 ? property.image_paths[0] : "https://images.unsplash.com/photo-1595872018818-97555653a011"} />
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id);}}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full bg-card/90 hover:bg-card transition-colors shadow-md min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center z-20"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground hover:text-red-400'}`}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 leading-tight flex-1 mr-2">
            {property.title}
          </h3>
          <div className="ml-2 flex-shrink-0">
            <StarRating rating={property.rating || 0} />
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-1 text-xs sm:text-sm">
          <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 flex-shrink-0 text-primary" />
          <span>{propertyTypeDisplay}</span>
          {property.brand && (
            <>
              <span className="mx-1">|</span>
              <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 flex-shrink-0 text-accent" />
              <span>{property.brand}</span>
            </>
          )}
        </div>

        <div className="flex items-center text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0 text-primary" />
          <span>{property.location}</span>
        </div>


        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-grow">
          {property.description}
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 border-t border-b border-border py-2 sm:py-3">
          <div className="flex items-center">
            <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-primary" />
            {property.bedrooms || 'N/A'} Beds
          </div>
          <div className="flex items-center">
            <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-primary" />
            {property.bathrooms || 'N/A'} Baths
          </div>
          <div className="flex items-center">
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-primary" />
            {property.area_sqm || 'N/A'} m²
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div>
            <span className="text-lg sm:text-xl font-bold text-primary">
              ₱{property.price ? property.price.toLocaleString() : 'N/A'}
            </span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            property.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' :
            property.availabilityStatus === 'Booked' ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'
          }`}>
            {property.availabilityStatus || 'Unknown'}
          </span>
        </div>


        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
            onClick={handleDetailsClick}
          >
            <Info className="w-3.5 h-3.5 mr-1.5" />
            View Details
          </Button>
          <Button
            size="sm"
            className={`flex-1 text-primary-foreground min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm ${property.availabilityStatus === "Available" ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" : "bg-muted hover:bg-muted/90 cursor-not-allowed"}`}
            onClick={handleBookNowClick}
            disabled={property.availabilityStatus !== "Available"}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
