
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center"
    >
      <Heart className="w-24 h-24 text-primary mb-6 animate-pulse" />
      <h1 className="text-4xl font-bold text-foreground mb-4">Your Wishlists</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This is where your saved properties will appear. Start exploring and add some favorites!
      </p>
      <p className="text-md text-accent-foreground">
        🚧 This feature is under construction. Come back soon! 🚀
      </p>
    </motion.div>
  );
};

export default WishlistPage;
