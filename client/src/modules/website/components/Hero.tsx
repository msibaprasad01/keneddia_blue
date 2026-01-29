import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { getHeroSectionsPaginated } from "@/Api/Api";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Assets - Fallback
import video1 from "@assets/video/video1.mp4";

// Cache configuration
const CACHE_KEY = "hero_sections_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  data: HeroSlide[];
  timestamp: number;
  hash: string;
}

// Default slides as fallback
const defaultSlides = [
  {
    type: "video" as const,
    media: video1,
    mobileMedia: video1,
    thumbnail: siteContent.images.hero.slide1,
    title: siteContent.text.hero.slides[0].title,
    subtitle: siteContent.text.hero.slides[0].subtitle,
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide2,
    mobileMedia: siteContent.images.hero.slide2,
    thumbnail: siteContent.images.hero.slide2,
    title: siteContent.text.hero.slides[1].title,
    subtitle: siteContent.text.hero.slides[1].subtitle,
    cta: "Explore",
  },
  {
    type: "image" as const,
    media: siteContent.images.hero.slide3,
    mobileMedia: siteContent.images.hero.slide3,
    thumbnail: siteContent.images.hero.slide3,
    title: siteContent.text.hero.slides[2].title,
    subtitle: siteContent.text.hero.slides[2].subtitle,
    cta: "Explore",
  },
];

interface HeroSlide {
  type: "video" | "image";
  media: string | any;
  mobileMedia: string | any;
  thumbnail: string | any;
  title: string;
  subtitle: string;
  cta?: string;
  fallbackMedia?: any;
  fallbackThumbnail?: any;
}

interface ApiHeroItem {
  id: number;
  mainTitle: string;
  subTitle: string;
  ctaText: string;
  backgroundMediaUrl: string;
  backgroundMediaType: "IMAGE" | "VIDEO";
  subMediaUrl: string;
  subMediaType: "IMAGE" | "VIDEO";
  active: boolean;
}

// Generate a hash from the API response to detect changes
const generateDataHash = (items: ApiHeroItem[]): string => {
  return items
    .map((item) => `${item.id}-${item.mainTitle}-${item.backgroundMediaUrl}-${item.subMediaUrl}`)
    .join("|");
};

// Get cached data from sessionStorage
const getCachedData = (): CachedData | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsedCache: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - parsedCache.timestamp < CACHE_DURATION) {
      return parsedCache;
    }

    // Cache expired, remove it
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.warn("Error reading cache:", error);
    return null;
  }
};

