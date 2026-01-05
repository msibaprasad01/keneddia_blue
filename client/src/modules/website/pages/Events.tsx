import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, X, Users, Music, GlassWater, Sparkles, ChevronRight } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import HeaderLogo from "@/modules/website/components/HeaderLogo";

// Assets
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { BackButton } from "@/components/ui/BackButton";

// Event Navigation Items
const EVENT_NAV_ITEMS = [
  { type: 'link', label: 'WEDDINGS', key: 'weddings', href: '#collection' },
  { type: 'link', label: 'CORPORATE', key: 'corporate', href: '#collection' },
  { type: 'link', label: 'SOCIAL', key: 'social', href: '#collection' },
  { type: 'link', label: 'PLANNING', key: 'planning', href: '#collection' },
] as any[];

const events = [
  {
    id: 1,
    title: "Jazz & Wine Night",
    category: "Music & Dining",
    date: "Dec 15, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "The Blue Note Mumbai",
    image: siteContent.images.events.jazz,
    description: "An evening of smooth jazz performance by the 'Midnight Quartet' accompanied by a curated selection of vintage wines.",
    highlights: ["Live Quartet", "Sommelier Selection", "Tapas Menu"],
  },
  {
    id: 2,
    title: "New Year's Eve Gala",
    category: "Celebration",
    date: "Dec 31, 2025",
    time: "8:00 PM onwards",
    location: "Skyline High, Bengaluru",
    image: siteContent.images.events.gala,
    description: "Welcome 2026 under the stars. Champagne toast, gourmet buffet, and a spectacular view of the city fireworks.",
    highlights: ["Champagne Toast", "Fireworks View", "Gourmet Buffet", "Live DJ"],
  },
  {
    id: 3,
    title: "Spring High Tea Showcase",
    category: "Culinary",
    date: "Jan 10, 2026",
    time: "3:00 PM - 6:00 PM",
    location: "The Orchid Room, New Delhi",
    image: siteContent.images.events.highTea,
    description: "Experience the art of tea blending with our master sommeliers, paired with floral-inspired pastries.",
    highlights: ["Tea Blending Workshop", "Floral Pastries", "Take-home Gift"],
  },
  {
    id: 4,
    title: "Artisan Market",
    category: "Community",
    date: "Jan 25, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "Courtyard, Goa",
    image: siteContent.images.events.wedding, // Placeholder for market/community event
    description: "Discover local crafts, organic produce, and handmade goods from artisans across the region.",
    highlights: ["Local Artisans", "Organic Food Stalls", "Live Folk Music"],
  },
];

// Hero Images
const HERO_IMAGES = [
  siteContent.images.events.gala,
  siteContent.images.events.jazz,
  siteContent.images.events.wedding
];

const categories = ["All Categories", "Music & Dining", "Celebration", "Culinary", "Community"];

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Hero Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = events.filter(event => selectedCategory === "All Categories" || event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar navItems={EVENT_NAV_ITEMS} />

      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <OptimizedImage
              {...HERO_IMAGES[currentHeroIndex]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-background/90 backdrop-blur-sm p-8 md:p-12 rounded-sm border border-primary/20 max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">
              Moments That Matter
            </h1>
            <p className="text-lg text-muted-foreground font-light tracking-wide uppercase">
              Curated Events, Weddings & Corporate Gatherings
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">Celebrating Life's Milestones</h2>
          <p className="text-muted-foreground/80 leading-relaxed text-lg font-light max-w-3xl mx-auto mb-12">
            From intimate jazz evenings to grand wedding galas, Kennedia Events hosts a spectrum of experiences. Our dedicated planning team ensures every detail is perfect, allowing you to immerse yourself in the celebration.
          </p>
          <div className="flex justify-center gap-12 text-primary">
            <div className="flex flex-col items-center">
              <GlassWater className="w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest font-bold">Exquisite Catering</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest font-bold">Unmatched Decor</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 mb-3" />
              <span className="text-xs uppercase tracking-widest font-bold">Expert Planning</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE SECTION */}
      <section id="collection" className="py-20 bg-secondary/5 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Upcoming</span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Events & Happenings</h2>
          </div>

          {/* Filter Categories */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50 hover:bg-secondary text-muted-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="group cursor-pointer bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <OptimizedImage
                      {...event.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-sm">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-xs text-primary font-bold uppercase tracking-widest mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {event.date}
                    </div>

                    <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">{event.title}</h3>

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

                    <p className="text-muted-foreground/80 text-sm leading-relaxed mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    <button className="w-full py-3 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded flex items-center justify-center">
                      Event Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-20 bg-background border-t border-border/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
          <div className="order-2 md:order-1 relative h-[500px] w-full rounded-lg overflow-hidden">
            <OptimizedImage
              {...siteContent.images.events.wedding}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl font-serif mb-2">Weddings at Kennedia</h3>
              <p className="text-white/80 font-light">Create timeless memories in our breathtaking venues.</p>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">Start Planning</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether it's a corporate conference, a social gathering, or the wedding of your dreams, our team is here to bring your vision to life.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded">
                Inquire Now
              </button>
              <button className="px-8 py-4 border border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors rounded">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Magnified Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[21/9] overflow-hidden">
                <OptimizedImage
                  {...selectedEvent.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-primary-foreground uppercase tracking-widest">{selectedEvent.category}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-serif text-foreground mb-4">{selectedEvent.title}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wide text-foreground">{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm uppercase tracking-wide">{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm uppercase tracking-wide">{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground/80 font-light leading-relaxed mb-8">
                  {selectedEvent.description}
                </p>

                <div className="mb-8 bg-secondary/10 p-6 rounded-lg border border-primary/5">
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-4 font-bold">Event Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedEvent.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        <span className="text-sm font-medium text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-4 rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
                  RSVP to Event
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )
        }
      </AnimatePresence >

      <Footer />
    </div>
  );
}
