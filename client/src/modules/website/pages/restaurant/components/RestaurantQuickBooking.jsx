import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, UtensilsCrossed, Search, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const BOOKING_TYPES = [
  { value: "dining",   label: "Dining"   },
  { value: "takeaway", label: "Takeaway" },
];

const LOCATIONS = [
  { value: "ghaziabad", label: "Ghaziabad" },
  { value: "noida",     label: "Noida"     },
  { value: "delhi",     label: "Delhi"     },
];

const RESTAURANTS = [
  { id: 1, name: "Kennedia Blu Signature Dining", type: "dining",   location: "ghaziabad", cuisine: "Asian Fusion",  timing: "12:00 PM – 11:00 PM" },
  { id: 2, name: "Spicy Darbar",                  type: "dining",   location: "ghaziabad", cuisine: "North Indian",  timing: "01:00 PM – 11:30 PM" },
  { id: 3, name: "Luxury Family Lounge",           type: "dining",   location: "noida",     cuisine: "Multi Cuisine", timing: "11:30 AM – 10:30 PM" },
  { id: 4, name: "Takeaway Treats Express",        type: "takeaway", location: "ghaziabad", cuisine: "Quick Bites",   timing: "11:00 AM – 10:00 PM" },
  { id: 5, name: "Italian Box Kitchen",            type: "takeaway", location: "delhi",     cuisine: "Italian",       timing: "12:00 PM – 09:30 PM" },
  { id: 6, name: "City Wok Pickup",                type: "takeaway", location: "noida",     cuisine: "Chinese",       timing: "12:30 PM – 10:00 PM" },
];

/* ─── Custom inline dropdown (no portal, no body scroll-lock) ───────────────── */

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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 transition-colors hover:border-zinc-300 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
      >
        <span className={selected ? "" : "text-zinc-400 dark:text-white/30"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform duration-200 dark:text-white/30 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel — rendered inline in DOM, no portal, no body padding */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-zinc-900"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-white/80 dark:hover:bg-white/5"
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function RestaurantQuickBooking() {
  const [bookingType, setBookingType] = useState("");
  const [location,    setLocation]    = useState("");
  const [isOpen,      setIsOpen]      = useState(false);

  const handleTypeChange = (val) => { setBookingType(val); setIsOpen(false); };
  const handleLocChange  = (val) => { setLocation(val);    setIsOpen(false); };

  const matchingRestaurants = useMemo(() => {
    if (!bookingType || !location) return [];
    return RESTAURANTS.filter(
      (r) => r.type === bookingType && r.location === location
    );
  }, [bookingType, location]);

  const selectedTypeLabel = BOOKING_TYPES.find((o) => o.value === bookingType)?.label ?? "";
  const selectedLocLabel  = LOCATIONS.find((o) => o.value === location)?.label ?? "";
  const canSearch         = Boolean(bookingType && location);

  return (
    <section className="relative overflow-hidden bg-white py-12 transition-colors duration-500 dark:bg-[#050505]">
      {/* Watermark */}
      <div className="absolute left-0 top-8 select-none text-[6rem] font-black uppercase italic text-zinc-900/[0.03] dark:text-white/[0.02] md:text-[8rem]">
        Quick Booking
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Heading */}
        <div className="mb-7 max-w-3xl">
          <h2 className="text-2xl font-serif leading-tight text-zinc-900 dark:text-white md:text-3xl">
            Book Faster.
            <span className="italic text-zinc-400 dark:text-white/30"> Dine Smarter.</span>
          </h2>
        </div>

        <div className="rounded-[1.5rem] border border-zinc-200 bg-white/80 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 md:p-6">

          {/* ── Filters ── */}
          <div className="border-b border-zinc-200 pb-6 dark:border-white/10">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                  Select Type
                </Label>
                <CustomSelect
                  options={BOOKING_TYPES}
                  value={bookingType}
                  onChange={handleTypeChange}
                  placeholder="Choose booking type"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                  Select Location
                </Label>
                <CustomSelect
                  options={LOCATIONS}
                  value={location}
                  onChange={handleLocChange}
                  placeholder="Choose location"
                />
              </div>
            </div>

            {/* Search / Hide */}
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={() => setIsOpen(true)}
                disabled={!canSearch}
                className="h-10 rounded-full bg-zinc-900 px-6 text-sm text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                      className="h-10 rounded-full border-zinc-200 px-6 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
                    >
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Collapsible results ── */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="mt-6">
                  <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 dark:text-white/40">
                        Available Restaurants
                      </p>
                      <h3 className="mt-1.5 text-xl font-serif text-zinc-900 dark:text-white">
                        {selectedTypeLabel} in {selectedLocLabel}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-white/50">
                      {matchingRestaurants.length} option{matchingRestaurants.length === 1 ? "" : "s"} available
                    </p>
                  </div>

                  {matchingRestaurants.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {matchingRestaurants.map((restaurant, index) => (
                        <motion.div
                          key={restaurant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className="flex min-h-[248px] flex-col justify-between rounded-[1.2rem] border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                          <div>
                            <div className="mb-3 flex items-center justify-between">
                              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                                {selectedTypeLabel}
                              </span>
                              <UtensilsCrossed className="h-4 w-4 text-zinc-400 dark:text-white/40" />
                            </div>
                            <h4 className="text-lg font-serif text-zinc-900 dark:text-white">
                              {restaurant.name}
                            </h4>
                            <div className="mt-2.5 space-y-1.5 text-sm text-zinc-600 dark:text-white/60">
                              <p>{restaurant.cuisine}</p>
                              <p>{restaurant.timing}</p>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{selectedLocLabel}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() =>
                              document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="mt-5 h-10 rounded-full bg-zinc-900 text-sm text-white transition-all hover:bg-primary dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
                          >
                            Reserve
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[160px] items-center justify-center rounded-[1.2rem] border border-dashed border-zinc-200 dark:border-white/10">
                      <p className="text-sm text-zinc-400 dark:text-white/30">
                        No options available for this combination.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}