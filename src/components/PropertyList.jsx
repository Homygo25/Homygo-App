import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const PropertyList = ({ 
  properties, 
  favorites, 
  toggleFavorite, 
  openPropertyDetailsModal,
  showFilters, 
  setShowFilters, 
  selectedLocation, 
  setSelectedLocation,
  propertyType,
  setPropertyType,
  priceRange,
  setPriceRange,
  propertyTypesList,
  barangaysList,
  handleResetFilters,
  isHomePage = false,
  isListingsPage = false,
  triggerSearch
}) => {

  const handleSearchButtonClick = () => {
    if(triggerSearch) triggerSearch();
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-background via-background/95 to-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-0"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isHomePage ? "Featured Properties" : "Available Properties"}
            </h2>
            {!isHomePage && (
              <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm">
                Showing {properties.length} properties
                {selectedLocation && selectedLocation.trim() !== '' && ` matching "${selectedLocation}"`}
                {(propertyType && propertyType !== 'All Types') && ` of type ${propertyType}`}
              </p>
            )}
             {isHomePage && (
              <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm">
                A glimpse of what Homygo offers. Use search for more!
              </p>
            )}
          </motion.div>

          {isListingsPage && (
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="filter-button border-primary text-primary hover:bg-primary/10 self-start md:self-center min-h-[40px] sm:min-h-[44px] px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2"
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isListingsPage && showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 sm:mb-8 p-4 sm:p-6 bg-card/80 backdrop-blur-lg rounded-xl shadow-xl border border-border/30"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="filter-location">Location/Keyword</Label>
                  <Input 
                    id="filter-location" 
                    placeholder="e.g., Lapasan, Condo Title" 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-input border-border focus:ring-primary text-foreground min-h-[44px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="filter-property-type">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger id="filter-property-type" className="min-h-[44px] bg-input border-border focus:ring-primary text-foreground">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      {propertyTypesList.map(type => (
                        <SelectItem key={type} value={type} className="hover:bg-accent focus:bg-accent">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2 space-y-1.5 items-end">
                  <div>
                    <Label htmlFor="filter-min-price">Min Price (PHP)</Label>
                    <Input 
                      id="filter-min-price" 
                      type="number" 
                      placeholder="e.g., 5000" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                      className="bg-input border-border focus:ring-primary text-foreground min-h-[44px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="filter-max-price">Max Price (PHP)</Label>
                    <Input 
                      id="filter-max-price" 
                      type="number" 
                      placeholder="e.g., 20000" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                      className="bg-input border-border focus:ring-primary text-foreground min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-end md:col-span-1 lg:col-span-1 pt-4 sm:pt-0">
                    <Button 
                      variant="outline" 
                      onClick={handleResetFilters}
                      className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive min-h-[44px]"
                    >
                        Reset
                    </Button>
                    <Button 
                      onClick={handleSearchButtonClick}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground min-h-[44px]"
                    >
                        <Search className="w-4 h-4 mr-2"/>
                        Search
                    </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {properties.length > 0 ? (
            <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-xl border border-border/30 p-4 sm:p-6">
              <motion.div
                className={`grid grid-cols-1 ${isHomePage ? "md:grid-cols-2 lg:grid-cols-3" : "gap-y-6 sm:gap-y-8"} gap-4 sm:gap-6 md:gap-8`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {properties.map((property, index) => (
                   <div key={property.id || `prop-${index}`} className={isHomePage ? "" : "w-full md:w-3/4 lg:w-2/3 mx-auto"}>
                      <PropertyCard
                      property={property}
                      isFavorite={favorites.includes(property.id)}
                      toggleFavorite={toggleFavorite}
                      openPropertyDetailsModal={() => openPropertyDetailsModal(property)}
                      index={index}
                      />
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-16 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/20"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                 We couldn't find any properties matching your current filters.
              </p>
              {!isHomePage && (
                <Button
                  onClick={handleResetFilters}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground min-h-[44px] px-4 py-2 text-sm sm:text-base"
                >
                  Reset Filters & Explore All
                </Button>
              )}
               {isHomePage && (
                <Button
                  onClick={() => {
                    if (handleResetFilters) handleResetFilters(); 
                  }}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground min-h-[44px] px-4 py-2 text-sm sm:text-base"
                >
                  Explore All Listings
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PropertyList;