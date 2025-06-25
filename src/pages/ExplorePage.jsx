import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Search, Home, Briefcase, MessageSquare, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { BARANGAYS } from '@/data/locations';
import ExploreHeader from '@/components/explore/ExploreHeader';
import ExploreFilters from '@/components/explore/ExploreFilters';
import PropertyListSection from '@/components/explore/PropertyListSection';
import { AIChatbox } from '@/components/AIChatbox';

const propertyTypesList = ['All Types', 'Apartment', 'House', 'Condo', 'Hotel', 'Inn', 'Room', 'Boarding House', 'Townhouse', 'Penthouse', 'Commercial Space', 'Lot Only'];
const cdoBarangays = BARANGAYS.map(b => b.name).filter(name => name !== 'All Locations' && !name.includes('(Sample Other City)'));

const OwnerExploreView = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center my-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Owner Hub</h1>
      <p className="text-muted-foreground">Quick actions for your properties.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <Button size="lg" className="h-20 text-lg flex-col bg-primary hover:bg-primary/90" onClick={() => navigate('/owner/properties/create')}>
          <Home className="w-6 h-6 mb-1" /> Add Property
        </Button>
        <Button size="lg" variant="outline" className="h-20 text-lg flex-col border-primary text-primary hover:bg-primary/10" onClick={() => navigate('/owner/dashboard')}>
          <Briefcase className="w-6 h-6 mb-1" /> My Listings
        </Button>
        <Button size="lg" variant="outline" className="h-20 text-lg flex-col" onClick={() => toast({ title: "🚧 Inquiries Coming Soon!" })}>
          <MessageSquare className="w-6 h-6 mb-1" /> Inquiries
        </Button>
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [activeCategory, setActiveCategory] = useState('homes');
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [popularProperties, setPopularProperties] = useState([]);
  const [availableWeekendProperties, setAvailableWeekendProperties] = useState([]);
  const [barangaySpotlightProperties, setBarangaySpotlightProperties] = useState([]);
  const [spotlightBarangayName, setSpotlightBarangayName] = useState('CDO');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllFeesBanner, setShowAllFeesBanner] = useState(true);
  const [showFilters, setShowFilters] = useState(!!location.state?.searchTerm);

  const [filterLocation, setFilterLocation] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('All Locations');
  const [filterPropertyType, setFilterPropertyType] = useState('All Types');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState({ min: '', max: '' });

  const placeholderLocations = ["Carmen", "Lapasan", "Macasandig", "Kingsfield", "Avida Towers"];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderLocations[0]);

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      setShowFilters(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.searchTerm, navigate, location.pathname]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholder(prev => {
        const currentIndex = placeholderLocations.indexOf(prev);
        return placeholderLocations[(currentIndex + 1) % placeholderLocations.length];
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('homygo-favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId];
      localStorage.setItem('homygo-favorites', JSON.stringify(newFavorites));
      toast({
        title: newFavorites.includes(propertyId) ? "💖 Added to Wishlist!" : "💔 Removed from Wishlist",
        description: newFavorites.includes(propertyId) ? "You can view it in your Wishlists tab." : "",
      });
      return newFavorites;
    });
  };

  const fetchProperties = useCallback(async (options = {}) => {
    const { limit, filter, orderBy } = options;
    let query = supabase.from('properties').select('*, user:users ( name, role )').eq('status', 'live');

    if (limit) query = query.limit(limit);
    if (filter?.guest_favorite) query = query.eq('guest_favorite', true);
    if (filter?.location) query = query.ilike('location', `%${filter.location}%`);
    if (filter?.type) query = query.eq('type', filter.type);
    if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending, nullsLast: true });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching properties:', error);
      toast({ title: 'Error', description: 'Could not fetch properties.', variant: 'destructive' });
      return [];
    }
    return data || [];
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const all = await fetchProperties();
      setAllProperties(all);
      setFilteredProperties(all);

      const popular = await fetchProperties({ limit: 4, filter: { guest_favorite: true }, orderBy: { column: 'rating', ascending: false } });
      setPopularProperties(popular.length > 0 ? popular : await fetchProperties({ limit: 4, orderBy: { column: 'rating', ascending: false } }));

      const availableWeekend = await fetchProperties({ limit: 4, filter: { type: 'Condo' } });
      setAvailableWeekendProperties(availableWeekend);

      const randomBarangay = cdoBarangays[Math.floor(Math.random() * cdoBarangays.length)] || 'Carmen';
      setSpotlightBarangayName(randomBarangay);
      const barangaySpotlight = await fetchProperties({ limit: 4, filter: { location: randomBarangay } });
      setBarangaySpotlightProperties(barangaySpotlight);

      setLoading(false);
    };
    loadInitialData();
  }, [fetchProperties]);

  const applyFilters = useCallback(() => {
    setLoading(true);
    let tempProperties = allProperties.filter(p =>
      (searchTerm.trim() === '' || (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (p.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
      (filterLocation.trim() === '' || (p.location?.toLowerCase() || '').includes(filterLocation.toLowerCase())) &&
      (filterBarangay === 'All Locations' || (p.location?.toLowerCase() || '').includes(filterBarangay.toLowerCase())) &&
      (filterPropertyType === 'All Types' || p.type === filterPropertyType) &&
      (filterBrand.trim() === '' || (p.brand?.toLowerCase() || '').includes(filterBrand.toLowerCase())) &&
      (filterPriceRange.min === '' || (p.price != null && p.price >= parseFloat(filterPriceRange.min))) &&
      (filterPriceRange.max === '' || (p.price != null && p.price <= parseFloat(filterPriceRange.max)))
    );
    setFilteredProperties(tempProperties);
    setLoading(false);
  }, [allProperties, searchTerm, filterLocation, filterBarangay, filterPropertyType, filterBrand, filterPriceRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
    setShowFilters(true);
    toast({ title: 'Search Complete', description: `Showing results for "${searchTerm}".` });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLocation('');
    setFilterBarangay('All Locations');
    setFilterPropertyType('All Types');
    setFilterBrand('');
    setFilterPriceRange({ min: '', max: '' });
    setFilteredProperties(allProperties);
    toast({ title: 'Filters Reset', description: 'Showing all available properties.' });
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category !== 'homes') {
      toast({ title: `🚧 ${category.charAt(0).toUpperCase() + category.slice(1)} Coming Soon!`, description: "This feature isn't implemented yet!" });
    }
  };

  const openPropertyDetails = (property) => navigate(`/user/listings/${property.id}`, { state: { property } });

  const handleAIFilters = (filters) => {
    if (filters.barangay) setFilterBarangay(cdoBarangays.find(b => b.toLowerCase() === filters.barangay) || 'All Locations');
    if (filters.location) setFilterLocation(filters.location);
    if (filters.propertyType) setFilterPropertyType(propertyTypesList.find(p => p.toLowerCase() === filters.propertyType) || 'All Types');
    if (filters.minPrice || filters.maxPrice) {
      setFilterPriceRange(prev => ({ min: filters.minPrice || prev.min, max: filters.maxPrice || prev.max }));
    }
    setShowFilters(true);
    toast({ title: "🤖 AI Search Applied!", description: "I've updated the filters based on your request." });
  };

  const isDefaultView = !showFilters && searchTerm.trim() === '' && filterLocation.trim() === '' && filterBarangay === 'All Locations' && filterPropertyType === 'All Types' && filterBrand.trim() === '' && filterPriceRange.min === '' && filterPriceRange.max === '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto pt-2 pb-24 sm:pb-16">
      {userRole === 'owner' ? (
        <>
          <OwnerExploreView />
          <div className="mt-12">
            <PropertyListSection title="Popular Homes in CDO (Guest View)" properties={popularProperties} loading={loading} isCarousel={true} openPropertyDetails={openPropertyDetails} toggleFavorite={toggleFavorite} favorites={favorites} />
          </div>
        </>
      ) : (
        <>
          <ExploreHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearchSubmit={handleSearchSubmit} currentPlaceholder={currentPlaceholder} activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} setShowFilters={setShowFilters} />
          <ExploreFilters show={showFilters && activeCategory === 'homes'} filterBarangay={filterBarangay} setFilterBarangay={setFilterBarangay} cdoBarangays={cdoBarangays} filterPropertyType={filterPropertyType} setFilterPropertyType={setFilterPropertyType} propertyTypes={propertyTypesList} filterBrand={filterBrand} setFilterBrand={setFilterBrand} filterPriceRange={filterPriceRange} setFilterPriceRange={setFilterPriceRange} handleResetFilters={handleResetFilters} applyFilters={applyFilters} />
          
          {showAllFeesBanner && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/30 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 mx-4 sm:mx-0 flex items-center justify-between shadow-sm">
              <div className="flex items-center"><Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary" /><p className="text-xs sm:text-sm font-medium text-foreground">Homygo Promise: Prices include all fees.</p></div>
              <Button variant="ghost" size="sm" onClick={() => setShowAllFeesBanner(false)} className="text-primary hover:bg-primary/10 h-7 px-2 text-xs">Dismiss</Button>
            </motion.div>
          )}

          {isDefaultView ? (
            <>
              <PropertyListSection title="Popular Homes in CDO" properties={popularProperties} loading={loading} isCarousel={true} openPropertyDetails={openPropertyDetails} toggleFavorite={toggleFavorite} favorites={favorites} />
              <PropertyListSection title="Condos Available in CDO" properties={availableWeekendProperties} loading={loading} isCarousel={true} openPropertyDetails={openPropertyDetails} toggleFavorite={toggleFavorite} favorites={favorites} />
              <PropertyListSection title={`Stay in Barangay ${spotlightBarangayName}`} properties={barangaySpotlightProperties} loading={loading} isCarousel={true} openPropertyDetails={openPropertyDetails} toggleFavorite={toggleFavorite} favorites={favorites} />
            </>
          ) : (
            <section className="mb-12 px-4 sm:px-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(8)].map((_, i) => (<div key={i} className="h-80 bg-muted rounded-xl animate-pulse"></div>))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProperties.map((property, idx) => (<PropertyCard key={property.id} property={property} index={idx} openPropertyDetailsModal={openPropertyDetails} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(property.id)} />))}
                </div>
              ) : (
                <div className="text-center py-10"><Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold">No Properties Found</h3><p className="text-muted-foreground">Try adjusting your search or filters.</p><Button onClick={handleResetFilters} variant="link" className="mt-4 text-primary">Reset Filters</Button></div>
              )}
            </section>
          )}
          <AIChatbox onFiltersFound={handleAIFilters} />
        </>
      )}
      {loading && !isDefaultView && (<div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>)}
    </motion.div>
  );
};

export default ExplorePage;