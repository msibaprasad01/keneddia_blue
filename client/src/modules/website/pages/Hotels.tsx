import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ArrowRight, X, Share2, Heart, Gift, Check } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import HotelCarouselSection from "@/modules/website/components/HotelCarouselSection";
import CollectionSection from "@/modules/website/components/CollectionSection";
import HotelOffersCarousel from "@/modules/website/components/hotel/HotelOffersCarousel";
import HotelNewsUpdates from "@/modules/website/components/hotel/HotelNewsUpdates";

// Assets
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Hotel Navigation Items
const HOTEL_NAV_ITEMS = [
  { type: 'link', label: 'OVERVIEW', key: 'overview', href: '#overview' },
  { type: 'link', label: 'COLLECTION', key: 'collection', href: '#collection' },
  { type: 'link', label: 'OFFERS', key: 'offers', href: '/offers' },
  { type: 'link', label: 'EVENTS', key: 'events', href: '/events' },
  { type: 'link', label: 'CONTACT', key: 'contact', href: '#footer' },
] as any[];

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
    description:
      "A historic landmark transformed into a sanctuary of modern luxury, overlooking the Gateway of India. Experience the convergence of heritage and contemporary elegance.",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Gym", "Room Service"],
    features: ["Heritage Wing", "Sea View Suites", "Butlers on call"],
    rooms: 156,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: {
      lat: 18.921984,
      lng: 72.833855, // Colaba, Mumbai
    },
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
    description:
      "Minimalist perfection in the heart of Bengaluru's most exclusive tech and lifestyle district. A haven for digital nomads and business leaders.",
    amenities: ["Free WiFi", "Traditional Tea Room", "Michelin Restaurant", "Zen Garden"],
    features: ["Co-working Lounge", "Rooftop Microbrewery", "Smart Rooms"],
    rooms: 98,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: {
      lat: 12.971891,
      lng: 77.641154, // Indiranagar, Bengaluru
    },
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
    description:
      "Opulence redefined with unparalleled views of the capital's heritage. The preferred address for diplomats and discerning travelers.",
    amenities: ["Infinity Pool", "Spa", "5 Restaurants", "Butler Service", "Helipad"],
    features: ["Presidential Suite", "Cigar Lounge", "Art Gallery"],
    rooms: 342,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    coordinates: {
      lat: 28.631451,
      lng: 77.216667, // Connaught Place, Delhi
    },
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
    description:
      "Classic colonial elegance meets contemporary comfort in the City of Joy. A tribute to the artistic and intellectual spirit of Bengal.",
    amenities: ["Michelin Star Restaurant", "Wine Cellar", "Art Gallery", "Concierge"],
    features: ["Literary Club", "Afternoon Tea", "Jazz Bar"],
    rooms: 124,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: {
      lat: 22.553523,
      lng: 88.349934, // Park Street, Kolkata
    },
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
    description:
      "An urban oasis featuring our signature infinity pool and lush sky gardens. The jewel of the Nizams, reimagined for the modern era.",
    amenities: ["Rooftop Pool", "Sky Gardens", "3 Restaurants", "Spa", "Business Center"],
    features: ["Convention Hall", "Helipad Access", "Royal Suites"],
    rooms: 287,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: {
      lat: 17.412348,
      lng: 78.448522, // Banjara Hills, Hyderabad
    },
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
    description:
      "Waterfront luxury with commanding views of the Bay of Bengal. Where the rhythm of the waves meets the soul of hospitality.",
    amenities: ["Harbour Views", "Fine Dining", "Pool", "Gym", "Yacht Charter"],
    features: ["Private Beach", "Ayurvedic Spa", "Seafood Specialty"],
    rooms: 198,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: {
      lat: 12.909821,
      lng: 80.249693, // ECR, Chennai
    },
  },
];


const cities = ["All Cities", "Mumbai", "Bengaluru", "Delhi", "Kolkata", "Hyderabad", "Chennai"];

// Hero Slider Images
const HERO_IMAGES = [
  siteContent.images.hotels.mumbai,
  siteContent.images.hotels.delhi,
  siteContent.images.hotels.hyderabad
];

// Define a flexible type compatible with CollectionSection's expectation
type HotelType = typeof allHotels[0];
type FlexHotelType = Omit<HotelType, 'features'> & { features?: string[] };

