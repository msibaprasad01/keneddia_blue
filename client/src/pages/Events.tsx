import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Asset placeholders (using reliable images)
import eventImg1 from "@assets/generated_images/speakeasy_jazz_bar.png"; 
import eventImg2 from "@assets/generated_images/rooftop_cocktail_bar.png"; 
import eventImg3 from "@assets/generated_images/luxury_high_tea_lounge.png";

const events = [
  {
    id: 1,
    title: "Jazz & Wine Night",
    category: "Music & Dining",
    date: "Dec 15, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "The Blue Note Mumbai",
    image: eventImg1,
    description: "An evening of smooth jazz performance by the 'Midnight Quartet' accompanied by a curated selection of vintage wines.",
  },
  {
    id: 2,
    title: "New Year's Eve Gala",
    category: "Celebration",
    date: "Dec 31, 2025",
    time: "8:00 PM onwards",
    location: "Skyline High, Bengaluru",
    image: eventImg2,
    description: "Welcome 2026 under the stars. Champagne toast, gourmet buffet, and a spectacular view of the city fireworks.",
  },
  {
    id: 3,
    title: "Spring High Tea Showcase",
    category: "Culinary",
    date: "Jan 10, 2026",
    time: "3:00 PM - 6:00 PM",
    location: "The Orchid Room, New Delhi",
    image: eventImg3,
    description: "Experience the art of tea blending with our master sommeliers, paired with floral-inspired pastries.",
  },
];

export default function Events() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6 bg-secondary/20 border-b border-primary/5 mb-12">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-foreground mb-4"
          >
            Events & Happenings
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover upcoming showcases, culinary experiences, and exclusive brand activities at Kennedia Blu.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-xs text-primary font-bold uppercase tracking-widest mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {event.date}
                </div>
                
                <h3 className="text-2xl font-serif text-foreground mb-3">{event.title}</h3>
                
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 opacity-70" />
                    {event.location}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {event.description}
                </p>
                
                <button className="w-full py-3 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors rounded">
                  RSVP Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
