import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight, Coffee } from "lucide-react";
import Navbar from "@/components/Navbar";

// Assets
import parisianImg from "@assets/generated_images/parisian_style_cafe_interior.png";
import modernImg from "@assets/generated_images/modern_minimalist_coffee_shop.png";
import bakeryImg from "@assets/generated_images/artisan_bakery_cafe.png";
import teaImg from "@assets/generated_images/luxury_high_tea_lounge.png";
import terraceImg from "@assets/generated_images/garden_terrace_cafe.png";
import libraryImg from "@assets/generated_images/cozy_library_cafe.png";

const cafes = [
  {
    id: "parisian",
    name: "The Parisian",
    location: "Paris, France",
    image: parisianImg,
    cuisine: "French Patisserie",
    rating: "4.9",
    description: "A classic experience featuring artisanal croissants and rich espresso in a marble-clad setting.",
  },
  {
    id: "zenith",
    name: "Zenith Brew",
    location: "Tokyo, Japan",
    image: modernImg,
    cuisine: "Specialty Coffee",
    rating: "4.8",
    description: "Minimalist precision meets the art of coffee. Single-origin pours in a serene concrete sanctuary.",
  },
  {
    id: "hearth",
    name: "Hearth & Grain",
    location: "Copenhagen, Denmark",
    image: bakeryImg,
    cuisine: "Artisan Bakery",
    rating: "4.9",
    description: "The warmth of fresh sourdough and cinnamon, served in a rustic yet refined wooden haven.",
  },
  {
    id: "orchid",
    name: "The Orchid Room",
    location: "London, UK",
    image: teaImg,
    cuisine: "High Tea",
    rating: "5.0",
    description: "An elegant afternoon tradition. Fine china, floral infusions, and delicate pastries.",
  },
  {
    id: "eden",
    name: "Eden Terrace",
    location: "Singapore",
    image: terraceImg,
    cuisine: "Garden Brunch",
    rating: "4.7",
    description: "Dining amidst nature. Sun-dappled tables and fresh, organic ingredients.",
  },
  {
    id: "study",
    name: "The Study",
    location: "Boston, USA",
    image: libraryImg,
    cuisine: "Literary Lounge",
    rating: "4.8",
    description: "Quiet corners, leather chairs, and the scent of old books paired with dark roast coffee.",
  },
];

export default function Cafes() {
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
            Curated Culinary Lounges
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            <div className="relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">City</label>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Select city" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <div className="relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-4 md:pl-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Date & Time</label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Reservation date" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <div className="relative md:px-4 pb-2 md:pb-0">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Guests</label>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Table for..." className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <button className="bg-primary text-primary-foreground h-12 w-full rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
              <Search className="w-4 h-4 mr-2" />
              Find Table
            </button>
          </motion.div>
        </div>
      </div>

      {/* Cafe List */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {cafes.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                  <span className="text-xs font-bold text-foreground">{cafe.rating}</span>
                </div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={cafe.image}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors">{cafe.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs uppercase tracking-wide">{cafe.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-foreground">{cafe.cuisine}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed pt-2 border-t border-primary/10 mt-4">
                  {cafe.description}
                </p>
                
                <div className="pt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:underline underline-offset-4">
                  View Menu <ArrowRight className="w-3 h-3 ml-2" />
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
