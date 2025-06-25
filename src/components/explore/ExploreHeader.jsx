import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Home, Sparkles, Wind } from 'lucide-react';

const ExploreHeader = ({
  searchTerm,
  setSearchTerm,
  handleSearchSubmit,
  currentPlaceholder,
  activeCategory,
  handleCategoryClick,
  setShowFilters,
}) => {
  return (
    <header className="sticky top-[var(--header-height)] z-40 bg-background/80 backdrop-blur-md pt-3 pb-3 px-4 sm:px-0 mb-2 sm:mb-4 -mx-4 sm:-mx-0 border-b border-border/30">
      <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-2xl mx-auto bg-card p-1.5 sm:p-2 rounded-full shadow-lg border border-border/50 focus-within:ring-2 focus-within:ring-primary transition-all">
        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mx-2 sm:mx-3" />
        <Input
          type="search"
          placeholder={`Search inns, hotels... (e.g. ${currentPlaceholder})`}
          className="flex-grow bg-transparent border-none focus:ring-0 text-sm sm:text-base placeholder-muted-foreground h-9 sm:h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 hidden sm:flex">
          Search
        </Button>
      </form>
      <Tabs defaultValue="homes" value={activeCategory} className="w-full mt-4" onValueChange={handleCategoryClick}>
        <TabsList className="grid w-full grid-cols-3 sm:max-w-sm mx-auto h-11 sm:h-12 bg-muted/60 p-1 rounded-full">
          <TabsTrigger value="homes" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full" onClick={() => setShowFilters(prev => !prev)}>
            <Home className="w-3.5 h-3.5 sm:w-4 sm:w-4 mr-1 sm:mr-1.5" /> Homes
          </TabsTrigger>
          <TabsTrigger value="experiences" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full relative">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:w-4 mr-1 sm:mr-1.5" /> Experiences
            <span className="absolute -top-1 -right-0.5 sm:-right-0.5 bg-accent text-accent-foreground text-[0.5rem] sm:text-[0.6rem] font-bold px-1 sm:px-1.5 py-0.5 rounded-full">SOON</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md h-full relative">
            <Wind className="w-3.5 h-3.5 sm:w-4 sm:w-4 mr-1 sm:mr-1.5" /> Services
            <span className="absolute -top-1 -right-0.5 sm:-right-0.5 bg-accent text-accent-foreground text-[0.5rem] sm:text-[0.6rem] font-bold px-1 sm:px-1.5 py-0.5 rounded-full">SOON</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
};

export default ExploreHeader;