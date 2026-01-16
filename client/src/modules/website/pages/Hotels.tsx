import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import HotelCarouselSection from "@/modules/website/components/HotelCarouselSection";
import HotelOffersCarousel from "@/modules/website/components/hotel/HotelOffersCarousel";
import HotelNewsUpdates from "@/modules/website/components/hotel/HotelNewsUpdates";
import HotelReviewsSection from "@/modules/website/components/HotelReviewsSection";
import QuickBooking from "@/modules/website/components/QuickBooking";
import GroupBookingSection from "@/modules/website/components/GroupBookingSection";
import SpecialOfferPopup from "@/modules/website/components/SpecialOfferPopup";
// Assets
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Hotel Navigation Items
const HOTEL_NAV_ITEMS = [
  { type: "link", label: "OVERVIEW", key: "overview", href: "#overview" },
  { type: "link", label: "COLLECTION", key: "collection", href: "#collection" },
  { type: "link", label: "OFFERS", key: "offers", href: "#offers" },
  { type: "link", label: "EVENTS", key: "events", href: "#events" },
  { type: "link", label: "CONTACT", key: "contact", href: "#contact" },
] as any[];

// Hero Slider Images
const HERO_IMAGES = [
  siteContent.images.hotels.mumbai,
  siteContent.images.hotels.delhi,
  siteContent.images.hotels.hyderabad,
];

export default function Hotels() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  // Hero Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar navItems={HOTEL_NAV_ITEMS} logo={siteContent.brand.logo_hotel} />

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <OptimizedImage
              {...HERO_IMAGES[currentHeroIndex]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 uppercase tracking-wider drop-shadow-2xl"
          >
            Timeless Luxury
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 font-light max-w-2xl drop-shadow-lg"
          >
            Where every moment is crafted with elegance.
          </motion.p>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${idx === currentHeroIndex
                ? "bg-white"
                : "bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* QUICK BOOKING */}
      <QuickBooking />

      {/* HOTEL COLLECTION SECTION - Now includes Gallery/Map toggle internally */}
      <div id="collection">
        <HotelCarouselSection />
      </div>

      {/* 2. ABOUT / OVERVIEW SECTION - COMPACT */}
      <section id="overview" className="py-8 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center">
            {/* LEFT: Compact Rectangular Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative z-10 border border-border/10 shadow-2xl">
                <OptimizedImage
                  {...siteContent.images.hotels.delhi}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-primary/20 rounded-xl -z-0" />
              <div className="absolute -top-4 -left-4 w-1/2 h-1/2 bg-secondary/10 rounded-xl -z-0" />
            </motion.div>

            {/* RIGHT: Carousel Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5">
                      {currentHeroIndex === 0
                        ? "Our Philosophy"
                        : currentHeroIndex === 1
                          ? "Our Promise"
                          : "Our Legacy"}
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-3">
                      {currentHeroIndex === 0 && "Where Every Stay Is a Story"}
                      {currentHeroIndex === 1 && "Excellence in Every Detail"}
                      {currentHeroIndex === 2 && "A Heritage of Hospitality"}
                    </h2>
                  </div>

                  <p className="text-muted-foreground leading-relaxed text-base font-light">
                    {currentHeroIndex === 0 &&
                      "Kennedia Blu Hotels & Resorts represents a collection of the world's most distinguished properties. We invite you to experience hospitality that goes beyond service—hospitality that is a feeling, a memory, a story waiting to be told."}
                    {currentHeroIndex === 1 &&
                      "From the moment you arrive, every detail is carefully curated to exceed your expectations. Our commitment to excellence is reflected in our world-class amenities, personalized service, and unforgettable experiences that create lasting memories."}
                    {currentHeroIndex === 2 &&
                      "With decades of experience in luxury hospitality, Kennedia Blu has established itself as a leader in creating exceptional guest experiences. Our heritage of excellence continues to set the standard for premium accommodations worldwide."}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">
                        50+
                      </h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Locations
                      </p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">
                        5-Star
                      </h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Rating
                      </p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif text-primary mb-0.5">
                        100K+
                      </h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Guests
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentHeroIndex
                      ? "bg-primary w-8"
                      : "bg-border w-4 hover:bg-primary/50"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOTEL OFFERS CAROUSEL */}
      <div id="offers">
        <HotelOffersCarousel />
      </div>

      {/* GROUP BOOKING EXTENSION */}
      <GroupBookingSection />

      {/* HOTEL NEWS UPDATES */}
      <div id="events">
        <HotelNewsUpdates />
      </div>

      {/* HOTEL REVIEWS */}
      <div id="ratings">
        <HotelReviewsSection />
      </div>

      {/* EXCLUSIVE OFFER POPUP */}
      <SpecialOfferPopup />

      {/* FOOTER */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}