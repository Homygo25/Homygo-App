
import { useCallback } from 'react';

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const useAuthPin = (
  supabase, toast, setLoading, user, 
  setIsPinAccessRequired, setNeedsPinSetup,
  setShowOnboardingFlow, setCurrentOnboardingStep,
  userProfile, userRole, navigate, logout // Passed logout from authActions
) => {

  const setPin = useCallback(async (pinToSet) => {
    if (!user) return false;
    setLoading(true);
    try {
      const hashedPin = await digestMessage(pinToSet); 
      localStorage.setItem(`homygo-pin-${user.id}`, hashedPin);
      setNeedsPinSetup(false);
      setIsPinAccessRequired(false); 
      
      if (userProfile && !userProfile.has_completed_onboarding) {
        setShowOnboardingFlow(true);
        setCurrentOnboardingStep(1);
      } else {
         const targetPath = userRole === 'owner' ? '/owner/dashboard' : '/explore';
         navigate(targetPath, { replace: true });
      }
      setLoading(false);
      return true;
    } catch (e) {
      toast({ title: "PIN Setup Failed", variant: "destructive" });
      setLoading(false);
      return false;
    }
  }, [user, setLoading, setNeedsPinSetup, setIsPinAccessRequired, userProfile, setShowOnboardingFlow, setCurrentOnboardingStep, userRole, navigate]);

  const verifyPin = useCallback(async (enteredPin) => {
    if (!user) return false;
    setLoading(true);

    const lockoutKey = `homygo-pin-lockout-until-${user.id}`;
    const attemptCountKey = `homygo-pin-attempt-count-${user.id}`;
    const lockoutUntil = parseInt(localStorage.getItem(lockoutKey) || '0', 10);

    if (Date.now() < lockoutUntil) {
      const timeLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      toast({ title: "PIN Locked", description: `Try again in ${timeLeft}s.`, variant: "destructive" });
      setLoading(false);
      return false;
    }
    
    const storedPinHash = localStorage.getItem(`homygo-pin-${user.id}`);
    if (!storedPinHash) {
      toast({ title: "PIN Not Set", description: "Please log in to set up a PIN.", variant: "destructive" });
      setIsPinAccessRequired(false); 
      setLoading(false);
      await logout({navigateTo: '/login'}); 
      return false;
    }

    const enteredPinHash = await digestMessage(enteredPin);

    if (enteredPinHash === storedPinHash) {
      setIsPinAccessRequired(false); 
      localStorage.removeItem(attemptCountKey); 
      localStorage.removeItem(lockoutKey);
      toast({ title: "PIN Accepted!", description: "Accessing your account..." });
      
      if (userProfile && !userProfile.has_completed_onboarding) {
        setShowOnboardingFlow(true);
        setCurrentOnboardingStep(1);
      } else {
        const targetPath = userRole === 'owner' ? '/owner/dashboard' : '/explore';
        navigate(targetPath, { replace: true });
      }
      setLoading(false);
      return true;
    } else {
      let attempts = parseInt(localStorage.getItem(attemptCountKey) || '0', 10) + 1;
      if (attempts >= 3) {
        const newLockoutUntil = Date.now() + 60000; 
        localStorage.setItem(lockoutKey, newLockoutUntil.toString());
        localStorage.setItem(attemptCountKey, '0');
        toast({ title: "PIN Incorrect & Locked", description: "Too many attempts. Try again in 60s.", variant: "destructive" });
      } else {
        localStorage.setItem(attemptCountKey, attempts.toString());
        toast({ title: "PIN Incorrect", description: `${3-attempts} attempts remaining.`, variant: "destructive" });
      }
      setLoading(false);
      return false;
    }
  }, [user, setLoading, setIsPinAccessRequired, userProfile, setShowOnboardingFlow, setCurrentOnboardingStep, userRole, navigate, logout]);
  
  const clearPin = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    localStorage.removeItem(`homygo-pin-${user.id}`);
    localStorage.removeItem(`homygo-pin-attempt-count-${user.id}`);
    localStorage.removeItem(`homygo-pin-lockout-until-${user.id}`);
    setNeedsPinSetup(true); 
    setIsPinAccessRequired(false); 
    toast({ title: "PIN Cleared", description: "Your PIN has been removed. You'll be asked to set a new one on next login." });
    setLoading(false);
    await logout({ navigateTo: '/login' }); 
  }, [user, setLoading, setNeedsPinSetup, setIsPinAccessRequired, logout]);

  return { setPin, verifyPin, clearPin };
};
