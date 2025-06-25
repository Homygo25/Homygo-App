import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus, Loader2, Chrome, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { 
    login, 
    signInWithGoogle, 
    loading, 
    isAuthenticated, 
    userRole,
    showOnboardingFlow
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";
  
  const from = location.state?.from?.pathname || (userRole === 'owner' ? '/owner/dashboard' : '/explore');

  useEffect(() => {
    if (isAuthenticated && !showOnboardingFlow) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, showOnboardingFlow, navigate, from]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Login Failed", description: "Email and password are required.", variant: "destructive" });
      return;
    }
    
    const loginResult = await login(email, password);

    if (loginResult.success && loginResult.user) {
      if (!loginResult.error) { 
         toast({ title: "Login Successful!", description: `Welcome back!`});
         // Redirection or onboarding is handled by AuthContext and useEffect above
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // AuthContext will handle redirect or onboarding after Google sign-in
  };
  
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
          
          <div className="flex items-center justify-end text-xs sm:text-sm">
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
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
            {loading ? 'Signing In...' : 'Sign In'}
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