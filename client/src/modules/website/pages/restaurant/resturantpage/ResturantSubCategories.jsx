import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, UtensilsCrossed, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EXPERIENCES = [
  {
    id: "italian",
    title: "Italian",
    category: "Mediterranean",
    description: "Authentic Mediterranean soul in a sophisticated setting. Experience the rich heritage of Tuscany through our hand-picked ingredients.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    link: "/restaurant/italian"
  },
  {
    id: "luxury-lounge",
    title: "Luxury Lounge",
    category: "Premium",
    description: "Premium comfort tailored for memorable family gatherings. A refined space where elegance meets contemporary dining.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800", 
    link: "/restaurant/luxury-lounge"
  },
  {
    id: "spicy-darbar",
    title: "Spicy Darbar",
    category: "Traditional",
    description: "Bold, traditional Indian flavors with a fiery spirit. Royal curries and tandoori masterpieces prepared with authentic spices.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800",
    link: "/restaurant/spicy-darbar"
  },
  {
    id: "takeaway",
    title: "Takeaway Treats",
    category: "Gourmet",
    description: "Gourmet quality on the go for your convenience. Perfectly packaged meals that bring the restaurant experience to your home.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800", 
    link: "/restaurant/takeaway"
  },
  {
    id: "bakery",
    title: "The Bakehouse",
    category: "Desserts",
    description: "Handcrafted pastries and artisanal breads baked daily. Sweeten your moments with our collection of signature desserts.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800",
    link: "/restaurant/bakery"
  }
];

export default function ResturantSubCategories({ propertyId }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const moveTL_BR = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const moveBL_TR = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.04, 0.04, 0]);

  // Logic to determine layout style
  const itemCount = EXPERIENCES.length;

  return (
    <section 
      ref={containerRef}
      className="relative py-14 transition-colors duration-500 bg-white dark:bg-[#080808] overflow-hidden"
    >
      {/* ── Background Parallax Text ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ x: moveTL_BR, y: moveTL_BR, opacity: bgOpacity }}
          className="absolute top-4 left-4 text-[10rem] font-black italic text-zinc-900 dark:text-white select-none uppercase"
        >
          Cuisine
        </motion.div>
        <motion.div 
          style={{ x: moveBL_TR, y: moveBL_TR, opacity: bgOpacity }}
          className="absolute bottom-4 right-4 text-[10rem] font-black italic text-zinc-900 dark:text-white select-none uppercase"
        >
          Flavors
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Verticals</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white tracking-tight">
              One Location. <span className="text-primary italic">Diverse Verticals.</span>
            </h2>
          </motion.div>

          <motion.div className="hidden lg:flex items-center gap-4 bg-zinc-50 dark:bg-white/5 px-6 py-3.5 rounded-2xl border border-zinc-100 dark:border-white/10 shadow-sm">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <p className="text-sm font-serif font-bold text-zinc-900 dark:text-white tracking-wide">Premium Dining Destination</p>
          </motion.div>
        </div>

        {/* ── Flex-based Adaptive Layout ── */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {EXPERIENCES.map((exp, index) => {
            // Dynamic width logic:
            // If total is 5: index 0,1,2 get 33% width. index 3,4 get 45% width.
            // If total is 4: all get 24% width.
            let cardWidth = "w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]"; // Default for 4
            
            if (itemCount === 5) {
              if (index < 3) {
                cardWidth = "w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]";
              } else {
                cardWidth = "w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(42%-1.5rem)]";
              }
            }

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/restaurant/${propertyId}/${exp.id}`)}
                className={`group cursor-pointer relative flex flex-col bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 p-6 lg:p-10 transition-all duration-500 hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-900 hover:border-primary/20 min-h-[420px] ${cardWidth}`}
              >
                {/* Corner Circular Image */}
                <div className="absolute top-6 right-6 w-20 h-20 lg:w-24 lg:h-24 overflow-hidden rounded-full border-4 border-white dark:border-zinc-800 shadow-xl z-20 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-grow pt-2">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full">
                      {exp.category}
                    </span>
                  </div>
                  
                  {/* Light Divider Line */}
                  <div className="w-12 h-[1px] bg-zinc-200 dark:bg-zinc-800 mb-8" />
                  
                  <h3 className="text-2xl lg:text-3xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors mb-6 pr-12 lg:pr-16">
                    {exp.title}
                  </h3>
                  
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-4 font-light">
                    {exp.description}
                  </p>

                  {/* Action Button */}
                  <div className="mt-auto flex items-center gap-4">
                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <ChevronRight size={24} />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Explore Vertical
                     </span>
                  </div>
                </div>

                {/* Background Decorative Index */}
                <span className="absolute bottom-8 right-10 text-7xl font-black text-zinc-900/[0.03] dark:text-white/[0.02] italic select-none">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}