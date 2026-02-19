import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { siteContent } from "@/data/siteContent";

// ── Types ──────────────────────────────────────────────────────────────────
interface MediaItem {
  mediaId: number;
  type: "IMAGE" | "VIDEO";
  url: string;
  fileName: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface HeroSlide {
  id: number;
  type: "video" | "image";
  media: string;
  title: string;
  subtitle: string;
  backgroundAll: MediaItem[];
  backgroundLight: MediaItem[];
  backgroundDark: MediaItem[];
}

interface HotelHeroSectionProps {
  slides: HeroSlide[];
  loading: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const getCurrentTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const selectMediaByTheme = (
  theme: "light" | "dark",
  all: MediaItem[],
  light: MediaItem[],
  dark: MediaItem[],
): MediaItem | null => {
  if (theme === "dark") {
    if (dark?.length > 0) return dark[0];
    if (all?.length > 0) return all[0];
    if (light?.length > 0) return light[0];
  } else {
    if (light?.length > 0) return light[0];
    if (all?.length > 0) return all[0];
    if (dark?.length > 0) return dark[0];
  }
  return null;
};

// ── Component ──────────────────────────────────────────────────────────────
export default function HotelHeroSection({
  slides,
  loading,
}: HotelHeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    getCurrentTheme(),
  );
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides]);

  // Theme observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = getCurrentTheme();
      setCurrentTheme((prev) => (prev !== newTheme ? newTheme : prev));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleImageError = useCallback((url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
  }, []);

  const getCurrentMedia = useCallback(
    (slide: HeroSlide) => {
      const media = selectMediaByTheme(
        currentTheme,
        slide.backgroundAll,
        slide.backgroundLight,
        slide.backgroundDark,
      );
      return {
        type: media?.type === "VIDEO" ? "video" : "image",
        url: media?.url || "",
      };
    },
    [currentTheme],
  );

  const renderMedia = useCallback(
    (slide: HeroSlide) => {
      const { type, url } = getCurrentMedia(slide);

      if (type === "video") {
        return (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            key={url}
            onError={() => handleImageError(url)}
          >
            <source src={url} type="video/mp4" />
          </video>
        );
      }

      return (
        <img
          src={url}
          alt={slide.title}
          className="w-full h-full object-cover"
          onError={() => handleImageError(url)}
        />
      );
    },
    [getCurrentMedia, imageErrors, handleImageError],
  );

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-white" />
            <p className="text-white text-sm font-medium">
              Loading hero section...
            </p>
          </div>
        </div>
      )}

      {/* Slides */}
      {!loading && slides.length > 0 && (
        <>
          {/* Background media */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slides[currentIndex]?.id}-${currentTheme}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {renderMedia(slides[currentIndex])}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Title + subtitle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-5xl font-serif text-white mb-6 uppercase tracking-wider drop-shadow-2xl"
            >
              {slides[currentIndex]?.title || ""}
            </motion.h1>

            <motion.p
              key={`subtitle-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 font-light max-w-2xl drop-shadow-lg"
            >
              {slides[currentIndex]?.subtitle || ""}
            </motion.p>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
