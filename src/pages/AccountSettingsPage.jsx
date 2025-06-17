
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Lock, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AccountSettingsPage = () => {
  
  const handleSettingClick = (settingName) => {
    toast({
      title: `🚧 ${settingName} Feature Not Implemented`,
      description: "This specific setting is not yet available. You can request it next!",
      variant: "default"
    });
  };

  const settingsOptions = [
    { name: "Personal Information", icon: User, action: () => handleSettingClick("Personal Information") },
    { name: "Login & Security", icon: Lock, action: () => handleSettingClick("Login & Security") },
    { name: "Notifications", icon: Bell, action: () => handleSettingClick("Notifications") },
    { name: "Privacy & Sharing", icon: Shield, action: () => handleSettingClick("Privacy & Sharing") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Settings className="w-8 h-8 text-primary mr-3" />
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </header>

      <div className="space-y-4">
        {settingsOptions.map(option => (
          <motion.div
            key={option.name}
            whileHover={{ scale: 1.02 }}
            className="bg-card p-5 rounded-lg shadow-sm border border-border/30 cursor-pointer hover:border-primary/50 transition-all"
            onClick={option.action}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <option.icon className="w-6 h-6 text-primary mr-4" />
                <span className="text-lg font-medium text-foreground">{option.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
         <Button variant="link" onClick={() => window.history.back()} className="text-primary">
            Go Back
        </Button>
      </div>
    </motion.div>
  );
};

const ChevronRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);


export default AccountSettingsPage;
