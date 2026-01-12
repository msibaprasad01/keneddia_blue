import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

import "swiper/css";

// Mock Data
const HOTEL_NEWS_ITEMS = [
  {
    slug: "best-luxury-hotel-award-2025",
    image: { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", alt: "Award Ceremony" },
    date: "Jan 10, 2026",
    title: "Kennedia Blu Wins Best Luxury Hotel Award 2025",
    description: "We are honored to be recognized as the leading luxury hotel brand for the third consecutive year, setting new standards in hospitality.",
    category: "Awards"
  },
  {
    slug: "new-michelin-star-chef",
    image: { src: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9f4?q=80&w=2070&auto=format&fit=crop", alt: "Chef Cooking" },
    date: "Dec 28, 2025",
    title: "New Michelin Star Chef Joins Our Flagship Restaurant",
    description: "Chef Elena Rossi brings her culinary mastery and innovative vision to our signature dining experience, promising an unforgettable journey for your palate.",
    category: "Culinary"
  },
  {
    slug: "sustainable-luxury-commitment",
    image: { src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1527&auto=format&fit=crop", alt: "Green Garden" },
    date: "Dec 15, 2025",
    title: "Sustainable Luxury: Our Commitment to Zero Carbon",
    description: "Launching our ambitious initiative to achieve carbon neutrality across all properties by 2030 without compromising on luxury.",
    category: "Sustainability"
  },
  {
    slug: "introducing-royal-suite",
    image: { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop", alt: "Royal Suite Interior" },
    date: "Dec 05, 2025",
    title: "Introducing The Royal Suite: A New Standard of Opulence",
    description: "Experience the pinnacle of comfort in our newly renovated Royal Suites, featuring panoramic city views and exclusive butler service.",
    category: "Rooms & Suites"
  }
];

// Styling Configuration
const STYLE_CONFIG = {
  aspectRatio: "4/3",
  navigation: {
    buttonSize: "w-8 h-8",
    iconSize: "w-4 h-4",
  },
};

export default function HotelNewsUpdates() {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
              Latest News
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              News & Updates
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/news" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all cursor-pointer">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer z-10 relative`}
                aria-label="Previous"
              >
                <ChevronLeft className={STYLE_CONFIG.navigation.iconSize} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer z-10 relative`}
                aria-label="Next"
              >
                <ChevronRight className={STYLE_CONFIG.navigation.iconSize} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            speed={600}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={HOTEL_NEWS_ITEMS.length > 3}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full pb-4"
          >
            {HOTEL_NEWS_ITEMS.map((item, index) => (
              <SwiperSlide key={`hotel-news-${index}`} className="!h-auto">
                <div className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={item.image.src}
                      alt={item.image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2 text-xs font-bold text-primary tracking-wider uppercase">
                      {item.category}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {item.description}
                    </p>
                    <div className="mt-auto pt-2 border-t border-border/50">
                      <Link to={`/news/${item.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors group/link pt-3">
                        Read Story
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
