import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PinSetupDialog = ({ isOpen, onOpenChange, onPinSet }) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { loading: authLoading } = useAuth();

  const handlePinSetup = async () => {
    if (newPin.length < 4) {
      toast({ title: "Invalid PIN", description: "PIN must be at least 4 digits.", variant: "destructive" });
      return;
    }
    if (newPin !== confirmPin) {
      toast({ title: "PINs Do Not Match", description: "Please ensure both PIN fields are identical.", variant: "destructive" });
      return;
    }
    const success = await onPinSet(newPin);
    if (success) {
      setNewPin('');
      setConfirmPin('');
      onOpenChange(false);
    }
  };
  
  const handlePinInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setter(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center">
            <KeyRound className="w-6 h-6 mr-2 text-primary" /> Setup Quick Access PIN
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a 4 to 6 digit PIN for faster dashboard access on this device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="new-pin">New PIN</Label>
            <Input 
              id="new-pin" 
              type="password" 
              value={newPin} 
              onChange={handlePinInputChange(setNewPin)}
              placeholder="Enter 4-6 digits" 
              maxLength="6"
              className="bg-input border-border focus:ring-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="confirm-pin">Confirm PIN</Label>
            <Input 
              id="confirm-pin" 
              type="password" 
              value={confirmPin} 
              onChange={handlePinInputChange(setConfirmPin)}
              placeholder="Confirm your PIN" 
              maxLength="6"
              className="bg-input border-border focus:ring-primary text-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={authLoading}>Cancel</Button>
          <Button onClick={handlePinSetup} disabled={authLoading || newPin.length < 4 || newPin !== confirmPin} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            {authLoading ? "Saving..." : "Set PIN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PinSetupDialog;