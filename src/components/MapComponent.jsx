import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabaseClient';
import { useMapbox } from '@/hooks/useMapbox';
import MapControls from '@/components/map/MapControls';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const { theme } = useTheme();

  const { mapRef, mapState, setMapStyle, addMarkersToMap, flyTo } = useMapbox(
    mapContainerRef,
    124.6409,
    8.4764,
    12,
    'mapbox://styles/mapbox/streets-v12',
    theme
  );

  const fetchAllProperties = useCallback(async () => {
    setIsLoadingProperties(true);
    console.log("MapComponent: Fetching all properties from Supabase...");
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("MapComponent: Fetched properties count:", data?.length || 0);
      if (!data || data.length === 0) {
        console.warn("MapComponent: No properties found in the database. Please ensure data is seeded.");
        toast({
          title: "No Properties on Map",
          description: "There are no properties to display on the map yet. Please check if data is seeded in Supabase.",
          variant: "default",
          duration: 7000,
        });
      }
      setAllProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("MapComponent: Error fetching properties:", error.message);
      toast({
        title: "Failed to Load Properties on Map",
        description: error.message,
        variant: "destructive",
      });
      setAllProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  useEffect(() => {
    if (mapState.isLoaded) {
      addMarkersToMap(filteredProperties);
    }
  }, [filteredProperties, addMarkersToMap, mapState.isLoaded]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    console.log("MapComponent: Search initiated with query:", query);

    if (!query) {
      setFilteredProperties(allProperties);
      toast({ title: "Search Cleared", description: "Showing all properties on map." });
      console.log("MapComponent: Search query empty, showing all properties:", allProperties.length);
      return;
    }

    const results = allProperties.filter(property =>
      property.title?.toLowerCase().includes(query) ||
      property.location?.toLowerCase().includes(query) ||
      property.description?.toLowerCase().includes(query) ||
      (property.type && property.type.toLowerCase().includes(query))
    );
    setFilteredProperties(results);
    console.log("MapComponent: Filtered results:", results.length, results);

    if (results.length > 0) {
      const firstResult = results[0];
      if (firstResult.latitude && firstResult.longitude) {
        flyTo([firstResult.longitude, firstResult.latitude], 15);
      }
      toast({ title: "Properties Found!", description: `${results.length} properties match your search.` });
    } else {
      toast({ title: "No Properties Found", description: "Try a different search term.", variant: "destructive" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilteredProperties(allProperties);
    flyTo([124.6409, 8.4764], 12);
    toast({ title: "Filters Cleared", description: "Showing all properties and reset map view." });
    console.log("MapComponent: Filters cleared, showing all properties:", allProperties.length);
  };

  if (isLoadingProperties && allProperties.length === 0 && !mapState.mapError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading Homygo Map...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-var(--header-height))] w-full overflow-hidden">
      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        aria-label="Interactive map of Cagayan de Oro properties"
      />
      {mapState.mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4 text-center z-50">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive-foreground">Map Error</p>
          <p className="text-sm text-destructive-foreground/80 max-w-md">{mapState.mapError}</p>
          <p className="text-xs text-destructive-foreground/60 mt-2">Please try refreshing the page or check your internet connection.</p>
        </div>
      )}

      {!mapState.mapError && (
        <MapControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleClearFilters={handleClearFilters}
          currentMapStyle={mapState.mapStyle}
          setMapStyleCallback={setMapStyle}
          mapError={mapState.mapError}
        />
      )}
    </div>
  );
};

export default MapComponent;