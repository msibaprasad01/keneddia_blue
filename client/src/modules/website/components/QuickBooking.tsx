import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, MapPin, Search, Users, Minus, Plus, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup as MapPopup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Data
import { CITIES, HOTELS_DATA, Hotel } from "@/data/hotelsData";

const ITEMS_PER_PAGE = 3;

// Leaflet Icon Fix
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function QuickBooking() {
  const navigate = useNavigate();
  // Always expanded now as per requirement for better visibility
  const [isExpanded, setIsExpanded] = useState(true);

  // Search State
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  // Dialog State
  const [showMap, setShowMap] = useState<Hotel | null>(null);

  // Results State
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // Search Handler
  const handleSearch = () => {
    setHasSearched(true);
    setCurrentPage(1);

    // Filter logic
    let filtered = HOTELS_DATA;
    if (location) {
      filtered = HOTELS_DATA.filter(h => h.city === location);
    }

    // Auto Redirect if only 1 hotel found
    if (filtered.length === 1) {
      handleBook(filtered[0]);
    } else {
      setSearchResults(filtered);
    }
  };

  const handleBook = (hotel: Hotel) => {
    const params = new URLSearchParams();
    params.append("hotel", hotel.name);
    params.append("location", hotel.city);
    params.append("price", hotel.price.toString());
    if (checkIn) params.append("checkIn", checkIn.toISOString());
    if (checkOut) params.append("checkOut", checkOut.toISOString());
    params.append("adults", guests.adults.toString());
    params.append("children", guests.children.toString());
    params.append("rooms", guests.rooms.toString());

    navigate(`/checkout?${params.toString()}`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const paginatedHotels = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 -mt-10 relative z-30 mb-12">
      <motion.div
        layout
        className="bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
      >
        {/* Header - Simplified */}
        <div className="p-4 bg-primary/5 border-b border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-serif font-medium">Find Your Stay</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 h-11",
                      !location && "text-muted-foreground"
                    )}
                  >
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    {location || "Select City"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="grid">
                    <div
                      className="p-2 hover:bg-muted cursor-pointer text-sm font-medium border-b"
                      onClick={() => {
                        setLocation("");
                        document.body.click();
                      }}
                    >
                      All Locations
                    </div>
                    {CITIES.map((city) => (
                      <div
                        key={city}
                        className="p-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => {
                          setLocation(city);
                          document.body.click();
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-in */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Check-in
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 h-11",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {checkIn ? format(checkIn, "MMM dd") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 h-11",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {checkOut ? format(checkOut, "MMM dd") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) =>
                      checkIn ? date <= checkIn : date < new Date()
                    }
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Guests & Rooms
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-background/50 h-11"
                  >
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    {guests.adults + guests.children} Guests, {guests.rooms} Room
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="font-medium">Adults</p>
                        <p className="text-xs text-muted-foreground">Ages 13+</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} disabled={guests.adults <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{guests.adults}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="font-medium">Children</p>
                        <p className="text-xs text-muted-foreground">Ages 2-12</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} disabled={guests.children <= 0}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{guests.children}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <div className="text-sm">
                        <p className="font-medium">Rooms</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))} disabled={guests.rooms <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{guests.rooms}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(prev => ({ ...prev, rooms: prev.rooms + 1 }))}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold uppercase tracking-wide text-sm"
              >
                <Search className="w-4 h-4" />
                Check Availability
              </Button>
            </div>
          </div>

          {/* Search Results Area - New Layout (No Images) */}
          {hasSearched && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-border/10 pt-6"
            >
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Available Properties in {location || "All Locations"}
              </h4>

              <div className="space-y-3">
                {paginatedHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-background border border-border/50 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow gap-4">

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-serif text-lg font-medium">{hotel.name}</h5>
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{hotel.rating} ★</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {hotel.location}, {hotel.city}
                      </p>

                      {/* Amenities Grid Small */}
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                          <span key={idx} className="text-[10px] bg-secondary/30 px-2 py-0.5 rounded text-muted-foreground">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 md:border-l md:pl-4 border-border/10">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Starting from</p>
                        <p className="text-lg font-bold text-primary">₹{hotel.price.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => handleBook(hotel)} className="w-full md:w-auto px-6">
                          Book Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] text-muted-foreground hover:text-primary gap-1"
                          onClick={() => setShowMap(hotel)}
                        >
                          <Map className="w-3 h-3" /> Show on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm flex items-center px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {hasSearched && searchResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-t border-border/10 pt-6 mt-6">
              No hotels found matching your criteria.
            </div>
          )}
        </div>
      </motion.div>

      {/* Map Popup */}
      <Dialog open={!!showMap} onOpenChange={(open) => !open && setShowMap(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden h-[500px]">
          {showMap && (
            <div className="w-full h-full relative">
              <MapContainer
                center={[showMap.coordinates.lat, showMap.coordinates.lng]}
                zoom={14}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[showMap.coordinates.lat, showMap.coordinates.lng]}
                  icon={markerIcon}
                >
                  <MapPopup>
                    <div className="text-center">
                      <h3 className="font-bold">{showMap.name}</h3>
                      <p className="text-xs">{showMap.location}</p>
                    </div>
                  </MapPopup>
                </Marker>
              </MapContainer>
              <div className="absolute top-4 right-4 z-[400] bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <h3 className="font-bold text-lg mb-1">{showMap.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{showMap.location}</p>
                <Button onClick={() => { setShowMap(null); handleBook(showMap); }} className="w-full">
                  Book This Property
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
