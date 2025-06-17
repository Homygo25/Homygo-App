
import React from 'react';
import { Home } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleFooterLinkClick = (featureName, locationFilter = null) => {
    if (locationFilter) {
      navigate('/user/listings', { state: { location: locationFilter, propertyType: 'All Types', price: { min: '', max: ''} } });
      toast({ title: `Showing listings for ${locationFilter}`, description: "Property list updated."});
    } else {
      toast({ title: `🚧 ${featureName} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀` });
    }
  };
  
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">Homygo</span>
            </div>
            <p className="text-xs sm:text-sm">
              Your trusted partner for finding rental properties in Cagayan de Oro, Philippines.
            </p>
          </div>

          <div>
            <span className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4 block">Quick Links</span>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => {
                if (localStorage.getItem('homygo-role') === 'owner') navigate('/owner/properties/create');
                else navigate('/login', {state: {from: {pathname: '/owner/properties/create'}}});
                 toast({title: "List Your Property", description: "Navigate to add property page or login."});
              }} className="hover:text-white transition-colors">List Property</button></li>
              <li><button onClick={() => handleFooterLinkClick('Contact')} className="hover:text-white transition-colors">Contact</button></li>
              <li><button onClick={() => handleFooterLinkClick('Help')} className="hover:text-white transition-colors">Help</button></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4 block">Popular Areas</span>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><button onClick={() => handleFooterLinkClick('Popular Areas', 'Lapasan')} className="hover:text-white transition-colors">Lapasan</button></li>
              <li><button onClick={() => handleFooterLinkClick('Popular Areas', 'Carmen')} className="hover:text-white transition-colors">Carmen</button></li>
              <li><button onClick={() => handleFooterLinkClick('Popular Areas', 'Gusa')} className="hover:text-white transition-colors">Gusa</button></li>
              <li><button onClick={() => handleFooterLinkClick('Popular Areas', 'Pueblo de Oro')} className="hover:text-white transition-colors">Pueblo de Oro</button></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4 block">Contact Info</span>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <p>📍 Cagayan de Oro City, Philippines</p>
              <p>📞 +63 912 345 6789</p>
              <p>✉️ info@homygo.ph</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Homygo. All rights reserved. Made with ❤️ for Cagayan de Oro.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
