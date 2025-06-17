import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';

const PinSetupModal = ({ isOpen, onOpenChange, onPinSet, loading }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be at least 4 digits.",
        variant: "destructive",
      });
      return;
    }
    if (pin !== confirmPin) {
      toast({
        title: "PINs Do Not Match",
        description: "Please ensure both PIN fields are identical.",
        variant: "destructive",
      });
      return;
    }
    const success = await onPinSet(pin);
    if (success) {
      setPin('');
      setConfirmPin('');
      onOpenChange(false); 
    }
  };

  const handlePinChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setter(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-md border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-3">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-foreground">Setup Quick Access PIN</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm sm:text-base">
              Create a 4 to 6 digit PIN for faster and secure access to your dashboard on this device.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="new-pin" className="block text-sm font-medium text-muted-foreground mb-1">New PIN</label>
                <Input
                  id="new-pin"
                  type="password"
                  value={pin}
                  onChange={handlePinChange(setPin)}
                  placeholder="Enter 4-6 digits"
                  maxLength="6"
                  className="text-center text-xl tracking-[0.2em] bg-input border-border focus:ring-primary text-foreground h-12"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="confirm-pin" className="block text-sm font-medium text-muted-foreground mb-1">Confirm PIN</label>
                <Input
                  id="confirm-pin"
                  type="password"
                  value={confirmPin}
                  onChange={handlePinChange(setConfirmPin)}
                  placeholder="Confirm your PIN"
                  maxLength="6"
                  className="text-center text-xl tracking-[0.2em] bg-input border-border focus:ring-primary text-foreground h-12"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={loading || pin.length < 4 || pin !== confirmPin}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4"/>}
                Set PIN & Continue
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PinSetupModal;