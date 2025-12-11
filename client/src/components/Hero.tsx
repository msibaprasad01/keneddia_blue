import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

// Assets
import video1 from "@assets/video/video1.mp4";

const slides = [
  {
    type: "video" as const,
    media: video1,
    thumbnail: siteContent.images.hero.slide1,
    title: siteContent.text.hero.slides[0].title,
    subtitle: siteContent.text.hero.slides[0].subtitle,
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide2, // Now an object
    thumbnail: siteContent.images.hero.slide2, // Now an object
    title: siteContent.text.hero.slides[1].title,
    subtitle: siteContent.text.hero.slides[1].subtitle,
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide3, // Now an object
    thumbnail: siteContent.images.hero.slide3, // Now an object
    title: siteContent.text.hero.slides[2].title,
    subtitle: siteContent.text.hero.slides[2].subtitle,
    cta: "Know More",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleThumbnailClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slide.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={slide.thumbnail.src}
                  className="w-full h-full object-cover"
                >
                  <source src={slide.media} type="video/mp4" />
                </video>
              ) : (
                <OptimizedImage
                  {...slide.media} // Spreads src, alt, priority
                  className="w-full h-full object-cover"
                />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content - Left Aligned & Width Restricted */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="container mx-auto h-full px-8 md:px-16 lg:px-24 flex items-center">
                {/* WIDTH FIX: 
                  w-full md:w-3/4 xl:w-1/2 
                  This ensures text never crosses the 50% mark on large screens,
                  preventing overlap with thumbnails.
                */}
                <div className="w-full md:w-3/4 xl:w-[50%] pt-10 pointer-events-auto">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl lg:text-6xl font-serif font-medium text-[#FDFBF7] mb-6 leading-[1.1] tracking-tight wrap-break-word"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-[#FDFBF7]/80 font-light mb-10 tracking-wide uppercase"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="px-10 py-3.5 border border-[#FDFBF7]/50 text-[#FDFBF7] font-medium text-base hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 backdrop-blur-sm"
                  >
                    {slide.cta}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Decorative Wave Element */}
            <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 z-10 pointer-events-none">
              <svg
                viewBox="0 0 1440 320"
                className="w-full h-full drop-shadow-lg"
                preserveAspectRatio="none"
              >
                <path
                  className="fill-background"
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- THUMBNAIL PREVIEW SECTION --- */}
      {/* Positioned higher (bottom-48) to avoid wave overlap */}
      <div className="hidden xl:flex absolute right-12 bottom-48 z-20 flex-row items-end gap-4">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.5 }}
            onClick={() => handleThumbnailClick(index)}
            className={`relative w-40 h-64 cursor-pointer overflow-hidden transition-all duration-500 ease-out group ${activeIndex === index
              ? "ring-2 ring-[#FDFBF7] shadow-2xl scale-105 z-10 grayscale-0"
              : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
          >
            <OptimizedImage
              {...slide.thumbnail}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {slide.type === "video" && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-3 bg-linear-to-t from-black/90 to-transparent">
              <p className="text-xs text-white/90 font-medium truncate">
                {slide.subtitle}
              </p>
            </div>
            <div
              className={`absolute inset-0 transition-all duration-300 ${activeIndex === index
                ? "bg-transparent"
                : "bg-black/20 group-hover:bg-transparent"
                }`}
            />
          </motion.div>
        ))}
      </div>

      {/* --- CONTROLS SECTION --- */}
      <div className="hidden xl:flex absolute bottom-48 right-136 z-20 items-center gap-6 mr-8">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`cursor-pointer h-[3px] transition-all duration-500 rounded-full ${activeIndex === index
                ? "w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                : "w-6 bg-white/30 hover:bg-white/60"
                }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {/* Direct Slide Control via Instance */}
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="w-10 h-10 flex items-center justify-center rounded-full
            border border-white/30 text-white backdrop-blur-md
            hover:bg-white hover:text-black hover:scale-110
            transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="w-10 h-10 flex items-center justify-center rounded-full
            border border-white/30 text-white backdrop-blur-md
            hover:bg-white hover:text-black hover:scale-110
            transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="xl:hidden absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-0.5 transition-all duration-500 cursor-pointer ${activeIndex === index
                ? "w-10 bg-[#FDFBF7]"
                : "w-5 bg-[#FDFBF7]/40"
                }`}
            />
          ))}
        </div>

        <button
          onClick={() => swiperInstance?.slideNext()}
          className="w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}