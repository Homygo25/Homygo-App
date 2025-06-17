import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/ThemeProvider';

const HeroSection = ({ 
  selectedLocation, setSelectedLocation, 
  priceRange, setPriceRange,
  propertyType, setPropertyType,
  handleSearch, 
  searchMode, setSearchMode,
}) => {
  const { theme } = useTheme();
  const heroBackgroundImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/80730cba564c89ef00cd82d143f3e3e1.png";
  
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(prev => ({ ...prev, min: value }));
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(prev => ({ ...prev, max: value }));
  };

  return (
    <section 
      className="relative py-12 sm:py-16 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBackgroundImageUrl})` }}
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Homygo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">|</span> Your Next Home Starts Here
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
            Choose your place, set your budget, and move in — stress-free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto" 
        >
          <div className={`bg-card/70 dark:bg-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-2xl border border-border/20`}>
            <div className="flex justify-center mb-4 space-x-2">
              {['rent', 'buy'].map((mode) => (
                <Button
                  key={mode}
                  variant={searchMode === mode ? 'default' : 'outline'}
                  onClick={() => {
                    setSearchMode(mode);
                    if (mode === 'buy') {
                      toast({
                        title: "🚧 'Buy' feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
                        description: "Currently, Homygo specializes in rentals. Feel free to explore rental options!",
                        variant: "destructive"
                      });
                    }
                  }}
                  className={`capitalize px-3 py-2 sm:px-5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out min-h-[40px] sm:min-h-[44px]
                    ${searchMode === mode 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground bg-background/60 dark:bg-background/20'
                    }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
            
            <div className="max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 items-end">
                <div className="space-y-1.5">
                  <label htmlFor="location-input" className="text-xs font-medium text-muted-foreground flex items-center justify-start md:justify-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Location/Keyword
                  </label>
                  <Input
                    id="location-input"
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    placeholder="City, Barangay, Title..."
                    className="w-full p-2.5 text-sm min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="property-type-input" className="text-xs font-medium text-muted-foreground flex items-center justify-start md:justify-center">
                    <Home className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Property Type
                  </label>
                  <Input
                    id="property-type-input"
                    type="text"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="e.g., Apartment, House"
                    className="w-full p-2.5 text-sm min-h-[44px]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center justify-start md:justify-center mb-1">
                    Price Range (PHP)
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative w-1/2">
                       <TrendingDown className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                       <Input
                        id="min-price-input"
                        type="number"
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        className="w-full p-2.5 text-sm min-h-[44px] pl-7"
                        placeholder="Min"
                      />
                    </div>
                    <div className="relative w-1/2">
                      <TrendingUp className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="max-price-input"
                        type="number"
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="w-full p-2.5 text-sm min-h-[44px] pl-7"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-6 py-3 sm:px-8 sm:py-3 rounded-md font-semibold pulse-glow text-sm sm:text-base mt-3 min-h-[44px]"
                onClick={handleSearch}
                aria-label="Search properties based on current filters"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;