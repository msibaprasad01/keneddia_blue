import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Map,
  MapPin,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { siteContent } from "@/data/siteContent";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RESTAURANTS = [
  {
    id: 31,
    name: "Kennedia Blu Restaurant-Ghaziabad",
    heading: "Kennedia Blu Restaurant- Ghaziabad",
    city: "Ghaziabad",
    location: "Noor Nagar, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201003",
    type: "Restaurant",
    image: siteContent.images.cafes.highTea,
    rating: 4.5,
    description: "Premium dining experience with elegant interiors and signature multi-cuisine service.",
    cuisines: ["Fine Dining", "Family Dining", "Signature Service"],
    nearbyLocation: "Near Guldhar Metro Station (2KM)",
    email: "blukennedia@gmail.com",
    assignedAdmin: "Vishal bhardwaj",
    serviceHours: "Open Daily",
    coordinates: { lat: 28.6692, lng: 77.4538 },
  },
  {
    id: 32,
    name: "Kennedia Blu Rooftop Noida",
    heading: "Kennedia Blu Rooftop Dining - Noida",
    city: "Noida",
    location: "Sector 62, Noida, Uttar Pradesh",
    type: "Restaurant",
    image: siteContent.images.bars.rooftop,
    rating: 4.7,
    description: "Skyline dining setup with elevated evening service and a modern social atmosphere.",
    cuisines: ["Rooftop Dining", "Asian Grill", "Cocktail Lounge"],
    nearbyLocation: "Near Electronic City Metro",
    email: "noida@kennediablu.com",
    assignedAdmin: "Operations Team",
    serviceHours: "Open Daily",
    coordinates: { lat: 28.627, lng: 77.3649 },
  },
  {
    id: 33,
    name: "Kennedia Blu Brasserie Delhi",
    heading: "Kennedia Blu Brasserie - Delhi",
    city: "Delhi",
    location: "Connaught Place, New Delhi",
    type: "Restaurant",
    image: siteContent.images.cafes.parisian,
    rating: 4.6,
    description: "All-day dining format with polished cafe-brasserie service and curated plated offerings.",
    cuisines: ["Cafe Brasserie", "Bakery", "Continental"],
    nearbyLocation: "Near Rajiv Chowk Metro",
    email: "delhi@kennediablu.com",
    assignedAdmin: "City Team",
    serviceHours: "Open Daily",
    coordinates: { lat: 28.6315, lng: 77.2167 },
  },
  {
    id: 34,
    name: "Kennedia Blu Social Lounge Mumbai",
    heading: "Kennedia Blu Social Lounge - Mumbai",
    city: "Mumbai",
    location: "Bandra West, Mumbai, Maharashtra",
    type: "Restaurant",
    image: siteContent.images.bars.speakeasy,
    rating: 4.8,
    description: "An intimate dining and social lounge concept built around premium hosting and chef-driven menus.",
    cuisines: ["Chef's Table", "Fusion", "Social Lounge"],
    nearbyLocation: "Near Bandra Station",
    email: "mumbai@kennediablu.com",
    assignedAdmin: "Hospitality Desk",
    serviceHours: "Open Daily",
    coordinates: { lat: 19.0596, lng: 72.8295 },
  },
];

const popupStyles = `
  .leaflet-popup-content-wrapper { border-radius: 12px; padding: 4px; box-shadow: 0 10px 25px rgba(0,0,0,.15); }
  .leaflet-popup-content { margin: 8px; min-width: 220px; }
  .leaflet-popup-tip, .custom-popup .leaflet-popup-close-button { display: none; }
`;

if (typeof document !== "undefined" && !document.querySelector("style[data-restaurant-leaflet-custom]")) {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = popupStyles;
  styleEl.setAttribute("data-restaurant-leaflet-custom", "true");
  document.head.appendChild(styleEl);
}

function MapViewController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);

  return null;
}

