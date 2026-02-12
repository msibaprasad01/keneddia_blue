import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function AboutResturantPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth Parallax Controls
  const textX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15px", "15px"]);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative py-16 md:py-20 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden"
    >
      {/* DECORATIVE BACKGROUND TEXT */}
      <motion.div 
        style={{ x: textX }}
        className="absolute top-1/4 left-0 whitespace-nowrap text-[8rem] md:text-[12rem] font-black text-zinc-100 dark:text-white/[0.02] pointer-events-none select-none italic uppercase z-0"
      >
        Authentic Heritage Dining
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT: COMPACT IMAGE COMPONENT (Reduced to 4 Columns) */}
          <div className="lg:col-span-4 relative max-w-sm mx-auto lg:mx-0">
            <motion.div 
              style={{ y: imageY }}
              className="relative rounded-2xl overflow-hidden aspect-square shadow-xl border border-zinc-100 dark:border-white/5"
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200"
                alt="Restaurant Ambience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            {/* SMALLER SOCIAL MEDIA FLOATER */}
            <div className="absolute -bottom-4 left-4 flex gap-2">
              {[
                { icon: <Instagram size={14} />, link: "#" },
                { icon: <Facebook size={14} />, link: "#" },
                { icon: <Twitter size={14} />, link: "#" },
                { icon: <MessageCircle size={14} />, link: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link}
                  className="w-9 h-9 bg-white dark:bg-zinc-900 shadow-lg rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors border border-zinc-100 dark:border-white/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT (Increased to 8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                  The Destination
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 dark:text-white leading-tight tracking-tight">
                A Symphony of <br />
                <span className="italic text-zinc-400 dark:text-white/40">Fine Flavors.</span>
              </h2>
              
              <p className="text-zinc-600 dark:text-white/70 text-base md:text-lg leading-relaxed font-light max-w-3xl">
                We believe dining is more than just a meal; it’s a 
                <span className="text-zinc-900 dark:text-white font-medium"> curated premium experience</span>. 
                Our philosophy balances bold Indian tradition with refined global elegance, 
                all within a <span className="text-primary italic font-medium">thoughtfully designed setting</span>.
              </p>
            </div>

            {/* INFO GRID */}
            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-white/10">
              {/* Availability */}
              <div className="group">
                <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary" /> Availability
                </h4>
                <div className="space-y-1">
                  <p className="text-zinc-900 dark:text-white font-serif text-lg md:text-xl italic leading-tight transition-colors">
                    11:00 AM — 11:30 PM
                  </p>
                  <p className="text-zinc-400 dark:text-white/30 text-[9px] font-bold tracking-widest uppercase">
                    MONDAY — SUNDAY
                  </p>
                </div>
              </div>

              {/* Connect */}
              <div className="group">
                <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" /> Connect
                </h4>
                <div className="space-y-1">
                  <a 
                    href="tel:+919999999999" 
                    className="text-zinc-900 dark:text-white font-serif text-lg md:text-xl italic block hover:text-primary transition-colors"
                  >
                    +91 999 999 9999
                  </a>
                  <span className="text-zinc-400 dark:text-white/30 text-[9px] font-bold tracking-widest uppercase">
                    Direct Reservation
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}