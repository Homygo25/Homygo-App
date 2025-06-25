import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const popularRentals = [
  {
    id: 1,
    image: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/d738d99f5d03114ee0a47316cfd43c9b.png",
    name: "Mesaverte",
    room: "Tower 3, 12T",
    type: "Condominium",
    price: 1499,
    alt: "Modern bedroom with neat bed and industrial-style lighting"
  },
  {
    id: 2,
    image: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/e25f0e246d05f26b53774a4e46615b53.png",
    name: "Mesaverte",
    room: "Tower 1, 5B",
    type: "Condominium",
    price: 1499,
    alt: "Cozy bedroom with wooden furniture and a view from the window"
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const termToSearch = searchTerm.trim() || "Cagayan de Oro";
    navigate(`/explore`, { state: { searchTerm: termToSearch } });
  };

  return (
    <div className="flex flex-col bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white overflow-hidden"
      >
        <img
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/d1f5e9aea3c260d1e204b52f7ca208fd.png"
          alt="Skyline of Cagayan de Oro with a prominent yellow bridge over the river"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg">
            Find Your Perfect Home
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto text-shadow">
            Explore the best rentals in Cagayan de Oro
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-20 -mt-16 w-full px-4"
      >
        <div className="max-w-2xl mx-auto bg-background p-4 rounded-xl shadow-2xl border">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Input
              type="search"
              placeholder="Search by location, landmark, or barangay..."
              className="w-full h-14 pl-5 pr-14 rounded-full text-base border-input focus-visible:ring-primary focus-visible:ring-2 placeholder:text-muted-foreground/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Search"
             >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </motion.div>

      <section className="container mx-auto py-16 px-4">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-center text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Explore Popular Rentals in CDO
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {popularRentals.map((rental, index) => (
            <motion.div 
              key={rental.id} 
              className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col h-full cursor-pointer hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate(`/explore`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            >
              <div className="overflow-hidden">
                <img src={rental.image} alt={rental.alt} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-foreground">{rental.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{rental.room}</p>
                <div className="mt-auto pt-3 flex justify-between items-center border-t border-border">
                  <span className="text-sm text-foreground font-medium">{rental.type}</span>
                  <span className="text-lg font-bold text-primary">
                    ₱{rental.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/explore')}
            className="group"
          >
            View More
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>
      
      <div className="container mx-auto pb-24 pt-0 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Journey Home Starts Here</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
            Homygo is more than just a listing site; it's a community-driven platform dedicated to making your rental experience in Cagayan de Oro simple, transparent, and secure. Discover hidden gems, connect with verified landlords, and find a place you'll love to call home.
        </p>
      </div>
    </div>
  );
};

export default HomePage;