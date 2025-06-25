import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, XCircle } from 'lucide-react';

const PledgeModal = ({ isOpen, onOpenChange, onAgree, onDecline }) => {
  const homygoLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/homygo_logo_mint_charcoal_v1.png";
  const characterLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/homygo_mascot_transparent_v1.png";


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <img src={homygoLogoUrl} alt="Homygo Logo" className="h-10 mr-2" />
            <DialogTitle className="text-2xl font-bold text-primary">Homygo</DialogTitle>
          </div>
          <img src={characterLogoUrl} alt="Homygo Mascot" className="w-32 h-32 mx-auto mb-4" />
          <DialogTitle className="text-xl font-semibold mb-2">Homygo Community Commitment</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Homygo is a community rooted in respect and hospitality.
            <br /><br />
            By using Homygo, you agree to treat every user—regardless of background, faith, orientation, or status—with kindness and fairness.
            <br /><br />
            We stand for local pride, safe rentals, and open opportunity for every Kagay-anon.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
          <Button 
            onClick={() => {
              if (typeof onDecline === 'function') {
                onDecline();
              }
            }}
            variant="outline"
            className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive text-md px-6 py-3 rounded-lg shadow-sm"
          >
            <XCircle className="mr-2 h-5 w-5" /> Decline
          </Button>
          <Button 
            onClick={() => {
              if (typeof onAgree === 'function') {
                onAgree();
              }
            }}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md px-6 py-3 rounded-lg shadow-md"
          >
            <ShieldCheck className="mr-2 h-5 w-5" /> Agree and Continue
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