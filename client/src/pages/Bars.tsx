import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight, Wine } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderLogo from "@/components/HeaderLogo";

// Assets
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { BackButton } from "@/components/ui/BackButton";

const bars = [
  {
    id: "bluenote",
    name: "The Blue Note Mumbai",
    location: "Bandra West, Mumbai",
    image: siteContent.images.bars.speakeasy,
    type: "Jazz Speakeasy",
    rating: "4.9",
    description: "Hidden behind an unmarked door, discover a world of vintage velvet, live sax, and prohibition-era cocktails.",
  },
  {
    id: "skyline",
    name: "Skyline High",
    location: "UB City, Bengaluru",
    image: siteContent.images.bars.rooftop,
    type: "Rooftop Lounge",
    rating: "4.8",
    description: "Suspend reality 20 floors up. Neon lights meet starlight with panoramic views of the electric city below.",
  },
  {
    id: "amber",
    name: "The Amber Vault",
    location: "Connaught Place, Delhi",
    image: siteContent.images.bars.whiskey,
    type: "Whiskey Library",
    rating: "5.0",
    description: "A gentleman's retreat featuring rare single malts, crackling fireplaces, and deep leather armchairs.",
  },
  {
    id: "sunset",
    name: "Sunset Point",
    location: "Varkala, Kerala",
    image: siteContent.images.bars.beach,
    type: "Beach Club",
    rating: "4.9",
    description: "Barefoot luxury where the ocean meets the sky. Signature rum punches served as the sun dips below the horizon.",
  },
  {
    id: "obsidian",
    name: "Obsidian Room",
    location: "Koregaon Park, Pune",
    image: siteContent.images.bars.jazz,
    type: "Modern Mixology",
    rating: "4.7",
    description: "Dark, dramatic, and designed for the night. Experimental cocktails served in crystal amidst avant-garde decor.",
  },
  {
    id: "vertex",
    name: "Vertex Lounge",
    location: "Banjara Hills, Hyderabad",
    image: siteContent.images.bars.lounge,
    type: "VIP Sky Bar",
    rating: "4.9",
    description: "The pinnacle of exclusivity. Private tables, bottle service, and an atmosphere of unmatched sophistication.",
  },
];

export default function Bars() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeaderLogo
        logo={siteContent.brand.logo_bar.image}
        text={siteContent.brand.logo_bar.text}
        bgColor="bg-background"
      />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif mb-6 text-foreground"
          >
            Exclusive Nightlife
          </motion.h1>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
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
                <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                  <span className="text-xs font-bold text-foreground">{bar.rating}</span>
                </div>
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                >
                  <OptimizedImage
                    {...bar.image}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
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
      <Footer />
    </div>
  );
}