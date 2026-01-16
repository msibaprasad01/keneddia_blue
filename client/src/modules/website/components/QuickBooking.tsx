import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Data
import { CITIES, HOTELS_DATA, Hotel } from "@/data/hotelsData";

const ITEMS_PER_PAGE = 3;

export default function QuickBooking() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Search State
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  // Results State
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // Search Handler
  const handleSearch = () => {
    if (!isExpanded) setIsExpanded(true);
    setHasSearched(true);
    setCurrentPage(1);

    // Filter logic
    if (location) {
      const filtered = HOTELS_DATA.filter(h => h.city === location);
      setSearchResults(filtered);
    } else {
      setSearchResults(HOTELS_DATA); // Show all if no location selected? Or maybe nothing. Let's show all for demo.
    }
  };

  const handleBook = (hotel: Hotel) => {
    const params = new URLSearchParams();
    params.append("hotel", hotel.name);
    params.append("location", hotel.city);
    params.append("price", hotel.price.toString());
    if (checkIn) params.append("checkIn", checkIn.toISOString());
    if (checkOut) params.append("checkOut", checkOut.toISOString());
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
        {/* Header / Collapsed State */}
        <div
          className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-muted/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-medium">Quick Booking</h3>
              {!isExpanded && (
                <p className="text-sm text-muted-foreground">
                  {location ? `Searching in ${location}` : "Find your perfect stay"}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border/10"
            >
              <div className="p-6">
                {/* Search Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* Location Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Location (City)
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !location && "text-muted-foreground"
                          )}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {location || "Select City"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <div className="grid">
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Check-in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "MMM dd") : "Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Check-out */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Check-out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
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
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Check Availability
                    </Button>
                  </div>
                </div>

                {/* Search Results Area */}
                {hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-border/10 pt-6"
                  >
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Available Properties in {location || "All Locations"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {paginatedHotels.map((hotel) => (
                            <div key={hotel.id} className="bg-background border border-border/50 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                              <div className="aspect-video relative">
                                <OptimizedImage
                                  {...hotel.image}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  ⭐ {hotel.rating}
                                </div>
                              </div>
                              <div className="p-4 flex flex-col flex-1">
                                <h5 className="font-serif text-lg font-medium leading-tight mb-1">{hotel.name}</h5>
                                <p className="text-xs text-muted-foreground mb-3">{hotel.city}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                  {hotel.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/10">
                                  <div>
                                    <span className="text-sm font-bold text-primary">₹{hotel.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-muted-foreground">/night</span>
                                  </div>
                                  <Button size="sm" onClick={() => handleBook(hotel)}>
                                    Book
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
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No hotels found in {location}. Please try another city.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
