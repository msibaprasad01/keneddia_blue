import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Link } from "wouter";

// Asset
import aboutImg from "@assets/generated_images/opulent_hotel_lobby_in_dubai.png";

const slides = [
  {
    title: "Trusted Hospitality Brand",
    description: "Kennedia Blu is built on trust and excellence, delivering premium hospitality experiences that exceed customer expectations.",
    icon: Shield,
  },
  {
    title: "Commitment to Quality",
    description: "We focus on top-class service standards, attention to detail, and customer satisfaction across every touchpoint.",
    icon: Award,
  },
  {
    title: "Leadership Excellence",
    description: "Led by industry veterans with decades of experience in hospitality, driving innovation and consistent service quality.",
    icon: Users,
  },
];

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
    <section className="py-20 px-6 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <img 
                src={aboutImg} 
                alt="Luxury hospitality environment" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
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
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Discover Kennedia Blu</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">About Kennedia Blu</h3>
            
            <div 
              className="relative min-h-[220px] mb-8"
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
            <div className="flex gap-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
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
