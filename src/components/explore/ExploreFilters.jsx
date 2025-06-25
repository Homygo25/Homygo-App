import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ExploreFilters = ({
  show,
  filterBarangay,
  setFilterBarangay,
  cdoBarangays,
  filterPropertyType,
  setFilterPropertyType,
  propertyTypes,
  filterBrand,
  setFilterBrand,
  filterPriceRange,
  setFilterPriceRange,
  handleResetFilters,
  applyFilters,
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 sm:mb-8 p-4 sm:p-6 bg-card/90 backdrop-blur-md rounded-xl shadow-xl border border-border/40 mx-4 sm:mx-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
        <div>
          <Label htmlFor="filter-barangay-detailed" className="text-xs font-medium text-muted-foreground">Barangay (CDO Only)</Label>
          <Select value={filterBarangay} onValueChange={setFilterBarangay}>
            <SelectTrigger id="filter-barangay-detailed" className="min-h-[40px] bg-input border-input-border focus:ring-primary text-foreground text-sm">
              <SelectValue placeholder="Select Barangay" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="All Locations" className="hover:bg-accent focus:bg-accent text-sm">All CDO Locations</SelectItem>
              {cdoBarangays.map(brgy => (<SelectItem key={brgy} value={brgy} className="hover:bg-accent focus:bg-accent text-sm">{brgy}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filter-property-type-detailed" className="text-xs font-medium text-muted-foreground">Property Type</Label>
          <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
            <SelectTrigger id="filter-property-type-detailed" className="min-h-[40px] bg-input border-input-border focus:ring-primary text-foreground text-sm">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {propertyTypes.map(type => (<SelectItem key={type} value={type} className="hover:bg-accent focus:bg-accent text-sm">{type}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filter-brand-detailed" className="text-xs font-medium text-muted-foreground">Keyword / Brand (Optional)</Label>
          <Input id="filter-brand-detailed" placeholder="e.g. Avida, Kingsfield" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="bg-input border-input-border focus:ring-primary text-foreground min-h-[40px] text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="filter-min-price" className="text-xs font-medium text-muted-foreground">Min Price</Label>
            <Input id="filter-min-price" type="number" placeholder="Any" value={filterPriceRange.min} onChange={(e) => setFilterPriceRange(p => ({ ...p, min: e.target.value }))} className="bg-input border-input-border focus:ring-primary text-foreground min-h-[40px] text-sm" />
          </div>
          <div>
            <Label htmlFor="filter-max-price" className="text-xs font-medium text-muted-foreground">Max Price</Label>
            <Input id="filter-max-price" type="number" placeholder="Any" value={filterPriceRange.max} onChange={(e) => setFilterPriceRange(p => ({ ...p, max: e.target.value }))} className="bg-input border-input-border focus:ring-primary text-foreground min-h-[40px] text-sm" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="ghost" onClick={handleResetFilters} className="text-muted-foreground hover:bg-muted/50 text-sm min-h-[40px]">Reset Filters</Button>
        <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm min-h-[40px] px-6">
          <Search className="w-4 h-4 mr-2" />Apply Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default ExploreFilters;