import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { ArrowRight, MapPin, Star, Building2, ChevronLeft, ChevronRight, Phone, Mail, Calendar, Search, Home, Users, Wifi, Grid3x3, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { allHotels } from "@/data/hotelData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom CSS for Leaflet popups
const customPopupStyles = `
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 4px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  .leaflet-popup-content {
    margin: 8px;
    min-width: 200px;
  }
  .leaflet-popup-tip {
    display: none;
  }
  .custom-popup .leaflet-popup-close-button {
    display: none;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = customPopupStyles;
  if (!document.querySelector('style[data-leaflet-custom]')) {
    styleEl.setAttribute('data-leaflet-custom', 'true');
    document.head.appendChild(styleEl);
  }
}

const featuredHotels = [
  {
    id: "mumbai",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    type: "Heritage",
    image: siteContent.images.hotels.mumbai,
    rating: "4.9",
    reviews: 342,
    description: "Experience timeless elegance in the heart of South Mumbai with colonial charm.",
    amenities: ["Ocean View", "Heritage Architecture", "Fine Dining", "Spa & Wellness"],
    capacity: "120 Rooms",
    price: "₹12,500",
    rooms: 120,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: { lat: 18.9067, lng: 72.8147 }
  },
  {
    id: "delhi",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    type: "Luxury",
    image: siteContent.images.hotels.delhi,
    rating: "5.0",
    reviews: 512,
    description: "Unparalleled luxury in the capital's most prestigious location.",
    amenities: ["Presidential Suite", "Michelin Dining", "Private Butler", "Infinity Pool"],
    capacity: "200 Suites",
    price: "₹18,900",
    rooms: 200,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    coordinates: { lat: 28.6315, lng: 77.2167 }
  },
  {
    id: "bengaluru",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    type: "Business",
    image: siteContent.images.hotels.bengaluru,
    rating: "4.8",
    reviews: 289,
    description: "Perfect for business travelers and tech professionals in Silicon Valley.",
    amenities: ["Business Center", "High-Speed WiFi", "Conference Rooms", "Rooftop Bar"],
    capacity: "150 Rooms",
    price: "₹10,800",
    rooms: 150,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: "chennai",
    name: "Kennedia Blu Chennai",
    location: "ECR, Chennai",
    city: "Chennai",
    type: "Resort",
    image: siteContent.images.hotels.chennai,
    rating: "4.9",
    reviews: 423,
    description: "Beachfront paradise along the scenic East Coast Road with ocean views.",
    amenities: ["Beach Access", "Water Sports", "Ayurvedic Spa", "Seafood Restaurant"],
    capacity: "80 Villas",
    price: "₹14,500",
    rooms: 80,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: "hyderabad",
    name: "Kennedia Blu Hyderabad",
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    type: "City Hotel",
    image: siteContent.images.hotels.hyderabad,
    rating: "4.8",
    reviews: 367,
    description: "Contemporary elegance in the City of Pearls with royal hospitality.",
    amenities: ["City Views", "Multi-Cuisine", "Fitness Center", "Event Spaces"],
    capacity: "135 Rooms",
    price: "₹11,200",
    rooms: 135,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    coordinates: { lat: 17.4239, lng: 78.4738 }
  }
];

const cities = [
  "All Cities",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Kolkata",
  "Hyderabad",
  "Chennai",
];

// Map controller component
function MapViewController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 2.0,
      easeLinearity: 0.1
    });
  }, [center, zoom, map]);

  return null;
}

export default function HotelCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState(featuredHotels);

  // Auto-slide every 5 seconds (only in gallery mode)
  useEffect(() => {
    if (viewMode !== "gallery" || isPaused || filteredHotels.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === filteredHotels.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [viewMode, isPaused, filteredHotels.length]);

  // Reset index when filtered hotels change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredHotels]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? filteredHotels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === filteredHotels.length - 1 ? 0 : prev + 1));
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const filtered = featuredHotels.filter((hotel) => {
        if (selectedCity !== "All Cities" && hotel.city !== selectedCity) {
          return false;
        }
        return true;
      });
      setFilteredHotels(filtered);
      setIsSearching(false);
    }, 500);
  };

  const activeHotel = filteredHotels[activeIndex];

  // Calculate visible cards for 3D effect (Gallery mode)
  const getVisibleCards = () => {
    const total = filteredHotels.length;
    return [
      { index: (activeIndex - 1 + total) % total, position: 'left' },
      { index: activeIndex, position: 'center' },
      { index: (activeIndex + 1) % total, position: 'right' }
    ];
  };

  const visibleCards = getVisibleCards();

  // Create custom icon for map
  const createRedIcon = (isActive: boolean = false) => {
    return new L.Icon({
      iconUrl: isActive
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: isActive ? [35, 57] : [25, 41],
      iconAnchor: isActive ? [17, 57] : [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <section className="py-6 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Unified Header with View Toggle */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            {/* Top Row: Title & View Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                  {viewMode === "gallery" ? "Premium Selection" : "Discover"}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-foreground">
                  {viewMode === "gallery" ? "Our Collection" : "Our Collection"}
                </h2>
              </div>

              {/* View Mode Toggle - Prominent */}
              <div className="inline-flex items-center gap-0.5 bg-background border border-border rounded-full p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === "gallery"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Grid3x3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Gallery</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === "map"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Map className="w-3 h-3" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Filters (Separated) */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Filter By:
              </span>

              {/* City Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium">{selectedCity}</span>
                  <ArrowRight
                    className={`w-2.5 h-2.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-90" : ""}`}
                  />
                </button>
                {showCityDropdown && (
                  <div className="absolute top-full mt-1 left-0 w-48 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                          handleSearch();
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-secondary/50 transition-colors ${selectedCity === city ? "bg-secondary/30 font-semibold" : ""}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Filter (Static for now) */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="font-medium">All Types</span>
              </button>

              <div className="flex-1" />

              {/* Property Count Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs">
                <Star className="w-3 h-3 text-primary fill-current" />
                <span className="font-semibold text-foreground">{filteredHotels.length} Properties</span>
              </div>
            </div>
          </div>

          {/* Date Search Row (Only for Map View) */}
          {viewMode === "map" && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
              {/* Check-in Date */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm">
                <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  placeholder="Check-in"
                  className="bg-transparent outline-none text-xs font-medium w-24"
                />
              </div>

              {/* Check-out Date */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm">
                <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  placeholder="Check-out"
                  className="bg-transparent outline-none text-xs font-medium w-24"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors uppercase tracking-wider text-xs font-bold disabled:opacity-50 shadow-sm"
              >
                {isSearching ? (
                  <Search className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Search className="w-3 h-3" />
                    Search
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content Area - Switches between Gallery and Map */}
        <AnimatePresence mode="wait">
          {viewMode === "gallery" ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* GALLERY VIEW: 3D Carousel + Details Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
                {/* LEFT: 3D Carousel - 60% width */}
                <div className="relative h-[500px] flex items-center justify-center px-12" style={{ perspective: '1000px' }}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    {visibleCards.map(({ index, position }) => {
                      const hotel = filteredHotels[index];
                      const isCenter = position === 'center';
                      const isLeft = position === 'left';

                      return (
                        <div
                          key={hotel.id}
                          className={`absolute transition-all duration-700 ease-out ${isCenter
                            ? 'z-30 scale-100 opacity-100'
                            : 'z-10 scale-65 opacity-35'
                            }`}
                          style={{
                            transform: isCenter
                              ? 'translateX(0) rotateY(0deg)'
                              : isLeft
                                ? 'translateX(-90%) rotateY(30deg)'
                                : 'translateX(90%) rotateY(-30deg)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          <div className="w-[340px] max-w-[80vw] h-[380px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
                            <div className="relative h-full">
                              <OptimizedImage
                                {...hotel.image}
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {isCenter && (
                                <>
                                  <div className="absolute top-4 left-4">
                                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                      <span className="text-xs font-bold text-gray-900">{hotel.rating}</span>
                                    </div>
                                  </div>

                                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <div className="inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30">
                                      {hotel.type}
                                    </div>
                                    <h3 className="text-lg font-serif font-semibold mb-1">
                                      {hotel.name}
                                    </h3>
                                    <div className="flex items-center text-xs opacity-90 mb-1.5">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {hotel.location}
                                    </div>
                                    <p className="text-[11px] opacity-80 line-clamp-2 leading-relaxed">
                                      {hotel.description}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full border border-border">
                      <span className="text-xs font-semibold text-foreground">
                        {activeIndex + 1} / {filteredHotels.length}
                      </span>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* RIGHT: Content Panel - 40% width */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-xl h-[500px] flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                          Hotel
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-900">{activeHotel.rating}</span>
                          <span className="text-[10px] text-yellow-700">Exceptional</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-serif font-semibold text-foreground mb-1.5 line-clamp-2">
                        {activeHotel.name}
                      </h3>

                      <div className="flex items-center text-muted-foreground mb-2.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-1.5" />
                        <span className="line-clamp-1">{activeHotel.location}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {activeHotel.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                        Featured Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activeHotel.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span className="line-clamp-1">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-y border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                          Accommodation
                        </p>
                        <p className="text-sm font-semibold text-foreground">{activeHotel.capacity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                          Starting From
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {activeHotel.price}
                          <span className="text-xs text-muted-foreground font-normal">/night</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => navigate(`/hotels/${activeHotel.city}`, {
                        state: {
                          hotelId: activeHotel.id,
                          hotelSlug: activeHotel.id,
                          city: activeHotel.city,
                          selectedDates: { checkIn: checkInDate, checkOut: checkOutDate },
                          guests: 2,
                          rooms: 1
                        }
                      })}
                      className="w-full py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 text-sm"
                    >
                      Book Room
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button className="py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        Call Us
                      </button>
                      <button className="py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs">
                        <Mail className="w-3.5 h-3.5" />
                        Enquire
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/hotels/${activeHotel.city}`, {
                        state: {
                          hotelId: activeHotel.id,
                          hotelSlug: activeHotel.id,
                          city: activeHotel.city,
                          selectedDates: { checkIn: checkInDate, checkOut: checkOutDate },
                          guests: 2,
                          rooms: 1
                        }
                      })}
                      className="w-full py-2 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      View Full Details →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* MAP VIEW: Property Card + Interactive Map */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* LEFT: Single Property Card with Navigation - 50% */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-[240px] overflow-hidden group">
                      <OptimizedImage
                        {...activeHotel.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-gray-900">{activeHotel.rating}</span>
                          <span className="text-[10px] text-gray-600">({activeHotel.reviews})</span>
                        </div>

                        <div className="bg-primary/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                          <span className="text-[10px] font-bold text-primary-foreground">
                            {activeIndex + 1} / {filteredHotels.length}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-white/90" />
                          <span className="text-xs opacity-90">{activeHotel.location}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-1">
                          {activeHotel.name}
                        </h3>
                        <p className="text-xs opacity-80 line-clamp-2">
                          {activeHotel.description}
                        </p>
                      </div>

                      <button
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
                        <div className="text-center">
                          <Home className="w-4 h-4 text-primary mx-auto mb-0.5" />
                          <p className="text-[10px] text-muted-foreground">Rooms</p>
                          <p className="text-xs font-bold text-foreground">{activeHotel.rooms}</p>
                        </div>
                        <div className="text-center">
                          <Users className="w-4 h-4 text-primary mx-auto mb-0.5" />
                          <p className="text-[10px] text-muted-foreground">Guests</p>
                          <p className="text-xs font-bold text-foreground">{activeHotel.rooms * 2}</p>
                        </div>
                        <div className="text-center">
                          <Wifi className="w-4 h-4 text-primary mx-auto mb-0.5" />
                          <p className="text-[10px] text-muted-foreground">Amenities</p>
                          <p className="text-xs font-bold text-foreground">{activeHotel.amenities.length}+</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-foreground mb-2">Top Amenities</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeHotel.amenities.slice(0, 6).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-secondary/50 rounded-full text-[10px] font-medium text-foreground"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-0.5">Starting from</p>
                          <p className="text-2xl font-bold text-primary">
                            {activeHotel.price}
                            <span className="text-xs text-muted-foreground font-normal">/night</span>
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/hotels/${activeHotel.city}`, {
                            state: {
                              hotelId: activeHotel.id,
                              hotelSlug: activeHotel.id,
                              city: activeHotel.city,
                              selectedDates: { checkIn: checkInDate, checkOut: checkOutDate },
                              guests: 2,
                              rooms: 1
                            }
                          })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    {filteredHotels.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === activeIndex
                          ? 'w-8 h-2 bg-primary'
                          : 'w-2 h-2 bg-border hover:bg-primary/50'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* RIGHT: Interactive Map - 50% */}
                <div className="lg:sticky lg:top-6">
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-border shadow-2xl bg-card">
                    <MapContainer
                      center={[activeHotel.coordinates.lat, activeHotel.coordinates.lng]}
                      zoom={12}
                      scrollWheelZoom={true}
                      className="w-full h-full"
                      style={{ zIndex: 1 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <MapViewController
                        center={[activeHotel.coordinates.lat, activeHotel.coordinates.lng]}
                        zoom={12}
                      />

                      {filteredHotels.map((hotel, idx) => {
                        const isActive = idx === activeIndex;
                        const markerIcon = createRedIcon(isActive);

                        return (
                          <Marker
                            key={hotel.id}
                            position={[hotel.coordinates.lat, hotel.coordinates.lng]}
                            icon={markerIcon}
                            eventHandlers={{
                              click: () => setActiveIndex(idx),
                              mouseover: (e: L.LeafletMouseEvent) => e.target.openPopup(),
                              mouseout: (e: L.LeafletMouseEvent) => e.target.closePopup(),
                            }}
                          >
                            <Popup closeButton={false} className="custom-popup" autoClose={false} closeOnClick={false}>
                              <div className="space-y-2 min-w-[200px]">
                                <div className="flex items-center justify-between">
                                  <p className="font-serif text-sm font-bold text-foreground line-clamp-1">
                                    {hotel.name}
                                  </p>
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-xs font-bold">{hotel.rating}</span>
                                  </div>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3 mr-1 text-red-500 flex-shrink-0" />
                                  <span className="line-clamp-1">{hotel.location}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">Starting from</span>
                                  <span className="text-base font-bold text-primary">{hotel.price}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveIndex(idx);
                                    navigate(`/hotels/${hotel.city}`, {
                                      state: {
                                        hotelId: hotel.id,
                                        hotelSlug: hotel.id,
                                        city: hotel.city,
                                        selectedDates: { checkIn: checkInDate, checkOut: checkOutDate },
                                        guests: 2,
                                        rooms: 1
                                      }
                                    });
                                  }}
                                  className="w-full text-xs bg-primary text-primary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                                >
                                  View Details <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>

                  <div className="mt-3 bg-card border border-border rounded-lg p-2 shadow-sm">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                        <span className="text-muted-foreground">Current Property</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm" />
                        <span className="text-muted-foreground">Other Properties</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}