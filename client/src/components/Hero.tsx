import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Assets
import hero1 from "@assets/generated_images/luxury_hotel_exterior_at_twilight.png";
import hero2 from "@assets/generated_images/luxury_hotel_lobby_interior.png";
import hero3 from "@assets/generated_images/exclusive_rooftop_lounge_at_night.png";
import video1 from "@assets/video/video1.mp4";

const slides = [
  {
    type: "video" as const,
    media: video1,
    thumbnail: hero1, // For thumbnail preview
    title: "A Legacy of Global Hospitality",
    subtitle: "Kennedia Groups",
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: hero2,
    thumbnail: hero2,
    title: "Where Luxury Meets Experience",
    subtitle: "Kennedia Groups",
    cta: "Know More",
  },
  {
    type: "image" as const,
    media: hero3,
    thumbnail: hero3,
    title: "Built on Passion and Purpose",
    subtitle: "Kennedia Groups",
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
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Background Media - Video or Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slide.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={slide.media} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.media}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Dark Overlay - Adjusted for better text contrast */}
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content - Left Aligned */}
            <div className="absolute inset-0 z-10">
              <div className="container mx-auto h-full px-8 md:px-16 lg:px-24 flex items-center">
                <div className="max-w-3xl pt-20">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-[#FDFBF7] mb-6 leading-[1.1] tracking-tight"
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

            {/* Decorative Wave Element - Glass/Cream Style */}
            <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 z-5 pointer-events-none">
              <svg
                viewBox="0 0 1440 320"
                className="w-full h-full drop-shadow-lg"
                preserveAspectRatio="none"
              >
                <path
                  fill="rgba(253, 251, 247, 0.75)"
                  style={{ backdropFilter: "blur(8px)" }}
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Preview */}
      <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 z-20 flex-col gap-5">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + 0.5 }}
            onClick={() => handleThumbnailClick(index)}
            className={`relative w-56 h-36 cursor-pointer overflow-hidden transition-all duration-500 ${
              activeIndex === index
                ? "ring-2 ring-[#FDFBF7] shadow-2xl shadow-black/50 grayscale-0"
                : "ring-1 ring-white/10 hover:ring-white/30 opacity-50 hover:opacity-80 grayscale"
            }`}
          >
            <img
              src={slide.thumbnail}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Video indicator for first slide */}
            {slide.type === "video" && (
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            )}
            {/* Overlay */}
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                activeIndex === index
                  ? "bg-transparent"
                  : "bg-black/40 hover:bg-black/20"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Progress Bars & Navigation */}
      <div className="hidden xl:flex absolute bottom-20 right-12 z-20 items-center gap-8">
        {/* Progress Indicators */}
        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`
          cursor-pointer rounded-full transition-all duration-500 ease-out
          ${
            activeIndex === index
              ? "w-20 h-[5px] bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
              : "w-10 h-[3px] bg-white/30 hover:bg-white/50 hover:w-14"
          }
        `}
            />
          ))}
        </div>

        {/* Prev Button */}
        <button
          className="custom-prev w-12 h-12 flex items-center justify-center rounded-full
      border border-white/30 text-white backdrop-blur-md
      hover:bg-white hover:text-black hover:scale-110
      transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Next Button */}
        <button
          className="custom-next w-12 h-12 flex items-center justify-center rounded-full
      border border-white/30 text-white backdrop-blur-md
      hover:bg-white hover:text-black hover:scale-110
      transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="xl:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button className="custom-prev w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-0.5 transition-all duration-500 cursor-pointer ${
                activeIndex === index
                  ? "w-10 bg-[#FDFBF7]"
                  : "w-5 bg-[#FDFBF7]/40"
              }`}
            />
          ))}
        </div>

        <button className="custom-next w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md">
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}