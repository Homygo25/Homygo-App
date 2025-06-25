import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, ListChecks, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (userProfile?.role !== 'admin') {
    // This should ideally be caught by ProtectedRoute, but as a fallback:
    navigate('/');
    toast({ title: "Access Denied", description: "You are not authorized to view this page.", variant: "destructive"});
    return null;
  }

  const adminTasks = [
    { name: "User Management", icon: Users, action: () => toast({title: "🚧 User Management - Coming Soon!"})},
    { name: "Content Moderation (Listings)", icon: ListChecks, action: () => toast({title: "🚧 Content Moderation - Coming Soon!"})},
    { name: "Platform Analytics", icon: BarChart3, action: () => toast({title: "🚧 Platform Analytics - Coming Soon!"})},
    { name: "System Settings", icon: Settings, action: () => toast({title: "🚧 System Settings - Coming Soon!"})},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <header className="mb-8 text-center">
        <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-destructive">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, Administrator! Manage Homygo platform operations.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminTasks.map(task => (
          <motion.div
            key={task.name}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-card p-6 rounded-xl shadow-lg border border-border/30 cursor-pointer hover:border-destructive/50 transition-all"
            onClick={task.action}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-destructive/10 rounded-full mb-3">
                <task.icon className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">{task.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
         <Button variant="outline" onClick={() => navigate('/')} className="text-primary border-primary hover:bg-primary/10 min-h-[44px]">
            Go to Homepage
        </Button>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;