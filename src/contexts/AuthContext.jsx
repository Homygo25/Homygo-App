
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthSession } from '@/contexts/authHooks/useAuthSession';
import { useAuthActions } from '@/contexts/authHooks/useAuthActions';
import { useAuthPin } from '@/contexts/authHooks/useAuthPin';
import { useAuthOnboarding } from '@/contexts/authHooks/useAuthOnboarding';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [sessionRefreshed, setSessionRefreshed] = useState(false);
  
  const { 
    user, 
    userProfile, 
    userRole, 
    isAuthenticated, 
    isPinAccessRequired,
    needsPinSetup,
    setUser,
    setUserProfile,
    setUserRole,
    setIsAuthenticated,
    setIsPinAccessRequired,
    setNeedsPinSetup,
    fetchUserProfileData
  } = useAuthSession(setLoading);

  const {
    showOnboardingFlow,
    currentOnboardingStep,
    setShowOnboardingFlow,
    setCurrentOnboardingStep,
    nextOnboardingStep,
    markOnboardingComplete
  } = useAuthOnboarding(user, userProfile, setUserProfile, setLoading, supabase, toast, navigate, userRole);

  const processSession = async (session, isLoginOrSignUp = false) => {
    if (session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);
      const profileData = await fetchUserProfileData(session.user.id);
      setUserProfile(profileData);
      setUserRole(profileData.role);
      localStorage.setItem('homygo-role', profileData.role);

      const pinHash = localStorage.getItem(`homygo-pin-${session.user.id}`);
      if (pinHash) {
        setIsPinAccessRequired(true);
        setNeedsPinSetup(false);
      } else {
        setIsPinAccessRequired(false);
        if (isLoginOrSignUp) setNeedsPinSetup(true);
      }
      
      if ((!pinHash || !isPinAccessRequired) && !profileData.has_completed_onboarding && isLoginOrSignUp) {
        setShowOnboardingFlow(true);
        setCurrentOnboardingStep(1);
      } else if (profileData.has_completed_onboarding || (!isLoginOrSignUp && pinHash && !isPinAccessRequired )) {
        setShowOnboardingFlow(false);
        setCurrentOnboardingStep(0);
      }

    } else {
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem('homygo-role');
      setIsPinAccessRequired(false);
      setNeedsPinSetup(false);
      setShowOnboardingFlow(false);
      setCurrentOnboardingStep(0);
    }
  };
  
  const authActions = useAuthActions(supabase, toast, setLoading, processSession, navigate);
  const pinActions = useAuthPin(
    supabase, toast, setLoading, user, 
    setIsPinAccessRequired, setNeedsPinSetup, 
    setShowOnboardingFlow, setCurrentOnboardingStep, 
    userProfile, userRole, navigate, authActions.logout
  );

  const handlePasswordResetEvent = useCallback(() => {
    if (location.hash.includes('type=recovery') && location.hash.includes('access_token=')) {
       const hash = location.hash;
       const params = new URLSearchParams(hash.substring(1)); 
       const accessToken = params.get('access_token');
       if (accessToken) {
         navigate(`/reset-password${location.hash}`, { replace: true });
       }
    }
  }, [location, navigate]);

  useEffect(() => {
    const checkInitialSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error);
      await processSession(session, false);
      setSessionRefreshed(true);
      setLoading(false);
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      setSessionRefreshed(false); 

      if (event === 'INITIAL_SESSION') {
        await processSession(session, false);
      } else if (event === 'SIGNED_IN') {
        await processSession(session, true);
      } else if (event === 'SIGNED_OUT') {
        if (user) {
           localStorage.removeItem(`homygo-pin-attempt-count-${user.id}`);
           localStorage.removeItem(`homygo-pin-lockout-until-${user.id}`);
        }
        await processSession(null, false); 
      } else if (event === 'USER_UPDATED') {
        await processSession(session, false); 
      } else if (event === 'TOKEN_REFRESHED') {
        await processSession(session, false);
      }
      
      setSessionRefreshed(true);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setIsAuthenticated, setUserProfile, setUserRole, setIsPinAccessRequired, setNeedsPinSetup, setShowOnboardingFlow, setCurrentOnboardingStep, fetchUserProfileData]);


  return (
    <AuthContext.Provider value={{ 
      user, userProfile, isAuthenticated, userRole, 
      login: authActions.login, 
      logout: authActions.logout, 
      signUp: authActions.signUp, 
      signInWithGoogle: authActions.signInWithGoogle, 
      sendPasswordResetEmail: authActions.sendPasswordResetEmail, 
      updateUserPassword: authActions.updateUserPassword,
      handlePasswordResetEvent,
      loading, setLoading, sessionRefreshed,
      isPinAccessRequired, setIsPinAccessRequired,
      needsPinSetup, setNeedsPinSetup,
      setPin: pinActions.setPin, 
      verifyPin: pinActions.verifyPin, 
      clearPin: pinActions.clearPin,
      showOnboardingFlow, setShowOnboardingFlow,
      currentOnboardingStep, setCurrentOnboardingStep,
      nextOnboardingStep, markOnboardingComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
