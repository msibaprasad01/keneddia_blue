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
    mobileMedia: video1, // Start with same media, allows replacement
    thumbnail: siteContent.images.hero.slide1,
    title: siteContent.text.hero.slides[0].title,
    subtitle: siteContent.text.hero.slides[0].subtitle,
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide2,
    mobileMedia: siteContent.images.hero.slide2,
    thumbnail: siteContent.images.hero.slide2,
    title: siteContent.text.hero.slides[1].title,
    subtitle: siteContent.text.hero.slides[1].subtitle,
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide3,
    mobileMedia: siteContent.images.hero.slide3,
    thumbnail: siteContent.images.hero.slide3,
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
            {/* Background Media - Desktop */}
            <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
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
                  <source src={slide.media as string} type="video/mp4" />
                </video>
              ) : (
                <OptimizedImage
                  {...slide.media}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Background Media - Mobile (Distinct Asset Support) */}
            <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
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
                  <source src={slide.mobileMedia as string} type="video/mp4" />
                </video>
              ) : (
                <OptimizedImage
                  {...slide.mobileMedia}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Gradient Overlay - Increased opacity for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            {/* Content - Left Aligned & Width Restricted */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="container mx-auto h-full px-8 md:px-16 lg:px-24 flex items-center">
                <div className="w-full md:w-3/4 xl:w-[50%] pt-10 pointer-events-auto">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg wrap-break-word"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/90 font-light mb-10 tracking-wide uppercase drop-shadow-md"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="px-10 py-3.5 border border-white/50 text-white font-medium text-base hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                  >
                    {slide.cta}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Decorative Wave Element - Using semantic background color */}
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

      {/* --- THUMBNAIL AND CONTROLS SECTION --- */}
      <div className="hidden md:flex absolute right-4 md:right-8 lg:right-12 bottom-48 z-20 flex-col items-end gap-4">
        {/* Thumbnails */}
        <div className="flex flex-row items-end gap-2 md:gap-3 lg:gap-4">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.5 }}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-24 h-40 md:w-28 md:h-48 lg:w-40 lg:h-64 cursor-pointer overflow-hidden transition-all duration-500 ease-out group ${activeIndex === index
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
              <div className="absolute bottom-0 left-0 w-full p-2 md:p-3 bg-linear-to-t from-black/90 to-transparent">
                <p className="text-[10px] md:text-xs text-white/90 font-medium truncate">
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

        {/* Controls - Under Thumbnails */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 pr-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`cursor-pointer h-[3px] transition-all duration-500 rounded-full ${activeIndex === index
                  ? "w-8 md:w-10 lg:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  : "w-4 md:w-5 lg:w-6 bg-white/30 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full
              border border-white/30 text-white backdrop-blur-md
              hover:bg-white hover:text-black hover:scale-110
              transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full
              border border-white/30 text-white backdrop-blur-md
              hover:bg-white hover:text-black hover:scale-110
              transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
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