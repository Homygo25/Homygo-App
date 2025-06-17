import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropertyList from '@/components/PropertyList';
import { toast } from '@/components/ui/use-toast';
import { PROPERTY_TYPES } from '@/data/properties'; 
import { BARANGAYS } from '@/data/locations';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const UserListingsPage = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const { type: routeType } = useParams(); 
  
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(locationHook.state?.location || '');
  const [propertyType, setPropertyType] = useState(routeType || locationHook.state?.propertyType || 'All Types');
  const [priceRange, setPriceRange] = useState(locationHook.state?.price || { min: '', max: '' });
  const [showFilters, setShowFilters] = useState(true);

  const fetchAllPropertiesInitially = useCallback(async () => {
    setIsLoading(true);
    console.log("UserListingsPage: Fetching ALL properties from Supabase initially...");
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('featured', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      console.log("UserListingsPage: Initial fetched properties count:", data?.length || 0);
      if(!data || data.length === 0) {
        console.warn("UserListingsPage: No properties found in the database. Please ensure data is seeded.");
        toast({
            title: "No Properties Found",
            description: "There are no properties listed yet. Check back soon or ensure data is seeded in Supabase!",
            variant: "default",
            duration: 7000,
        });
      }
      setAllProperties(data || []);
      setFilteredProperties(data || []); 
    } catch (error) {
      console.error("UserListingsPage: Error fetching initial properties:", error.message);
      toast({
        title: "Failed to Load Properties",
        description: error.message,
        variant: "destructive",
      });
      setAllProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPropertiesInitially();
    const storedFavorites = JSON.parse(localStorage.getItem('homygo-favorites') || '[]');
    setFavorites(storedFavorites);
  }, [fetchAllPropertiesInitially]);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    console.log("UserListingsPage: Performing search with:", { selectedLocation, propertyType: routeType || propertyType, priceRange });

    try {
      let query = supabase.from('properties').select('*');
      const currentType = routeType || propertyType;
      const searchTerm = selectedLocation.trim().toLowerCase();

      if (searchTerm) {
        const searchKeywords = searchTerm.split(' ').map(term => `%${term}%`);
        let orConditions = searchKeywords.map(keyword => `title.ilike.${keyword},location.ilike.${keyword},description.ilike.${keyword}`).join(',');
        query = query.or(orConditions);
      }
      
      if (currentType && currentType !== 'All Types') {
        query = query.ilike('type', `%${currentType}%`);
      }
      if (priceRange.min && !isNaN(parseFloat(priceRange.min))) {
        query = query.gte('price', parseFloat(priceRange.min));
      }
      if (priceRange.max && !isNaN(parseFloat(priceRange.max))) {
        query = query.lte('price', parseFloat(priceRange.max));
      }

      query = query.order('featured', { ascending: false, nullsFirst: false })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      console.log("UserListingsPage: Search results:", data?.length || 0, data);
      setFilteredProperties(data || []);
      if (!data || data.length === 0) {
          toast({ title: "No Matches Found", description: "Try adjusting your search filters."});
      } else {
          toast({ title: "Search Complete!", description: `${data.length} properties found.`});
      }

    } catch (error) {
      console.error("UserListingsPage: Error searching properties:", error.message);
      toast({ title: "Search Error", description: error.message, variant: "destructive" });
      setFilteredProperties([]); // Show empty on error to avoid confusion
    } finally {
      setIsSearching(false);
    }
  }, [selectedLocation, propertyType, priceRange, routeType]);
  
  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem('homygo-favorites', JSON.stringify(newFavorites));
      toast({
        title: newFavorites.includes(propertyId) ? "Added to favorites!" : "Removed from favorites",
      });
      return newFavorites;
    });
  };
  
  const openPropertyDetails = (property) => {
    navigate(`/user/listings/${property.id}`, { state: { property } });
  };

  const handleResetFilters = () => {
    setSelectedLocation('');
    setPropertyType('All Types');
    setPriceRange({ min: '', max: '' });
    setFilteredProperties(allProperties); 
    if (routeType) navigate('/user/listings'); 
    toast({ title: "Filters Reset", description: "Showing all available listings." });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,50px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading properties...</p>
      </div>
    );
  }
  
  if (isSearching) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,50px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Searching for your perfect Homy...</p>
      </div>
    );
  }

  return (
    <PropertyList
      properties={filteredProperties}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      openPropertyDetailsModal={openPropertyDetails}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      selectedLocation={selectedLocation}
      setSelectedLocation={setSelectedLocation}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      propertyType={propertyType}
      setPropertyType={setPropertyType}
      propertyTypesList={PROPERTY_TYPES}
      barangaysList={BARANGAYS}
      handleResetFilters={handleResetFilters}
      isListingsPage={true}
      triggerSearch={performSearch}
    />
  );
};

export default UserListingsPage;