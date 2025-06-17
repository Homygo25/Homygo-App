
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import LandingPage from '@/pages/LandingPage'; 
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import OwnerDashboardPage from '@/pages/OwnerDashboardPage';
import AddPropertyPage from '@/pages/AddPropertyPage'; 
import ExplorePage from '@/pages/ExplorePage';
import UserPropertyDetailsPage from '@/pages/UserPropertyDetailsPage';
import UserProfilePage from '@/pages/UserProfilePage';
import WishlistPage from '@/pages/WishlistPage';
import BookingsPage from '@/pages/BookingsPage'; // Changed from TripsPage
import MessagesPage from '@/pages/MessagesPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';

import PinAccessModal from '@/components/PinAccessModal';
import PinSetupModal from '@/components/PinSetupModal';
import PledgeModal from '@/components/onboarding/PledgeModal';
import NotificationsModal from '@/components/onboarding/NotificationsModal';
import PriceInfoModal from '@/components/onboarding/PriceInfoModal';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role, pinProtected = false }) => {
  const { 
    isAuthenticated, 
    userRole, 
    loading, 
    isPinAccessRequired, 
    setIsPinAccessRequired, 
    verifyPin: authVerifyPin,
    logout: authLogout,
    showOnboardingFlow
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (pinProtected && isPinAccessRequired && !showOnboardingFlow) {
    return (
      <PinAccessModal 
        isOpen={true}
        onOpenChange={(isOpen) => {
           if (!isOpen) {
            authLogout({ navigateTo: '/login' });
           }
        }}
        onPinSubmit={async (pin) => {
          const success = await authVerifyPin(pin);
          if (success) {
            setIsPinAccessRequired(false);
          }
        }}
        onLoginWithPassword={async () => {
          await authLogout({ navigateTo: '/login?pinBypass=true', state: { from: location, pinBypass: true } });
        }}
        loading={loading}
      />
    );
  }


  if (role && userRole !== role) {
     toast({
      title: "Access Denied",
      description: `You are logged in as ${userRole}. This page requires ${role} role.`,
      variant: "destructive",
    });
    
    if (userRole === 'owner') return <Navigate to="/owner/dashboard" replace />;
    if (userRole === 'guest') return <Navigate to="/explore" replace />; 
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    loading: authLoading, 
    isAuthenticated: userIsAuthenticated, 
    sessionRefreshed,
    needsPinSetup,
    setNeedsPinSetup,
    setPin: authSetPin,
    isPinAccessRequired,
    setIsPinAccessRequired: authSetIsPinAccessRequired,
    verifyPin: authVerifyPin,
    logout: authLogout,
    handlePasswordResetEvent,
    userRole,
    showOnboardingFlow,
    currentOnboardingStep,
    nextOnboardingStep,
    markOnboardingComplete,
    setShowOnboardingFlow
  } = useAuth();

  const [showPinSetupModal, setShowPinSetupModal] = useState(false);

  useEffect(() => {
    if (userIsAuthenticated && needsPinSetup && !isPinAccessRequired && !showOnboardingFlow) {
      setShowPinSetupModal(true);
    } else {
      setShowPinSetupModal(false);
    }
  }, [userIsAuthenticated, needsPinSetup, isPinAccessRequired, showOnboardingFlow]);
  
  useEffect(() => {
    if (sessionRefreshed && location.search.includes('type=signup') && location.search.includes('token=')) {
      toast({
        title: "✅ Email Verified!",
        description: "Your email has been successfully verified. You can now log in.",
        variant: "default",
        duration: 7000,
      });
      navigate('/login', { replace: true });
    }
  }, [sessionRefreshed, location, navigate]);

  useEffect(() => {
    handlePasswordResetEvent();
  }, [handlePasswordResetEvent, location]);
  
  const handlePinSetup = async (pinValue) => {
    const success = await authSetPin(pinValue);
    if (success) {
      setNeedsPinSetup(false);
      setShowPinSetupModal(false);
      toast({title: "PIN Setup Successful!", description: "You can now use your PIN for quick access."});
    }
    return success;
  };

  if (authLoading && !sessionRefreshed) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userIsAuthenticated && isPinAccessRequired && !showOnboardingFlow && !['/login', '/signup', '/forgot-password', '/reset-password'].some(path => location.pathname.startsWith(path))) {
     const currentPathIsProtected = !location.pathname.startsWith('/public-route'); // Example, adjust if needed
     if (currentPathIsProtected) {
        return (
            <PinAccessModal 
                isOpen={true}
                onOpenChange={(isOpen) => {
                if (!isOpen) { 
                    authLogout({ navigateTo: '/login' });
                }
                }}
                onPinSubmit={async (pin) => {
                const success = await authVerifyPin(pin);
                if (success) {
                    authSetIsPinAccessRequired(false);
                }
                }}
                onLoginWithPassword={async () => {
                    await authLogout({ navigateTo: '/login?pinBypass=true', state: { from: location, pinBypass: true } });
                }}
                loading={authLoading}
            />
        );
     }
  }

  const handleOnboardingAgree = () => nextOnboardingStep();
  const handleNotificationsProceed = () => nextOnboardingStep();
  const handlePriceInfoGotIt = async () => {
    await markOnboardingComplete();
    setShowOnboardingFlow(false);
    const targetPath = userRole === 'owner' ? '/owner/dashboard' : '/explore';
    navigate(targetPath, { replace: true });
  };
  
  const pathsWithoutHeaderFooter = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthPage = pathsWithoutHeaderFooter.some(path => location.pathname.startsWith(path));
  
  const showHeader = !isAuthPage && !isPinAccessRequired && !showOnboardingFlow;
  const showFooter = !isAuthPage && !isPinAccessRequired && !showOnboardingFlow && !location.pathname.startsWith('/owner'); // No main footer for owner dashboard
  const showBottomNav = userIsAuthenticated && !isPinAccessRequired && !showOnboardingFlow && !isAuthPage;

  return (
    <div className={`min-h-screen flex flex-col text-foreground bg-background`}>
      <Toaster />
      {showOnboardingFlow && currentOnboardingStep === 1 && (
        <PledgeModal 
          isOpen={true} 
          onOpenChange={() => { setShowOnboardingFlow(false); markOnboardingComplete(); navigate(userRole === 'owner' ? '/owner/dashboard' : '/explore', { replace: true }); }} 
          onAgree={handleOnboardingAgree} 
        />
      )}
      {showOnboardingFlow && currentOnboardingStep === 2 && (
        <NotificationsModal 
          isOpen={true} 
          onOpenChange={() => { setShowOnboardingFlow(false); markOnboardingComplete(); navigate(userRole === 'owner' ? '/owner/dashboard' : '/explore', { replace: true }); }} 
          onProceed={handleNotificationsProceed} 
        />
      )}
      {showOnboardingFlow && currentOnboardingStep === 3 && (
        <PriceInfoModal 
          isOpen={true} 
          onOpenChange={() => { setShowOnboardingFlow(false); markOnboardingComplete(); navigate(userRole === 'owner' ? '/owner/dashboard' : '/explore', { replace: true }); }} 
          onGotIt={handlePriceInfoGotIt} 
        />
      )}

      <PinSetupModal
        isOpen={showPinSetupModal}
        onOpenChange={(isOpen) => {
            if (!isOpen && needsPinSetup) { 
                toast({title: "PIN Setup Skipped", description: "You can set up a PIN later from your profile.", variant: "default"});
                setNeedsPinSetup(false); 
            }
            setShowPinSetupModal(isOpen);
        }}
        onPinSet={handlePinSetup}
        loading={authLoading}
      />
      
      {showHeader && <Header />}
      <main className={`flex-grow ${showBottomNav ? 'pb-16 md:pb-0' : ''} ${!showHeader ? 'pt-0' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/explore" element={ <ProtectedRoute role="guest" pinProtected={true}><ExplorePage /></ProtectedRoute> } />
          <Route path="/user/listings" element={ <Navigate to="/explore" replace /> } /> {/* Redirect old listings to explore */}
          <Route path="/user/listings/:id" element={ <ProtectedRoute role="guest" pinProtected={true}><UserPropertyDetailsPage /></ProtectedRoute> } />
          <Route path="/profile" element={ <ProtectedRoute role="guest" pinProtected={true}><UserProfilePage /></ProtectedRoute> } />
          <Route path="/wishlists" element={ <ProtectedRoute role="guest" pinProtected={true}><WishlistPage /></ProtectedRoute> } />
          <Route path="/trips" element={ <ProtectedRoute role="guest" pinProtected={true}><BookingsPage /></ProtectedRoute> } /> {/* Path remains /trips, component is BookingsPage */}
          <Route path="/messages" element={ <ProtectedRoute role="guest" pinProtected={true}><MessagesPage /></ProtectedRoute> } />
          <Route path="/account-settings" element={ <ProtectedRoute role="guest" pinProtected={true}><AccountSettingsPage /></ProtectedRoute> } />

          <Route 
            path="/owner/dashboard" 
            element={ <ProtectedRoute role="owner" pinProtected={true}><OwnerDashboardPage /></ProtectedRoute> } 
          />
          <Route
            path="/owner/properties/create"
            element={ <ProtectedRoute role="owner" pinProtected={true}><AddPropertyPage /></ProtectedRoute> }
          />
           <Route
            path="/owner/properties/:propertyId/edit"
            element={ <ProtectedRoute role="owner" pinProtected={true}><AddPropertyPage /></ProtectedRoute> }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
