import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <Info className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Homygo</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          This page is currently under construction. Check back soon for more information about our mission to simplify rentals in Cagayan de Oro!
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;