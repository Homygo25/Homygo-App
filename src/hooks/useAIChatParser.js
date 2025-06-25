import { BARANGAYS } from '@/data/locations';

const propertyTypes = ['apartment', 'house', 'condo', 'hotel', 'inn', 'room', 'bedspace', 'boarding house', 'townhouse', 'studio'];
const cdoBarangays = BARANGAYS.filter(b => b.city === 'Cagayan de Oro').map(b => b.name.toLowerCase());
const amenities = {
  'female only': { key: 'femaleOnly', value: true },
  'wifi': { key: 'withWifi', value: true },
  'cooking allowed': { key: 'cookingAllowed', value: true },
  'shared cr': { key: 'sharedCR', value: true },
  'single occupant': { key: 'singleOccupant', value: true },
};

export const useAIChatParser = () => {
  const parseQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const filters = {};
    let responseParts = [];

    const foundType = propertyTypes.find(type => lowerQuery.includes(type));
    if (foundType) {
      filters.roomType = foundType;
      responseParts.push(`a ${foundType}`);
    }

    const foundBarangay = cdoBarangays.find(brgy => lowerQuery.includes(brgy));
    if (foundBarangay) {
      filters.barangay = BARANGAYS.find(b => b.name.toLowerCase() === foundBarangay)?.name;
      responseParts.push(`in ${filters.barangay}`);
    } else {
      const locationMatch = lowerQuery.match(/(?:in|at|near)\s+([\w\s]+)/);
      if (locationMatch && locationMatch[1]) {
        const loc = locationMatch[1].trim();
        if (!propertyTypes.includes(loc)) {
          filters.landmark = loc;
          responseParts.push(`near ${loc}`);
        }
      }
    }

    const priceUnderMatch = lowerQuery.match(/(?:under|less than|below|max of|up to)\s+₱?(\d{1,3}(?:,?\d{3})*)/);
    if (priceUnderMatch) {
      filters.maxPrice = parseInt(priceUnderMatch[1].replace(/,/g, ''), 10);
      responseParts.push(`under ₱${filters.maxPrice.toLocaleString()}`);
    }

    const priceOverMatch = lowerQuery.match(/(?:over|more than|above|min of|at least)\s+₱?(\d{1,3}(?:,?\d{3})*)/);
    if (priceOverMatch) {
      filters.minPrice = parseInt(priceOverMatch[1].replace(/,/g, ''), 10);
      responseParts.push(`above ₱${filters.minPrice.toLocaleString()}`);
    }
    
    Object.keys(amenities).forEach(amenity => {
      if (lowerQuery.includes(amenity)) {
        const { key, value } = amenities[amenity];
        filters[key] = value;
        responseParts.push(amenity);
      }
    });

    let response;
    if (responseParts.length > 0) {
      response = `Sige! I'm looking for rentals ${responseParts.join(', ')}. Check out what I found!`;
    } else {
      response = "Pasensya, I didn't quite get that. Pwede paki-specify, like 'apartment in Carmen under 10k'?";
    }

    return { filters, response };
  };

  return { parseQuery };
};