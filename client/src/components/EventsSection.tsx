import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

// ============================================================================
// EVENTS SECTION CONFIGURATION - Centralized
// ============================================================================

// Routes
const ROUTES = {
  allEvents: "/events",
  eventDetail: (slug: string) => `/events/${slug}`,
} as const;

// Animation Configuration
const ANIMATION_CONFIG = {
  card: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    staggerDelay: 0.08,
    duration: 0.4,
  },
  hover: {
    scale: 1.05,
    duration: 0.7,
  },
} as const;

// Styling Configuration
const STYLE_CONFIG = {
  aspectRatio: "4/3.5" as const,
  gridGap: "gap-5",
  cardRadius: "rounded-xl",
} as const;

// ============================================================================
// MAIN EVENTS SECTION COMPONENT
// ============================================================================

export default function EventsSection() {
  const { events } = siteContent.text;

  if (!events) return null;

  return (
    <section id="events" className="py-12 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Compact Header */}
        <SectionHeader title={events.title} viewAllLink={ROUTES.allEvents} />

        {/* Compact Staggered Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${STYLE_CONFIG.gridGap}`}>
          {events.items.map((event, index) => (
            <EventCard
              key={event.slug}
              event={event}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Section Header Component
function SectionHeader({ title, viewAllLink }: { title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <div className="h-0.5 w-16 bg-primary" />
      </div>
      <Link href={viewAllLink}>
        <a className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
          All Events
          <ArrowRight className="w-4 h-4" />
        </a>
      </Link>
    </div>
  );
}

// Event Card Component
interface EventCardProps {
  event: {
    slug: string;
    image: { src: string; alt: string };
    date: string;
    title: string;
    description: string;
  };
  index: number;
}

function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={ANIMATION_CONFIG.card.initial}
      whileInView={ANIMATION_CONFIG.card.whileInView}
      viewport={ANIMATION_CONFIG.card.viewport}
      transition={{
        delay: index * ANIMATION_CONFIG.card.staggerDelay,
        duration: ANIMATION_CONFIG.card.duration
      }}
      className="group relative"
    >
      <Link href={ROUTES.eventDetail(event.slug)}>
        <a className="block">
          <EventCardContent event={event} />
        </a>
      </Link>
    </motion.div>
  );
}

// Event Card Content Component
function EventCardContent({ event }: { event: EventCardProps['event'] }) {
  return (
    <div className={`relative aspect-[${STYLE_CONFIG.aspectRatio}] ${STYLE_CONFIG.cardRadius} overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500`}>
      {/* Background Image */}
      <EventCardImage src={event.image.src} alt={event.image.alt} />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Date Badge */}
      <EventDateBadge date={event.date} />

      {/* Content - Bottom Overlay */}
      <EventCardDetails
        title={event.title}
        description={event.description}
      />
    </div>
  );
}

// Event Card Image Component
function EventCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={false}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

// Event Date Badge Component
function EventDateBadge({ date }: { date: string }) {
  return (
    <div className="absolute top-3 right-3 bg-primary shadow-xl border border-white/20">
      <div className="flex items-center gap-1.5 px-3 py-1.5">
        <Calendar className="w-3.5 h-3.5 text-white" />
        <span className="text-xs font-bold text-white uppercase tracking-wide">
          {date}
        </span>
      </div>
    </div>
  );
}

// Event Card Details Component
function EventCardDetails({ title, description }: { title: string; description: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3 className="text-lg font-bold mb-1.5 line-clamp-2 group-hover:text-primary transition-colors drop-shadow-lg">
        {title}
      </h3>
      <p className="text-xs text-white/90 mb-3 line-clamp-2 leading-relaxed drop-shadow-md">
        {description}
      </p>

      {/* View Details Link */}
      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
        Details
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  );
}