import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SAMPLE_PROPERTIES } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, MapPin, BedDouble, Bath, Tag, Maximize2, Heart, CalendarDays, Phone, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyDetailsModal from '@/components/PropertyDetailsModal'; 
import { useAuth } from '@/contexts/AuthContext';


const UserPropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
  const [favorites, setFavorites] = useState([]);

   useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('homygo-favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const foundProperty = SAMPLE_PROPERTIES.find(p => p.id.toString() === id);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      toast({
        title: "Property Not Found",
        description: "The property you are looking for does not exist or has been removed.",
        variant: "destructive",
      });
      navigate('/user/listings'); 
    }
    setIsLoading(false);
  }, [id, navigate]);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(pid => pid !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem('homygo-favorites', JSON.stringify(newFavorites));
      toast({
        title: newFavorites.includes(propertyId) ? "Added to favorites!" : "Removed from favorites",
      });
      return newFavorites;
    });
  };

  const handleBookNow = async (propertyDetails, duration, renter) => {
    if (!isAuthenticated || !renter || !renter.id) {
      toast({ title: "Authentication Required", description: "Please log in to book a property.", variant: "destructive" });
      navigate('/login', {state: { from: location }});
      return;
    }

    toast({
      title: "Booking Request Initiated...",
      description: `Processing booking for ${propertyDetails.title} for ${duration}.`,
    });
    
     toast({
        title: "🎉 Booking Request Sent!",
        description: (
          <div>
            <p>The owner of "<strong>{propertyDetails.title}</strong>" will be notified shortly.</p>
            <p className="text-xs mt-1">Duration: {duration}</p>
            <p className="text-xs mt-1">Renter: {user?.email || "Your Email"}</p>
          </div>
        ),
        variant: "default",
        duration: 8000,
      });

    setIsDetailsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return null; 
  }

  const isFavorited = favorites.includes(property.id);
  const defaultImageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const imageUrl = property.image_paths && property.image_paths.length > 0 && property.image_paths[0] ? property.image_paths[0] : defaultImageUrl;


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20 text-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 sm:mb-8 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
        </Button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/80 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/30"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg mb-4 sm:mb-6">
                <img-replace 
                  src={imageUrl}
                  alt={property.title || "Property image"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground text-sm sm:text-base">
                    <MapPin className="w-4 h-4 mr-2 text-accent" />
                    {property.location}
                  </div>
                </div>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleFavorite(property.id)}
                    className={`rounded-full hover:bg-primary/10 ${isFavorited ? 'text-destructive' : 'text-muted-foreground'}`}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{property.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
                <div className="flex items-center bg-muted/50 p-2 sm:p-3 rounded-md">
                  <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> 
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center bg-muted/50 p-2 sm:p-3 rounded-md">
                  <Bath className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> 
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center bg-muted/50 p-2 sm:p-3 rounded-md">
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> 
                  <span>{property.area_sqm} sqm</span>
                </div>
                 <div className="flex items-center bg-muted/50 p-2 sm:p-3 rounded-md">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> 
                  <span>Type: {property.type}</span>
                </div>
                 <div className="flex items-center bg-muted/50 p-2 sm:p-3 rounded-md">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> 
                  <span>Available: {property.available_from ? new Date(property.available_from).toLocaleDateString() : 'Now'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-muted/30 p-4 sm:p-6 rounded-lg shadow-lg border border-border/20 sticky top-24">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary-foreground mb-1">Price</h2>
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                  ₱{Number(property.price).toLocaleString()}
                  <span className="text-sm sm:text-base font-normal text-muted-foreground"> /month</span>
                </p>
                
                <Button 
                  size="lg" 
                  className="w-full mb-3 sm:mb-4 text-base sm:text-lg min-h-[48px] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => setIsDetailsModalOpen(true)}
                >
                  Book Now / Check Details
                </Button>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/30">
                  <h3 className="text-lg sm:text-xl font-semibold text-primary-foreground mb-2 sm:mb-3">Contact Owner</h3>
                  {property.contact_phone && (
                    <div className="flex items-center text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                      <Phone className="w-4 h-4 mr-2 text-accent" />
                      <span>{property.contact_phone}</span>
                    </div>
                  )}
                  {property.contact_email && (
                    <div className="flex items-center text-muted-foreground text-sm sm:text-base">
                      <Mail className="w-4 h-4 mr-2 text-accent" />
                      <span>{property.contact_email}</span>
                    </div>
                  )}
                   {!property.contact_phone && !property.contact_email && (
                     <p className="text-muted-foreground text-sm">Contact information not provided.</p>
                   )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <PropertyDetailsModal 
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        property={property}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default UserPropertyDetailsPage;