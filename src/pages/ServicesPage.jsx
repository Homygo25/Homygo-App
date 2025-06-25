import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <Briefcase className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          This page is currently under construction. We're working on detailing all the ways we help both renters and landlords. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
};

export default ServicesPage;