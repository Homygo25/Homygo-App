import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, Home, PlusCircle, ShieldAlert, ArrowLeft, UploadCloud, X } from 'lucide-react';
import { PROPERTY_TYPES } from '@/data/propertiesData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canAddProperty, setCanAddProperty] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaSqm, setAreaSqm] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const checkSubscriptionAndProperties = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('tier, status, properties_allowed, expires_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subError && subError.code !== 'PGRST116') throw subError;
        
        if (!subData || new Date(subData.expires_at) < new Date()) {
          setSubscription(null);
          toast({
            title: "Subscription Required",
            description: "You need an active subscription to add properties.",
            variant: "destructive",
            duration: 5000
          });
          navigate('/subscribe');
          return;
        }
        setSubscription(subData);

        const { count, error: countError } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (countError) throw countError;
        
        setPropertyCount(count || 0);

        if (subData && count < subData.properties_allowed) {
          setCanAddProperty(true);
        } else {
          setCanAddProperty(false);
          toast({
            title: "Listing Limit Reached",
            description: `You've reached your limit of ${subData.properties_allowed} properties. Please upgrade your plan to add more.`,
            variant: "destructive",
            duration: 7000
          });
        }

      } catch (error) {
        console.error("Error checking subscription/properties:", error.message);
        toast({
          title: "Error",
          description: "Could not verify your subscription status or property count.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionAndProperties();
  }, [user, navigate]);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast({ title: "Image Limit", description: "You can upload a maximum of 5 images.", variant: "destructive" });
      return;
    }
    setImages(prev => [...prev, ...files.slice(0, 5 - prev.length)]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews.slice(0, 5 - prev.length)]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      newPreviews.forEach(preview => URL.revokeObjectURL(preview)); 
      return newPreviews;
    });
  };
  
  useEffect(() => {
    return () => imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imagePreviews]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canAddProperty || isSubmitting) return;
    
    setIsSubmitting(true);

    if (images.length === 0) {
        toast({title: "Image Required", description: "Please upload at least one image for your property.", variant: "destructive"});
        setIsSubmitting(false);
        return;
    }

    const imagePaths = [];
    for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
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
        imagePaths.push(publicUrl);
    }


    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          title,
          description,
          type,
          location,
          price: parseFloat(price),
          bedrooms: parseInt(bedrooms) || null,
          bathrooms: parseInt(bathrooms) || null,
          area_sqm: parseFloat(areaSqm) || null,
          image_paths: imagePaths,
          availability_status: 'available', 
        });

      if (error) throw error;

      toast({
        title: "Property Added! 🎉",
        description: `${title} has been successfully listed.`,
      });
      navigate('/owner/dashboard');

    } catch (error) {
      console.error("Error adding property:", error.message);
      toast({
        title: "Failed to Add Property",
        description: error.message || "Could not add your property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height))] p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking your subscription status...</p>
      </div>
    );
  }

  if (!canAddProperty && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height))] p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive-foreground mb-2">Cannot Add Property</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          You've either reached your property listing limit for your current plan, or your subscription has expired.
        </p>
        <Button onClick={() => navigate('/subscribe')} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
          View Subscription Plans
        </Button>
        <Button variant="outline" onClick={() => navigate('/owner/dashboard')} className="mt-2 min-h-[44px]">
            Back to Dashboard
        </Button>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">List Your Property</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Fill in the details below to showcase your rental.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">Property Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 min-h-[44px]" placeholder="e.g., Cozy 2BR Apartment near City Center"/>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</Label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]" placeholder="Detailed description of your property..."></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-muted-foreground">Property Type</Label>
                 <Select value={type} onValueChange={setType} required>
                    <SelectTrigger className="w-full mt-1 min-h-[44px]">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.filter(pt => pt !== 'All Types').map(pt => (
                        <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location (Barangay/Area)</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-1 min-h-[44px]" placeholder="e.g., Carmen, Pueblo de Oro"/>
              </div>
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

            <div>
                <Label htmlFor="images" className="text-sm font-medium text-muted-foreground">Property Images (Max 5)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md min-h-[150px] hover:border-primary transition-colors">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                            <label
                                htmlFor="images"
                                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                            >
                                <span>Upload files</span>
                                <input id="images" name="images" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                </div>
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 text-base min-h-[48px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
              {isSubmitting ? 'Listing Property...' : 'List My Property'}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddPropertyPage;