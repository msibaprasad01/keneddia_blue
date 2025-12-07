import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight, Wine } from "lucide-react";
import Navbar from "@/components/Navbar";

// Assets
import speakeasyImg from "@assets/generated_images/speakeasy_jazz_bar.png";
import rooftopImg from "@assets/generated_images/rooftop_cocktail_bar.png";
import whiskeyImg from "@assets/generated_images/classic_whiskey_lounge.png";
import beachImg from "@assets/generated_images/beachside_sunset_bar.png";
import moodyBarImg from "@assets/generated_images/moody_luxury_bar_interior.png";
import exclusiveLoungeImg from "@assets/generated_images/exclusive_rooftop_lounge_at_night.png";

const bars = [
  {
    id: "bluenote",
    name: "The Blue Note",
    location: "Chicago, USA",
    image: speakeasyImg,
    type: "Jazz Speakeasy",
    rating: "4.9",
    description: "Hidden behind an unmarked door, discover a world of vintage velvet, live sax, and prohibition-era cocktails.",
  },
  {
    id: "skyline",
    name: "Skyline High",
    location: "Bangkok, Thailand",
    image: rooftopImg,
    type: "Rooftop Lounge",
    rating: "4.8",
    description: "Suspend reality 60 floors up. Neon lights meet starlight with panoramic views of the electric city below.",
  },
  {
    id: "amber",
    name: "The Amber Vault",
    location: "Edinburgh, Scotland",
    image: whiskeyImg,
    type: "Whiskey Library",
    rating: "5.0",
    description: "A gentleman's retreat featuring rare single malts, crackling fireplaces, and deep leather armchairs.",
  },
  {
    id: "sunset",
    name: "Sunset Point",
    location: "Maldives",
    image: beachImg,
    type: "Beach Club",
    rating: "4.9",
    description: "Barefoot luxury where the ocean meets the sky. Signature rum punches served as the sun dips below the horizon.",
  },
  {
    id: "obsidian",
    name: "Obsidian Room",
    location: "New York, USA",
    image: moodyBarImg,
    type: "Modern Mixology",
    rating: "4.7",
    description: "Dark, dramatic, and designed for the night. Experimental cocktails served in crystal amidst avant-garde decor.",
  },
  {
    id: "vertex",
    name: "Vertex Lounge",
    location: "Shanghai, China",
    image: exclusiveLoungeImg,
    type: "VIP Sky Bar",
    rating: "4.9",
    description: "The pinnacle of exclusivity. Private tables, bottle service, and an atmosphere of unmatched sophistication.",
  },
];

export default function Bars() {
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
            Exclusive Nightlife
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
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Date</label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Select date" className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <div className="relative md:px-4 pb-2 md:pb-0">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Experience</label>
              <div className="flex items-center">
                <Wine className="w-4 h-4 text-primary mr-2" />
                <input type="text" placeholder="Vibe..." className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/30 font-medium" />
              </div>
            </div>
            
            <button className="bg-primary text-primary-foreground h-12 w-full rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
              <Search className="w-4 h-4 mr-2" />
              Reserve
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bar List */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {bars.map((bar, index) => (
            <motion.div
              key={bar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                  <span className="text-xs font-bold text-foreground">{bar.rating}</span>
                </div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={bar.image}
                  alt={bar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors">{bar.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs uppercase tracking-wide">{bar.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Vibe</p>
                    <p className="text-sm font-medium text-foreground">{bar.type}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed pt-2 border-t border-primary/10 mt-4">
                  {bar.description}
                </p>
                
                <div className="pt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:underline underline-offset-4">
                  Book Table <ArrowRight className="w-3 h-3 ml-2" />
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
