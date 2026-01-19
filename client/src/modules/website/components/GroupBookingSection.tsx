import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Users, PartyPopper, ArrowRight, ChevronRight, Check, Calendar, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { siteContent } from "@/data/siteContent";
import { CITIES, HOTELS_DATA, Hotel } from "@/data/hotelsData";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CELEBRATION_OFFERS = [
  {
    id: "birthday",
    title: "Birthday & Private Parties",
    icon: PartyPopper,
    image: siteContent.images.hotels.mumbai,
    description: "Celebrate in style with custom decor, curated menus, and exclusive venues for your private moments.",
    tag: "Custom Packages"
  },
  {
    id: "corporate",
    title: "Corporate Meetings & Offsites",
    icon: Users,
    image: siteContent.images.hotels.hyderabad,
    description: "State-of-the-art conference rooms and team-building activities designed for productivity and connection.",
    tag: "Business Ready"
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "International Wine Festival",
    date: "25th Oct 2024",
    location: "Kennedia Blu Mumbai",
    image: siteContent.images.bars.lounge,
    price: "₹2,500 onwards",
    badge: "Early Bird"
  },
  {
    id: 2,
    title: "Sufi Night with Live Band",
    date: "2nd Nov 2024",
    location: "Kennedia Blu Delhi",
    image: siteContent.images.bars.poolside,
    price: "Entry Free for Guests",
    badge: "Exclusive"
  },
  {
    id: 3,
    title: "Global Culinary Summit",
    date: "15th Nov 2024",
    location: "Kennedia Blu Bengaluru",
    image: siteContent.images.cafes.parisian,
    price: "Registration Required",
    badge: "Networking"
  }
];

export default function GroupBookingSection() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<typeof CELEBRATION_OFFERS[0] | null>(null);
  const [step, setStep] = useState(1);

  // Wizard State
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleOpen = (offer: typeof CELEBRATION_OFFERS[0]) => {
    setSelectedOffer(offer);
    setStep(1);
    setCity("");
    setHotel(null);
    setDate(undefined);
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinish = () => {
    if (!selectedOffer || !hotel) return;

    const params = new URLSearchParams();
    params.append("type", selectedOffer.id);
    params.append("hotel", hotel.name);
    params.append("location", hotel.city);
    if (date) params.append("checkIn", date.toISOString());

    navigate(`/checkout?${params.toString()}`);
  };

  const filteredHotels = city ? HOTELS_DATA.filter(h => h.city === city) : [];

  return (
    <section className="py-16 bg-background space-y-16">

      {/* 1. Celebrations Container (2 Sliding Boxes) */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Celebrations & Groups</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated experiences for your most important gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CELEBRATION_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="group relative h-[400px] overflow-hidden rounded-2xl shadow-xl cursor-pointer"
              onClick={() => handleOpen(offer)}
            >
              <OptimizedImage
                {...offer.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-wide">
                  {offer.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <offer.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {offer.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-2 max-w-md">
                  {offer.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  Plan Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Upcoming Events Slider */}
      <div className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-serif font-semibold">Upcoming Events</h3>
              <p className="text-muted-foreground text-sm">Join us for exclusive experiences</p>
            </div>
            <Button variant="outline" className="hidden md:flex">View All Events</Button>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="pb-8"
          >
            {UPCOMING_EVENTS.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage {...event.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold shadow-sm uppercase tracking-wide text-foreground">
                      {event.badge}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {event.date}
                    </span>
                    <h4 className="font-serif text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {event.location}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-semibold">{event.price}</span>
                      <Button size="sm" variant="secondary" className="h-8 text-xs">RSVP</Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Booking Wizard Modal */}
      <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border/20">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl flex items-center gap-3">
                {selectedOffer?.icon && <selectedOffer.icon className="w-6 h-6 text-primary" />}
                {selectedOffer?.title}
              </DialogTitle>
              <DialogDescription>
                Plan your event in 3 simple steps.
              </DialogDescription>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex gap-2 mt-4 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("h-1 flex-1 rounded-full", step >= i ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 min-h-[300px]">
            {/* STEP 1: CITY */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg">Select a Destination</h3>
                <div className="grid grid-cols-2 gap-3">
                  {CITIES.map(c => (
                    <div
                      key={c}
                      onClick={() => setCity(c)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 flex items-center justify-between",
                        city === c ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                      )}
                    >
                      <span>{c}</span>
                      {city === c && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: HOTEL */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg">Select a Venue in {city}</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredHotels.length > 0 ? filteredHotels.map(h => (
                    <div
                      key={h.id}
                      onClick={() => setHotel(h)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 flex items-start gap-3",
                        hotel?.id === h.id ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                      )}
                    >
                      <div className="w-16 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                        <OptimizedImage {...h.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{h.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{h.description}</p>
                      </div>
                      {hotel?.id === h.id && <Check className="w-4 h-4 text-primary mt-1" />}
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm">No venues available in this city.</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: DATE */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                <h3 className="font-medium text-lg self-start">Select Event Date</h3>
                <div className="border rounded-lg p-3 bg-card/50">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    initialFocus
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext} disabled={step === 1 ? !city : !hotel}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!date}>
                Proceed to Checkout
              </Button>
            )}
          </div>

        </DialogContent>
      </Dialog>
    </section>
  );
}
