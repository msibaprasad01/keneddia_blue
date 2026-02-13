import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Data ---
const BUFFET_DATA = [
  {
    id: "b1",
    name: "Royal Lunch",
    tag: "STUDENT SPECIAL",
    tagColor: "#e67e22",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200",
    remark: "Show your Student ID and enjoy the unlimited buffet.",
    accentColor: "#c0392b",
  },
  {
    id: "b2",
    name: "Grand Dinner",
    tag: "WEEKEND SPECIAL",
    tagColor: "#2ecc71",
    img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200",
    remark: "Applewood smoked grills and coastal curries every Friday–Sunday.",
    accentColor: "#16a085",
  },
  {
    id: "b3",
    name: "Sunday Brunch",
    tag: "BOTTOMLESS BRUNCH",
    tagColor: "#8e44ad",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200",
    remark: "Live pasta stations and bottomless prosecco from 11 AM.",
    accentColor: "#6c3483",
  },
];

const SIGNATURE_DATA = [
  { id: "s1", name: "Butter Chicken", cuisine: "North Indian", description: "Our legendary cream-based curry with succulent clay-oven grilled chicken pieces.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800", spice: 2 },
  { id: "s2", name: "Tandoori Jhinga", cuisine: "Coastal Tandoor", description: "Jumbo prawns marinated in a secret coastal spice mix and charred to perfection.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800", spice: 3 },
  { id: "s3", name: "Truffle Dim Sum", cuisine: "Asian Fusion", description: "Hand-rolled translucent dumplings infused with aromatic black truffle oil.", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800", spice: 1 },
  { id: "s4", name: "Szechuan Prawns", cuisine: "Szechuan", description: "Fiery wok-tossed prawns glazed in a bold and spicy authentic Szechuan pepper sauce.", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800", spice: 4 },
  { id: "s5", name: "Dal Makhani", cuisine: "North Indian", description: "Slow-cooked black lentils simmered for 24 hours with vine-ripened tomatoes and butter.", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800", spice: 1 },
  { id: "s6", name: "Crispy Lotus Stem", cuisine: "Asian Fusion", description: "Thinly sliced lotus stems fried to a golden crunch and tossed in honey-chilli glaze.", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800", spice: 2 },
];

// ─── BUFFET CAROUSEL SUB-COMPONENT ──────────────────────────────────────────
function BuffetCarousel({ onBook }) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = BUFFET_DATA.length;

  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isHovered, active]);

  const positionStyles = {
    center: { zIndex: 30, scale: 1, x: "0%", opacity: 1, filter: "blur(0px)" },
    left: { zIndex: 10, scale: 0.85, x: "-45%", opacity: 0.4, filter: "blur(4px)" },
    right: { zIndex: 10, scale: 0.85, x: "45%", opacity: 0.4, filter: "blur(4px)" },
    hidden: { zIndex: 0, scale: 0.7, x: "0%", opacity: 0, filter: "blur(10px)" },
  };

  return (
    <div className="relative w-full flex flex-col items-center py-10" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[250px] bg-primary/5 dark:bg-white/[0.02] backdrop-blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="relative w-full flex items-center justify-center h-[380px] lg:h-[420px]">
        {BUFFET_DATA.map((item, idx) => {
          const pos = idx === active ? "center" : idx === (active - 1 + total) % total ? "left" : idx === (active + 1) % total ? "right" : "hidden";
          return (
            <motion.div
              key={item.id}
              animate={positionStyles[pos]}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
              className={`absolute w-[340px] md:w-[650px] lg:w-[750px] rounded-[40px] overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 ${pos === "center" ? "pointer-events-auto" : "pointer-events-none"}`}
              onClick={() => pos !== "center" && (pos === "left" ? prev() : next())}
            >
              <div className="relative aspect-[16/8]">
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 lg:p-12 flex flex-col justify-end text-left">
                  <span className="w-fit px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase mb-4" style={{ backgroundColor: item.tagColor }}>{item.tag}</span>
                  <h3 className="text-white font-serif text-3xl lg:text-5xl mb-2">{item.name}</h3>
                  <p className="text-white/70 text-xs italic max-w-lg mb-6 line-clamp-2">{item.remark}</p>
                  <button onClick={(e) => { e.stopPropagation(); onBook(item); }} className="w-fit py-2.5 px-7 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-primary shadow-xl">Book Unlimited <ChevronRight size={14} /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-10 mt-10 z-20">
        <button onClick={prev} className="p-2.5 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-primary hover:text-white transition-all text-zinc-500 hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-4">
          {BUFFET_DATA.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`transition-all duration-700 rounded-full ${i === active ? "w-10 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-zinc-300 dark:bg-white/20"}`} />
          ))}
        </div>
        <button onClick={next} className="p-2.5 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-primary hover:text-white transition-all text-zinc-500 hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function EnhancedCulinaryCuration() {
  const [bookingModal, setBookingModal] = useState({ isOpen: false, item: null });

  return (
    <div className="bg-white dark:bg-[#050505] transition-colors duration-500">
      {/* 1. BUFFET SECTION - Intact */}
      <section className="pt-20 pb-8 overflow-hidden border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 mb-4 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Unlimited Experience</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif dark:text-white leading-tight">
            Buffet <span className="italic text-primary">Selection</span>
          </h2>
        </div>
        <div className="w-full lg:w-[85%] mx-auto px-6">
          <BuffetCarousel onBook={(item) => setBookingModal({ isOpen: true, item })} />
        </div>
      </section>

      {/* 2. SIGNATURE DISHES SECTION - Refined */}
      <section className="pt-10 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Decreased Header Size */}
          <div className="flex items-center gap-2 mb-1.5">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">The Masterpieces</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif dark:text-white mb-10">
            Signature <span className="italic text-primary">Dishes</span>
          </h2>

          {/* Compact Grid Layout with descriptions */}
          <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 pt-20 pb-10">
              {SIGNATURE_DATA.map((item, idx) => (
                <motion.div
                  key={item.id}
                  onClick={() => setBookingModal({ isOpen: true, item })}
                  className="group cursor-pointer relative bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 p-8 transition-all duration-500 hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-900 min-h-[380px]"
                >
                  {/* Visualized Large Overlapping Image */}
                  <div className="absolute -top-16 -right-4 w-36 h-36 md:w-40 md:h-40 overflow-hidden rounded-full border-[6px] border-white dark:border-zinc-800 shadow-2xl z-20 group-hover:scale-110 transition-transform duration-700">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:rotate-6 transition-transform duration-1000" />
                  </div>

                  <div className="flex flex-col h-full pt-4 text-left">
                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">{item.cuisine}</span>
                    </div>
                    
                    <h3 className="text-2xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors mb-3 pr-10">{item.name}</h3>
                    
                    {/* Added Description */}
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed mb-6 line-clamp-3 italic font-light">
                      "{item.description}"
                    </p>

                    <div className="flex gap-1.5 mb-8">
                      {[...Array(item.spice)].map((_, i) => (
                        <Flame key={i} size={14} className="text-primary fill-primary animate-pulse" />
                      ))}
                    </div>

                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <ChevronRight size={22} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">Book Dish</span>
                    </div>
                  </div>
                  <span className="absolute bottom-8 right-10 text-7xl font-black text-zinc-900/[0.03] dark:text-white/[0.01] italic select-none">0{idx + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef444422; border-radius: 20px; }
      `}</style>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setBookingModal({ isOpen: false, item: null })} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"><X className="dark:text-white" /></button>
              <h3 className="text-2xl font-serif mb-6 dark:text-white">Reserve {bookingModal.item?.name}</h3>
              <div className="space-y-4">
                <Input placeholder="Your Name" className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none dark:text-white placeholder:text-zinc-400" />
                <Input placeholder="Phone Number" className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none dark:text-white placeholder:text-zinc-400" />
                <Button className="w-full h-14 bg-primary rounded-2xl font-black uppercase tracking-widest shadow-lg">Confirm Request</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}