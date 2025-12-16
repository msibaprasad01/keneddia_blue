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

// ============================================================================
// NEWS & PRESS CONFIGURATION - Centralized
// ============================================================================

// Routes
const ROUTES = {
  newsDetail: (slug: string) => `/#`,
} as const;

// Swiper Configuration
const SWIPER_CONFIG = {
  modules: [EffectFade, Autoplay, Navigation],
  effect: "fade" as const,
  speed: 800,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  loop: true,
} as const;

// Styling Configuration
const STYLE_CONFIG = {
  aspectRatios: {
    mobile: "4/3" as const,
    desktop: "3/2" as const,
  },
  navigation: {
    buttonSize: "w-9 h-9",
    iconSize: "w-4 h-4",
  },
  indicator: {
    active: "w-8 bg-primary",
    inactive: "w-4 bg-primary/30 hover:bg-primary/50",
    height: "h-1",
  },
} as const;

// Text Content
const TEXT_CONTENT = {
  header: {
    badge: "Updates & Recognition",
    readMore: "Read Full Story",
    category: "Press",
  },
  aria: {
    previous: "Previous",
    next: "Next",
    slidePrefix: "Go to slide ",
  },
} as const;

// Custom Styles for Swiper
const SWIPER_CUSTOM_STYLES = `
  .news-swiper .swiper-slide {
    opacity: 0 !important;
    pointer-events: none;
  }
  .news-swiper .swiper-slide-active {
    opacity: 1 !important;
    pointer-events: auto;
  }
`;

// ============================================================================
// MAIN NEWS PRESS COMPONENT
// ============================================================================

export default function NewsPress() {
  const { news } = siteContent.text;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!news || !news.items || news.items.length === 0) return null;

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();
  const handleSlideChange = (swiper: SwiperType) => setActiveIndex(swiper.realIndex);
  const handleGoToSlide = (index: number) => swiperInstance?.slideToLoop(index);

  return (
    <section id="news" className="py-12 md:py-16 bg-background relative overflow-hidden">
      <style>{SWIPER_CUSTOM_STYLES}</style>
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
          activeIndex={activeIndex}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          onGoToSlide={handleGoToSlide}
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
        onClick={onPrev}
        className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer`}
        aria-label={TEXT_CONTENT.aria.previous}
      >
        <ChevronLeft className={STYLE_CONFIG.navigation.iconSize} />
      </button>
      <button
        onClick={onNext}
        className={`${STYLE_CONFIG.navigation.buttonSize} rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer`}
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
  activeIndex: number;
  onSwiper: (swiper: SwiperType) => void;
  onSlideChange: (swiper: SwiperType) => void;
  onGoToSlide: (index: number) => void;
}

function NewsCarousel({ items, activeIndex, onSwiper, onSlideChange, onGoToSlide }: NewsCarouselProps) {
  return (
    <div className="relative">
      <Swiper
        modules={SWIPER_CONFIG.modules}
        effect={SWIPER_CONFIG.effect}
        speed={SWIPER_CONFIG.speed}
        autoplay={SWIPER_CONFIG.autoplay}
        loop={items.length > 1}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        className="w-full news-swiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.slug} className="!flex">
            <NewsSlide item={item} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide Indicators - Outside carousel for better positioning */}
      <SlideIndicators
        items={items}
        activeIndex={activeIndex}
        onGoToSlide={onGoToSlide}
      />
    </div>
  );
}

// News Slide Component
interface NewsSlideProps {
  item: {
    slug: string;
    image: { src: string; alt: string };
    date: string;
    title: string;
    description: string;
  };
  index: number;
}

function NewsSlide({ item, index }: NewsSlideProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
      {/* Image Section */}
      <NewsImage
        src={item.image.src}
        alt={item.image.alt}
        priority={index === 0}
      />

      {/* Content Section */}
      <NewsContent
        date={item.date}
        title={item.title}
        description={item.description}
        slug={item.slug}
      />
    </div>
  );
}

// News Image Component
interface NewsImageProps {
  src: string;
  alt: string;
  priority: boolean;
}

function NewsImage({ src, alt, priority }: NewsImageProps) {
  return (
    <div className={`relative aspect-[${STYLE_CONFIG.aspectRatios.mobile}] lg:aspect-[${STYLE_CONFIG.aspectRatios.desktop}] overflow-hidden rounded-lg`}>
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        className="w-full h-full object-cover"
      />
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

// News Content Component
interface NewsContentProps {
  date: string;
  title: string;
  description: string;
  slug: string;
}

function NewsContent({ date, title, description, slug }: NewsContentProps) {
  return (
    <div className="flex flex-col justify-center lg:pl-4">
      {/* Meta */}
      <NewsMeta date={date} />

      {/* Title */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-4 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
        {description}
      </p>

      {/* Link */}
      <NewsLink slug={slug} />
    </div>
  );
}

// News Meta Component
function NewsMeta({ date }: { date: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-xs text-primary">
      <span className="font-medium">{date}</span>
      <span className="w-1 h-1 bg-primary rounded-full" />
      <span className="uppercase tracking-wider font-semibold">
        {TEXT_CONTENT.header.category}
      </span>
    </div>
  );
}

// News Link Component
function NewsLink({ slug }: { slug: string }) {
  return (
    <Link href={ROUTES.newsDetail(slug)}>
      <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group">
        {TEXT_CONTENT.header.readMore}
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </Link>
  );
}

// Slide Indicators Component
interface SlideIndicatorsProps {
  items: any[];
  activeIndex: number;
  onGoToSlide: (index: number) => void;
}

function SlideIndicators({ items, activeIndex, onGoToSlide }: SlideIndicatorsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0">
      {items.map((_, idx) => (
        <button
          key={idx}
          onClick={() => onGoToSlide(idx)}
          className={`${STYLE_CONFIG.indicator.height} rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
            ? STYLE_CONFIG.indicator.active
            : STYLE_CONFIG.indicator.inactive
            }`}
          aria-label={`${TEXT_CONTENT.aria.slidePrefix}${idx + 1}`}
        />
      ))}
    </div>
  );
}