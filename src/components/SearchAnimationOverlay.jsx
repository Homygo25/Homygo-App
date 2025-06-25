import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

const SearchAnimationOverlay = ({ onComplete }) => {
  const [characterVisible, setCharacterVisible] = useState(false);
  const [zipEffectVisible, setZipEffectVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const characterTimer = setTimeout(() => {
      setCharacterVisible(true);
      setZipEffectVisible(true); 
    }, 100); 

    return () => clearTimeout(characterTimer);
  }, []);

  const handleCharacterAnimationComplete = () => {
    onComplete();
  };

  const overlayBackgroundColor = theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: overlayBackgroundColor }}
    >
      <AnimatePresence>
        {zipEffectVisible && (
          <>
            <motion.div
              key="top-zip"
              className="absolute top-0 left-0 w-full h-1/2 bg-background shadow-2xl"
              initial={{ y: 0, height: '50%' }}
              animate={{ y: '-50vh', height: '0%' }}
              transition={{ duration: 1.3, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.1 }} 
            />
            <motion.div
              key="bottom-zip"
              className="absolute bottom-0 left-0 w-full h-1/2 bg-background shadow-2xl"
              initial={{ y: 0, height: '50%' }}
              animate={{ y: '50vh', height: '0%' }}
              transition={{ duration: 1.3, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.1 }}
            />
          </>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {characterVisible && (
          <motion.div
            initial={{ y: "10vh", opacity: 0, scale: 0.7, rotate: 0 }}
            animate={{
              y: "-110vh", 
              opacity: [0, 1, 1, 0], 
              scale: [0.7, 1.1, 1], 
              rotate: [0, 15, -10, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              opacity: { times: [0, 0.1, 0.9, 1], duration: 1.5 },
              scale: { times: [0, 0.3, 1], duration: 1.0 },
              rotate: { duration: 1.5, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }
            }}
            onAnimationComplete={handleCharacterAnimationComplete}
            className="absolute z-10" 
          >
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/45032f660b5b2544dcc261cec6ee709a.png"
              alt="Homygo mascot flying upwards"
              className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchAnimationOverlay;