import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";
import { useState } from "react";

const verticals = [
  {
    key: "hotel",
    logo: siteContent.brand.logo_hotel,
    image: siteContent.images.businessVerticals.hotel,
    description: "Luxury accommodations redefining comfort.",
    link: "/business/hotels-resorts"
  },
  {
    key: "cafe",
    logo: siteContent.brand.logo_cafe,
    image: siteContent.images.businessVerticals.cafe,
    description: "Artisanal coffee and gourmet experiences.",
    link: "/business/cafes-dining"
  },
  {
    key: "bar",
    logo: siteContent.brand.logo_bar,
    image: siteContent.images.businessVerticals.bar,
    description: "Exclusive lounges and signature cocktails.",
    link: "/business/bars-lounges"
  }
];

export default function AboutUsSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prev: number) => (prev + 1) % verticals.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev: number) => (prev - 1 + verticals.length) % verticals.length);
  };

  const currentItem = verticals[currentIndex];

  return (
    <section className="py-16 px-6 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-secondary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">
            {siteContent.text.about.discoverTitle}
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
            Experience Our World
          </h3>
          <p className="mt-4 text-muted-foreground font-light text-lg">
            {siteContent.text.about.carousel[0].description}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-30 w-10 h-10 rounded-full border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-30 w-10 h-10 rounded-full border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Card Slide */}
          <div className="relative overflow-hidden px-4 md:px-0">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Background Image */}
              <OptimizedImage
                {...currentItem.image}
                className="w-full h-full object-cover"
              />

              {/* Dark Overlay Card */}
              <div className="absolute inset-0 bg-black/40" /> {/* General image dimming */}

              {/* Content Card Positioned Over Image */}
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                <div
                  className="max-w-xl w-full p-8 md:p-10 rounded-xl text-center backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(15,17,22,0.75)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                  }}
                >
                  {/* Logo */}
                  <div className="h-16 mb-6 flex items-center justify-center">
                    <img
                      src={currentItem.logo.image.src}
                      alt={currentItem.logo.image.alt}
                      className="h-full w-auto object-contain brightness-0 invert opacity-90"
                    />
                  </div>

                  <h4 className="text-2xl font-serif text-[#FFFFFF] mb-3">
                    {currentItem.key === 'hotel' ? 'Hotels & Resorts' : currentItem.key === 'cafe' ? 'Cafes & Dining' : 'Bars & Lounges'}
                  </h4>

                  <p className="text-[#C7CBD6] font-light text-sm md:text-base mb-8 leading-relaxed">
                    {currentItem.description}
                  </p>

                  <Link href={currentItem.link}>
                    <a className="inline-flex items-center px-6 py-2 border border-primary/50 text-primary hover:bg-primary hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest rounded-sm">
                      Explore
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </a>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {verticals.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-600 hover:bg-gray-500"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
