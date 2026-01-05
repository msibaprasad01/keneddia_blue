import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import HeaderLogo from "@/modules/website/components/HeaderLogo";

// Assets
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Hotel Navigation Items
const HOTEL_NAV_ITEMS = [
  { type: 'link', label: 'OVERVIEW', key: 'overview', href: '#overview' },
  { type: 'link', label: 'COLLECTION', key: 'collection', href: '#collection' },
  { type: 'link', label: 'OFFERS', key: 'offers', href: '/offers' }, // Placeholder 
  { type: 'link', label: 'EVENTS', key: 'events', href: '/events' },
  { type: 'link', label: 'CONTACT', key: 'contact', href: '#footer' }, // Scroll to footer
] as any[]; // Using any to bypass strict type checking if NavItem types conflict locally

const allHotels = [
  {
    id: "mumbai",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    image: siteContent.images.hotels.mumbai,
    price: "₹35,000",
    rating: "4.9",
    reviews: 1240,
    description: "A historic landmark transformed into a sanctuary of modern luxury, overlooking the Gateway of India.",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Gym", "Room Service"],
    rooms: 156,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "bengaluru",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    image: siteContent.images.hotels.bengaluru,
    price: "₹18,000",
    rating: "4.8",
    reviews: 892,
    description: "Minimalist perfection in the heart of Bengaluru's most exclusive tech and lifestyle district.",
    amenities: ["Free WiFi", "Traditional Tea Room", "Michelin Restaurant", "Zen Garden"],
    rooms: 98,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "delhi",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    image: siteContent.images.hotels.delhi,
    price: "₹25,000",
    rating: "5.0",
    reviews: 2156,
    description: "Opulence redefined with unparalleled views of the capital's heritage.",
    amenities: ["Infinity Pool", "Spa", "5 Restaurants", "Butler Service", "Helipad"],
    rooms: 342,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: "kolkata",
    name: "Kennedia Blu Kolkata",
    location: "Park Street, Kolkata",
    city: "Kolkata",
    image: siteContent.images.hotels.kolkata,
    price: "₹20,000",
    rating: "4.9",
    reviews: 1567,
    description: "Classic colonial elegance meets contemporary comfort in the City of Joy.",
    amenities: ["Michelin Star Restaurant", "Wine Cellar", "Art Gallery", "Concierge"],
    rooms: 124,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "hyderabad",
    name: "Kennedia Blu Hyderabad",
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    image: siteContent.images.hotels.hyderabad,
    price: "₹22,000",
    rating: "4.8",
    reviews: 1023,
    description: "An urban oasis featuring our signature infinity pool and lush sky gardens.",
    amenities: ["Rooftop Pool", "Sky Gardens", "3 Restaurants", "Spa", "Business Center"],
    rooms: 287,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  },
  {
    id: "chennai",
    name: "Kennedia Blu Chennai",
    location: "ECR, Chennai",
    city: "Chennai",
    image: siteContent.images.hotels.chennai,
    price: "₹19,000",
    rating: "4.9",
    reviews: 934,
    description: "Waterfront luxury with commanding views of the Bay of Bengal.",
    amenities: ["Harbour Views", "Fine Dining", "Pool", "Gym", "Yacht Charter"],
    rooms: 198,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  },
];

const cities = ["All Cities", "Mumbai", "Bengaluru", "Delhi", "Kolkata", "Hyderabad", "Chennai"];

// Hero Slider Images (Using existing hotel images for now)
const HERO_IMAGES = [
  siteContent.images.hotels.mumbai,
  siteContent.images.hotels.delhi,
  siteContent.images.hotels.hyderabad
];

