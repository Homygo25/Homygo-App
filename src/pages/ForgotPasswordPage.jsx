import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { sendPasswordResetEmail, loading } = useAuth();
  const navigate = useNavigate();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    
    const success = await sendPasswordResetEmail(email);
    if (success) {
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a reset link has been sent. Please check your inbox (and spam folder).",
        duration: 7000,
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
            <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-primary" />
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">No worries! Enter your email and we'll send you a reset link.</p>
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

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
        </form>
        
        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Button variant="link" className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm" asChild>
            <Link to="/login"> <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Back to Login </Link>
          </Button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;