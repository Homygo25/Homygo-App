import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FilterX } from 'lucide-react';

export const MAP_STYLES_CONFIG = [
  { name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
  { name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12' },
  { name: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
  { name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
];

const MapControls = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearFilters,
  currentMapStyle,
  setMapStyleCallback,
  mapError
}) => {
  return (
    <>
      <div 
        className="absolute left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 bg-card/80 backdrop-blur-md rounded-lg shadow-xl border border-border/30 z-20"
        style={{ top: `calc(var(--header-height, 0px) + 0.75rem)`, width: 'calc(100% - 1rem)', maxWidth: '600px' }}
      >
        <div className="relative w-full sm:flex-grow">
          <Input
            type="text"
            placeholder="Search Barangay, Building, or Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 text-sm border-border focus:ring-primary focus:border-primary min-h-[44px]"
            aria-label="Search for properties on map"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 min-h-[44px]">
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto text-sm px-4 py-2 min-h-[44px]">
          <FilterX className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
        <div className="bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-border/30">
          <label htmlFor="map-style-select" className="text-xs text-muted-foreground">Map Style:</label>
          <select 
            id="map-style-select"
            value={currentMapStyle} 
            onChange={(e) => {
              if (setMapStyleCallback) setMapStyleCallback(e.target.value);
            }}
            className="w-full p-1.5 text-xs bg-input border border-border rounded focus:ring-primary focus:border-primary min-h-[36px]"
            disabled={!!mapError}
            aria-label="Select map style"
          >
            {MAP_STYLES_CONFIG.map(style => (
              <option key={style.url} value={style.url}>{style.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default MapControls;