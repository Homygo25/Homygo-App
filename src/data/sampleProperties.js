import { CDO_BARANGAY_COORDS } from './locations';

const BARANGAYS = [
  'Agusan',
  'Balulang',
  'Bugo',
  'Bulua',
  'Camaman-an',
  'Canitoan',
  'Carmen',
  'Cogon',
  'Gusa',
  'Iponan',
  'Kauswagan',
  'Lapasan',
  'Macabalan',
  'Macasandig',
  'Nazareth',
  'Patag',
  'Pueblo de Oro',
  'Puerto',
  'Tablon',
  'Tignapoloan',
  'Upper Balulang',
  'Other'
];

let idCounter = 1;
function createProperty(barangay, index) {
  const coords = CDO_BARANGAY_COORDS[barangay] || { lat: 0, lng: 0 };
  return {
    id: idCounter++,
    title: `Sample Property ${index + 1} in ${barangay}`,
    location: barangay,
    price: 10000 + index * 1000,
    type: 'House',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 50 + index * 5,
    image_paths: [],
    description: `Placeholder property ${index + 1} for ${barangay}.`,
    contact_phone: '',
    contact_email: '',
    rating: 0,
    featured: false,
    available_from: '2025-01-01',
    latitude: coords.lat,
    longitude: coords.lng,
    availabilityStatus: 'Available',
  };
}

export const SAMPLE_PROPERTIES_BY_BARANGAY = BARANGAYS.reduce((acc, barangay) => {
  acc[barangay] = Array.from({ length: 5 }, (_, i) => createProperty(barangay, i));
  return acc;
}, {});
