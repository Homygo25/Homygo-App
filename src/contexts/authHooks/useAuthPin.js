import React from 'react';

export const useAuthPin = () => {
  return {
    setPin: async () => { console.warn("PIN functionality removed."); return false; },
    verifyPin: async () => { console.warn("PIN functionality removed."); return false; },
    clearPin: async () => { console.warn("PIN functionality removed."); }
  };
};