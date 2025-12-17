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
    <section id="story" className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: Experience Slider (Span 8) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
                Guest Experiences
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                {experienceShowcase.title}
              </h2>
            </div>

            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 2.5 }, // Compact view on desktop
              }}
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              className="w-full experience-swiper py-2"
            >
              {experienceShowcase.items.map((item: any, index: number) => (
                <SwiperSlide key={index} className="h-full">
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    {/* Image Top */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        src={item.image.src}
                        alt={item.image.alt}
                        priority={index < 2}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white/90">
                        <Quote className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Content Bottom */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow italic">
                        "{item.description}"
                      </p>
                      <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{item.author}</span>
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT: Compact Panel (Span 4) */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">

            {/* Rating Summary Card */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Star className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-serif font-bold text-primary mb-1">
                  {experienceShowcase.rating}
                </h3>
                <div className="flex justify-center gap-1 text-amber-500 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Based on {experienceShowcase.reviewCount} Reviews
                </p>
              </div>
            </div>

            {/* Application / Upload Mock UI */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Share Your Moment
              </h4>

              <div className="space-y-4">
                {/* Upload Zone */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/30 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Click to upload photo</p>
                </div>

                {/* Text Input */}
                <div>
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
