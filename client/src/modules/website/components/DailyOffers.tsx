import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Tag, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

// Countdown Timer Component
function CountdownTimer({ expiresAt }: { expiresAt?: string | Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const expiryTime = new Date(expiresAt).getTime();
      
      // Check if the expiry date is valid
      if (isNaN(expiryTime)) {
        console.warn('Invalid expiry date:', expiresAt);
        return;
      }

      const difference = expiryTime - now;

      // If expired
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      // Calculate time components
      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      // Format display based on time remaining
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
      
      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
      isExpired 
        ? 'bg-red-500/90 text-white border border-red-600' 
        : 'bg-orange-500/90 text-white border border-orange-600'
    }`}>
      <Clock className="w-3 h-3" />
      <span>{isExpired ? "Expired" : `Expires in ${timeLeft}`}</span>
    </div>
  );
}

export default function DailyOffers() {
  const { dailyOffers } = siteContent.text;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Guard clause
  if (!dailyOffers || !dailyOffers.offers || dailyOffers.offers.length === 0) return null;

  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const offers = dailyOffers.offers;

  // Extract unique locations
  const uniqueLocations = ["All Locations", ...Array.from(new Set(offers.map((offer: any) => offer.location).filter(Boolean)))];

  const filteredOffers = selectedLocation === "All Locations"
    ? offers
    : offers.filter((offer: any) => offer.location === selectedLocation);

  // Simple category inference helper
  const getCategory = (title: string, desc: string) => {
    const text = (title + " " + desc).toLowerCase();
    if (text.includes("dining") || text.includes("meal") || text.includes("restaurant") || text.includes("dinner")) return "Restaurant";
    if (text.includes("cafe") || text.includes("coffee") || text.includes("tea")) return "Cafe";
    if (text.includes("spa") || text.includes("massage")) return "Wellness";
    return "Hotel"; // Default
  };

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <section className="relative w-full bg-muted py-10 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header - Compact */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              {dailyOffers.title}
            </h2>
            <div className="w-12 h-0.5 bg-primary mt-2" />
          </div>

          {/* Custom Navigation Controls & Filter */}
          <div className="flex items-center gap-3">
            {/* Location Filter */}
            <div className="relative hidden sm:block">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-background border border-border rounded-full py-1.5 pl-3 pr-8 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer outline-none shadow-sm hover:border-primary/50 transition-colors"
              >
                {uniqueLocations.map((loc) => (
                  <option key={String(loc)} value={String(loc)}>
                    {String(loc)}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={filteredOffers.length > 3}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={setSwiperInstance}
            speed={600}
            className="w-full pb-4"
          >
            {filteredOffers.map((offer: any, index: number) => {
              const category = getCategory(offer.title, offer.description);

              return (
                <SwiperSlide key={index} className="h-full">
                  <div className="group relative bg-card border border-border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-colors duration-300 flex flex-col">
                    {/* Image Aspect 300x250ish */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        {...offer.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
                          {category}
                        </span>
                      </div>

                      {/* Countdown Timer Badge - Top Right */}
                      {offer.expiresAt && (
                        <div className="absolute top-3 right-3">
                          <CountdownTimer expiresAt={offer.expiresAt} />
                        </div>
                      )}
                    </div>

                    {/* Content - Compact */}
                    <div className="p-4 flex flex-col gap-3 flex-grow">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                          {offer.title}
                        </h3>
                        {offer.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <MapPin className="w-3 h-3" />
                            <span className="whitespace-nowrap">{offer.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Available Hours - if any */}
                      {offer.availableHours && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{offer.availableHours}</span>
                        </div>
                      )}

                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Code: <span className="font-mono text-foreground font-medium">{offer.couponCode}</span>
                        </div>
                        <Link href={offer.link}>
                          <a className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                            {offer.ctaText}
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}