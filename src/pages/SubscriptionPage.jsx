import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, ArrowRight, Briefcase, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const tiers = [
  {
    name: 'Basic Tier',
    price: 50,
    propertiesAllowed: 1,
    features: ['List 1 property', 'Standard support', 'Basic analytics'],
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    id: 'basic'
  },
  {
    name: 'Pro Tier',
    price: 100,
    propertiesAllowed: 5,
    features: ['List up to 5 properties', 'Priority support', 'Advanced analytics', 'Featured listings'],
    icon: <Zap className="w-8 h-8 text-accent" />,
    id: 'pro'
  }
];

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      setCheckingSubscription(true);
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active') 
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { 
          throw error;
        }
        setCurrentSubscription(data);
      } catch (error) {
        console.error("Error fetching current subscription:", error.message);
        toast({
          title: "Error",
          description: "Could not fetch your current subscription status.",
          variant: "destructive"
        });
      } finally {
        setCheckingSubscription(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const handleSelectTier = async (tier) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "Please log in to subscribe.", variant: "destructive"});
      navigate('/login');
      return;
    }

    setSelectedTier(tier);
    setIsLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { data: existingActiveSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('id, tier, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingActiveSubscription) {
         if (existingActiveSubscription.tier === tier.id && new Date(existingActiveSubscription.expires_at) > new Date()) {
            toast({
              title: "Already Subscribed",
              description: `You are already on the ${tier.name}. Your subscription is active until ${new Date(existingActiveSubscription.expires_at).toLocaleDateString()}.`,
              variant: "default"
            });
            setIsLoading(false);
            setSelectedTier(null);
            navigate('/owner/dashboard');
            return;
         }
        
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (updateError) throw updateError;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: tier.id,
          status: 'active',
          properties_allowed: tier.propertiesAllowed,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;

      setCurrentSubscription(data);
      toast({
        title: "Subscription Successful! 🎉",
        description: `You've successfully subscribed to the ${tier.name}.`,
      });
      navigate('/owner/dashboard');

    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Could not process your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  if (checkingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height))]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="py-12 sm:py-16 bg-gradient-to-br from-background via-background to-muted/30 min-h-screen"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3">
            Choose Your Plan
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Unlock features to manage and grow your rental properties with Homygo.
          </p>
        </div>

        {currentSubscription && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 sm:p-6 bg-primary/10 border border-primary rounded-lg text-center shadow-lg"
          >
            <div className="flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6 text-primary mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-primary-foreground">Your Current Plan: {currentSubscription.tier === 'basic' ? 'Basic Tier' : 'Pro Tier'}</h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Expires on: {new Date(currentSubscription.expires_at).toLocaleDateString()}. 
              You can list up to {currentSubscription.properties_allowed} properties.
            </p>
             <p className="text-xs text-muted-foreground mt-1">Selecting a new plan will replace your current one.</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={`bg-card/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl border transition-all duration-300 hover:shadow-primary/30 ${selectedTier?.id === tier.id && isLoading ? 'ring-2 ring-primary' : 'border-border/30'}`}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                {tier.icon}
                <h2 className="text-xl sm:text-2xl font-semibold ml-3 text-foreground">{tier.name}</h2>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                ₱{tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Allows up to {tier.propertiesAllowed} active propert{tier.propertiesAllowed > 1 ? 'ies' : 'y'}.</p>
              <ul className="space-y-2 mb-6 sm:mb-8 text-sm sm:text-base">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectTier(tier)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
                disabled={isLoading && selectedTier?.id === tier.id}
              >
                {isLoading && selectedTier?.id === tier.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {isLoading && selectedTier?.id === tier.id ? 'Processing...' : 'Select Plan'}
              </Button>
            </motion.div>
          ))}
        </div>
         <p className="text-center text-xs text-muted-foreground mt-8">
          Payments are mocked for now. Selecting a plan will activate it immediately for 30 days.
        </p>
      </div>
    </motion.div>
  );
};

export default SubscriptionPage;