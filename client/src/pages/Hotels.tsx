import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

// Assets (using generated images for showcase)
import londonImg from "@assets/generated_images/luxury_hotel_room_interior_in_london.png";
import tokyoImg from "@assets/generated_images/modern_hotel_suite_in_tokyo.png";
import dubaiImg from "@assets/generated_images/opulent_hotel_lobby_in_dubai.png";
import parisImg from "@assets/generated_images/chic_hotel_room_in_paris.png";
import singaporeImg from "@assets/generated_images/rooftop_pool_in_singapore.png";
import sydneyImg from "@assets/generated_images/harbour_view_hotel_in_sydney.png";

const hotels = [
  {
    id: "london",
    name: "The Kennedian London",
    location: "Westminster, London",
    image: londonImg,
    price: "£450",
    rating: "4.9",
    description: "A historic landmark transformed into a sanctuary of modern luxury, overlooking the Thames.",
  },
  {
    id: "tokyo",
    name: "Kennedian Ginza",
    location: "Ginza, Tokyo",
    image: tokyoImg,
    price: "¥65,000",
    rating: "4.8",
    description: "Minimalist perfection in the heart of Tokyo's most exclusive shopping district.",
  },
  {
    id: "dubai",
    name: "Kennedian Royal",
    location: "Downtown Dubai",
    image: dubaiImg,
    price: "AED 2,200",
    rating: "5.0",
    description: "Opulence redefined with unparalleled views of the Burj Khalifa and fountains.",
  },
  {
    id: "paris",
    name: "Le Kennedian",
    location: "1st Arrondissement, Paris",
    image: parisImg,
    price: "€550",
    rating: "4.9",
    description: "Classic French elegance meets contemporary comfort steps from the Louvre.",
  },
  {
    id: "singapore",
    name: "Kennedian Bay",
    location: "Marina Bay, Singapore",
    image: singaporeImg,
    price: "S$600",
    rating: "4.8",
    description: "An urban oasis featuring our signature infinity pool and lush sky gardens.",
  },
  {
    id: "sydney",
    name: "Kennedian Harbour",
    location: "The Rocks, Sydney",
    image: sydneyImg,
    price: "A$580",
    rating: "4.9",
    description: "Waterfront luxury with commanding views of the Opera House and Harbour Bridge.",
  },
];

export default function Hotels() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Header / Filter Section */}
      <div className="pt-32 pb-12 px-6 bg-secondary/20 border-b border-primary/5">
        <div className="container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-foreground mb-8"
          >
            Find Your Sanctuary
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            <div className="relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Location</label>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Where are you going?" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <div className="relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-4 md:pl-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-in - Check-out</label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Add dates" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <div className="relative md:px-4 pb-2 md:pb-0">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Guests</label>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Add guests" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <button className="bg-primary text-primary-foreground h-12 w-full rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Hotel List */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                  <span className="text-xs font-bold text-foreground">{hotel.rating}</span>
                </div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors">{hotel.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs uppercase tracking-wide">{hotel.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">from</p>
                    <p className="text-lg font-serif text-foreground">{hotel.price}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed pt-2 border-t border-primary/10 mt-4">
                  {hotel.description}
                </p>
                
                <div className="pt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:underline underline-offset-4">
                  View Details <ArrowRight className="w-3 h-3 ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Minimal Footer */}
      <footer className="py-12 border-t border-foreground/5 mt-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-xs uppercase tracking-widest">© 2025 Kennedian Hotels</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Privacy</a>
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Terms</a>
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
