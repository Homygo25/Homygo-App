
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { KeyRound, Loader2 } from 'lucide-react';

const PinAccessModal = ({ isOpen, onOpenChange, onPinSubmit, onLoginWithPassword, loading }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be at least 4 digits.",
        variant: "destructive",
      });
      return;
    }
    onPinSubmit(pin);
    setPin(''); 
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-md border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-3">
              <KeyRound className="w-12 h-12 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-foreground">Enter PIN</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm sm:text-base">
              Enter your PIN to quickly access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                id="pin"
                type="password" 
                value={pin}
                onChange={handlePinChange}
                placeholder="••••"
                maxLength="6"
                className="text-center text-2xl tracking-[0.3em] bg-input border-border focus:ring-primary text-foreground h-14"
                autoFocus
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onLoginWithPassword();
                  onOpenChange(false);
                }}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                Login with Password
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={loading || pin.length < 4}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Unlock Dashboard
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PinAccessModal;
