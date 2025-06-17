
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading, isPinAccessRequired, setLoading: setAuthLoading } = useAuth();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";

  useEffect(() => {
    // This effect handles redirection AFTER authentication state is clear (not loading)
    // AND if PIN is not currently required.
    if (!loading && isAuthenticated && !isPinAccessRequired) {
      if (userRole === 'owner') {
        navigate('/owner/dashboard', { replace: true });
      } else if (userRole === 'guest') {
        navigate('/user/listings', { replace: true }); // Corrected from /user/map
      }
    } else if (!loading && isAuthenticated && isPinAccessRequired) {
      // If authenticated but PIN is required, ensure user is on login page to show PIN modal
      navigate('/login', { replace: true, state: { fromPinRequired: true } });
    }
  }, [isAuthenticated, userRole, loading, navigate, isPinAccessRequired]);


  // This effect is specifically for the initial load of the landing page
  // If the auth state is still loading, we show a loader.
  // We set auth loading to false once this page has made its initial check,
  // to prevent an infinite loading loop if other effects depend on `loading`.
  useEffect(() => {
    if(loading) {
        // Simulate a brief moment to allow auth state to settle if needed.
        // Or simply let the AuthContext's initial load handle this.
        // For now, we assume AuthContext handles initial loading state.
    }
  }, [loading, setAuthLoading]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background/90 to-muted/30 p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Homygo...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background/90 to-muted/30 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        className="flex flex-col items-center"
      >
        <img
          src={characterLogoUrl}
          alt="Homygo Mascot"
          className="w-48 h-48 sm:w-64 sm:h-64 mb-6 object-contain"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Welcome to Homygo!
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-md">
          Your next home is just a click away. Discover amazing places or list your own property.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="text-lg sm:text-xl px-10 py-6 sm:px-12 sm:py-7 rounded-full shadow-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 min-h-[60px]"
            onClick={() => navigate('/login')}
            disabled={isAuthenticated && isPinAccessRequired} // Disable if PIN is required to prevent navigation loop
          >
            <LogIn className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            Get Started
          </Button>
        </motion.div>
      </motion.div>
       <p className="absolute bottom-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Homygo. All rights reserved.</p>
    </div>
  );
};

export default LandingPage;
