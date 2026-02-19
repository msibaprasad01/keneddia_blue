import { useState, useEffect, useRef } from "react";
import {
  Users,
  Sparkles,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  ArrowRight,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Calendar from "@/components/ui/calendar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getEventsUpdated, getGroupBookings } from "@/Api/Api";

/* ================= TYPES ================= */
type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: number;
  title: string;
  locationName: string;
  eventDate: string;
  description: string;
  status: "ACTIVE" | "COMING_SOON" | "SOLD_OUT";
  ctaText: string;
  ctaLink: string | null;
  image?: {
    type?: "IMAGE" | "VIDEO";
    url: string;
    width?: number | null;
    height?: number | null;
    fileName?: string | null;
    alt?: string | null;
  } | null;
  typeName: string;
  active: boolean;
}

interface GroupBooking {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  media: { mediaId: number; type: string; url: string }[];
}

/* ================= HELPERS ================= */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
};

const CARD_COLORS = [
  "bg-pink-50 border-pink-200 hover:border-pink-300",
  "bg-blue-50 border-blue-200 hover:border-blue-300",
  "bg-orange-50 border-orange-200 hover:border-orange-300",
  "bg-purple-50 border-purple-200 hover:border-purple-300",
  "bg-green-50 border-green-200 hover:border-green-300",
];

/* ================= EVENT CARD — identical structure to EventsSection ================= */
function EventCard({ event, index }: { event: Event; index: number }) {
  const [isBanner, setIsBanner] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo =
    event.image?.type === "VIDEO" || event.image?.url?.includes(".mp4");

  const analyzeMediaSize = (w: number, h: number) => {
    if (w / h <= 0.85) setIsBanner(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const { day, month } = formatDate(event.eventDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group h-[440px] bg-card border rounded-2xl overflow-hidden flex flex-col shadow-sm relative transition-all duration-500 hover:shadow-xl cursor-pointer"
    >
      {/* Media Container */}
      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          isBanner ? "h-full" : "h-[220px]"
        }`}
      >
        {event.image?.url ? (
          isVideo ? (
            <>
              <video
                ref={videoRef}
                src={event.image.url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
                onLoadedMetadata={(e) =>
                  analyzeMediaSize(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
                }
              />
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <img
              src={event.image.url}
              alt={event.image.alt || event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onLoad={(e) =>
                analyzeMediaSize(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
              }
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-center bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg border border-white/10">
          <span className="text-lg font-black leading-none">{day}</span>
          <span className="text-[9px] font-bold tracking-tighter">{month}</span>
        </div>

        {/* Location Badge */}
        <div className="absolute top-4 right-4 z-20 bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
          <MapPin size={10} /> {event.locationName}
        </div>

        {/* Banner Hover Overlay */}
        {isBanner && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <h3 className="text-white font-serif font-bold text-xl mb-2 drop-shadow-md">
              {event.title}
            </h3>
            <p className="text-white/80 text-xs mb-6 line-clamp-2 italic drop-shadow-sm">
              {event.description}
            </p>
            {event.ctaText?.trim() && (
              <a
                href={event.ctaLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white py-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95 transition-transform"
              >
                {event.ctaText} <ArrowRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Standard Mode Content */}
      {!isBanner && (
        <div className="p-6 flex flex-col flex-1 bg-card">
          <h3 className="text-lg font-serif font-bold line-clamp-1 leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2 mb-3">
            <MapPin size={12} className="text-primary" />
            <span className="text-[11px] font-medium italic uppercase">
              {event.locationName}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {event.description}
          </p>
          {event.ctaText?.trim() && (
            <div className="mt-auto pt-4 border-t border-dashed border-border">
              <a
                href={event.ctaLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-white py-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95 transition-transform hover:opacity-90"
              >
                {event.ctaText} <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function GroupBookingSection() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<GroupBooking | null>(null);
  const [step, setStep] = useState(1);
  const [dateRange, setDateRange] = useState<CalendarValue>(null);

  // Fetch events — Hotel type + ACTIVE + active only
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEventsUpdated();
        const raw = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        setEvents(
          raw
            .filter(
              (e: Event) =>
                e.typeName === "Hotel" &&
                e.status === "ACTIVE" &&
                e.active === true,
            )
            .sort(
              (a: Event, b: Event) =>
                new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
            ),
        );
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch group bookings
  useEffect(() => {
    const fetchGroupBookings = async () => {
      try {
        const res = await getGroupBookings();
        setGroupBookings(res?.data || []);
      } catch (err) {
        console.error("Error fetching group bookings:", err);
      }
    };
    fetchGroupBookings();
  }, []);

  const handleOpenBooking = (booking: GroupBooking) => {
    setSelectedOffer(booking);
    setStep(1);
    setDateRange(null);
  };

  return (
    <section className="py-10 bg-background">
      <div className="w-[92%] max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2">
            Events & Celebrations
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Discover upcoming experiences and plan your special gatherings
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: EVENTS */}
          <div className="lg:col-span-8">
            <div className="bg-card border rounded-2xl p-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Upcoming Events
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => swiper?.slidePrev()}
                    className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => swiper?.slideNext()}
                    className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-primary w-7 h-7" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No upcoming hotel events available at the moment.
                </div>
              ) : (
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  autoplay={{ delay: 5000, disableOnInteraction: false,pauseOnMouseEnter: true }}
                  pagination={{ clickable: true }}
                  onSwiper={setSwiper}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="!pb-10"
                >
                  {events.map((event, index) => (
                    <SwiperSlide key={event.id}>
                      <EventCard event={event} index={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* RIGHT: GROUP BOOKINGS */}
          <div className="lg:col-span-4">
            <div className="border rounded-2xl p-5 h-full">
              <h3 className="text-xl font-serif font-semibold mb-4 flex gap-2">
                <Users className="w-5 h-5 text-primary" />
                Group Booking
              </h3>

              {groupBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No group booking options available.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupBookings.map((booking, index) => {
                    const img = booking.media?.[0]?.url;
                    const hasCtaLink = !!(booking.ctaLink && booking.ctaLink.trim());
                    const colorCls = CARD_COLORS[index % CARD_COLORS.length];

                    return (
                      <div
                        key={booking.id}
                        onClick={() => handleOpenBooking(booking)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${colorCls}`}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={booking.title}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {booking.title}
                          </p>
                          {booking.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {booking.description}
                            </p>
                          )}
                          {hasCtaLink && (
                            <a
                              href={booking.ctaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary mt-1 hover:underline"
                            >
                              {booking.ctaText || "Learn More"} <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selectedOffer?.title}</DialogTitle>
            <DialogDescription>Select your preferred event dates.</DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <Calendar selectRange value={dateRange} onChange={setDateRange} />
              <p className="text-xs text-muted-foreground">*Select start and end date</p>
            </div>
          )}

          {step === 2 && (
            <div className="py-8 text-center space-y-2">
              <p className="text-lg font-semibold text-green-600">Enquiry Sent!</p>
              <p className="text-sm text-muted-foreground">We'll get back to you shortly.</p>
            </div>
          )}

          {step < 2 && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]}
              >
                Send Enquiry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}