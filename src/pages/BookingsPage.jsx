
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarDays } from 'lucide-react'; // Kept Briefcase, added CalendarDays as an option

const BookingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center"
    >
      <Briefcase className="w-24 h-24 text-primary mb-6 animate-bounce" />
      {/* Or use CalendarDays: <CalendarDays className="w-24 h-24 text-primary mb-6 animate-bounce" /> */}
      <h1 className="text-4xl font-bold text-foreground mb-4">Your Bookings</h1>
      <p className="text-lg text-muted-foreground mb-8">
        All your confirmed reservations, past and upcoming, will be shown here.
      </p>
      <p className="text-md text-accent-foreground">
        🚧 This feature is under construction. Come back soon! 🚀
      </p>
    </motion.div>
  );
};

export default BookingsPage;
