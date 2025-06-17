
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Briefcase, Home, LogOut, Settings, LifeBuoy, Users, Edit, Edit3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const UserProfilePage = () => {
  const { user, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout({ navigateTo: '/' });
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFeatureClick = (featureName) => {
    toast({
      title: `🚧 ${featureName} Coming Soon!`,
      description: "This feature isn't implemented yet—but we're working on it! 🚀 You can request it in your next prompt!",
      variant: 'default'
    });
  };

  const handleBecomeHost = () => {
     if(userRole === 'owner') {
        navigate('/owner/dashboard');
     } else {
        toast({
            title: "🚀 Become a Host!",
            description: "Interested in becoming a host? This feature is coming soon! Request it next!",
            variant: "default"
        });
     }
  }

  if (!user || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  const profileOptions = [
    { label: "Account settings", icon: Settings, action: () => navigate('/account-settings'), arrow: true },
    { label: "Get help", icon: LifeBuoy, action: () => handleFeatureClick("Help Center"), arrow: true },
    { label: "Logout", icon: LogOut, action: () => setShowLogoutConfirm(true), arrow: false, color: "text-destructive" },
  ];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-muted/30 pb-24 sm:pb-16"
    >
      <div className="container mx-auto max-w-2xl py-6 sm:py-8 px-4">
        <header className="mb-6 sm:mb-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile</h1>
          <Button variant="ghost" size="icon" onClick={() => handleFeatureClick("Notifications")}>
            <Bell className="h-6 w-6 text-foreground" />
          </Button>
        </header>

        <section className="bg-card p-6 rounded-xl shadow-lg mb-6 sm:mb-8 border border-border/30">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/50">
              <AvatarImage src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=random&size=128`} alt={user.user_metadata?.full_name || 'User'} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-primary/20 text-primary font-semibold">
                {getInitials(user.user_metadata?.full_name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{user.user_metadata?.full_name || 'Homygo User'}</h2>
              <p className="text-sm sm:text-base text-muted-foreground capitalize">{userRole}</p>
              <Button variant="link" className="p-0 h-auto text-xs text-primary hover:underline" onClick={() => handleFeatureClick("Edit Profile")}>
                <Edit3 className="w-3 h-3 mr-1"/> Edit profile
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => handleFeatureClick("Past Trips")}
            className="bg-card p-5 rounded-xl shadow-md cursor-pointer border border-border/30 hover:border-primary/50 transition-all"
          >
            <div className="relative">
              <img-replace src="https://images.unsplash.com/photo-1522075782449-e45a34f1dd73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3VpdGNhc2V8ZW58MHx8fHwxNzE4MjA3MzEy&ixlib=rb-4.0.3&q=80&w=400" alt="Vintage Suitcase" className="w-full h-32 sm:h-36 object-cover rounded-lg mb-3" />
              <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">NEW</span>
            </div>
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Past trips</h3>
            <p className="text-xs text-muted-foreground">Revisit your adventures</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => handleFeatureClick("Connections")}
            className="bg-card p-5 rounded-xl shadow-md cursor-pointer border border-border/30 hover:border-primary/50 transition-all"
          >
             <div className="relative">
              <img-replace src="https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxncm91cCUyMG9mJTIwZnJpZW5kcyUyMHRyYXZlbGxpbmd8ZW58MHx8fHwxNzE4MjA3MzY3&ixlib=rb-4.0.3&q=80&w=400" alt="Friends Traveling" className="w-full h-32 sm:h-36 object-cover rounded-lg mb-3" />
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">NEW</span>
            </div>
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Connections</h3>
            <p className="text-xs text-muted-foreground">Connect with fellow travelers</p>
          </motion.div>
        </section>
        
        {userRole === 'guest' && (
          <motion.div 
            whileHover={{ y: -2 }}
            onClick={handleBecomeHost}
            className="bg-card p-5 rounded-xl shadow-md cursor-pointer mb-6 sm:mb-8 border border-border/30 hover:border-primary/50 transition-all flex items-center space-x-4"
          >
            <div className="bg-primary/10 p-3 rounded-lg">
                <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-foreground text-base sm:text-lg">Become a host</h3>
                <p className="text-xs text-muted-foreground">It's easy to start hosting and earn extra income.</p>
            </div>
          </motion.div>
        )}

        <section className="bg-card rounded-xl shadow-lg border border-border/30 overflow-hidden">
          {profileOptions.map((item, index) => (
            <div
              key={item.label}
              onClick={item.action}
              className={`flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-muted/50 transition-colors ${item.color || 'text-foreground'} ${index < profileOptions.length - 1 ? 'border-b border-border/30' : ''}`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color || 'text-primary'}`} />
                <span className="text-sm sm:text-base font-medium">{item.label}</span>
              </div>
              {item.arrow && <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
            </div>
          ))}
        </section>
        
        <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be returned to the home page. You can always log back in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </motion.div>
  );
};

// Placeholder for ChevronRight, actual one is used by shadcn
const ChevronRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);


export default UserProfilePage;
