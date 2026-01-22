import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/data/restaurantData";
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative py-10 md:py-14 bg-background overflow-hidden">
      {/* Compact Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.04, 0.02],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-primary rounded-full blur-3xl"
        />
        
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Guest Reviews</span>
          </motion.span>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            What Our Guests Say
          </h2>
          
          <p className="text-muted-foreground text-sm">
            Real experiences from valued customers
          </p>
        </motion.div>

        {/* Compact Testimonials Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card - Compact */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-xl relative">
                    {/* Compact Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-5">
                      <Quote className="w-16 h-16 text-primary" />
                    </div>

                    {/* Compact Content Layout */}
                    <div className="grid md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-start">
                      {/* Testimonial Text */}
                      <div className="relative z-10">
                        {/* Rating Stars - Compact */}
                        {testimonials[currentIndex].rating && (
                          <div className="flex items-center gap-0.5 mb-3">
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                            ))}
                          </div>
                        )}

                        {/* Text - Compact */}
                        <p className="text-sm md:text-base text-foreground leading-relaxed mb-4 line-clamp-3 md:line-clamp-none">
                          "{testimonials[currentIndex].text}"
                        </p>

                        {/* Author Info - Inline */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {testimonials[currentIndex].name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">
                              {testimonials[currentIndex].name}
                            </h4>
                            {testimonials[currentIndex].location && (
                              <p className="text-xs text-muted-foreground">
                                {testimonials[currentIndex].location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Navigation - Vertical on Desktop */}
                      <div className="hidden md:flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePrevious}
                          className="w-10 h-10 rounded-full bg-background border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-md flex items-center justify-center"
                          aria-label="Previous testimonial"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleNext}
                          className="w-10 h-10 rounded-full bg-background border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-md flex items-center justify-center"
                          aria-label="Next testimonial"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Navigation - Horizontal */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-md flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              {/* Dots - Mobile Center */}
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-6 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-border hover:bg-primary/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-md flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Desktop Indicator Dots */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-primary shadow-lg shadow-primary/30"
                    : "w-2 h-2 bg-border hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <motion.div
                animate={{ scale: isAutoPlaying ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1.5 h-1.5 rounded-full ${isAutoPlaying ? 'bg-primary' : 'bg-border'}`}
              />
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}