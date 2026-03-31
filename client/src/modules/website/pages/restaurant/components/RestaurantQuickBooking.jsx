import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  UtensilsCrossed,
  Search,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BOOKING_TYPES = [
  { value: "dining", label: "Dining" },
  { value: "takeaway", label: "Takeaway" },
];

const LOCATIONS = [
  { value: "ghaziabad", label: "Ghaziabad" },
  { value: "noida", label: "Noida" },
  { value: "delhi", label: "Delhi" },
];

const RESTAURANTS = [
  { id: 1, name: "Kennedia Blu Signature Dining", type: "dining", location: "ghaziabad", cuisine: "Asian Fusion", timing: "12:00 PM - 11:00 PM" },
  { id: 2, name: "Spicy Darbar", type: "dining", location: "ghaziabad", cuisine: "North Indian", timing: "01:00 PM - 11:30 PM" },
  { id: 3, name: "Luxury Family Lounge", type: "dining", location: "noida", cuisine: "Multi Cuisine", timing: "11:30 AM - 10:30 PM" },
  { id: 4, name: "Takeaway Treats Express", type: "takeaway", location: "ghaziabad", cuisine: "Quick Bites", timing: "11:00 AM - 10:00 PM" },
  { id: 5, name: "Italian Box Kitchen", type: "takeaway", location: "delhi", cuisine: "Italian", timing: "12:00 PM - 09:30 PM" },
  { id: 6, name: "City Wok Pickup", type: "takeaway", location: "noida", cuisine: "Chinese", timing: "12:30 PM - 10:00 PM" },
];

function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex h-14 w-full items-center justify-between rounded-md border border-border/60 bg-background/50 px-4 text-left text-sm font-normal transition-colors hover:border-primary/50 focus:outline-none"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {option.label}
                  {value === option.value && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RestaurantQuickBooking() {
  const [bookingType, setBookingType] = useState("");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const matchingRestaurants = useMemo(() => {
    if (!bookingType || !location) return [];
    return RESTAURANTS.filter(
      (restaurant) => restaurant.type === bookingType && restaurant.location === location,
    );
  }, [bookingType, location]);

  const selectedTypeLabel = BOOKING_TYPES.find((option) => option.value === bookingType)?.label ?? "";
  const selectedLocLabel = LOCATIONS.find((option) => option.value === location)?.label ?? "";
  const canSearch = Boolean(bookingType && location);

  useEffect(() => {
    if (bookingType && location && matchingRestaurants.length === 1) {
      setIsOpen(true);
    }
  }, [bookingType, location, matchingRestaurants.length]);

  const clearFilters = () => {
    setBookingType("");
    setLocation("");
    setIsOpen(false);
  };

  return (
    <div className="relative z-30 mb-12 -mt-10 container mx-auto px-4">
      <motion.div
        layout
        className="overflow-visible rounded-xl border border-border/50 bg-card shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-border/10 bg-primary/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium text-foreground">Find Your Table</h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Quick Restaurant Booking
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Booking Type
              </Label>
              <CustomSelect
                options={BOOKING_TYPES}
                value={bookingType}
                onChange={(value) => {
                  setBookingType(value);
                  setIsOpen(false);
                }}
                placeholder="Choose booking type"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </Label>
              <CustomSelect
                options={LOCATIONS}
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  setIsOpen(false);
                }}
                placeholder="Choose location"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setIsOpen(true)}
                disabled={!canSearch}
                className="h-14 w-full gap-2 bg-primary text-base font-bold uppercase tracking-wide text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-70"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          {(bookingType || location) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-wrap items-center gap-2"
            >
              {bookingType && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <UtensilsCrossed className="h-3 w-3" />
                  {selectedTypeLabel}
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("");
                      setIsOpen(false);
                    }}
                    className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <MapPin className="h-3 w-3" />
                  {selectedLocLabel}
                  <button
                    type="button"
                    onClick={() => {
                      setLocation("");
                      setIsOpen(false);
                    }}
                    className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(bookingType || location) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-auto rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear Filters
                </Button>
              )}
              {isOpen && (
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-auto rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Hide Results
                </Button>
              )}
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
                className="border-t border-border/10 pt-6"
              >
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Available Restaurants
                    </p>
                    <h3 className="mt-1.5 text-xl font-serif text-foreground">
                      {selectedTypeLabel} in {selectedLocLabel}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {matchingRestaurants.length} option{matchingRestaurants.length === 1 ? "" : "s"} available
                  </p>
                </div>

                {matchingRestaurants.length > 0 ? (
                  <div className="space-y-3">
                    {matchingRestaurants.map((restaurant, index) => (
                      <motion.div
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                        className="overflow-hidden rounded-lg border border-border/50 bg-background transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h4 className="font-serif text-lg font-medium text-foreground">
                                {restaurant.name}
                              </h4>
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                                {selectedTypeLabel}
                              </span>
                            </div>
                            <p className="mb-2 text-xs text-muted-foreground">{restaurant.cuisine}</p>
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <MapPin className="h-3 w-3 text-primary" />
                                {selectedLocLabel}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <UtensilsCrossed className="h-3 w-3 text-primary" />
                                {restaurant.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{restaurant.timing}</p>
                          </div>

                          <div className="flex items-center gap-4 border-border/10 md:border-l md:pl-4">
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">Reservation Type</p>
                              <p className="text-lg font-bold text-primary">{selectedTypeLabel}</p>
                              <p className="text-[9px] text-muted-foreground">{restaurant.timing}</p>
                            </div>
                            <Button
                              size="sm"
                              className="w-full px-6 md:w-auto"
                              onClick={() =>
                                document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })
                              }
                            >
                              Reserve
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="font-medium">No options available for this combination.</p>
                    <p className="mt-1 text-xs">
                      Try adjusting your filters or selecting a different location.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
