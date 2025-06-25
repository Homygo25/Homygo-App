import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color, isLoading }) => (
  <motion.div
    className="bg-card/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-border/30 flex items-center space-x-3 sm:space-x-4 hover:shadow-primary/20 transition-shadow duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={`p-2 sm:p-3 rounded-full bg-primary/10 ${color}`}>{icon}</div>
    <div>
      {isLoading ? (
        <div className="h-6 sm:h-7 w-12 sm:w-16 bg-muted-foreground/30 animate-pulse rounded-md mb-1"></div>
      ) : (
        <p className="text-xl sm:text-2xl font-bold">{value}</p>
      )}
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;