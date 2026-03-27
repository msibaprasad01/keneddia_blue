import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Phone, GlassWater, MapPin, Sparkles, UtensilsCrossed } from "lucide-react";

// ── Static Data (mirrors Hotels.tsx aboutSections structure) ─────────────────

const ABOUT_SECTIONS = [
  {
    id: 1,
    subTitle: "Ghaziabad Destination",
    sectionTitle: "A Symphony of Fine Flavors",
    description:
      "We believe dining is more than just a meal — it's a curated premium experience designed to ground you in the moment. Our philosophy balances the bold spices of Indian tradition with the refined elegance of global favorites, all within a thoughtfully designed BYOB setting.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200",
    recognitions: [
      { id: 1, value: "11 AM", title: "Opens Daily",    subTitle: "Serving guests every day from morning to night", isActive: true },
      { id: 2, value: "₹899",  title: "Lunch Buffet",   subTitle: "Grand spread served daily from 12 PM to 4 PM",  isActive: true },
      { id: 3, value: "BYOB",  title: "Premium Setting", subTitle: "Bring your own bottle — curated bar ambience",  isActive: true },
    ],
    isActive: true,
  },
  {
    id: 2,
    subTitle: "Signature Experience",
    sectionTitle: "Where Heritage Meets Modern Craft",
    description:
      "Our chefs bring decades of mastery to every plate, blending age-old family recipes with contemporary presentation. Each visit is a new chapter in a story written with saffron, smoke, and seasonal produce sourced from local farms.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200",
    recognitions: [
      { id: 4, value: "50+",   title: "Menu Items",    subTitle: "Rotating seasonal specials added every month",    isActive: true },
      { id: 5, value: "4.8★",  title: "Guest Rating",  subTitle: "Consistently rated across platforms",             isActive: true },
      { id: 6, value: "15yr",  title: "Legacy",        subTitle: "Serving the region since our founding",           isActive: true },
    ],
    isActive: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AboutRestaurant() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRecognitionIndex, setCurrentRecognitionIndex] = useState(0);

  // Reset recognition index when section changes
  useEffect(() => {
    setCurrentRecognitionIndex(0);
  }, [currentIndex]);

  // Auto-cycle sections every 5 s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ABOUT_SECTIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle recognitions every 2 s
  useEffect(() => {
    const recognitions = ABOUT_SECTIONS[currentIndex].recognitions.filter((r) => r.isActive);
    if (recognitions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentRecognitionIndex((prev) => (prev + 1) % recognitions.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const section      = ABOUT_SECTIONS[currentIndex];
  const recognitions = section.recognitions.filter((r) => r.isActive);

  return (
    <section
      id="about"
      className="py-8 px-6 bg-white transition-colors duration-500 dark:bg-[#050505]"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center">

          {/* ── LEFT: Image ── */}
          <motion.div
            key={`about-image-${currentIndex}`}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative z-10 border border-zinc-200/10 dark:border-white/10 shadow-2xl">
              <img
                src={section.image}
                alt={section.sectionTitle}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay — matches Hotels.tsx feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Decorative offset borders — exact Hotels.tsx pattern */}
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-primary/20 rounded-xl -z-0" />
            <div className="absolute -top-4 -left-4 w-1/2 h-1/2 bg-zinc-100/80 dark:bg-white/5 rounded-xl -z-0" />

            {/* Float badge — retained from original */}
            {/* <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute top-6 -left-4 bg-primary p-4 shadow-2xl rounded-sm z-20"
            >
              <GlassWater className="text-white w-5 h-5 mb-1.5" />
              <span className="text-white text-[9px] font-black uppercase tracking-tighter leading-tight block">
                Premium <br /> BYOB Setting
              </span>
            </motion.div> */}
          </motion.div>

          {/* ── RIGHT: Content ── */}
          <div className="relative lg:pl-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Eyebrow + Title */}
                <div>
                  <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {section.subTitle}
                  </h3>
                  <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 dark:text-white leading-tight mb-3">
                    {section.sectionTitle}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-zinc-500 dark:text-white/60 leading-relaxed text-base font-light">
                  {section.description}
                </p>

                {/* Recognitions — exact Hotels.tsx pattern */}

                {/* Quick info row — Hours + Phone */}
                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-zinc-200 dark:border-white/10">
                  <div>
                    <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-primary" /> Availability
                    </h4>
                    <p className="text-zinc-900 dark:text-white font-serif text-base italic leading-tight">
                      11:00 AM — 11:30 PM
                    </p>
                    <p className="text-zinc-400 dark:text-white/30 text-[10px] mt-1 font-bold tracking-tighter">
                      MONDAY — SUNDAY
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-primary" /> Connect
                    </h4>
                    <a
                      href="tel:+919999999999"
                      className="text-zinc-900 dark:text-white font-serif text-base italic block hover:text-primary transition-colors"
                    >
                      +91 999 999 9999
                    </a>
                    <span className="text-zinc-400 dark:text-white/30 text-[10px] font-bold tracking-tighter uppercase">
                      Direct Reservation
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Section dot indicators (bottom-right) */}
            {ABOUT_SECTIONS.length > 1 && (
              <div className="flex gap-2 mt-6">
                {ABOUT_SECTIONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-primary w-6"
                        : "bg-zinc-200 dark:bg-white/10 w-3 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}