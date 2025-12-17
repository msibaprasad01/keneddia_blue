import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Play, Hotel, UtensilsCrossed, Coffee, Wine, Star } from "lucide-react";
import { Link } from "wouter";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

const brandLogos = [
  { label: "Hotel", icon: Hotel, logo: siteContent.brand.logo_hotel.image },
  { label: "Restaurant", icon: UtensilsCrossed, logo: siteContent.brand.logo.image },
  { label: "Cafe", icon: Coffee, logo: siteContent.brand.logo_cafe.image },
  { label: "Liquor Shop", icon: Wine, logo: siteContent.brand.logo_bar.image }
];

const mediaItems = [
  {
    type: "video",
    src: "https://www.youtube.com/embed/oqqrdFmYkO0",
    poster: siteContent.images.about.main
  },
  {
    type: "image",
    src: siteContent.images.about.leadership,
    alt: "Award Winning Service"
  },
  {
    type: "image",
    src: siteContent.images.hero.slide2,
    alt: "Luxury Interiors"
  }
];

export default function AboutUsSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const nextSlide = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <section className="py-10 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left Column: Media Showcase */}
          <div className="relative group">
            <div
              className="relative aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/10"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  {mediaItems[currentMediaIndex].type === "video" ? (
                    <div className="w-full h-full relative bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`${mediaItems[currentMediaIndex].src as string}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1`}
                        title="Brand Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <OptimizedImage
                      src={(mediaItems[currentMediaIndex].src as any).src}
                      alt={(mediaItems[currentMediaIndex].src as any).alt || "Gallery Image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation */}
              <div className="absolute bottom-6 right-6 flex gap-3 z-20">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 text-muted-foreground">
                {siteContent.text.about.sectionTitle}
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-foreground">
                {siteContent.brand.name}
              </h3>
              <p className="text-lg font-light leading-relaxed text-muted-foreground">
                {siteContent.text.about.carousel[0].description} {siteContent.brand.tagline}
              </p>
            </div>

            {/* Ratings Row - Compact & Inline */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-serif font-bold text-foreground text-lg leading-none">5.0</span>
                <span className="text-muted-foreground font-light">from 2,500+ reviews</span>
              </div>
            </div>

            {/* Brand Logos Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-70 text-muted-foreground">
                Our Ventures
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {brandLogos.map((brand) => (
                  <div key={brand.label} className="flex flex-col items-center justify-center text-center space-y-3 group cursor-pointer">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 bg-slate-900/90 dark:bg-accent/5 border border-border/10">
                      {/* Logo with proper visibility in both modes */}
                      <img
                        src={brand.logo.src}
                        alt={brand.label}
                        className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:scale-[1.15]"
                        style={{
                          filter: 'none',
                          mixBlendMode: 'normal'
                        }}
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-medium opacity-60 group-hover:opacity-100 transition-opacity text-muted-foreground">
                      {brand.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about">
                <a className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:underline underline-offset-8 transition-all text-foreground hover:text-primary">
                  Discover More
                  <ArrowRight className="w-4 h-4 ml-2 text-primary" />
                </a>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}