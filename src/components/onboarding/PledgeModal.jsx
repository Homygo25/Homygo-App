import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const PledgeModal = ({ isOpen, onOpenChange, onAgree }) => {
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/6ca54696c10833ab013f1e825a06a8e5.png";
  const homygoLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/homygo_logo_v2_light.png";


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <img  src={homygoLogoUrl} alt="Homygo Logo" className="h-10 mr-2" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
            <DialogTitle className="text-2xl font-bold text-primary">Homygo</DialogTitle>
          </div>
          <img  src={characterLogoUrl} alt="Homygo Mascot" className="w-32 h-32 mx-auto mb-4" src="https://images.unsplash.com/photo-1644554763605-fcb7654cbc64" />
          <DialogTitle className="text-xl font-semibold mb-2">Our Homygo Pledge</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Homygo is a space where everyone deserves to feel at home.
            <br /><br />
            To keep Homygo safe and welcoming, we ask all users to agree to the following:
            <br /><br />
            I agree to treat everyone on the Homygo platform-renters, owners, and partners regardless of their background, status, race, religion, age, gender identity, sexual orientation, disability, or financial situation-with respect, empathy, and without discrimination or judgment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-center">
          <Button 
            onClick={() => {
              if (typeof onAgree === 'function') {
                onAgree();
              }
            }}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            <ShieldCheck className="mr-2 h-5 w-5" /> Agree and continue
          </Button>
        </DialogFooter>
        <div className="text-center mt-4">
          <Button variant="link" className="text-xs text-muted-foreground hover:text-primary">Learn more</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PledgeModal;