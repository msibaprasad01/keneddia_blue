import { useState } from "react";
import { Star, Upload, Send, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

import "swiper/css";

export default function OurStoryPreview() {
  const { experienceShowcase } = siteContent.text;

  // Fallback if data isn't ready type-safe check
  if (!experienceShowcase) return null;

  return (
    <section id="story" className="py-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* LEFT: Experience Slider (Span 8) */}
          <div className="lg:col-span-8 order-2 lg:order-1 min-w-0">
            <div className="mb-5">
              <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
                Guest Experiences
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                {experienceShowcase.title}
              </h2>
            </div>

            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 16 }, // Exactly 3 cards visible
              }}
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              watchSlidesProgress={true}
              className="w-full experience-swiper py-2 !pb-12 lg:!pb-2"
            >
              {experienceShowcase.items.map((item: any, index: number) => (
                <SwiperSlide key={index} className="h-auto">
                  <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-md">
                    {/* Image Top - Reduced aspect ratio */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <OptimizedImage
                        src={item.image.src}
                        alt={item.image.alt}
                        priority={index < 3}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white/90">
                        <Quote className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Content Bottom - Reduced padding */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-serif font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-grow italic">
                        "{item.description}"
                      </p>
                      <div className="mt-auto pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground truncate">{item.author}</span>
                        <div className="flex text-amber-500 ml-2">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT: Compact Panel (Span 4) - Increased width */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-end h-full pt-0 lg:pt-[74px]">
            {/* Application / Upload Mock UI */}
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm h-full flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Share Your Moment
              </h4>

              <div className="space-y-3 flex-grow flex flex-col">
                {/* Upload Zone - Reduced height */}
                <div className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/30 transition-colors group flex-grow min-h-[80px]">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center mb-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Click to upload photo</p>
                </div>

                {/* Text Input */}
                <div className="mt-auto">
                  <input
                    type="text"
                    placeholder="Highlight of your stay..."
                    className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/70"
                  />
                </div>

                {/* Submit Button */}
                <button className="w-full bg-primary text-primary-foreground text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide">
                  Submit Experience <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}