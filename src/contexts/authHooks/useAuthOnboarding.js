
import { useCallback, useState } from 'react';

export const useAuthOnboarding = (user, userProfile, setUserProfile, setLoading, supabase, toast, navigate, userRole) => {
  const [showOnboardingFlow, setShowOnboardingFlowInternal] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStepInternal] = useState(0);
  
  const setShowOnboardingFlow = useCallback((value) => {
    setShowOnboardingFlowInternal(value);
  }, []);

  const setCurrentOnboardingStep = useCallback((value) => {
    setCurrentOnboardingStepInternal(value);
  }, []);

  const nextOnboardingStep = useCallback(() => {
    setCurrentOnboardingStepInternal(prev => prev + 1);
  }, []);

  const markOnboardingComplete = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);
    
    setLoading(false);
    if (error) {
      toast({ title: "Onboarding Error", description: "Could not save onboarding status.", variant: "destructive"});
    } else {
      if (setUserProfile) {
          setUserProfile(prev => ({...prev, has_completed_onboarding: true}));
      }
      setShowOnboardingFlowInternal(false);
      setCurrentOnboardingStepInternal(0);
      // Navigation after completion is handled in App.jsx
    }
  }, [user, setLoading, supabase, toast, setUserProfile, userRole, navigate]);

  return {
    showOnboardingFlow,
    currentOnboardingStep,
    setShowOnboardingFlow,
    setCurrentOnboardingStep,
    nextOnboardingStep,
    markOnboardingComplete
  };
};
