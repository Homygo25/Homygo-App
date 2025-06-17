
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center"
    >
      <MessageSquare className="w-24 h-24 text-primary mb-6" style={{ animation: 'wiggle 2s linear infinite' }} />
      <h1 className="text-4xl font-bold text-foreground mb-4">Your Messages</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Communicate with hosts and guests right here. All your conversations in one place.
      </p>
      <p className="text-md text-accent-foreground">
        🚧 This feature is under construction. Come back soon! 🚀
      </p>
      <style jsx>{`
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-10deg); }
          20% { transform: rotateZ(8deg); }
          25% { transform: rotateZ(-6deg); }
          30% { transform: rotateZ(4deg); }
          35% { transform: rotateZ(-2deg); }
          40%, 100% { transform: rotateZ(0); }
        }
      `}</style>
    </motion.div>
  );
};

export default MessagesPage;
