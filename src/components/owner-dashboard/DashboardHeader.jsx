import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, PlusCircle, KeyRound, ShieldOff } from 'lucide-react';

const DashboardHeader = ({ onAddNewProperty, onSetupPin, onClearPin, isPinSetupComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6 sm:mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start gap-4"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary" />
          Owner Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Manage your properties, bookings, and earnings.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        {isPinSetupComplete ? (
          <Button 
            variant="outline" 
            onClick={onClearPin}
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive/90 w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            size="lg"
          >
            <ShieldOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Clear PIN
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onSetupPin}
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            size="lg"
          >
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Setup PIN
          </Button>
        )}
        <Button 
          onClick={onAddNewProperty} 
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200 w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
          size="lg"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Add New Property
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;