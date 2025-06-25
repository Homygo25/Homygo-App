import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Corrected: should resolve if dialog.jsx exists
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Bed, Bath, Square, MapPin, CalendarDays, CheckCircle, XCircle, Clock, DollarSign, Info, CalendarCheck2, Sparkles, ShieldCheck, Sun, Moon, Wind } from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, onOpenChange, property, onBookNow }) => {
  const [bookingDuration, setBookingDuration] = useState('Day');
  const { isAuthenticated, user } = useAuth();

  if (!property) return null;

  const handleProceedToBook = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in or sign up to book a property.",
        variant: "destructive",
      });
      // Potentially redirect to login or open login modal
      return;
    }
    
    onBookNow(property, bookingDuration, user); 
    onOpenChange(false); // Close modal after initiating booking
  };
  
  const amenities = property.amenities || ["Basic furnishings", "Kitchenette", "Air Conditioning"]; // Default if not provided
  const rules = property.rules || ["No smoking", "No pets", "Quiet hours after 10 PM"]; // Default if not provided


  const getStatusIndicator = () => {
    switch (property.availabilityStatus) {
      case 'Available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Booked':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Maintenance':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center">
            {property.title}
             <span className="ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center">
              {getStatusIndicator()}
              <span className="ml-1.5">{property.availabilityStatus}</span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground flex items-center pt-1">
            <MapPin className="w-4 h-4 mr-1.5 text-primary" /> {property.location}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-6 border-b md:border-b-0 md:border-r border-border">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img
                src={property.image_paths && property.image_paths.length > 0 ? property.image_paths[0] : "https://images.unsplash.com/photo-1595872018818-97555653a011"} 
                alt={`Image of ${property.title}`}
                className="w-full h-full object-cover"
            />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2 text-primary" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2 text-primary" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="w-5 h-5 mr-2 text-primary" />
                <span>{property.area} m²</span>
              </div>
            </div>

             <div className="flex items-center text-muted-foreground mb-2 text-sm">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                <span className="text-xl font-bold text-primary">₱{property.price.toLocaleString()}</span>
                <span className="text-xs ml-1">/month</span>
             </div>
             {property.available_from && (
              <div className="flex items-center text-muted-foreground text-sm">
                <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                <span>Available from: {new Date(property.available_from).toLocaleDateString()}</span>
              </div>
             )}

          </div>
          
          <div className="p-6 flex flex-col">
            <h4 className="font-semibold text-foreground mb-1 text-lg">Description</h4>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{property.description}</p>
            
            <h4 className="font-semibold text-foreground mb-2 text-lg flex items-center"><Sparkles className="w-5 h-5 mr-2 text-amber-400"/>Amenities</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm mb-4 space-y-1">
              {amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>

            <h4 className="font-semibold text-foreground mb-2 text-lg flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-blue-500"/>House Rules</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm mb-6 space-y-1">
              {rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
            
            {property.availabilityStatus === "Available" ? (
              <>
                <h4 className="font-semibold text-foreground mb-3 text-lg flex items-center"><CalendarCheck2 className="w-5 h-5 mr-2 text-green-500"/>Booking Options</h4>
                <RadioGroup defaultValue="Day" value={bookingDuration} onValueChange={setBookingDuration} className="mb-6">
                  <div className="flex items-center space-x-4">
                    {['Day', 'Week', 'Month'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`duration-${option.toLowerCase()}`} />
                        <Label htmlFor={`duration-${option.toLowerCase()}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <Button 
                  onClick={handleProceedToBook} 
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold min-h-[44px] text-base"
                >
                  Proceed to Book for {bookingDuration}
                </Button>
              </>
            ) : (
              <div className="mt-auto p-3 bg-destructive/10 text-destructive rounded-md text-center text-sm font-medium">
                This property is currently unavailable for booking.
              </div>
            )}

          </div>
        </div>
        <DialogFooter className="p-6 pt-0 sm:justify-start">
            <DialogClose asChild>
                <Button type="button" variant="outline" className="min-h-[44px]">
                Close
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;