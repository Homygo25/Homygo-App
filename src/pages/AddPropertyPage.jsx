import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Home, PlusCircle, ArrowLeft, UploadCloud, X, Info } from 'lucide-react';
import { PROPERTY_TYPES } from '@/data/propertiesData';
import { BARANGAYS as CDO_BARANGAYS_ALL } from '@/data/locations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CDO_BARANGAYS = CDO_BARANGAYS_ALL.filter(b => b !== 'All Locations' && !b.includes('(Sample Other City)'));
const propertyStatuses = ['draft', 'live', 'booked', 'unlisted'];


const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useAuth();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingPropertyData, setLoadingPropertyData] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState(''); // Renamed from 'type' to 'propertyType'
  const [barangay, setBarangay] = useState(''); // For CDO Barangay dropdown
  const [addressDetails, setAddressDetails] = useState(''); // For specific address line
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaSqm, setAreaSqm] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('draft');

  const [images, setImages] = useState([]); // Files for new uploads
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for new uploads
  const [existingImagePaths, setExistingImagePaths] = useState([]); // URLs of existing images for edit mode
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propertyId) {
      setIsEditMode(true);
      setLoadingPropertyData(true);
      const fetchPropertyData = async () => {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('user_id', user.id)
          .single();
        
        if (error || !data) {
          toast({ title: "Error", description: "Could not fetch property data or property not found.", variant: "destructive"});
          navigate('/owner/dashboard');
          return;
        }
        
        setTitle(data.title);
        setDescription(data.description);
        setPropertyType(data.property_type || '');
        
        // Split location back into barangay and addressDetails if possible
        const locationParts = data.location?.split(',');
        if (locationParts && locationParts.length > 1 && CDO_BARANGAYS.includes(locationParts[0].trim())) {
            setBarangay(locationParts[0].trim());
            setAddressDetails(locationParts.slice(1).join(',').trim());
        } else if (CDO_BARANGAYS.includes(data.location?.trim())) {
            setBarangay(data.location.trim());
            setAddressDetails('');
        } else {
            setBarangay(''); // Or a default CDO barangay if not found
            setAddressDetails(data.location || '');
        }

        setPrice(data.price.toString());
        setBedrooms(data.bedrooms?.toString() || '');
        setBathrooms(data.bathrooms?.toString() || '');
        setAreaSqm(data.area_sqm?.toString() || '');
        setBrand(data.brand || '');
        setStatus(data.status || 'draft');
        setExistingImagePaths(data.image_paths || []);
        
        setLoadingPropertyData(false);
      };
      fetchPropertyData();
    }
  }, [propertyId, user, navigate]);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = (existingImagePaths?.length || 0) + images.length + files.length;
    if (totalImages > 5) {
      toast({ title: "Image Limit", description: "You can upload a maximum of 5 images in total.", variant: "destructive" });
      return;
    }
    setImages(prev => [...prev, ...files.slice(0, 5 - ((existingImagePaths?.length || 0) + prev.length))]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews.slice(0, 5 - ((existingImagePaths?.length || 0) + prev.length))]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]); 
    setImagePreviews(newPreviews);
  };
  
  const removeExistingImage = async (pathToRemove) => {
    setExistingImagePaths(prev => prev.filter(path => path !== pathToRemove));
    // Note: Actual deletion from Supabase storage on save/update
    toast({ title: "Image Marked for Removal", description: "Image will be removed from storage upon saving changes.", variant: "default"});
  };
  
  useEffect(() => {
    return () => imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imagePreviews]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    const totalExistingImages = existingImagePaths?.length || 0;
    const totalNewImages = images.length;

    if (totalExistingImages + totalNewImages === 0) {
        toast({title: "Image Required", description: "Please upload at least one image for your property.", variant: "destructive"});
        setIsSubmitting(false);
        return;
    }

    const uploadedImagePaths = [...existingImagePaths]; // Start with existing images not marked for removal
    for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-images') 
            .upload(fileName, image);

        if (uploadError) {
            console.error("Image upload error: ", uploadError);
            toast({title: "Image Upload Failed", description: uploadError.message, variant: "destructive"});
            setIsSubmitting(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(uploadData.path);
        uploadedImagePaths.push(publicUrl);
    }
    
    const fullLocation = barangay && addressDetails ? `${barangay}, ${addressDetails}` : (barangay || addressDetails);

    const propertyData = {
      user_id: user.id,
      title,
      description,
      property_type: propertyType,
      location: fullLocation,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || null,
      bathrooms: parseInt(bathrooms) || null,
      area_sqm: parseFloat(areaSqm) || null,
      brand: brand || null,
      status,
      image_paths: uploadedImagePaths,
      // Hardcoding 'guest_favorite' and 'rating' for now as they are not in the form
      guest_favorite: Math.random() > 0.8, // ~20% chance of being a guest favorite
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)), // Random rating between 3.5 and 5.0
      // availabilityStatus should map from 'status' or be a separate field
      availabilityStatus: status === 'live' ? 'Available' : (status === 'booked' ? 'Booked' : 'Unavailable'),
    };


    try {
      let response;
      if (isEditMode) {
        const { data, error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId)
          .eq('user_id', user.id);
        if (error) throw error;
        response = data;
        toast({ title: "Property Updated! 🏡", description: `${title} has been successfully updated.` });
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select(); // Important to get the inserted data back
        if (error) throw error;
        response = data;
        toast({ title: "Property Added! 🎉", description: `${title} has been successfully listed.` });
      }
      
      navigate('/owner/dashboard');

    } catch (error) {
      console.error("Error saving property:", error.message);
      toast({
        title: `Failed to ${isEditMode ? 'Update' : 'Add'} Property`,
        description: error.message || "Could not save your property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loadingPropertyData && isEditMode) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height))] p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 sm:py-12 bg-gradient-to-br from-background via-background to-muted/30 min-h-screen"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="outline" onClick={() => navigate('/owner/dashboard')} className="mb-6 text-primary border-primary hover:bg-primary/10 min-h-[44px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="bg-card/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-border/30">
          <div className="text-center mb-6 sm:mb-8">
            <Home className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{isEditMode ? "Edit Property" : "List Your Property"}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Fill in the details below to showcase your rental.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">Property Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 min-h-[44px]" placeholder="e.g., Cozy 2BR Apartment near City Center"/>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</Label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="mt-1 w-full rounded-md border border-input-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]" placeholder="Detailed description of your property..."></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="propertyType" className="text-sm font-medium text-muted-foreground">Property Type</Label>
                 <Select value={propertyType} onValueChange={setPropertyType} required>
                    <SelectTrigger className="w-full mt-1 min-h-[44px] bg-input border-input-border">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.filter(pt => pt !== 'All Types' && ['Apartment', 'House', 'Condo', 'Hotel', 'Inn'].includes(pt)).map(pt => (
                        <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="barangay" className="text-sm font-medium text-muted-foreground">Barangay (CDO Only)</Label>
                 <Select value={barangay} onValueChange={setBarangay} required>
                    <SelectTrigger className="w-full mt-1 min-h-[44px] bg-input border-input-border">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {CDO_BARANGAYS.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <div>
                 <Label htmlFor="addressDetails" className="text-sm font-medium text-muted-foreground">Address Details (Street, Building, etc.)</Label>
                <Input id="addressDetails" value={addressDetails} onChange={(e) => setAddressDetails(e.target.value)} className="mt-1 min-h-[44px]" placeholder="e.g., Unit 123, Tower A, Main Street"/>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-muted-foreground">Price per Month (PHP)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 min-h-[44px]" placeholder="e.g., 15000"/>
              </div>
              <div>
                <Label htmlFor="areaSqm" className="text-sm font-medium text-muted-foreground">Area (sqm)</Label>
                <Input id="areaSqm" type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} className="mt-1 min-h-[44px]" placeholder="e.g., 55"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium text-muted-foreground">Bedrooms</Label>
                <Input id="bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="mt-1 min-h-[44px]" placeholder="e.g., 2"/>
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium text-muted-foreground">Bathrooms</Label>
                <Input id="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="mt-1 min-h-[44px]" placeholder="e.g., 1"/>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="brand" className="text-sm font-medium text-muted-foreground">Brand (Optional)</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 min-h-[44px]" placeholder="e.g., Avida, Kingsfield"/>
                </div>
                <div>
                    <Label htmlFor="status" className="text-sm font-medium text-muted-foreground">Listing Status</Label>
                    <Select value={status} onValueChange={setStatus} required>
                        <SelectTrigger className="w-full mt-1 min-h-[44px] bg-input border-input-border">
                        <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                        {propertyStatuses.map(s => (
                            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            <div>
                <Label htmlFor="images" className="text-sm font-medium text-muted-foreground">Property Images (Max 5 total)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-input-border border-dashed rounded-md min-h-[150px] hover:border-primary transition-colors bg-input/50">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                            <label
                                htmlFor="images-upload"
                                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                            >
                                <span>Upload files</span>
                                <input id="images-upload" name="images-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                </div>
                 {(existingImagePaths.length > 0 || imagePreviews.length > 0) && (
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Current images ({existingImagePaths.length + imagePreviews.length} / 5):</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {existingImagePaths.map((path, index) => (
                                <div key={`existing-${index}`} className="relative group aspect-square">
                                    <img-replace src={path} alt={`Existing image ${index + 1}`} className="w-full h-full object-cover rounded-md border border-border" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={() => removeExistingImage(path)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {imagePreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="relative group aspect-square">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border border-border" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={() => removeNewImage(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 text-base min-h-[48px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
              {isSubmitting ? (isEditMode ? 'Updating Property...' : 'Listing Property...') : (isEditMode ? 'Update Property' : 'List My Property')}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddPropertyPage;