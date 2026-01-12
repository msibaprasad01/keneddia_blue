import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

import "swiper/css";

// ============================================================================
// NEWS & PRESS CONFIGURATION - Centralized
// ============================================================================

// Routes
const ROUTES = {
  newsDetail: (slug: string) => `/news/${slug}`,
} as const;

// Styling Configuration
const STYLE_CONFIG = {
  aspectRatio: "4/3" as const,
  navigation: {
    buttonSize: "w-8 h-8",
    iconSize: "w-4 h-4",
  },
} as const;

// Text Content
const TEXT_CONTENT = {
  header: {
    badge: "Updates & Recognition",
    readMore: "Read Story",
    category: "Press",
  },
  aria: {
    previous: "Previous",
    next: "Next",
  },
} as const;

// ============================================================================
// MAIN NEWS PRESS COMPONENT
// ============================================================================

export default function NewsPress() {
  const { news } = siteContent.text;
  const swiperRef = useRef<SwiperType | null>(null);

  if (!news || !news.items || news.items.length === 0) return null;

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
    <section id="news" className="py-12 md:py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Compact Header with Navigation */}
        <SectionHeader
          title={news.title}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        {/* Carousel Container */}
        <NewsCarousel
          items={news.items}
          swiperRef={swiperRef}
        />
      </div>
    </section>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Section Header Component
interface SectionHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
}

function SectionHeader({ title, onPrev, onNext }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
          {TEXT_CONTENT.header.badge}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">
          {title}
        </h2>
      </div>

      {/* Navigation Controls */}
      <NavigationControls onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

// Navigation Controls Component
interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

function NavigationControls({ onPrev, onNext }: NavigationControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onPrev();
        }}
        className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer z-10 relative`}
        aria-label={TEXT_CONTENT.aria.previous}
      >
        <ChevronLeft className={STYLE_CONFIG.navigation.iconSize} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
        className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer z-10 relative`}
        aria-label={TEXT_CONTENT.aria.next}
      >
        <ChevronRight className={STYLE_CONFIG.navigation.iconSize} />
      </button>
    </div>
  );
}

// News Carousel Component
interface NewsCarouselProps {
  items: any[];
  swiperRef: React.MutableRefObject<SwiperType | null>;
}

function NewsCarousel({ items, swiperRef }: NewsCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Calculate if we need to duplicate items for smooth loop
  // We need at least 2x the maximum visible slides for proper looping
  const maxVisibleSlides = 3; // From breakpoint at 1024px
  const needsDuplication = items.length < maxVisibleSlides * 2;

  // Duplicate items if needed for smooth infinite loop
  const displayItems = needsDuplication
    ? [...items, ...items, ...items] // Triple the items for smooth loop
    : items;

  useEffect(() => {
    if (swiperInstance?.autoplay) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        swiperInstance.autoplay.start();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [swiperInstance]);

  return (
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
          waitForTransition: true,
        }}
        loop={true} // Always enable loop
        loopAdditionalSlides={2}
        centeredSlides={false}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setSwiperInstance(swiper);
        }}
        onSlideChange={(swiper) => {
          // Ensure autoplay continues after manual navigation
          if (swiper.autoplay && !swiper.autoplay.running) {
            swiper.autoplay.start();
          }
        }}
        className="w-full news-swiper pb-4"
      >
        {displayItems.map((item, index) => (
          <SwiperSlide key={`news-${item.slug}-${index}`} className="!h-auto">
            <NewsCard item={item} index={index % items.length} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// News Card Component
interface NewsCardProps {
  item: {
    slug: string;
    image: { src: string; alt: string };
    date: string;
    title: string;
    description: string;
  };
  index: number;
}

function NewsCard({ item, index }: NewsCardProps) {
  return (
    <div className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
      {/* Image Section */}
      <div className={`relative aspect-[${STYLE_CONFIG.aspectRatio}] overflow-hidden`}>
        <OptimizedImage
          src={item.image.src}
          alt={item.image.alt}
          priority={index < 3}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Date Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
            {item.date}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Meta */}
        <div className="mb-2 text-xs font-bold text-primary tracking-wider uppercase">
          {TEXT_CONTENT.header.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Link - Pushed to bottom */}
        <div className="mt-auto pt-2 border-t border-border/50">
          <Link to={ROUTES.newsDetail(item.slug)} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors group/link pt-3">
            {TEXT_CONTENT.header.readMore}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}