import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

import "swiper/css";

import { HOTEL_NEWS_ITEMS } from "@/data/hotelContent";

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
    <section className="py-2 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-6">
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
                      <Link to={`/hotel/news/${item.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors group/link pt-3">
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
