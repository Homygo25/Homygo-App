
import { useCallback } from 'react';

export const useAuthActions = (supabase, toast, setLoading, processSession, navigate) => {
  const login = useCallback(async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      return { success: false, error };
    }

    if (data.user) {
      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut(); 
        setLoading(false);
        toast({ title: "Email Not Confirmed", description: "Please confirm your email first.", variant: "destructive" });
        return { success: false, error: { message: "Email not confirmed." } };
      }
      // processSession will be called by onAuthStateChange
      setLoading(false);
      return { success: true, user: data.user };
    }
    setLoading(false);
    return { success: false, error: { message: "Login failed unexpectedly." } };
  }, [supabase, toast, setLoading, processSession]);

  const logout = useCallback(async (options = {}) => {
    const { navigateTo = '/', state = {} } = options;
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    // processSession will clean up state via onAuthStateChange
    setLoading(false);
    if (navigateTo && typeof window !== 'undefined') {
      navigate(navigateTo, { replace: true, state });
    }
  }, [supabase, toast, setLoading, processSession, navigate]);

  const signUp = useCallback(async (email, password, name, role) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: role },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    setLoading(false);
    if (error) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      return { success: false, error };
    }
    if (data.user) {
      toast({ title: "Sign Up Almost Complete!", description: `Please check your email (${data.user.email}) to confirm your account.`, duration: 10000 });
      return { success: true, user: data.user, needsConfirmation: true };
    }
    return { success: false, error: { message: "Sign up process incomplete." } };
  }, [supabase, toast, setLoading]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` } 
    });
    if (error) {
      toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
    // setLoading(false) will be handled by onAuthStateChange or error
  }, [supabase, toast, setLoading]);
  
  const sendPasswordResetEmail = useCallback(async (email) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Password Reset Error", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  }, [supabase, toast, setLoading]);

  const updateUserPassword = useCallback(async (newPassword) => {
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Password Update Failed", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Password Updated Successfully!", description: "Please log in with your new password."});
    await logout({ navigateTo: '/login' });
    return true;
  }, [supabase, toast, setLoading, logout]);

  return { login, logout, signUp, signInWithGoogle, sendPasswordResetEmail, updateUserPassword };
};
