import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { testimonials } from "@/data/restaurantData";
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Scroll animations for Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const smoothCardY = useSpring(cardY, { stiffness: 100, damping: 30 });

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-[#050505] overflow-hidden min-h-[600px] flex items-center"
    >
      {/* 1. BACKGROUND STORYTELLING LAYER */}
      <motion.div 
        style={{ x: bgTextX }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[15rem] font-black text-white/[0.01] pointer-events-none select-none italic uppercase z-0"
      >
        Guest Experience Excellence Reviews
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: STATIC STORY HEADER */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em]">The Feedback</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-none">
              Voices of <br />
              <span className="italic text-white/30 italic decoration-primary/20 underline decoration-1 underline-offset-[12px]">Delight.</span>
            </h2>
            <p className="text-white/40 text-lg font-light leading-relaxed max-w-xs">
              Direct insights from those who have journeyed through our culinary offerings.
            </p>
          </div>

          {/* RIGHT: PARALLAX REVERSE TESTIMONIAL CARD */}
          <div className="lg:col-span-8 relative">
            <motion.div style={{ y: smoothCardY }} className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <Quote className="absolute -top-6 -right-6 w-32 h-32 text-primary/5 -rotate-12" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-xl md:text-3xl font-serif text-white leading-snug mb-10 italic">
                    "{testimonials[currentIndex].text}"
                  </blockquote>

                  {/* Author Meta */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <span className="text-primary font-black text-lg">{testimonials[currentIndex].name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-widest uppercase">{testimonials[currentIndex].name}</h4>
                        <p className="text-white/30 text-[10px] uppercase font-medium">{testimonials[currentIndex].location || "Verified Guest"}</p>
                      </div>
                    </div>

                    {/* Manual Navigation Inside Card */}
                    <div className="flex gap-1">
                      <button onClick={handlePrev} className="p-4 border border-white/5 text-white hover:bg-white hover:text-black transition-all">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={handleNext} className="p-4 bg-white text-black hover:bg-primary hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Counter Indicator Overlay */}
              <div className="absolute -bottom-6 -right-6 text-white/5 text-9xl font-black italic select-none">
                0{currentIndex + 1}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}