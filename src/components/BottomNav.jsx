
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Briefcase, MessageSquare, UserCircle, Search, CalendarDays } from 'lucide-react'; // Added CalendarDays for potential future use
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const { userRole } = useAuth();

  const navItems = [
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/wishlists', icon: Heart, label: 'Wishlists' },
    { path: '/trips', icon: Briefcase, label: 'Bookings' }, // Path remains /trips, label changed to Bookings
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: userRole === 'owner' ? '/owner/dashboard' : '/profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-t-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
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
