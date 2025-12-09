import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Search, Star, ArrowRight, X, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Assets
import { siteContent } from "@/data/siteContent";

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

export default function Hotels() {
  const [selectedHotel, setSelectedHotel] = useState<typeof allHotels[0] | null>(null);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [filteredHotels, setFilteredHotels] = useState(allHotels);
  const [isSearching, setIsSearching] = useState(false);

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
      <Navbar />
      
      {/* Search Section */}
      <div className="pt-32 pb-12 px-6 bg-secondary/20 border-b border-primary/5">
        <div className="container mx-auto">
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            {/* Location Dropdown */}
            <div className="relative">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Location</label>
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-transparent border border-border rounded outline-none hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm font-medium">{selectedCity}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: showCityDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-3 h-3 rotate-90 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showCityDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50"
                    >
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setShowCityDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors ${
                            selectedCity === city ? "bg-secondary/30" : ""
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Check-in Date */}
            <div className="relative">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-in</label>
              <div className="flex items-center border border-border rounded px-3 py-2 hover:border-primary/30 transition-colors">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-foreground text-sm font-medium" 
                />
              </div>
            </div>
            
            {/* Check-out Date */}
            <div className="relative">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-out</label>
              <div className="flex items-center border border-border rounded px-3 py-2 hover:border-primary/30 transition-colors">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input 
                  type="date" 
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-foreground text-sm font-medium" 
                />
              </div>
            </div>
            
            {/* Guests Counter */}
            <div className="relative">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Guests</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded bg-secondary hover:bg-secondary/70 flex items-center justify-center transition-colors text-sm font-bold"
                >
                  -
                </button>
                <div className="flex-1 flex items-center justify-center border border-border rounded px-3 py-2">
                  <Users className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-bold">{guests}</span>
                </div>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="w-8 h-8 rounded bg-secondary hover:bg-secondary/70 flex items-center justify-center transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-primary text-primary-foreground h-10 w-full rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold disabled:opacity-50"
            >
              {isSearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Hotel Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedHotel(hotel)}
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
          </AnimatePresence>
        </div>
      </div>

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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 flex items-center rounded-full">
                  <Star className="w-4 h-4 text-primary fill-primary mr-1" />
                  <span className="text-sm font-bold">{selectedHotel.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">({selectedHotel.reviews} reviews)</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-serif text-foreground mb-2">{selectedHotel.name}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm uppercase tracking-wide">{selectedHotel.location}</span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {selectedHotel.rooms} rooms available
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">from</p>
                    <p className="text-3xl font-serif text-foreground">{selectedHotel.price}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed mb-6 pb-6 border-b border-primary/10">
                  {selectedHotel.description}
                </p>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1 bg-secondary/50 text-foreground text-xs font-medium rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Check-in/out Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-primary/10 p-4 rounded">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-xs uppercase tracking-widest font-bold">Check-in</span>
                    </div>
                    <p className="text-lg font-serif">{selectedHotel.checkIn}</p>
                  </div>
                  <div className="border border-primary/10 p-4 rounded">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-xs uppercase tracking-widest font-bold">Check-out</span>
                    </div>
                    <p className="text-lg font-serif">{selectedHotel.checkOut}</p>
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full bg-primary text-primary-foreground py-4 rounded flex items-center justify-center hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs font-bold">
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}