export default function Hotels() {
  const [selectedHotel, setSelectedHotel] = useState<FlexHotelType | null>(null);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(allHotels);
  const [isSearching, setIsSearching] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showCelebrationOffer, setShowCelebrationOffer] = useState(false);

  // Hero Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Show offer popup after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCelebrationOffer(true), 10000);
    return () => clearTimeout(timer);
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

  const handleShare = async () => {
    if (selectedHotel && navigator.share) {
      try {
        await navigator.share({
          title: selectedHotel.name,
          text: `Check out ${selectedHotel.name} at Kennedia Blu!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Link copied to clipboard!"); // Fallback
    }
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
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 uppercase tracking-wider drop-shadow-2xl"
          >
            Timeless Luxury
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 font-light max-w-2xl drop-shadow-lg"
          >
            Where every moment is crafted with elegance.
          </motion.p>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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

      {/* NEW: HOTEL CAROUSEL SECTION */}
      <HotelCarouselSection />

      {/* 2. ABOUT / OVERVIEW SECTION - COMPACT */}
      <section id="overview" className="py-8 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center">
            {/* LEFT: Compact Rectangular Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative z-10 border border-border/10 shadow-2xl">
                <OptimizedImage
                  {...siteContent.images.hotels.delhi}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-primary/20 rounded-xl -z-0" />
              <div className="absolute -top-4 -left-4 w-1/2 h-1/2 bg-secondary/10 rounded-xl -z-0" />
            </motion.div>

            {/* RIGHT: Carousel Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5">
                      {currentHeroIndex === 0 ? "Our Philosophy" : currentHeroIndex === 1 ? "Our Promise" : "Our Legacy"}
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-3">
                      {currentHeroIndex === 0 && "Where Every Stay Is a Story"}
                      {currentHeroIndex === 1 && "Excellence in Every Detail"}
                      {currentHeroIndex === 2 && "A Heritage of Hospitality"}
                    </h2>
                  </div>

                  <p className="text-muted-foreground leading-relaxed text-base font-light">
                    {currentHeroIndex === 0 && "Kennedia Blu Hotels & Resorts represents a collection of the world's most distinguished properties. We invite you to experience hospitality that goes beyond service—hospitality that is a feeling, a memory, a story waiting to be told."}
                    {currentHeroIndex === 1 && "From the moment you arrive, every detail is carefully curated to exceed your expectations. Our commitment to excellence is reflected in our world-class amenities, personalized service, and unforgettable experiences that create lasting memories."}
                    {currentHeroIndex === 2 && "With decades of experience in luxury hospitality, Kennedia Blu has established itself as a leader in creating exceptional guest experiences. Our heritage of excellence continues to set the standard for premium accommodations worldwide."}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">50+</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Locations</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">5-Star</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Rating</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">100K+</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Guests</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? "bg-primary w-8" : "bg-border w-4 hover:bg-primary/50"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CollectionSection
        filteredHotels={filteredHotels}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        handleSearch={handleSearch}
        isSearching={isSearching}
        cities={cities}
        showCityDropdown={showCityDropdown}
        setShowCityDropdown={setShowCityDropdown}
        onHotelSelect={setSelectedHotel}
      />

      {/* NEW: HOTEL OFFERS CAROUSEL */}
      <HotelOffersCarousel />

      {/* NEW: HOTEL NEWS UPDATES */}
      <HotelNewsUpdates />

      {/* 4. CTA SECTION */}
      <section className="py-10 bg-primary text-primary-foreground text-center px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Experience the Extraordinary</h2>
          <p className="text-base text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Join our loyalty program to unlock exclusive rates, complimentary upgrades, and unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-background text-primary font-bold uppercase tracking-widest hover:bg-background/90 transition-colors rounded text-sm">
              Join Kennedia Rewards
            </button>
            <button className="px-6 py-3 border border-primary-foreground/30 text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors rounded text-sm">
              Contact Concierge
            </button>
          </div>
        </div>
      </section>

      {/* ENHANCED DETAIL MODAL */}
      <AnimatePresence>
        {selectedHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHotel(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto overflow-x-hidden shadow-2xl flex flex-col lg:flex-row"
            >
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-full flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Imagery */}
              <div className="w-full lg:w-1/2 relative h-[40vh] lg:h-auto overflow-hidden bg-gray-100">
                <OptimizedImage
                  {...selectedHotel.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 text-white lg:hidden">
                  <h2 className="text-2xl font-serif font-bold">{selectedHotel.name}</h2>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
                <div className="flex-1">
                  <div className="hidden lg:block mb-8">
                    <h2 className="text-4xl font-serif text-foreground mb-2">{selectedHotel.name}</h2>
                    <div className="flex items-center text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                        <span className="text-sm uppercase tracking-wide">{selectedHotel.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1.5 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold">{selectedHotel.rating} ({selectedHotel.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs / Description */}
                  <div className="mb-8">
                    <p className="text-base text-muted-foreground leading-relaxed font-light">
                      {selectedHotel.description}
                    </p>
                  </div>

                  {/* Features / Amenities */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
                        Amenities
                      </h3>
                      <ul className="space-y-2">
                        {selectedHotel.amenities.slice(0, 4).map(amenity => (
                          <li key={amenity} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
                        Highlights
                      </h3>
                      <ul className="space-y-2">
                        {selectedHotel.features?.map(feature => (
                          <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Celebration Booking */}
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-5 mb-8">
                    <h4 className="flex items-center text-sm font-bold text-foreground mb-2">
                      <Gift className="w-4 h-4 mr-2 text-primary" />
                      Planning a Celebration?
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Let us make your special occasion unforgettable with our curated celebration packages.
                    </p>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                      <input type="checkbox" className="accent-primary w-4 h-4" />
                      <span>Add Celebration Package (Cake, Decor & Champagne)</span>
                    </label>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total for 1 Night</p>
                    <p className="text-3xl font-serif text-foreground font-medium">{selectedHotel.price}</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={handleShare}
                      className="p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-foreground"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-red-500" title="Save">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      Book Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXCLUSIVE OFFER POPUP */}
      <AnimatePresence>
        {showCelebrationOffer && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-40 bg-card border border-border/50 p-6 rounded-lg shadow-2xl max-w-sm"
          >
            <button
              onClick={() => setShowCelebrationOffer(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-medium mb-1">Exclusive Offer</h4>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  Book your stay within the next 24 hours and receive a complimentary spa treatment on us.
                </p>
                <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4">
                  Claim Offer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}