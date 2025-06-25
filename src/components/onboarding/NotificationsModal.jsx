import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; 
import { Label } from '@/components/ui/label';

const NotificationsModal = ({ isOpen, onOpenChange, onProceed }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleProceed = () => {
    if (typeof onProceed === 'function') {
      onProceed(notificationsEnabled);
    }
  };
  
  const handleClose = () => {
    if (typeof onOpenChange === 'function') {
      onOpenChange(false);
    }
     if (typeof onProceed === 'function') {
      onProceed(notificationsEnabled); 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <DialogTitle className="text-xl font-semibold text-center mt-4 mb-2">Turn on notifications</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center mb-6">
            Don't miss important messages like check-in details and account activity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-toggle" className="text-sm text-foreground cursor-pointer">
              Get travel deals, personalized recommendations, and more.
            </Label>
            <Switch
              id="notifications-toggle"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              aria-label="Toggle notifications for travel deals"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center">
          <Button 
            onClick={handleProceed}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md px-8 py-3 rounded-lg shadow-md"
          >
            <Bell className="mr-2 h-5 w-5" /> Yes, notify me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;