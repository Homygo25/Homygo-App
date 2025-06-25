import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Briefcase, MessageSquare, UserCircle, Search, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const { userRole, userProfile } = useAuth();

  const navItems = [
    { 
      path: userRole === 'owner' ? '/owner/dashboard' : '/explore', 
      icon: userRole === 'owner' ? LayoutDashboard : Search, 
      label: userRole === 'owner' ? 'Dashboard' : 'Explore',
      roles: ['guest', 'owner']
    },
    { path: '/wishlists', icon: Heart, label: 'Wishlists', roles: ['guest'] },
    { path: '/trips', icon: Briefcase, label: 'Bookings', roles: ['guest', 'owner'] }, 
    { path: '/messages', icon: MessageSquare, label: 'Messages', roles: ['guest', 'owner'] },
    { 
      path: userRole === 'owner' ? '/owner/profile' : '/profile', 
      icon: UserCircle, 
      label: 'Profile',
      roles: ['guest', 'owner']
    },
  ];
  
  // Admin view for BottomNav
  if (userProfile?.role === 'admin') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-t-lg z-50 md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
            <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                cn(
                    "flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-md w-full",
                    isActive ? "text-destructive font-medium" : ""
                )
                }
            >
                <Shield className="h-6 w-6 mb-0.5" />
                <span className="text-xs">Admin Dashboard</span>
            </NavLink>
        </div>
      </nav>
    );
  }

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-t-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-md w-1/5",
                isActive ? "text-primary font-medium" : ""
              )
            }
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;