const createMarkerIcon = (active = false) =>
  new L.Icon({
    iconUrl: active
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: active ? [35, 57] : [25, 41],
    iconAnchor: active ? [17, 57] : [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export default function RestaurantProperties() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState("gallery");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cities = useMemo(
    () => ["All Cities", ...new Set(RESTAURANTS.map((item) => item.city))],
    [],
  );

  const filteredRestaurants = useMemo(() => {
    if (selectedCity === "All Cities") return RESTAURANTS;
    return RESTAURANTS.filter((item) => item.city === selectedCity);
  }, [selectedCity]);

  useEffect(() => setActiveIndex(0), [selectedCity]);

  useEffect(() => {
    if (viewMode !== "gallery" || isPaused || filteredRestaurants.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev === filteredRestaurants.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => window.clearInterval(interval);
  }, [filteredRestaurants.length, isPaused, viewMode]);

  const activeRestaurant = filteredRestaurants[activeIndex] || filteredRestaurants[0];
  if (!activeRestaurant) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No restaurants available.
          </div>
        </div>
      </section>
    );
  }

  const scrollToReservation = () => {
    document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? filteredRestaurants.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === filteredRestaurants.length - 1 ? 0 : prev + 1));
  };

  const visibleCards = filteredRestaurants.length <= 1
    ? [{ index: 0, position: "center" }]
    : [
        { index: (activeIndex - 1 + filteredRestaurants.length) % filteredRestaurants.length, position: "left" },
        { index: activeIndex, position: "center" },
        { index: (activeIndex + 1) % filteredRestaurants.length, position: "right" },
      ];

  return (
    <section className="py-6 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                  {viewMode === "gallery" ? "Restaurant Collection" : "Explore By Map"}
                </span>
                <h2 className="text-xl md:text-2xl font-serif text-foreground">Our Restaurants</h2>
              </div>

              <div className="inline-flex items-center gap-0.5 bg-background border border-border rounded-full p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    viewMode === "gallery" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3x3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Gallery</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    viewMode === "map" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Map className="w-3 h-3" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Filter By:</span>

              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium">{selectedCity}</span>
                  <ArrowRight className={`w-2.5 h-2.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-90" : ""}`} />
                </button>

                {showCityDropdown && (
                  <div className="absolute top-full mt-1 left-0 w-48 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-secondary/50 transition-colors ${selectedCity === city ? "bg-secondary/30 font-semibold" : ""}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full text-xs shadow-sm">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="font-medium">Restaurant</span>
              </button>

              <div className="flex-1" />

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs">
                <Star className="w-3 h-3 text-primary fill-current" />
                <span className="font-semibold text-foreground">{filteredRestaurants.length} Restaurants</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "gallery" ? (
            <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
                <div className="relative h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-border shadow-xl" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                  <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
                    {visibleCards.map(({ index, position }) => {
                      const restaurant = filteredRestaurants[index];
                      const isCenter = position === "center";
                      const isLeft = position === "left";

                      return (
                        <div
                          key={restaurant.id}
                          className="absolute transition-all duration-700 ease-out"
                          style={{
                            zIndex: isCenter ? 30 : 20,
                            opacity: isCenter ? 1 : 0.55,
                            transform: isCenter ? "translateX(0) rotateY(0deg)" : isLeft ? "translateX(-90%) rotateY(30deg)" : "translateX(90%) rotateY(-30deg)",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <div className="w-[340px] max-w-[80vw] h-[380px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
                            <div className="relative h-full">
                              <OptimizedImage {...restaurant.image} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              {isCenter && (
                                <>
                                  <div className="absolute top-4 left-4">
                                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                      <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
                                    </div>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <div className="inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30">{restaurant.type}</div>
                                    <h3 className="text-lg font-serif font-semibold mb-1">{restaurant.name}</h3>
                                    <div className="flex items-center text-xs opacity-90 mb-1.5">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {restaurant.location}
                                    </div>
                                    <p className="text-[11px] opacity-80 line-clamp-2 leading-relaxed">{restaurant.description}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
                    <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full border border-border">
                      <span className="text-xs font-semibold text-foreground">{activeIndex + 1} / {filteredRestaurants.length}</span>
                    </div>
                    <button onClick={handleNext} className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-xl h-[500px] flex flex-col justify-between">
                  <div className="space-y-3.5 overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">{activeRestaurant.type}</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-900">{activeRestaurant.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-1.5 line-clamp-2">{activeRestaurant.name}</h3>
                      <div className="flex items-center text-muted-foreground mb-2.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-1.5" />
                        <span className="line-clamp-1">{activeRestaurant.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{activeRestaurant.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pb-1">
                      <div className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center">
                        <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">City</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.city}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center">
                        <Building2 className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">Type</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.type}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center">
                        <CalendarClock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">Rating</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.rating}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Available Highlights</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activeRestaurant.cuisines.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <div className="py-3 border-y border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Response Details</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Heading</span>
                          <span className="font-semibold text-foreground text-right">{activeRestaurant.heading}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Nearby</span>
                          <span className="font-semibold text-foreground text-right">{activeRestaurant.nearbyLocation}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Email</span>
                          <span className="font-semibold text-foreground text-right">{activeRestaurant.email}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Assigned Admin</span>
                          <span className="font-semibold text-foreground text-right">{activeRestaurant.assignedAdmin}</span>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="space-y-2.5 mt-4">
                    <button onClick={scrollToReservation} className="w-full py-3 bg-primary text-primary-foreground font-bold uppercase rounded-lg shadow-md flex items-center justify-center gap-2 text-sm">
                      Reserve Table <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={handleNext} className="w-full py-2 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative h-[240px] overflow-hidden group">
                    <OptimizedImage {...activeRestaurant.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-gray-900">{activeRestaurant.rating}</span>
                      </div>
                      <div className="bg-primary/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                        <span className="text-[10px] font-bold text-primary-foreground">{activeIndex + 1} / {filteredRestaurants.length}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-white/90" />
                        <span className="text-xs opacity-90">{activeRestaurant.location}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold mb-1">{activeRestaurant.name}</h3>
                      <p className="text-xs opacity-80 line-clamp-2">{activeRestaurant.description}</p>
                    </div>
                    <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
                      <div className="text-center">
                        <MapPin className="w-4 h-4 text-primary mx-auto mb-0.5" />
                        <p className="text-[10px] text-muted-foreground">City</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.city}</p>
                      </div>
                      <div className="text-center">
                        <Building2 className="w-4 h-4 text-primary mx-auto mb-0.5" />
                        <p className="text-[10px] text-muted-foreground">Type</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.type}</p>
                      </div>
                      <div className="text-center">
                        <Star className="w-4 h-4 text-primary mx-auto mb-0.5 fill-current" />
                        <p className="text-[10px] text-muted-foreground">Rating</p>
                        <p className="text-xs font-bold text-foreground">{activeRestaurant.rating}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-foreground mb-2">Top Highlights</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeRestaurant.cuisines.map((item) => (
                          <span key={item} className="px-2 py-0.5 bg-secondary/50 rounded-full text-[10px] font-medium text-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3 pb-3 border-b border-border bg-muted/20 rounded-lg p-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-foreground">Nearby Landmark</p>
                          <p className="text-[8px] text-muted-foreground">From response format</p>
                        </div>
                        <p className="text-sm font-bold text-primary">{activeRestaurant.nearbyLocation}</p>
                      </div>
                    </div>

                    <button onClick={scrollToReservation} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-md text-sm">
                      Reserve Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:sticky lg:top-6">
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-border shadow-2xl bg-card">
                    <MapContainer center={[activeRestaurant.coordinates.lat, activeRestaurant.coordinates.lng]} zoom={11} scrollWheelZoom className="w-full h-full" style={{ zIndex: 1 }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapViewController center={[activeRestaurant.coordinates.lat, activeRestaurant.coordinates.lng]} zoom={11} />
                      {filteredRestaurants.map((restaurant, index) => (
                        <Marker
                          key={restaurant.id}
                          position={[restaurant.coordinates.lat, restaurant.coordinates.lng]}
                          icon={createMarkerIcon(index === activeIndex)}
                          eventHandlers={{ click: () => setActiveIndex(index) }}
                        >
                          <Popup closeButton={false} className="custom-popup">
                            <div className="space-y-2 min-w-[200px]">
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-serif text-sm font-bold">{restaurant.name}</p>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span className="text-xs font-bold">{restaurant.rating}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1 text-red-500" />
                                <span className="line-clamp-1">{restaurant.location}</span>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t">
                                <span className="text-[9px] font-bold">Open</span>
                                <span className="text-xs font-semibold text-primary">{restaurant.serviceHours}</span>
                              </div>
                              <button onClick={scrollToReservation} className="w-full text-xs bg-primary text-primary-foreground font-bold py-2 rounded">
                                Reserve Table
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
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
