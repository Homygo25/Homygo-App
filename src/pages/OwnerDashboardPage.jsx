import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { ListPlus, CalendarDays, DollarSign } from 'lucide-react';

import DashboardHeader from '@/components/owner-dashboard/DashboardHeader';
import StatCard from '@/components/owner-dashboard/StatCard';
import PropertyListingsTable from '@/components/owner-dashboard/PropertyListingsTable';
import PinSetupDialog from '@/components/owner-dashboard/PinSetupDialog';
import PinAccessModal from '@/components/PinAccessModal';


const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    isPinAccessRequired, 
    setIsPinAccessRequired, 
    verifyPin, 
    setPin, 
    isPinSetupComplete, 
    clearPin, 
    loading: authLoading 
  } = useAuth();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0, 
    monthlyEarnings: 0, 
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showPinSetupDialog, setShowPinSetupDialog] = useState(false);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!user || (isPinAccessRequired && !authLoading)) return; 

      setLoadingStats(true);
      setLoadingProperties(true);

      try {
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (propertiesError) throw propertiesError;
        
        setProperties(propertiesData || []);
        const totalProperties = propertiesData?.length || 0;
        
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, total_price, status, start_date')
          .in('property_id', propertiesData.map(p => p.id))
          .eq('status', 'confirmed'); 
        
        if (bookingsError) console.warn("Error fetching bookings:", bookingsError.message);
        
        const activeBookings = bookingsData?.length || 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyEarnings = bookingsData
          ?.filter(b => new Date(b.start_date).getMonth() === currentMonth && new Date(b.start_date).getFullYear() === currentYear)
          .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0) || 0;

        setStats({ totalProperties, activeBookings, monthlyEarnings });
      } catch (error) {
        toast({ title: "Error loading dashboard data", description: error.message, variant: "destructive" });
      } finally {
        setLoadingStats(false);
        setLoadingProperties(false);
      }
    };
    if(!isPinAccessRequired) fetchOwnerData();
  }, [user, isPinAccessRequired, authLoading]);

  const handlePinSubmit = async (enteredPin) => {
    const success = await verifyPin(enteredPin);
    if (success) {
      setIsPinAccessRequired(false);
    }
  };

  const handleLoginWithPassword = async () => {
    await logout({ navigateTo: null }); // Prevent AuthContext from navigating
    navigate('/login', { state: { from: { pathname: '/owner/dashboard' }, pinBypass: true }, replace: true });
  };

  const handleAddNewProperty = () => navigate('/owner/properties/create');
  const handleEditProperty = (propertyId) => navigate(`/owner/properties/${propertyId}/edit`);

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;
    try {
      const { error } = await supabase.from('properties').delete().eq('id', propertyToDelete.id).eq('user_id', user.id);
      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      setStats(prev => ({ ...prev, totalProperties: prev.totalProperties - 1 }));
      toast({ title: "Property Deleted", description: `${propertyToDelete.title} removed.`, variant: "default" });
    } catch (error) {
      toast({ title: "Error Deleting Property", description: error.message, variant: "destructive" });
    } finally {
      setPropertyToDelete(null);
    }
  };
  
  if (isPinAccessRequired && !authLoading) {
    return (
      <PinAccessModal 
        isOpen={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
             handleLoginWithPassword(); // Force full login if modal is closed without PIN
          }
        }}
        onPinSubmit={handlePinSubmit}
        onLoginWithPassword={handleLoginWithPassword}
        loading={authLoading}
      />
    );
  }

  return (
    <div className="py-6 sm:py-8 md:py-12 bg-gradient-to-br from-background via-background/90 to-muted/30 text-foreground min-h-screen">
      <PinSetupDialog isOpen={showPinSetupDialog} onOpenChange={setShowPinSetupDialog} onPinSet={setPin} />
      <div className="container mx-auto px-4">
        <DashboardHeader
          onAddNewProperty={handleAddNewProperty}
          onSetupPin={() => setShowPinSetupDialog(true)}
          onClearPin={clearPin}
          isPinSetupComplete={isPinSetupComplete}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatCard label="Total Properties" value={stats.totalProperties} icon={<ListPlus className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-primary" isLoading={loadingStats} />
          <StatCard label="Active Bookings" value={stats.activeBookings} icon={<CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-accent" isLoading={loadingStats} />
          <StatCard label="Monthly Earnings (PHP)" value={stats.monthlyEarnings.toLocaleString()} icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />} color="text-green-500" isLoading={loadingStats} />
        </div>
        <PropertyListingsTable
          properties={properties}
          isLoading={loadingProperties}
          onEditProperty={handleEditProperty}
          onDeleteProperty={confirmDeleteProperty}
          setPropertyToDelete={setPropertyToDelete}
        />
      </div>
    </div>
  );
};

export default OwnerDashboardPage;