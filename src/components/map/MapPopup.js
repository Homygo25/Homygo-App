import { toast } from '@/components/ui/use-toast';

export const generatePopupHTML = (property, navigate) => {
  const defaultImageUrl = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image';
  const imageUrl = property.image_paths && property.image_paths.length > 0 ? property.image_paths[0] : defaultImageUrl;

  return `
    <div class="p-1 rounded-lg shadow-lg max-w-xs text-sm bg-card text-card-foreground mapbox-popup-custom-styles">
      <strong class="text-base block mb-1 text-primary">${property.title}</strong>
      <img src="${imageUrl}" alt="${property.title.replace(/"/g, '&quot;')}" class="w-full h-24 object-cover rounded-md mb-2"/>
      <p class="text-muted-foreground text-xs mb-1">${property.location}</p>
      <p class="font-semibold text-foreground mb-2">₱${property.price.toLocaleString()}</p>
      <button class="w-full bg-primary text-primary-foreground py-1 px-2 rounded hover:bg-primary/90 text-xs view-details-btn min-h-[30px]" data-property-id="${property.id}">View Details</button>
    </div>
  `;
};

export const attachPopupEventlisteners = (navigateHook) => {
  document.querySelectorAll('.view-details-btn').forEach(button => {
    const existingListener = button.dataset.listenerAttached === 'true';
    if (!existingListener) {
      const propertyId = button.dataset.propertyId;
      const clickHandler = () => {
        if (propertyId) {
          navigateHook(`/user/listings/${propertyId}`);
        } else {
          toast({ title: `🚧 View details for property is not implemented yet.` });
        }
      };
      button.addEventListener('click', clickHandler);
      button.dataset.listenerAttached = 'true'; 
      button.dataset.clickHandler = clickHandler;
    }
  });
};

export const removePopupEventListeners = () => {
  document.querySelectorAll('.view-details-btn').forEach(button => {
    if (button.dataset.listenerAttached === 'true' && button.dataset.clickHandler) {
      button.removeEventListener('click', button.dataset.clickHandler);
      button.dataset.listenerAttached = 'false';
      delete button.dataset.clickHandler;
    }
  });
};