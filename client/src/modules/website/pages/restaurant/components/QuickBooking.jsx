import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Sparkles, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    id: 1,
    name: "Kennedia Blu Signature Dining",
    type: "dining",
    location: "ghaziabad",
    cuisine: "Asian Fusion",
    timing: "12:00 PM - 11:00 PM",
  },
  {
    id: 2,
    name: "Spicy Darbar",
    type: "dining",
    location: "ghaziabad",
    cuisine: "North Indian",
    timing: "01:00 PM - 11:30 PM",
  },
  {
    id: 3,
    name: "Luxury Family Lounge",
    type: "dining",
    location: "noida",
    cuisine: "Multi Cuisine",
    timing: "11:30 AM - 10:30 PM",
  },
  {
    id: 4,
    name: "Takeaway Treats Express",
    type: "takeaway",
    location: "ghaziabad",
    cuisine: "Quick Bites",
    timing: "11:00 AM - 10:00 PM",
  },
  {
    id: 5,
    name: "Italian Box Kitchen",
    type: "takeaway",
    location: "delhi",
    cuisine: "Italian",
    timing: "12:00 PM - 09:30 PM",
  },
  {
    id: 6,
    name: "City Wok Pickup",
    type: "takeaway",
    location: "noida",
    cuisine: "Chinese",
    timing: "12:30 PM - 10:00 PM",
  },
];

export default function QuickBooking() {
  const [bookingType, setBookingType] = useState(BOOKING_TYPES[0].value);
  const [location, setLocation] = useState(LOCATIONS[0].value);

  const matchingRestaurants = useMemo(() => {
    return RESTAURANTS.filter(
      (item) => item.type === bookingType && item.location === location,
    );
  }, [bookingType, location]);

  const selectedTypeLabel =
    BOOKING_TYPES.find((item) => item.value === bookingType)?.label || "Dining";
  const selectedLocationLabel =
    LOCATIONS.find((item) => item.value === location)?.label || "Ghaziabad";

  return (
    <section className="relative overflow-hidden bg-white py-16 transition-colors duration-500 dark:bg-[#050505]">
      <div className="absolute left-0 top-12 text-[9rem] font-black uppercase italic text-zinc-900/[0.03] dark:text-white/[0.02] md:text-[12rem]">
        Quick Booking
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-serif leading-tight text-zinc-900 dark:text-white md:text-4xl">
            Book Faster.
            <span className="italic text-zinc-400 dark:text-white/30"> Dine Smarter.</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white/80 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 md:p-8">
          <div className="grid gap-6 border-b border-zinc-200 pb-8 dark:border-white/10 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                Select Type
              </Label>
              <Select value={bookingType} onValueChange={setBookingType}>
                <SelectTrigger className="h-14 rounded-2xl border-zinc-200 bg-zinc-50 text-zinc-900 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <SelectValue placeholder="Choose booking type" />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                Select Location
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-14 rounded-2xl border-zinc-200 bg-zinc-50 text-zinc-900 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <SelectValue placeholder="Choose location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 dark:text-white/40">
                  Available Restaurants
                </p>
                <h3 className="mt-2 text-2xl font-serif text-zinc-900 dark:text-white">
                  {selectedTypeLabel} in {selectedLocationLabel}
                </h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-white/50">
                {matchingRestaurants.length} option{matchingRestaurants.length === 1 ? "" : "s"} available
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matchingRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col justify-between rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                        {selectedTypeLabel}
                      </span>
                      <UtensilsCrossed className="h-4 w-4 text-zinc-400 dark:text-white/40" />
                    </div>
                    <h4 className="text-xl font-serif text-zinc-900 dark:text-white">
                      {restaurant.name}
                    </h4>
                    <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-white/60">
                      <p>{restaurant.cuisine}</p>
                      <p>{restaurant.timing}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{selectedLocationLabel}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      document.getElementById("reservation")?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    className="mt-6 h-12 rounded-full bg-zinc-900 text-white transition-all hover:bg-primary dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
                  >
                    Reserve
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
