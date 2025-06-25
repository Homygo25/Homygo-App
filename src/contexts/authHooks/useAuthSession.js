import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAuthSession = (setGlobalLoading) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfileData = useCallback(async (userId) => {
    if (!userId) return { role: 'guest', has_completed_onboarding: true, name: null, email: null };
    
    setGlobalLoading(true);
    const { data: profile, error } = await supabase
      .from('users')
      .select('role, has_completed_onboarding, name, email')
      .eq('id', userId)
      .single();
    setGlobalLoading(false);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for a new user
      console.error("Error fetching user profile:", error.message);
      return { role: 'guest', has_completed_onboarding: false, name: null, email: null }; // Default for error or no profile
    }
    
    // If profile is null (new user via OAuth before trigger runs or if trigger fails), provide defaults
    return {
      role: profile?.role || 'guest',
      has_completed_onboarding: profile?.has_completed_onboarding || false,
      name: profile?.name || null,
      email: profile?.email || null,
    };
  }, [setGlobalLoading]);

  return {
    user,
    userProfile,
    userRole,
    isAuthenticated,
    setUser,
    setUserProfile,
    setUserRole,
    setIsAuthenticated,
    fetchUserProfileData,
  };
};