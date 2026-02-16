import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Loader2,
  Image as ImageIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  PartyPopper,
  Briefcase,
  Sparkles,
  X,
  User,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

// Video Imports
import eventvid1 from "@/assets/video/event&celeb.mp4";
import eventvid2 from "@/assets/video/resturant_event_video.mp4";
import eventvid3 from "@/assets/video/eventVid2.mp4";

// ============================================================================
// DATA & MEDIA LOGIC
// ============================================================================

const MEDIA_RULES = {
  reel: { aspectRatio: "9:16", minHeight: 800, tolerance: 0.15 },
  portrait: { aspectRatio: "4:5", minHeight: 1000, tolerance: 0.1 },
};

const detectBanner = (image) => {
  if (!image?.width || !image?.height) return false;
  const ratio = image.width / image.height;
  return (
    Math.abs(ratio - 9 / 16) <= MEDIA_RULES.reel.tolerance ||
    Math.abs(ratio - 4 / 5) <= MEDIA_RULES.portrait.tolerance
  );
};

const FALLBACK_EVENTS = [
  {
    id: "f1",
    title: "Events & Celebrations",
    locationName: "Kennedia Blu",
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: "Curated experiences for your special moments.",
    ctaText: "Book Now",
    image: {
      url: eventvid1,
      type: "VIDEO",
    },
  },
  {
    id: "f2",
    title: "Live Entertainment",
    locationName: "Kennedia Blu",
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    description: "Vibrant nights with live musical performances.",
    ctaText: "Reserve",
    image: {
      url: eventvid2,
      type: "VIDEO",
    },
  },
  {
    id: "f3",
    title: "Restaurant Event",
    locationName: "Kennedia Blu",
    eventDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    description: "Exclusive culinary journeys and tasting events.",
    ctaText: "Join Us",
    image: {
      url: eventvid3,
      type: "VIDEO",
    },
  },
];

const GROUP_BOOKING_TYPES = [
  {
    id: 1,
    label: "Birthday & Private Parties",
    icon: <PartyPopper size={18} />,
    color: "bg-[#F5E6FF] text-[#8E44AD]",
    borderColor: "border-[#D7BDE2]",
  },
  {
    id: 2,
    label: "Corporate Meetings & Offsites",
    icon: <Briefcase size={18} />,
    color: "bg-[#E3F2FD] text-[#1976D2]",
    borderColor: "border-[#BBDEFB]",
  },
  {
    id: 3,
    label: "Weddings & Receptions",
    icon: <Sparkles size={18} />,
    color: "bg-[#FFF3E0] text-[#E67E22]",
    borderColor: "border-[#FFE0B2]",
  },
];

export default function ResturantpageEvents() {
  const [apiEvents] = useState(FALLBACK_EVENTS);
  const [loading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const openInquiry = (type) => {
    setBookingType(type);
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setShowModal(false);
    toast.success(`Inquiry for ${bookingType} sent! We'll call you back.`);
    setStep(1);
    setFormData({ name: "", email: "", phone: "" });
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <section id="events" className="py-8 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="lg:w-[70%] flex flex-col pt-2">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-serif dark:text-white mb-2">
              Events <span className="italic text-primary">& Celebrations</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light tracking-wide">
              Explore international delicacies curated for every event.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6">
            {apiEvents.slice(0, 2).map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="lg:w-[40%]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="h-full bg-background border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Users size={22} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  Group Booking
                </h3>
              </div>

              <div className="space-y-4 flex-grow">
                {GROUP_BOOKING_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openInquiry(item.label)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border ${item.borderColor} ${item.color} transition-transform hover:scale-[1.02] text-left group`}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    <span className="font-bold text-sm md:text-base tracking-tight">
                      {item.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-dashed border-border">
                <p className="text-xs text-muted-foreground mb-4 italic">
                  Planning a large gathering? Let our experts handle the
                  details.
                </p>
                <button
                  onClick={() => openInquiry("General Celebration")}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- INQUIRY MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-zinc-100 dark:border-white/5"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl dark:text-white">
                      Inquiry: {bookingType}
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">
                      Step {step} of 2
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                {step === 1 ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Your Name"
                          className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91"
                          className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <Button
                      disabled={!formData.name || !formData.phone}
                      onClick={() => setStep(2)}
                      className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-primary transition-all"
                    >
                      Next Step <ChevronRight size={14} className="ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="email@example.com"
                          className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                        Requesting information for a <b>{bookingType}</b>. Our
                        events team will contact you shortly.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="h-14 rounded-xl px-8 dark:text-white"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={isSubmitting || !formData.email}
                        onClick={handleFinalSubmit}
                        className="flex-1 h-14 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            Submit Inquiry <Send size={14} className="ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function EventCard({ event, index }) {
  const isVideo = event.image.type === "VIDEO";
  const isBanner = isVideo || detectBanner(event.image);

  const dateObj = new Date(event.eventDate);
  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group h-[520px] bg-card border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* MEDIA CONTAINER */}
      <div
        className={`relative overflow-hidden ${isBanner ? "flex-1" : "h-[280px]"}`}
      >
        {isVideo ? (
          <video
            src={event.image.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <OptimizedImage
            src={event.image.url}
            alt={event.title}
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
          />
        )}

        {/* Floating Badges - Always Visible */}
        <div className="absolute top-5 left-5 z-30 flex flex-col items-center bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl border border-white/10">
          <span className="text-xl font-black leading-none">{day}</span>
          <span className="text-[10px] font-bold tracking-tighter opacity-80">
            {month}
          </span>
        </div>

        <div className="absolute top-5 right-5 z-30 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1.5">
          <MapPin size={10} /> {event.locationName}
        </div>

        {/* FULL CARD OVERLAY (Info only on Hover) */}
        {isBanner && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-4">
              <div>
                <h3 className="text-white font-serif font-bold text-2xl">
                  {event.title}
                </h3>
                <p className="text-white/70 text-xs italic font-light line-clamp-2 mt-1">
                  {event.description ||
                    "Join us for an exclusive experience curated just for you."}
                </p>
              </div>

              {/* Two Button Format for Banner */}
              <div className="flex gap-2 pb-2">
                <button className="flex-[2] bg-primary text-white py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                  {event.ctaText || "Book Now"}
                </button>
                <button className="flex-1 bg-white/20 backdrop-blur-md text-white py-3 rounded-xl text-[10px] font-bold flex items-center justify-center uppercase tracking-wider border border-white/20 hover:bg-white hover:text-black transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STANDARD CARD BOTTOM (Only for horizontal images) */}
      {!isBanner && (
        <div className="p-6 flex flex-col flex-1 bg-card text-left">
          <h3 className="text-lg font-serif font-bold line-clamp-1 leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2 mb-3">
            <Clock size={12} className="text-primary" />
            <span className="text-[11px] font-medium italic uppercase tracking-tighter">
              Starts 8:00 PM onwards
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {event.description}
          </p>
          <div className="mt-auto pt-4 border-t border-dashed border-border flex items-center gap-2">
            <button className="flex-[2] bg-primary text-white py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-wider">
              {event.ctaText || "Reserve"}
            </button>
            <button className="flex-1 bg-muted text-foreground py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center uppercase tracking-wider">
              Details
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