// Save data to cache
const setCachedData = (slides: HeroSlide[], hash: string): void => {
  try {
    const cacheData: CachedData = {
      data: slides,
      timestamp: Date.now(),
      hash,
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

// Transform API response to HeroSlide format
const transformApiDataToSlides = (content: ApiHeroItem[]): HeroSlide[] => {
  console.log('Transforming API data:', content);
  
  return content
    .filter((item) => item.active) // Only include active slides
    .map((item, index) => {
      // Determine if background media is video based on backgroundMediaType
      const isBackgroundVideo = item.backgroundMediaType === "VIDEO";

      // Determine thumbnail - use subMedia if it's an image, otherwise use background
      const thumbnailUrl =
        item.subMediaType === "IMAGE" ? item.subMediaUrl : item.backgroundMediaUrl;

      const slide = {
        type: (isBackgroundVideo ? "video" : "image") as "video" | "image",
        media: item.backgroundMediaUrl,
        mobileMedia: item.subMediaUrl || item.backgroundMediaUrl,
        thumbnail: thumbnailUrl,
        title: item.mainTitle || `Discover Amazing Places ${index + 1}`,
        subtitle: item.subTitle || "Book your next experience",
        cta: item.ctaText || "Explore",
        fallbackMedia: defaultSlides[index % defaultSlides.length].media,
        fallbackThumbnail: defaultSlides[index % defaultSlides.length].thumbnail,
      };
      
      console.log(`Transformed slide ${index}:`, {
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
        media: slide.media,
        type: slide.type
      });
      
      return slide;
    });
};

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const isFetchingRef = useRef(false);
  const currentHashRef = useRef<string>("");

  const fetchHeroSection = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate fetches
    if (isFetchingRef.current) return;

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        console.log("Using cached hero data");
        setSlides(cachedData.data);
        currentHashRef.current = cachedData.hash;
        setLoading(false);
        return;
      }
    }

    isFetchingRef.current = true;

    try {
      setLoading(true);

      // Fetch only the first page with 3 items (the latest ones)
      const response = await getHeroSectionsPaginated({ page: 0, size: 3 });
      
      // Handle different response structures:
      // 1. response.data.data.content (wrapped response)
      // 2. response.data.content (direct response)
      // 3. response.content (if axios unwraps)
      const pageData = response.data?.data || response.data || response;
      
      console.log('API Response structure:', response);
      console.log('Page data:', pageData);

      if (pageData?.content && Array.isArray(pageData.content) && pageData.content.length > 0) {
        const apiContent: ApiHeroItem[] = pageData.content;
        
        console.log('API Content items:', apiContent);

        // Generate hash for the new data
        const newHash = generateDataHash(apiContent);

        // Check if data has changed
        if (newHash === currentHashRef.current && slides.length > 0) {
          console.log("Hero data unchanged, skipping update");
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("Loading latest hero sections:", apiContent);

        // Transform API data to slides
        const apiSlides = transformApiDataToSlides(apiContent);

        // Use API slides if we have them
        if (apiSlides.length > 0) {
          // If we have fewer than 3, fill with defaults
          const finalSlides = [...apiSlides];
          while (finalSlides.length < 3) {
            const fallbackIndex = finalSlides.length;
            finalSlides.push({
              ...defaultSlides[fallbackIndex % defaultSlides.length],
              fallbackMedia: defaultSlides[fallbackIndex % defaultSlides.length].media,
              fallbackThumbnail: defaultSlides[fallbackIndex % defaultSlides.length].thumbnail,
            });
          }

          console.log("Final slides loaded:", finalSlides.length);
          setSlides(finalSlides);
          currentHashRef.current = newHash;

          // Cache the data
          setCachedData(finalSlides, newHash);
        } else {
          // No valid API slides, use all defaults
          console.log("No API slides, using defaults");
          const defaultSlidesWithFallback = defaultSlides.map((slide) => ({
            ...slide,
            fallbackMedia: slide.media,
            fallbackThumbnail: slide.thumbnail,
          }));
          setSlides(defaultSlidesWithFallback);
        }
      } else {
        // No data from API, use defaults
        console.log("No content in response, using defaults");
        const defaultSlidesWithFallback = defaultSlides.map((slide) => ({
          ...slide,
          fallbackMedia: slide.media,
          fallbackThumbnail: slide.thumbnail,
        }));
        setSlides(defaultSlidesWithFallback);
      }
    } catch (error) {
      console.error("Error fetching hero section:", error);
      // On error, use defaults
      const defaultSlidesWithFallback = defaultSlides.map((slide) => ({
        ...slide,
        fallbackMedia: slide.media,
        fallbackThumbnail: slide.thumbnail,
      }));
      setSlides(defaultSlidesWithFallback);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [slides.length]);

  useEffect(() => {
    // Clear cache on first mount to ensure fresh data during development
    // You can remove this line in production if you want caching to work
    sessionStorage.removeItem(CACHE_KEY);
    fetchHeroSection();
  }, [fetchHeroSection]);

  const handleImageError = useCallback((url: string) => {
    console.warn("Image/Video failed to load:", url);
    setImageErrors((prev) => new Set(prev).add(url));
  }, []);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (swiperInstance) {
        swiperInstance.slideToLoop(index);
      }
    },
    [swiperInstance]
  );

  const handleScrollToBusiness = useCallback(() => {
    const businessSection = document.getElementById("business");
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const renderMedia = useCallback(
    (slide: HeroSlide, isMobile: boolean = false) => {
      const mediaUrl = isMobile ? slide.mobileMedia : slide.media;
      const shouldUseFallback =
        typeof mediaUrl === "string" && imageErrors.has(mediaUrl);
      const finalMedia = shouldUseFallback ? slide.fallbackMedia : mediaUrl;

      if (slide.type === "video" && typeof finalMedia === "string") {
        return (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            key={finalMedia}
            onError={() => handleImageError(finalMedia)}
          >
            <source src={finalMedia} type="video/mp4" />
          </video>
        );
      }

      if (typeof finalMedia === "string") {
        return (
          <img
            src={finalMedia}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={() => handleImageError(finalMedia)}
          />
        );
      }

      return (
        <OptimizedImage {...finalMedia} className="w-full h-full object-cover" />
      );
    },
    [imageErrors, handleImageError]
  );

  const renderThumbnail = useCallback(
    (slide: HeroSlide) => {
      const thumbnailUrl = slide.thumbnail;
      const shouldUseFallback =
        typeof thumbnailUrl === "string" && imageErrors.has(thumbnailUrl);
      const finalThumbnail = shouldUseFallback
        ? slide.fallbackThumbnail
        : thumbnailUrl;

      if (typeof finalThumbnail === "string") {
        return (
          <img
            src={finalThumbnail}
            alt={slide.subtitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => handleImageError(finalThumbnail)}
          />
        );
      }

      return (
        <OptimizedImage
          {...finalThumbnail}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      );
    },
    [imageErrors, handleImageError]
  );

  // Show loading state
  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-white" />
          <p className="text-white/80 text-lg">Loading hero section...</p>
        </div>
      </section>
    );
  }

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
          <SwiperSlide key={`slide-${index}`} className="relative w-full h-full">
            {/* Background Media - Desktop */}
            <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
              {renderMedia(slide, false)}
            </div>

            {/* Background Media - Mobile (Distinct Asset Support) */}
            <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
              {renderMedia(slide, true)}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="container mx-auto h-full px-8 md:px-16 lg:px-24 flex items-center">
                <div className="w-full md:w-[70%] xl:w-[75%] pointer-events-auto">
                  <motion.h1
                    key={`title-${index}-${slide.title}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg wrap-break-word"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    key={`subtitle-${index}-${slide.subtitle}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/90 font-light mb-10 tracking-wide uppercase drop-shadow-md"
                  >
                    {slide.subtitle}
                  </motion.p>
                  {slide.cta && (
                    <motion.button
                      key={`cta-${index}-${slide.cta}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      onClick={handleScrollToBusiness}
                      className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-gray-900 font-semibold text-sm rounded-full shadow-[0_4px_16px_rgba(251,191,36,0.35)] overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_6px_24px_rgba(251,191,36,0.5)] hover:scale-105 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 border border-amber-300/40"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      <span className="relative z-10">{slide.cta}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 z-10 pointer-events-none">
              <svg viewBox="0 0 1440 320" className="w-full h-full drop-shadow-lg" preserveAspectRatio="none">
                <path className="fill-background" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
              </svg>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop Thumbnails & Controls */}
      <div className="hidden md:flex absolute right-4 md:right-8 lg:right-12 bottom-48 z-20 flex-col items-end gap-4">
        <div className="flex flex-row items-end gap-2 md:gap-3 lg:gap-4">
          {slides.map((slide, index) => (
            <motion.div
              key={`thumbnail-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.5 }}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-[67px] h-28 md:w-[78px] md:h-[134px] lg:w-28 lg:h-[179px] cursor-pointer overflow-hidden transition-all duration-500 ease-out group ${activeIndex === index ? "ring-2 ring-[#FDFBF7] shadow-2xl scale-105 z-10 grayscale-0" : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"}`}
            >
              {renderThumbnail(slide)}
              {slide.type === "video" && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full p-2 md:p-3 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-[10px] md:text-xs text-white/90 font-medium truncate">{slide.subtitle}</p>
              </div>
              <div className={`absolute inset-0 transition-all duration-300 ${activeIndex === index ? "bg-transparent" : "bg-black/20 group-hover:bg-transparent"}`} />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 pr-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            {slides.map((_, index) => (
              <div key={`indicator-${index}`} onClick={() => handleThumbnailClick(index)} className={`cursor-pointer h-[3px] transition-all duration-500 rounded-full ${activeIndex === index ? "w-8 md:w-10 lg:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-4 md:w-5 lg:w-6 bg-white/30 hover:bg-white/60"}`} />
            ))}
          </div>

          <div className="flex gap-2 md:gap-3">
            <button onClick={() => swiperInstance?.slidePrev()} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 cursor-pointer" aria-label="Previous">
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button onClick={() => swiperInstance?.slideNext()} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 cursor-pointer" aria-label="Next">
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button onClick={() => swiperInstance?.slidePrev()} className="w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md cursor-pointer" aria-label="Previous">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <div key={`mobile-indicator-${index}`} onClick={() => handleThumbnailClick(index)} className={`h-0.5 transition-all duration-500 cursor-pointer ${activeIndex === index ? "w-10 bg-[#FDFBF7]" : "w-5 bg-[#FDFBF7]/40"}`} />
          ))}
        </div>

        <button onClick={() => swiperInstance?.slideNext()} className="w-10 h-10 flex items-center justify-center border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-black transition-all duration-300 rounded-full backdrop-blur-md cursor-pointer" aria-label="Next">
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}