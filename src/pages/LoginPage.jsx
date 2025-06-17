
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus, Loader2, Chrome, KeyRound, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PinAccessModal from '@/components/PinAccessModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { 
    login, 
    signInWithGoogle, 
    loading, 
    user, 
    isAuthenticated, 
    isPinAccessRequired, 
    setIsPinAccessRequired, 
    verifyPin,
    logout,
    needsPinSetup,
    setNeedsPinSetup,
    userRole
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";
  
  const [showActualPinModal, setShowActualPinModal] = useState(false);
  
  const from = location.state?.from?.pathname || (isAuthenticated ? (userRole === 'owner' ? '/owner/dashboard' : '/user/listings') : '/');
  const pinBypass = location.search.includes('pinBypass=true') || location.state?.pinBypass;
  const fromPinRequired = location.state?.fromPinRequired || false;

  useEffect(() => {
    if (isAuthenticated && isPinAccessRequired && !pinBypass) {
      setShowActualPinModal(true);
    } else if (isAuthenticated && !isPinAccessRequired && !needsPinSetup) {
      // If authenticated, no PIN needed, no setup needed, then redirect
      const targetPath = userRole === 'owner' ? '/owner/dashboard' : '/user/listings';
      navigate(targetPath, { replace: true });
    } else {
      setShowActualPinModal(false);
    }
  }, [isAuthenticated, isPinAccessRequired, pinBypass, needsPinSetup, userRole, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Login Failed", description: "Email and password are required.", variant: "destructive" });
      return;
    }
    
    const loginResult = await login(email, password);

    if (loginResult.success && loginResult.user) {
      // AuthContext now handles setting needsPinSetup and isPinAccessRequired
      // The useEffect above will handle redirection or showing PIN modal
      if (!loginResult.error) { // ensure no error like "email not confirmed"
         toast({ title: "Login Successful!", description: `Welcome back!`});
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // AuthContext will handle redirect after Google sign-in and PIN setup logic
  };

  const handlePinSubmit = async (enteredPin) => {
    const pinVerified = await verifyPin(enteredPin);
    if (pinVerified) {
      setShowActualPinModal(false);
      setIsPinAccessRequired(false); // This will trigger the useEffect for redirection
      toast({ title: "PIN Accepted!", description: "Redirecting..." });
      // Redirection is handled by useEffect based on auth state
    }
  };

  const handleLoginWithPasswordForPinModal = async () => {
    setShowActualPinModal(false);
    // Effectively, we want to bypass the PIN for this one attempt and show the login form
    // The user is already on the login page. We just need to ensure the PIN modal doesn't reappear.
    // Logging out and navigating to login with pinBypass=true will achieve this.
    await logout({ navigateTo: '/login?pinBypass=true', state: { pinBypass: true } });
  };
  
  const handlePinModalClose = async () => {
    // If user closes PIN modal without action, consider it a PIN bypass attempt or logout.
    setShowActualPinModal(false);
    await logout({ navigateTo: '/login?pinBypass=true', state: { pinBypass: true } });
  }


  if (showActualPinModal && !pinBypass) {
    return (
      <PinAccessModal 
        isOpen={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) { 
            handlePinModalClose(); // Treat close as wanting to log in with password
          }
        }} 
        onPinSubmit={handlePinSubmit}
        onLoginWithPassword={handleLoginWithPasswordForPinModal}
        loading={loading}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-border/30"
      >
        <div className="text-center mb-6 sm:mb-8">
          <img  
            className="w-auto h-20 sm:h-24 mx-auto mb-4 object-contain" 
            alt="Homygo Character"
            src={characterLogoUrl} />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Sign in to continue to Homygo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground flex items-center">
              <Lock className="w-4 h-4 mr-2 text-primary" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="current-password"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs sm:text-sm">
             <Button
              type="button"
              variant="link"
              className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm"
              onClick={() => setShowActualPinModal(true)}
              disabled={!localStorage.getItem(`homygo-pin-${user?.id}`)} 
            >
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Enter PIN Instead
            </Button>
            <Button 
                type="button" 
                variant="link"
                onClick={() => navigate('/forgot-password')} 
                className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Forgot password?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            disabled={loading}
          >
            {loading && !isPinAccessRequired ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
            {loading && !isPinAccessRequired ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <>
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted/50 text-foreground py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Chrome className="w-5 h-5 mr-2" /> }
            Sign In with Google
          </Button>
        </>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button variant="link" className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm" asChild>
            <Link to="/signup"> <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Sign Up </Link>
          </Button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
