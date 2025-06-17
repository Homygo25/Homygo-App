import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Eye, Edit3, Trash2, AlertTriangle } from 'lucide-react';

const getAvailabilityBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs">Available</Badge>;
    case 'booked':
      return <Badge variant="destructive" className="text-xs">Booked</Badge>;
    case 'maintenance':
      return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs">Maintenance</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>;
  }
};

const PropertyListingsTable = ({ properties, isLoading, onEditProperty, onDeleteProperty, setPropertyToDelete }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 sm:h-16 bg-muted-foreground/10 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8 sm:py-10 text-muted-foreground">
        <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary/50" />
        <p className="text-base sm:text-xl font-medium">No properties listed yet.</p>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm">Click "Add New Property" to get started!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl border border-border/30"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary-foreground flex items-center">
        <Eye className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-primary" />
        Your Property Listings
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/20 text-xs sm:text-sm">
              <TableHead className="text-primary-foreground/80">Title</TableHead>
              <TableHead className="text-primary-foreground/80 hidden md:table-cell">Location</TableHead>
              <TableHead className="text-primary-foreground/80">Price (PHP)</TableHead>
              <TableHead className="text-primary-foreground/80 hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right text-primary-foreground/80">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs sm:text-sm">
            {properties.map((property) => (
              <TableRow key={property.id} className="hover:bg-muted/30 transition-colors duration-150">
                <TableCell className="font-medium text-foreground">{property.title}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{property.location}</TableCell>
                <TableCell className="text-muted-foreground">{Number(property.price).toLocaleString()}</TableCell>
                <TableCell className="hidden sm:table-cell">{getAvailabilityBadge(property.availabilityStatus || 'Unknown')}</TableCell>
                <TableCell className="text-right space-x-1 sm:space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEditProperty(property.id)} className="border-primary text-primary hover:bg-primary/10 hover:text-primary min-h-[36px] px-2 sm:px-3 text-xs">
                    <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setPropertyToDelete(property)} className="min-h-[36px] px-2 sm:px-3 text-xs">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive-foreground text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground text-sm sm:text-base">
                          This action cannot be undone. This will permanently delete the property
                          <span className="font-semibold text-destructive"> "{property.title}"</span> and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row">
                        <AlertDialogCancel className="hover:bg-muted/50 w-full sm:w-auto min-h-[40px] sm:min-h-[44px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteProperty} className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto min-h-[40px] sm:min-h-[44px]">
                          Yes, delete property
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default PropertyListingsTable;