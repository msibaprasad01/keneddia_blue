import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Loader2, 
  Image as ImageIcon, 
  Clock,
  ExternalLink 
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ============================================================================
// MEDIA DETECTION LOGIC
// ============================================================================

const MEDIA_RULES = {
  reel: { aspectRatio: "9:16", minHeight: 800, tolerance: 0.15 },
  portrait: { aspectRatio: "4:5", minHeight: 1000, tolerance: 0.1 },
};

const detectBanner = (image: any) => {
  if (!image?.width || !image?.height) return false;
  const ratio = image.width / image.height;
  
  const isReel = Math.abs(ratio - (9/16)) <= MEDIA_RULES.reel.tolerance;
  const isPortrait = Math.abs(ratio - (4/5)) <= MEDIA_RULES.portrait.tolerance;
  
  return isReel || isPortrait;
};

// ============================================================================
// FALLBACK DATA
// ============================================================================

const FALLBACK_EVENTS: ApiEvent[] = [
  {
    id: "f1",
    title: "Weekend Jazz Night",
    locationName: "Main Lounge",
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: "Experience soul-stirring jazz performances by international artists.",
    status: "ACTIVE",
    active: true,
    ctaText: "Book Table",
    image: {
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
      type: "IMAGE",
      width: 1080,
      height: 1920 // Reel format
    }
  },
  {
    id: "f2",
    title: "Gourmet Wine Tasting",
    locationName: "The Vineyard Room",
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    description: "An evening of fine wines paired with artisanal cheeses.",
    status: "ACTIVE",
    active: true,
    ctaText: "Get Tickets",
    image: {
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800",
      type: "IMAGE",
      width: 800,
      height: 600 // Landscape format
    }
  },
  {
    id: "f3",
    title: "Salsa Fusion Workshop",
    locationName: "Grand Ballroom",
    eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    description: "Learn the rhythm of Salsa with a modern fusion twist.",
    status: "ACTIVE",
    active: true,
    ctaText: "Join Now",
    image: {
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800",
      type: "IMAGE",
      width: 1080,
      height: 1350 // Portrait format
    }
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ResturantpageEvents() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [apiEvents] = useState<ApiEvent[]>(FALLBACK_EVENTS);
  const [loading] = useState(false);

  if (loading) return (
    <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
  );

  return (
    <section id="events" className="py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Upcoming Events</h2>
            <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => swiper?.slidePrev()} className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => swiper?.slideNext()} className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onSwiper={setSwiper}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-12"
        >
          {apiEvents.map((event, index) => (
            <SwiperSlide key={event.id}>
              <EventCard event={event} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: ApiEvent; index: number }) {
  const isBanner = detectBanner(event.image);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    };
  };

  const { day, month } = formatDate(event.eventDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group h-[520px] bg-card border rounded-2xl overflow-hidden flex flex-col shadow-sm relative transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Media Container */}
      <div className={`relative overflow-hidden ${isBanner ? "flex-1" : "h-[280px]"}`}>
        {event.image?.url ? (
          event.image.type === "VIDEO" ? (
            <video
              src={event.image.url}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              autoPlay loop muted playsInline
            />
          ) : (
            <OptimizedImage
              src={event.image.url}
              alt={event.title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg flex flex-col items-center border border-white/10 shadow-xl">
            <span className="text-lg font-black leading-none">{day}</span>
            <span className="text-[9px] font-bold tracking-tighter">{month}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <div className="bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
             <MapPin size={10} /> {event.locationName}
          </div>
        </div>

        {/* Overlay for Banner Mode (Reel/Portrait) */}
        {isBanner && (
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-gradient-to-t from-black via-black/60 to-transparent pt-20 z-20">
            <h3 className="text-white font-serif font-bold text-xl mb-2 leading-tight">
              {event.title}
            </h3>
            <p className="text-white/80 text-xs mb-6 line-clamp-2 italic">
              {event.description}
            </p>
            <Link
              to="#"
              className="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95"
            >
              {event.ctaText} <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Content for Landscape Mode (Standard Card) */}
      {!isBanner && (
        <div className="p-6 flex flex-col flex-1 bg-card">
          <h3 className="text-lg font-serif font-bold line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2 mb-3">
             <Clock size={12} className="text-primary" />
             <span className="text-[11px] font-medium italic uppercase tracking-tighter">Starts 8:00 PM onwards</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-auto pt-4 border-t border-dashed border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Entry Detail</span>
              <span className="text-xs font-black text-foreground">Free for Guests</span>
            </div>
            <Link
              to="#"
              className="bg-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm active:scale-90"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// INTERFACES
// ============================================================================

interface ApiEvent {
  id: number | string;
  title: string;
  locationName: string;
  eventDate: string;
  description: string;
  status: "ACTIVE" | "COMING_SOON" | "SOLD_OUT";
  active: boolean;
  image?: {
    mediaId?: number;
    type?: "IMAGE" | "VIDEO";
    url: string;
    width?: number;
    height?: number;
  } | null;
  ctaText: string;
}