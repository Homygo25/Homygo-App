import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, BookOpen, Home } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="py-8 sm:py-12 md:py-20 bg-gradient-to-b from-background to-background/90 text-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <img  
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-xl border-4 border-primary p-1" 
            alt="Homygo logo on about page"
           src="https://images.unsplash.com/photo-1690721694936-fd4b6f249126" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            About <span className="text-primary">Homygo</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in finding the perfect home in Cagayan de Oro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img  
              className="rounded-lg shadow-2xl object-cover w-full h-64 sm:h-80 md:h-96" 
              alt="Team working on Homygo platform"
             src="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-card/80 backdrop-blur-md rounded-lg shadow-lg border border-border/30">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-primary-foreground">Our Mission</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To simplify the rental process in Cagayan de Oro by providing a user-friendly, transparent, and efficient platform that connects renters with their ideal homes and property owners with reliable tenants.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-card/80 backdrop-blur-md rounded-lg shadow-lg border border-border/30">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-primary-foreground">Our Vision</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To be the leading and most trusted online rental marketplace in Cagayan de Oro, fostering a vibrant community where finding and managing rental properties is a seamless and positive experience for everyone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="p-6 sm:p-8 md:p-10 bg-card/80 backdrop-blur-md rounded-xl shadow-xl border border-border/30"
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary-foreground">The Homygo Story</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
            Founded with a passion for real estate and technology, Homygo was born out of the need for a dedicated, modern rental solution specifically for Cagayan de Oro City. We noticed the challenges renters and property owners faced – scattered listings, outdated information, and a lack of a centralized, easy-to-use platform.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our team, composed of local tech enthusiasts and real estate professionals, embarked on a journey to create Homygo. We envisioned a platform that is not just functional but also delightful to use, leveraging the latest technologies like React, TailwindCSS, and a robust backend to deliver speed and reliability. We believe finding your next home or managing your property should be a stress-free experience, and Homygo is our commitment to making that a reality for the Kagay-anon community.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;