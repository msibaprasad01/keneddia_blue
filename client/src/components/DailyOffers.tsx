import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export default function DailyOffers() {
  const { dailyOffers } = siteContent.text;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Guard clause in case data isn't ready
  if (!dailyOffers || !dailyOffers.offers || dailyOffers.offers.length === 0) return null;

  const offers = dailyOffers.offers;

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [offers.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const currentOffer = offers[currentIndex];

  return (
    <section className="relative w-full bg-gradient-to-br from-secondary/10 to-background py-16 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            {dailyOffers.title}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              {/* Left Side - Image */}
              <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-lg shadow-2xl">
                <OptimizedImage
                  {...currentOffer.image}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient for better text visibility on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
              </div>

              {/* Right Side - Content */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Tag / Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full w-fit">
                  <Tag className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 text-sm font-medium tracking-wide uppercase">
                    Limited Time Offer
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
                  {currentOffer.title}
                </h3>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {currentOffer.description}
                </p>

                {/* Coupon Code & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="px-6 py-3 bg-card border border-border rounded-lg shadow-sm">
                    <span className="text-muted-foreground text-xs uppercase block mb-1">
                      Coupon Code
                    </span>
                    <span className="text-xl font-mono text-foreground tracking-wider font-bold">
                      {currentOffer.couponCode}
                    </span>
                  </div>

                  <Link href={currentOffer.link}>
                    <a className="group flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground text-base font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                      {currentOffer.ctaText}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg z-10"
            aria-label="Previous offer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg z-10"
            aria-label="Next offer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-border hover:bg-primary/50"
                  }`}
                aria-label={`Go to offer ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
