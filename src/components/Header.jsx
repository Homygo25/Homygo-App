import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, Home as HomeIcon, Info, Briefcase, UserCircle, Loader2, Search as SearchIcon, Star, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';


const Header = ({ handleContact }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleUnimplementedFeature = (featureName) => {
    toast({ title: `🚧 ${featureName} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀` });
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
    setIsMobileMenuOpen(false);
    navigate('/');
  }

  const homygoLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/f2ba69bffb47937cde395fcd401ab94b.png";

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } }
  };

  const navLinkClass = "text-foreground hover:bg-muted/50 hover:text-primary px-3 py-2 min-h-[44px] text-sm";
  const mobileNavLinkClass = "w-full justify-start py-3 px-4 text-lg text-foreground hover:bg-muted/50 hover:text-primary min-h-[44px]";

  const commonLinks = (isMobile) => (
    <>
      <Button variant="ghost" className={isMobile ? mobileNavLinkClass : navLinkClass} asChild>
        <Link to="/"><HomeIcon className="w-5 h-5 mr-3" /> Home</Link>
      </Button>
      <Button variant="ghost" className={isMobile ? mobileNavLinkClass : navLinkClass} asChild>
        <Link to="/about"><Info className="w-5 h-5 mr-3" /> About</Link>
      </Button>
    </>
  );

  return (
    <>
      <header className="glass-effect sticky top-0 z-50 shadow-md border-b border-border/20">
        <div className="container mx-auto px-4 py-2.5 md:py-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-2" aria-label="Go to Homygo homepage" onClick={() => setIsMobileMenuOpen(false)}>
                <img 
                  src={homygoLogoUrl} 
                  alt="Homygo Logo" 
                  className="h-10 sm:h-11 md:h-12 object-contain" 
                />
              </Link>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center space-x-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {commonLinks(false)}
              {loading ? (
                <Button variant="ghost" disabled className={navLinkClass}>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Authenticating...
                </Button>
              ) : isAuthenticated ? (
                <>
                  {userRole === 'owner' && (
                    <Button variant="ghost" className={`${navLinkClass} text-primary`} asChild>
                      <Link to="/owner/dashboard"><Briefcase className="w-4 h-4 mr-1.5" /> Dashboard</Link>
                    </Button>
                  )}
                   {userRole === 'guest' && (
                    <Button variant="ghost" className={`${navLinkClass} text-primary`} onClick={() => navigate('/listings')}>
                      <SearchIcon className="w-4 h-4 mr-1.5" /> Explore
                    </Button>
                  )}
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive min-h-[44px] px-3 py-2 text-sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1.5" /> Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className={navLinkClass} asChild>
                    <Link to="/login"><LogIn className="w-4 h-4 mr-1.5" /> Log In</Link>
                  </Button>
                </>
              )}
               <ThemeToggle />
            </motion.div>

            <div className="md:hidden flex items-center space-x-2">
               <ThemeToggle />
               <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground hover:text-primary min-h-[44px] min-w-[44px]">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 top-[var(--header-height)] bg-card/95 backdrop-blur-md z-40 p-4 flex flex-col space-y-2 overflow-y-auto"
            style={{ height: `calc(100vh - var(--header-height))` }}
          >
            {commonLinks(true)}
            {loading ? (
              <Button variant="ghost" disabled className={mobileNavLinkClass}>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Authenticating...
              </Button>
            ) : isAuthenticated ? (
              <>
                {userRole === 'owner' && (
                  <Button variant="ghost" className={`${mobileNavLinkClass} text-primary`} asChild>
                    <Link to="/owner/dashboard"><LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard</Link>
                  </Button>
                )}
                 {userRole === 'guest' && (
                  <Button variant="ghost" className={`${mobileNavLinkClass} text-primary`} onClick={() => navigate('/listings')}>
                    <SearchIcon className="w-5 h-5 mr-3" /> Explore Listings
                  </Button>
                )}
                <Button variant="ghost" className={`${mobileNavLinkClass} text-destructive`} onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-3" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className={mobileNavLinkClass} asChild>
                  <Link to="/login"><LogIn className="w-5 h-5 mr-3" /> Log In</Link>
                </Button>
                <Button variant="primary" className="w-full justify-center py-3 text-lg min-h-[44px]" asChild>
                   <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <div className="pt-4 border-t border-border mt-auto">
              <p className="text-xs text-muted-foreground text-center">Homygo &copy; {new Date().getFullYear()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;