import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Link } from "wouter";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

const slides = siteContent.text.about.carousel.map((slide, index) => ({
  ...slide,
  icon: [Shield, Award, Users][index] // Keeping icons hardcoded for now or move to data if needed
}));

export default function AboutUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-10 px-6 bg-background overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left Column: Synced Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  {slides[currentSlide].image && (
                    <OptimizedImage
                      {...slides[currentSlide].image}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Content & Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{siteContent.text.about.discoverTitle}</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{siteContent.text.about.sectionTitle}</h3>

            <div
              className="relative min-h-[200px] mb-6"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {(() => {
                      const Icon = slides[currentSlide].icon;
                      return (
                        <div className="p-3 bg-secondary/30 rounded-full text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="text-xl font-serif text-foreground mb-3">{slides[currentSlide].title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-lg font-light">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex gap-2 mb-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Link href="/about">
              <a className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-widest hover:underline underline-offset-4 group">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