export default function Hotels() {
  const [selectedHotel, setSelectedHotel] = useState<typeof allHotels[0] | null>(null);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [filteredHotels, setFilteredHotels] = useState(allHotels);
  const [isSearching, setIsSearching] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Hero Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const filtered = allHotels.filter((hotel) => {
        if (selectedCity !== "All Cities" && hotel.city !== selectedCity) {
          return false;
        }
        return true;
      });
      setFilteredHotels(filtered);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar navItems={HOTEL_NAV_ITEMS} logo={siteContent.brand.logo_hotel} />

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
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
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 uppercase tracking-wider"
          >
            Timeless Luxury
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 font-light max-w-2xl"
          >
            Experience the pinnacle of hospitality at Kennedia Blu.
          </motion.p>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* 2. ABOUT / OVERVIEW SECTION */}
      <section id="overview" className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative z-10">
                <OptimizedImage
                  {...siteContent.images.hotels.delhi}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 aspect-square border border-primary/20 rounded-lg -z-0" />
              <div className="absolute -top-6 -left-6 w-2/3 aspect-square bg-secondary/30 rounded-lg -z-0" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Our Philosophy</h3>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                  Where Every Stay <br /> Is a Story
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                Kennedia Blu Hotels & Resorts represents a collection of the world's most distinguished properties, where history, culture, and luxury converge. From the bustling streets of Mumbai's Colaba to the serene backwaters of Chennai, each property is a gateway to the extraordinary.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-3xl font-serif text-primary mb-1">50+</h4>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Global Locations</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-primary mb-1">5-Star</h4>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Service Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE / COLLECTION SECTION */}
      <section id="collection" className="py-20 bg-secondary/5 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Explore Our Collection</h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto" />
          </div>

          {/* Search Section */}
          <div className="mb-12 bg-card p-6 rounded-xl shadow-lg border border-border/50 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Location Dropdown */}
              <div className="relative">
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Location</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full flex items-center justify-between px-3 py-3 bg-background border border-border rounded outline-none hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      <span className="text-sm font-medium">{selectedCity}</span>
                    </div>
                    <ArrowRight className={`w-3 h-3 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-90" : ""}`} />
                  </button>
                  {showCityDropdown && (
                    <div className="absolute top-full mt-1 w-full bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setShowCityDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors ${selectedCity === city ? "bg-secondary/30" : ""
                            }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-in</label>
                <div className="flex items-center bg-background border border-border rounded px-3 py-3">
                  <Calendar className="w-4 h-4 text-primary mr-2" />
                  <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-out</label>
                <div className="flex items-center bg-background border border-border rounded px-3 py-3">
                  <Calendar className="w-4 h-4 text-primary mr-2" />
                  <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-primary text-primary-foreground h-[46px] w-full rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold disabled:opacity-50"
              >
                {isSearching ? <Search className="w-4 h-4 animate-spin" /> : "Check Availability"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedHotel(hotel)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                    <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                      <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                      <span className="text-xs font-bold text-foreground">{hotel.rating}</span>
                    </div>
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    >
                      <OptimizedImage
                        {...hotel.image}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors">{hotel.name}</h3>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-sm uppercase tracking-wide">{hotel.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">from</p>
                        <p className="text-lg font-serif text-foreground">{hotel.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground/80 font-light leading-relaxed pt-2 border-t border-primary/10 mt-4 line-clamp-2">
                      {hotel.description}
                    </p>
                    <div className="pt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:underline underline-offset-4">
                      View Details <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-24 bg-primary text-primary-foreground text-center px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Experience the Extraordinary</h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join our loyalty program to unlock exclusive rates, complimentary upgrades, and unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-background text-primary font-bold uppercase tracking-widest hover:bg-background/90 transition-colors rounded">
              Join Kennedia Rewards
            </button>
            <button className="px-8 py-4 border border-primary-foreground/30 text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded">
              Contact Concierge
            </button>
          </div>
        </div>
      </section>

      {/* Magnified Detail Modal */}
      <AnimatePresence>
        {selectedHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHotel(null)}
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
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/9] overflow-hidden">
                <OptimizedImage
                  {...selectedHotel.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-4 h-4 text-primary fill-primary mr-1" />
                  <span className="text-sm font-bold">{selectedHotel.rating}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-serif text-foreground mb-2">{selectedHotel.name}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm uppercase tracking-wide">{selectedHotel.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-serif text-foreground">{selectedHotel.price}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed mb-6 pb-6 border-b border-primary/10">
                  {selectedHotel.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-secondary/50 text-foreground text-xs font-medium rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-4 rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}