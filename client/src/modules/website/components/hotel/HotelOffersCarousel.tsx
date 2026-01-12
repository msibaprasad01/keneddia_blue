import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

import "swiper/css";

// Mock Data
const HOTEL_OFFERS = [
  {
    title: "Weekend Luxury Getaway",
    description: "Escape the city with our 2-night luxury package including breakfast and spa credit.",
    image: { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2074&auto=format&fit=crop", alt: "Luxury Pool" },
    location: "All Locations",
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    category: "Stay",
    couponCode: "WEEKEND25",
    discount: "25% OFF"
  },
  {
    title: "Romantic Dining Experience",
    description: "A 5-course candlelit dinner for two at our signature rooftop restaurant.",
    image: { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop", alt: "Romantic Dinner" },
    location: "Mumbai, Delhi",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
    category: "Dining",
    couponCode: "LOVE20",
    discount: "20% OFF"
  },
  {
    title: "Rejuvenating Spa Retreat",
    description: "Complimentary 60-minute massage when you book a suite for 3 nights or more.",
    image: { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop", alt: "Spa Massage" },
    location: "Bengaluru, Hyderabad",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    category: "Wellness",
    couponCode: "SPA100",
    discount: "FREE SPA"
  },
  {
    title: "Family Fun Package",
    description: "Kids eat free and get complimentary access to the Kids Club. Perfect for family vacations.",
    image: { src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", alt: "Family Pool" },
    location: "Kolkata, Chennai",
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
    category: "Family",
    couponCode: "FAMILYFUN",
    discount: "KIDS FREE"
  }
];

// Reused Countdown Component
function CountdownTimer({ expiresAt }: { expiresAt?: string | Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

      if (days > 0) setTimeLeft(`${days}d ${hours}h`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m`);
      else setTimeLeft(`${minutes}m`);

      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${isExpired
      ? 'bg-red-500/90 text-white border border-red-600'
      : 'bg-orange-500/90 text-white border border-orange-600'
      }`}>
      <Clock className="w-3 h-3" />
      <span>{isExpired ? "Expired" : `Expires in ${timeLeft}`}</span>
    </div>
  );
}

export default function HotelOffersCarousel() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const handleNext = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  return (
    <section className="relative w-full bg-muted/30 py-10 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              Exclusive Hotel Offers
            </h2>
            <div className="w-12 h-0.5 bg-primary mt-2" />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/offers" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all text-sm mr-4">
              View All Offers
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={HOTEL_OFFERS.length > 3}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            onSwiper={setSwiperInstance}
            speed={600}
            className="w-full pb-4"
          >
            {HOTEL_OFFERS.map((offer, index) => (
              <SwiperSlide key={`offer-${index}`} className="h-full">
                <div className="group relative bg-card border border-border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-colors duration-300 flex flex-col shadow-sm hover:shadow-md">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={offer.image.src}
                      alt={offer.image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
                        {offer.category}
                      </span>
                    </div>
                    {offer.expiresAt && (
                      <div className="absolute top-3 right-3">
                        <CountdownTimer expiresAt={offer.expiresAt} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-3 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {offer.title}
                      </h3>
                      {offer.discount && (
                        <span className="flex-shrink-0 px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">
                          {offer.discount}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        <span>Code: <span className="font-mono text-foreground font-medium">{offer.couponCode}</span></span>
                      </div>
                      <Link to={`/offers/${index}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        Book Now
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
