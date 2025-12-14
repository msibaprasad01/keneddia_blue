import { useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

export default function DailyOffers() {
  const { dailyOffers } = siteContent.text;
  const swiperRef = useRef<SwiperType>(null);

  // Guard clause
  if (!dailyOffers || !dailyOffers.offers || dailyOffers.offers.length === 0) return null;

  const offers = dailyOffers.offers;

  // Simple category inference helper
  const getCategory = (title: string, desc: string) => {
    const text = (title + " " + desc).toLowerCase();
    if (text.includes("dining") || text.includes("meal") || text.includes("restaurant") || text.includes("dinner")) return "Restaurant";
    if (text.includes("cafe") || text.includes("coffee") || text.includes("tea")) return "Cafe";
    if (text.includes("spa") || text.includes("massage")) return "Wellness";
    return "Hotel"; // Default
  };

  return (
    <section className="relative w-full bg-background py-10 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header - Compact */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              {dailyOffers.title}
            </h2>
            <div className="w-12 h-0.5 bg-primary mt-2" />
          </div>

          {/* Custom Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={(swiper) => {
              // @ts-ignore
              swiperRef.current = swiper;
            }}
            className="w-full pb-4"
          >
            {offers.map((offer, index) => {
              const category = getCategory(offer.title, offer.description);

              return (
                <SwiperSlide key={index} className="h-full">
                  <div className="group relative bg-card border border-border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-colors duration-300 flex flex-col">
                    {/* Image Aspect 300x250ish */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        {...offer.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Priority Only / Category Badge */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Content - Compact */}
                    <div className="p-4 flex flex-col gap-3 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {offer.title}
                        </h3>
                      </div>

                      {/* Description Hidden as requested, showing minimal info or just CTA */}
                      {/* <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p> */}

                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Code: <span className="font-mono text-foreground font-medium">{offer.couponCode}</span>
                        </div>
                        <Link href={offer.link}>
                          <a className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                            {offer.ctaText}
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
