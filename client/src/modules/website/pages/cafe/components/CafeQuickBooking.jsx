import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Coffee, Search, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const VISIT_TYPES = [
  { value: "coffee", label: "Coffee Date" },
  { value: "work", label: "Work Session" },
  { value: "high-tea", label: "High Tea" },
];

const LOCATIONS = [
  { value: "ghaziabad", label: "Ghaziabad" },
  { value: "delhi", label: "Delhi" },
  { value: "noida", label: "Noida" },
];

const CAFES = [
  { id: 1, name: "Kennedia Roast Room", type: "coffee", location: "ghaziabad", specialty: "Espresso Bar", timing: "8:00 AM - 10:30 PM" },
  { id: 2, name: "Kennedia Library Cafe", type: "work", location: "delhi", specialty: "Quiet Seating + Fast Wi-Fi", timing: "9:00 AM - 11:00 PM" },
  { id: 3, name: "Kennedia High Tea Lounge", type: "high-tea", location: "noida", specialty: "Tea Towers + Desserts", timing: "11:30 AM - 9:30 PM" },
  { id: 4, name: "Garden Brew Terrace", type: "coffee", location: "noida", specialty: "Cold Brew + Outdoor Seating", timing: "8:30 AM - 9:30 PM" },
];

function PillSelect({ options, value, onChange, placeholder }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            value === option.value ? "border-primary bg-primary text-primary-foreground" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-primary/40"
          }`}
        >
          {option.label}
        </button>
      ))}
      {!value && <span className="self-center text-sm text-zinc-400">{placeholder}</span>}
    </div>
  );
}

export default function CafeQuickBooking() {
  const [visitType, setVisitType] = useState("");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const matches = useMemo(() => {
    if (!visitType || !location) return [];
    return CAFES.filter((cafe) => cafe.type === visitType && cafe.location === location);
  }, [visitType, location]);

  return (
    <section id="reservation" className="relative overflow-hidden bg-white py-12 transition-colors duration-500 dark:bg-[#050505]">
      <div className="absolute left-0 top-8 select-none text-[6rem] font-black uppercase italic text-zinc-900/[0.03] dark:text-white/[0.02] md:text-[8rem]">
        Quick Booking
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-7 max-w-3xl">
          <h2 className="text-2xl font-serif leading-tight text-zinc-900 dark:text-white md:text-3xl">
            Plan A Better Cafe Stop.
            <span className="italic text-zinc-400 dark:text-white/30"> Faster.</span>
          </h2>
        </div>

        <div className="rounded-[1.5rem] border border-zinc-200 bg-white/80 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 md:p-6">
          <div className="border-b border-zinc-200 pb-6 dark:border-white/10">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Select Visit Type</Label>
                <PillSelect options={VISIT_TYPES} value={visitType} onChange={setVisitType} placeholder="Choose a cafe format" />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Select Location</Label>
                <PillSelect options={LOCATIONS} value={location} onChange={setLocation} placeholder="Choose a city" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={() => setIsOpen(true)}
                disabled={!(visitType && location)}
                className="h-10 rounded-full bg-zinc-900 px-6 text-sm text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>

              {isOpen && (
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="h-10 rounded-full border-zinc-200 px-6 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Hide
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="results"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="mt-6">
                  <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 dark:text-white/40">Available Cafes</p>
                      <h3 className="mt-1.5 text-xl font-serif text-zinc-900 dark:text-white">Curated picks for your visit</h3>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-white/50">{matches.length} option{matches.length === 1 ? "" : "s"} available</p>
                  </div>

                  {matches.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {matches.map((cafe, index) => (
                        <motion.div
                          key={cafe.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className="flex min-h-[248px] flex-col justify-between rounded-[1.2rem] border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                          <div>
                            <div className="mb-3 flex items-center justify-between">
                              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                                {VISIT_TYPES.find((item) => item.value === cafe.type)?.label}
                              </span>
                              <Coffee className="h-4 w-4 text-zinc-400 dark:text-white/40" />
                            </div>
                            <h4 className="text-lg font-serif text-zinc-900 dark:text-white">{cafe.name}</h4>
                            <div className="mt-2.5 space-y-1.5 text-sm text-zinc-600 dark:text-white/60">
                              <p>{cafe.specialty}</p>
                              <p>{cafe.timing}</p>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{LOCATIONS.find((item) => item.value === cafe.location)?.label}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })}
                            className="mt-5 h-10 rounded-full bg-zinc-900 text-sm text-white transition-all hover:bg-primary dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
                          >
                            Reserve
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[160px] items-center justify-center rounded-[1.2rem] border border-dashed border-zinc-200 dark:border-white/10">
                      <p className="text-sm text-zinc-400 dark:text-white/30">No options available for this combination.</p>
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
