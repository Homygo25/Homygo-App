import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUserPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove '#'
      const accessToken = params.get('access_token');
      const error = params.get('error_description');

      if (error) {
        toast({ title: "Error", description: decodeURIComponent(error), variant: "destructive", duration: 7000 });
        navigate('/login', { replace: true });
      } else if (!accessToken) {
         toast({ title: "Invalid Link", description: "The password reset link is invalid or has expired. Please request a new one.", variant: "destructive", duration: 7000 });
         navigate('/forgot-password', { replace: true });
      }
    } else if (!location.search.includes('access_token=')){ 
        // If no hash and no access_token in search (older Supabase versions might use search)
        toast({ title: "Invalid Link", description: "No reset token found. Please use the link from your email.", variant: "destructive", duration: 7000 });
        navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({ title: "Passwords Required", description: "Please enter and confirm your new password.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords Do Not Match", description: "Please ensure both password fields are identical.", variant: "destructive" });
      return;
    }

    const success = await updateUserPassword(newPassword);
    if (success) {
      toast({
        title: "Password Reset Successful!",
        description: "You can now log in with your new password.",
      });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-muted/20 p-4">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-primary" />
            Set New Password
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Create a new strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="new-password" className="text-sm text-foreground flex items-center">
              <Lock className="w-4 h-4 mr-2 text-primary" /> New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="•••••••• (min. 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="confirm-password" className="text-sm text-foreground flex items-center">
              <Lock className="w-4 h-4 mr-2 text-primary" /> Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="new-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
            {loading ? 'Resetting Password...' : 'Reset Password & Login'}
          </Button>
        </form>

         <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Problem with the link?{' '}
          <Button variant="link" className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm" asChild>
            <Link to="/forgot-password"> <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Request a new link </Link>
          </Button>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;