import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, PartyPopper, ArrowRight, ChevronRight, Check, Calendar, MapPin, Sparkles, Phone, MessageCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { siteContent } from "@/data/siteContent";
import { CITIES, HOTELS_DATA, Hotel } from "@/data/hotelsData";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Group Booking Options
const GROUP_BOOKING_OPTIONS = [
  {
    id: "birthday",
    title: "Birthday & Private Parties",
    icon: PartyPopper,
    description: "Celebrate in style with custom decor and curated menus.",
    color: "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30"
  },
  {
    id: "corporate",
    title: "Corporate Meetings & Offsites",
    icon: Users,
    description: "State-of-the-art venues for productivity and connection.",
    color: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30"
  },
  {
    id: "wedding",
    title: "Weddings & Receptions",
    icon: Sparkles,
    description: "Make your special day unforgettable with our premium venues.",
    color: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30"
  }
];

// Upcoming Events Data
const UPCOMING_EVENTS = [
  [
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
      image: siteContent.images.bars.rooftop,
      price: "Entry Free for Guests",
      badge: "Exclusive"
    }
  ],
  [
    {
      id: 3,
      title: "Global Culinary Summit",
      date: "15th Nov 2024",
      location: "Kennedia Blu Bengaluru",
      image: siteContent.images.cafes.parisian,
      price: "Registration Required",
      badge: "Networking"
    },
    {
      id: 4,
      title: "Jazz & Blues Evening",
      date: "20th Nov 2024",
      location: "Kennedia Blu Mumbai",
      image: siteContent.images.bars.rooftop,
      price: "₹1,500 per person",
      badge: "Live Music"
    }
  ],
  [
    {
      id: 5,
      title: "New Year Gala Dinner",
      date: "31st Dec 2024",
      location: "All Kennedia Locations",
      image: siteContent.images.hotels.bengaluru,
      price: "From ₹15,000",
      badge: "Popular"
    },
    {
      id: 6,
      title: "Wine & Cheese Tasting",
      date: "10th Jan 2025",
      location: "Kennedia Blu Hyderabad",
      image: siteContent.images.hotels.mumbai,
      price: "₹3,500 per person",
      badge: "Limited"
    }
  ]
];

export default function GroupBookingSection() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<{ id: string; title: string; icon: any } | null>(null);
  const [step, setStep] = useState(1);

  // Wizard State
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleOpenBooking = (option: typeof GROUP_BOOKING_OPTIONS[0]) => {
    setSelectedOffer({ id: option.id, title: option.title, icon: option.icon });
    setStep(1);
    setCity("");
    setHotel(null);
    setDateRange(undefined);
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinish = () => {
    // Show Success Step instead of Navigation
    setStep(4);
  };

  const filteredHotels = city ? HOTELS_DATA.filter(h => h.city === city) : [];

  return (
    <section className="py-10 bg-background">
      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2">Events & Celebrations</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Discover upcoming experiences and plan your special gatherings
          </p>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDE: Upcoming Events Carousel (70%) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-serif font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Upcoming Events
                </h3>
                <p className="text-xs text-muted-foreground">
                  Exclusive experiences across our properties
                </p>
              </div>

              {/* Events Carousel */}
              <div className="relative">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  pagination={{
                    clickable: true,
                    el: '.events-pagination',
                  }}
                  loop={true}
                  speed={600}
                  className="events-carousel"
                >
                  {UPCOMING_EVENTS.map((eventPair, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventPair.map((event) => (
                          <div
                            key={event.id}
                            className="group bg-background border border-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
                          >
                            {/* Event Image or Video */}
                            <div className="relative h-[160px] overflow-hidden">
                              {/* Placeholder logic for video/reel support if we had videoSrc */}
                              <OptimizedImage
                                {...event.image}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Play Icon Overlay if it were a video */}
                              {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                                 <PlayCircle className="w-10 h-10 text-white/80" />
                              </div> */}

                              {/* Badge */}
                              <div className="absolute top-2.5 right-2.5">
                                <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                  {event.badge}
                                </span>
                              </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-4">
                              <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground mb-2">
                                <span className="flex items-center gap-1 font-medium text-primary">
                                  <Calendar className="w-3 h-3" /> {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {event.location}
                                </span>
                              </div>

                              <h4 className="font-serif text-base font-semibold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                                {event.title}
                              </h4>

                              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                <span className="text-sm font-bold text-foreground">{event.price}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs px-4 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Dot Pagination */}
                <div className="events-pagination flex justify-center gap-2 mt-5" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Group Booking (30%) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-primary/5 via-background to-background border border-border/50 rounded-2xl p-6 h-full shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-serif font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Group Booking
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Planning a special event? Let us make it unforgettable.
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {GROUP_BOOKING_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleOpenBooking(option)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      option.color
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                          {option.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wide mt-2">
                          <span>Enquire Now</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Contact Options */}
              <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full gap-2 text-xs h-10">
                  <Phone className="w-3.5 h-3.5" /> Call Us
                </Button>
                <Button variant="outline" className="w-full gap-2 text-xs h-10 bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/20 hover:text-[#25D366]">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </Button>
              </div>
            </div>
          </div>

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
                <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", step >= i ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 min-h-[350px]">
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

            {/* STEP 3: DATE RANGE */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                <h3 className="font-medium text-lg self-start">Select Event Dates</h3>
                <div className="border rounded-lg p-3 bg-card/50">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="rounded-md border"
                    initialFocus
                    numberOfMonths={1}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  *Select start and end date for your event
                </p>
              </div>
            )}

            {/* STEP 4: SUCCESS (Virtual Step) */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-full py-8 animate-in zoom-in-50 duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Enquiry Sent!</h3>
                <p className="text-muted-foreground max-w-xs mb-6">
                  Thank you for your interest. Our event coordinator will contact you shortly to plan your {selectedOffer?.title}.
                </p>
                <Button onClick={() => setSelectedOffer(null)} className="min-w-[150px]">
                  Close
                </Button>
              </div>
            )}

          </div>

          {step < 4 && (
            <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                Back
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} disabled={step === 1 ? !city : !hotel}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={!dateRange?.from}>
                  Send Enquiry
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        .events-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .events-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: hsl(var(--primary));
        }
      `}</style>
    </section>
  );
}