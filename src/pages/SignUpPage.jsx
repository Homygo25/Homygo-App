import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, ShieldQuestion, Loader2, LogIn, Chrome, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('guest');
  const { signUp, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !role) {
      toast({ title: "Sign Up Failed", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Sign Up Failed", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    
    const { success, error, needsConfirmation } = await signUp(email, password, fullName, role);

    if (success && needsConfirmation) {
      navigate('/login'); 
    } else if (error) {
      // Toast handled in AuthContext
    }
  };

  const handleGoogleSignUp = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-card/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-border/30"
      >
        <div className="text-center mb-6 sm:mb-8">
          <img 
            className="w-auto h-20 sm:h-24 mx-auto mb-4 object-contain" 
            alt="Homygo Character"
            src={characterLogoUrl} />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Join Homygo today!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="fullName" className="text-sm text-foreground flex items-center">
              <User className="w-4 h-4 mr-2 text-primary" /> Full Name
            </Label>
            <Input
              id="fullName" type="text" placeholder="Juan Dela Cruz" value={fullName}
              onChange={(e) => setFullName(e.target.value)} required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="name"
            />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary" /> Email Address
            </Label>
            <Input
              id="email" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground flex items-center">
              <Lock className="w-4 h-4 mr-2 text-primary" /> Password
            </Label>
            <Input
              id="password" type="password" placeholder="•••••••• (min. 6 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="bg-input border-border focus:ring-primary text-foreground min-h-[44px] text-sm sm:text-base"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm text-foreground flex items-center">
              <ShieldQuestion className="w-4 h-4 mr-2 text-primary" /> Register as:
            </Label>
            <RadioGroup defaultValue="guest" onValueChange={setRole} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Label 
                htmlFor="role-guest" 
                className={`flex items-center space-x-2 p-2.5 sm:p-3 rounded-md border transition-colors duration-200 cursor-pointer w-full hover:border-primary min-h-[44px] ${role === 'guest' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border bg-input'}`}
              >
                <RadioGroupItem value="guest" id="role-guest" />
                <span className="font-medium text-foreground text-sm sm:text-base">Guest</span>
              </Label>
              <Label 
                htmlFor="role-owner" 
                className={`flex items-center space-x-2 p-2.5 sm:p-3 rounded-md border transition-colors duration-200 cursor-pointer w-full hover:border-primary min-h-[44px] ${role === 'owner' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border bg-input'}`}
              >
                <RadioGroupItem value="owner" id="role-owner" />
                <span className="font-medium text-foreground text-sm sm:text-base">Property Owner</span>
              </Label>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <UserPlus className="w-5 h-5 mr-2" />}
            {loading ? 'Creating Account...' : 'Create Account'}
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
          <Button variant="outline" className="w-full border-border hover:bg-muted/50 text-foreground py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]" onClick={handleGoogleSignUp} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Chrome className="w-5 h-5 mr-2" />}
            Sign Up with Google
          </Button>
        </>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="font-medium text-primary hover:text-primary/80 p-0 h-auto text-xs sm:text-sm" asChild>
            <Link to="/login"> <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Log In </Link>
          </Button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;