import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, PartyPopper, ArrowRight, ChevronRight, Check, Calendar, MapPin, Sparkles } from "lucide-react";
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

// Combined data for the 3-box rotating slides
const SHOWCASE_SLIDES = [
  {
    id: 1,
    // Left Feature Card
    feature: {
      type: "celebration",
      id: "birthday",
      title: "Birthday & Private Parties",
      icon: PartyPopper,
      image: siteContent.images.hotels.mumbai,
      description: "Celebrate in style with custom decor and curated menus.",
      tag: "Custom Packages"
    },
    // Right Two Event Cards
    events: [
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
      }
    ]
  },
  {
    id: 2,
    feature: {
      type: "celebration",
      id: "corporate",
      title: "Corporate Meetings & Offsites",
      icon: Users,
      image: siteContent.images.hotels.hyderabad,
      description: "State-of-the-art venues for productivity and connection.",
      tag: "Business Ready"
    },
    events: [
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
    ]
  },
  {
    id: 3,
    feature: {
      type: "event-highlight",
      id: "wine-fest",
      title: "Wine Festival 2024",
      icon: Sparkles,
      image: siteContent.images.bars.rooftop,
      description: "An evening of exquisite wines from around the world.",
      tag: "Featured Event"
    },
    events: [
      {
        id: 5,
        title: "Birthday Bash Packages",
        date: "Year Round",
        location: "All Kennedia Locations",
        image: siteContent.images.hotels.bengaluru,
        price: "From ₹15,000",
        badge: "Popular"
      },
      {
        id: 6,
        title: "Team Offsite Deals",
        date: "Limited Time",
        location: "Premium Venues",
        image: siteContent.images.hotels.mumbai,
        price: "Custom Quote",
        badge: "Corporate"
      }
    ]
  }
];

export default function GroupBookingSection() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<{ id: string; title: string; icon: any } | null>(null);
  const [step, setStep] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  // Wizard State
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleOpenBooking = (feature: typeof SHOWCASE_SLIDES[0]['feature']) => {
    if (feature.type === "celebration") {
      setSelectedOffer({ id: feature.id, title: feature.title, icon: feature.icon });
      setStep(1);
      setCity("");
      setHotel(null);
      setDate(undefined);
    }
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

        {/* Main Carousel - 3 Box Layout */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ 
              clickable: true,
              el: '.showcase-pagination',
            }}
            loop={true}
            speed={600}
            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
            className="showcase-carousel"
          >
            {SHOWCASE_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                {/* 3-Column Equal Height Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Feature Card */}
                  <div 
                    className="group relative h-[280px] overflow-hidden rounded-xl shadow-md cursor-pointer"
                    onClick={() => handleOpenBooking(slide.feature)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <OptimizedImage
                        {...slide.feature.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    {/* Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {slide.feature.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:bg-primary transition-colors duration-300">
                        <slide.feature.icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg font-bold mb-1.5 leading-tight">
                        {slide.feature.title}
                      </h3>
                      <p className="text-white/75 text-xs leading-relaxed mb-3 line-clamp-2">
                        {slide.feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-primary transition-colors">
                        {slide.feature.type === "celebration" ? "Plan Your Event" : "Learn More"}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Middle & Right: Two Event Cards */}
                  {slide.events.map((event) => (
                    <div 
                      key={event.id}
                      className="group bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-[280px] flex flex-col cursor-pointer"
                    >
                      {/* Event Image */}
                      <div className="relative h-[140px] flex-shrink-0 overflow-hidden">
                        <OptimizedImage 
                          {...event.image} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        {/* Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                            {event.badge}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-3 flex flex-col flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground mb-1.5">
                          <span className="flex items-center gap-1 font-medium text-primary">
                            <Calendar className="w-3 h-3" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        </div>
                        
                        <h4 className="font-serif text-sm font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h4>

                        <div className="mt-auto pt-2 border-t border-border/40 flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{event.price}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-[10px] px-3 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dot Pagination - Centered Below */}
          <div className="showcase-pagination flex justify-center gap-2 mt-6" />
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

      <style>{`
        .showcase-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .showcase-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: hsl(var(--primary));
        }
      `}</style>
    </section>
  );
}