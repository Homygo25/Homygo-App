
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Search, MapPin, Building2, Sparkles, Home, Sun, Wind, Tag, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const propertyTypes = ['All Types', 'apartment', 'house', 'condo', 'hotel', 'inn'];

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('homes');
  
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  const [popularProperties, setPopularProperties] = useState([]);
  const [availablePropertiesWeekend, setAvailablePropertiesWeekend] = useState([]);
  const [barangaySpotlightProperties, setBarangaySpotlightProperties] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showAllFeesBanner, setShowAllFeesBanner] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filterLocation, setFilterLocation] = useState('');
  const [filterPropertyType, setFilterPropertyType] = useState('All Types');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState({ min: '', max: '' });


  const placeholderLocations = ["Cebu City", "Davao City", "Makati City"];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderLocations[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholder(prev => {
        const currentIndex = placeholderLocations.indexOf(prev);
        return placeholderLocations[(currentIndex + 1) % placeholderLocations.length];
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchAllPropertiesInitially = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('properties').select(`
      *,
      user:users ( name, role )
    `).order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all properties:', error);
      toast({ title: 'Error', description: 'Could not fetch properties.', variant: 'destructive' });
      setAllProperties([]);
      setFilteredProperties([]);
    } else {
      setAllProperties(data || []);
      setFilteredProperties(data || []);
    }
    setLoading(false);
  }, []);

  const fetchSectionProperties = useCallback(async (limit = 4, filter = {}) => {
    let query = supabase.from('properties').select(`
      *,
      user:users ( name, role )
    `).limit(limit);

    if (filter.featured) query = query.eq('featured', true);
    if (filter.location) query = query.ilike('location', `%${filter.location}%`);
    if (filter.property_type) query = query.eq('property_type', filter.property_type);
    
    const { data, error } = await query;
    if (error) {
      console.error(`Error fetching section properties (${JSON.stringify(filter)}):`, error);
      return [];
    }
    return data || [];
  }, []);

  useEffect(() => {
    fetchAllPropertiesInitially();
    
    const loadSectionData = async () => {
      const popular = await fetchSectionProperties(4, { featured: true });
      setPopularProperties(popular);
      
      const availableWeekend = await fetchSectionProperties(4, { location: 'Cagayan de Oro City', property_type: 'condo' });
      setAvailablePropertiesWeekend(availableWeekend);
      
      const barangaySpotlight = await fetchSectionProperties(4, { location: 'Carmen' });
      setBarangaySpotlightProperties(barangaySpotlight);
    };
    loadSectionData();
  }, [fetchAllPropertiesInitially, fetchSectionProperties]);


  const applyFilters = useCallback(() => {
    setLoading(true);
    let tempProperties = [...allProperties];

    if (searchTerm.trim() !== '') {
      tempProperties = tempProperties.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLocation.trim() !== '') {
      tempProperties = tempProperties.filter(p => 
        p.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (filterPropertyType !== 'All Types') {
      tempProperties = tempProperties.filter(p => p.property_type === filterPropertyType);
    }
    
    if (filterBrand.trim() !== '') {
      tempProperties = tempProperties.filter(p => 
        p.brand?.toLowerCase().includes(filterBrand.toLowerCase())
      );
    }

    if (filterPriceRange.min !== '') {
      tempProperties = tempProperties.filter(p => p.price >= parseFloat(filterPriceRange.min));
    }
    if (filterPriceRange.max !== '') {
      tempProperties = tempProperties.filter(p => p.price <= parseFloat(filterPriceRange.max));
    }

    setFilteredProperties(tempProperties);
    setLoading(false);
  }, [allProperties, searchTerm, filterLocation, filterPropertyType, filterBrand, filterPriceRange]);
  
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
    if (filteredProperties.length === 0 && searchTerm.trim() !== '') {
        toast({ title: 'No Results', description: `No properties found for "${searchTerm}". Try broadening your search.`, variant: 'default' });
    } else if (searchTerm.trim() !== '') {
        toast({ title: 'Search Complete', description: `Showing results for "${searchTerm}".`, variant: 'default' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLocation('');
    setFilterPropertyType('All Types');
    setFilterBrand('');
    setFilterPriceRange({ min: '', max: '' });
    setShowFilters(false);
    setFilteredProperties(allProperties); // Reset to all properties
    toast({ title: 'Filters Reset', description: 'Showing all available properties.', variant: 'default' });
  };
  
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category !== 'homes') {
      toast({
        title: `🚧 ${category.charAt(0).toUpperCase() + category.slice(1)} Coming Soon!`,
        description: "This feature isn't implemented yet—but we're working on it! 🚀",
        variant: 'default'
      });
      if (category === 'homes') {
        setShowFilters(false); // Hide filters if going back to main homes view without explicit search
      }
    } else {
        // Potentially show filters if they were open before
    }
  };

  const renderPropertyListSection = (propertiesToRender, title, showEmptyMessage = true) => (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-3 sm:mb-4 px-4 sm:px-0">{title}</h2>
      {loading && propertiesToRender.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
          {[...Array(4)].map((_, i) => ( <div key={i} className="h-72 bg-muted rounded-lg animate-pulse"></div> ))}
        </div>
      ) : propertiesToRender.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
          {propertiesToRender.map((property, idx) => (
            <PropertyCard key={property.id || `prop-${idx}`} property={property} index={idx} openPropertyDetailsModal={() => {/*TODO: Implement*/}} toggleFavorite={() => {/*TODO: Implement*/}} />
          ))}
        </div>
      ) : (
        showEmptyMessage && <p className="text-muted-foreground px-4 sm:px-0">No properties found for this section yet. Check back soon!</p>
      )}
    </section>
  );

  const renderMainFilteredList = () => (
     <section className="mb-12">
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                {[...Array(filteredProperties.length > 0 ? filteredProperties.length : 8)].map((_, i) => ( <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div> ))}
            </div>
        ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
            {filteredProperties.map((property, idx) => (
                <PropertyCard key={property.id || `filt-prop-${idx}`} property={property} index={idx} openPropertyDetailsModal={() => {/*TODO: Implement*/}} toggleFavorite={() => {/*TODO: Implement*/}}/>
            ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Properties Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                <Button onClick={handleResetFilters} variant="link" className="mt-4 text-primary">Reset Filters</Button>
            </div>
        )}
     </section>
  );


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto pt-4 pb-24 sm:pb-16" 
    >
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md pt-3 pb-3 px-4 sm:px-0 mb-2 sm:mb-4 -mx-4 sm:-mx-0 border-b border-border/30">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-2xl mx-auto bg-card p-2 rounded-full shadow-lg border border-border/50 focus-within:ring-2 focus-within:ring-primary transition-all">
          <Search className="h-5 w-5 text-muted-foreground mx-2 sm:mx-3" />
          <Input
            type="search"
            placeholder={`Search by name, location, brand... e.g. ${currentPlaceholder}`}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm sm:text-base placeholder-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 hidden sm:flex">
            Search
          </Button>
        </form>
      </header>
      
      <Tabs defaultValue="homes" className="w-full mb-6 sm:mb-8 px-4 sm:px-0" onValueChange={handleCategoryClick}>
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md mx-auto h-12 bg-muted/60 p-1 rounded-full">
          <TabsTrigger value="homes" className="text-sm sm:text-base rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full" onClick={() => setShowFilters(prev => !prev) }>
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Homes { showFilters ? '(Hide Filters)' : '(Show Filters)'}
          </TabsTrigger>
          <TabsTrigger value="experiences" className="text-sm sm:text-base rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full relative">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Experiences
            <span className="absolute -top-1 -right-1 sm:-right-0.5 bg-destructive text-destructive-foreground text-[0.6rem] sm:text-xs font-bold px-1.5 py-0.5 rounded-full">NEW</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="text-sm sm:text-base rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full relative">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Services
            <span className="absolute -top-1 -right-1 sm:-right-0.5 bg-destructive text-destructive-foreground text-[0.6rem] sm:text-xs font-bold px-1.5 py-0.5 rounded-full">NEW</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

    {showFilters && activeCategory === 'homes' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-4 sm:p-6 bg-card/90 backdrop-blur-md rounded-xl shadow-xl border border-border/40 mx-4 sm:mx-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
            <div>
              <Label htmlFor="filter-location-detailed" className="text-xs font-medium text-muted-foreground">Location</Label>
              <Input id="filter-location-detailed" placeholder="e.g. Carmen, CDO" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-input border-border focus:ring-primary text-foreground min-h-[40px] text-sm"/>
            </div>
            <div>
              <Label htmlFor="filter-property-type-detailed" className="text-xs font-medium text-muted-foreground">Property Type</Label>
              <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                <SelectTrigger id="filter-property-type-detailed" className="min-h-[40px] bg-input border-border focus:ring-primary text-foreground text-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {propertyTypes.map(type => ( <SelectItem key={type} value={type} className="hover:bg-accent focus:bg-accent text-sm">{type}</SelectItem> ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-brand-detailed" className="text-xs font-medium text-muted-foreground">Brand (Optional)</Label>
              <Input id="filter-brand-detailed" placeholder="e.g. Avida, Kingsfield" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="bg-input border-border focus:ring-primary text-foreground min-h-[40px] text-sm"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="filter-min-price" className="text-xs font-medium text-muted-foreground">Min Price</Label>
                <Input id="filter-min-price" type="number" placeholder="Any" value={filterPriceRange.min} onChange={(e) => setFilterPriceRange(p => ({...p, min: e.target.value}))} className="bg-input border-border focus:ring-primary text-foreground min-h-[40px] text-sm"/>
              </div>
              <div>
                <Label htmlFor="filter-max-price" className="text-xs font-medium text-muted-foreground">Max Price</Label>
                <Input id="filter-max-price" type="number" placeholder="Any" value={filterPriceRange.max} onChange={(e) => setFilterPriceRange(p => ({...p, max: e.target.value}))} className="bg-input border-border focus:ring-primary text-foreground min-h-[40px] text-sm"/>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="ghost" onClick={handleResetFilters} className="text-muted-foreground hover:bg-muted/50 text-sm min-h-[40px]">Reset Filters</Button>
            <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm min-h-[40px] px-6">
              <Search className="w-4 h-4 mr-2"/>Apply Filters
            </Button>
          </div>
        </motion.div>
      )}


      {showAllFeesBanner && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/30 text-primary p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 mx-4 sm:mx-0 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center">
            <Tag className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary" />
            <p className="text-sm sm:text-base font-medium text-foreground">
              Prices include all fees. No surprises at checkout!
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAllFeesBanner(false)} className="text-primary hover:bg-primary/10">
            Dismiss
          </Button>
        </motion.div>
      )}

      {(!showFilters && searchTerm.trim() === '' && filterLocation.trim() === '' && filterPropertyType === 'All Types' && filterBrand.trim() === '' && filterPriceRange.min === '' && filterPriceRange.max === '') ? (
        <>
          {renderPropertyListSection(popularProperties, "Popular Homes in Cagayan de Oro")}
          {renderPropertyListSection(availablePropertiesWeekend, "Available This Weekend in Iligan City")}
          {renderPropertyListSection(barangaySpotlightProperties, "Stay in Barangay Carmen")}
        </>
      ) : (
        renderMainFilteredList()
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </motion.div>
  );
};

export default ExplorePage;
