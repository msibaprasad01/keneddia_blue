import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

import "swiper/css";
import "swiper/css/effect-fade";

export default function NewsPress() {
  const { news } = siteContent.text;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!news || !news.items || news.items.length === 0) return null;

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      <style>{`
        .news-swiper .swiper-slide {
          opacity: 0 !important;
          pointer-events: none;
        }
        .news-swiper .swiper-slide-active {
          opacity: 1 !important;
          pointer-events: auto;
        }
      `}</style>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Compact Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
              Updates & Recognition
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              {news.title}
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            modules={[EffectFade, Autoplay, Navigation]}
            effect="fade"
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={news.items.length > 1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full news-swiper"
          >
            {news.items.map((item, index) => (
              <SwiperSlide key={item.slug} className="!flex">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-lg">
                    <OptimizedImage
                      src={item.image.src}
                      alt={item.image.alt}
                      priority={index === 0}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-center">
                    {/* Meta */}
                    <div className="mb-4 flex items-center gap-3 text-xs text-primary">
                      <span className="font-medium">{item.date}</span>
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span className="uppercase tracking-wider font-semibold">Press</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-4 leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>

                    {/* Link */}
                    <Link href={`/news/${item.slug}`}>
                      <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group">
                        Read Full Story
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </Link>

                    {/* Slide Indicator */}
                    <div className="flex items-center gap-2 mt-8">
                      {news.items.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => swiperInstance?.slideToLoop(idx)}
                          className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                              ? "w-8 bg-primary"
                              : "w-4 bg-primary/30 hover:bg-primary/50"
                            }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
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