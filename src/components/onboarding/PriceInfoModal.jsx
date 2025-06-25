import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tag, CheckCircle, X } from 'lucide-react';

const PriceInfoModal = ({ isOpen, onOpenChange, onGotIt }) => {

  const handleClose = () => {
    if (typeof onOpenChange === 'function') {
      onOpenChange(false);
    }
    if (typeof onGotIt === 'function') {
      onGotIt();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center">
          <div className="flex justify-end">
             <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mx-auto bg-pink-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 mt-4">
            <Tag className="h-8 w-8 text-pink-500" />
          </div>
          <DialogTitle className="text-xl font-semibold mb-2">Now you'll see one price for your trip, all fees included.</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-center">
          <Button 
            onClick={() => {
              if (typeof onGotIt === 'function') {
                onGotIt();
              }
            }}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md px-8 py-3 rounded-lg shadow-md"
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceInfoModal;