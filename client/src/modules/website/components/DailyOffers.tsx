import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Tag,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Swiper as SwiperType } from "swiper";
import { getDailyOffers } from "@/Api/Api";
import "swiper/css";
import "swiper/css/navigation";

const MEDIA_DETECTION_RULES = {
  instagramBannerReel: {
    label: "Instagram Banner / Reel",
    aspectRatio: "9:16",
    allowedDimensions: [
      { width: 1080, height: 1920 },
      { width: 900, height: 1600 },
      { width: 720, height: 1280 },
      { width: 450, height: 800 }
    ],
    minHeight: 800,
    ratioTolerance: 0.01,
  }
};

function CountdownTimer({ expiresAt }: { expiresAt?: string | Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const calculateTimeLeft = () => {
      const now = Date.now();
      const expiryTime = new Date(expiresAt).getTime();
      if (isNaN(expiryTime)) return;
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
      const seconds = totalSeconds % 60;
      if (days > 0) setTimeLeft(`${days}d ${hours}h`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m`);
      else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s`);
      else setTimeLeft(`${seconds}s`);
      setIsExpired(false);
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
      isExpired ? "bg-red-500/90 text-white border border-red-600" : "bg-orange-500/90 text-white border border-orange-600"
    }`}>
      <Clock className="w-3 h-3" />
      <span>{isExpired ? "Expired" : `Expires in ${timeLeft}`}</span>
    </div>
  );
}

interface ApiOffer {
  id: number;
  title: string;
  description: string;
  couponCode: string;
  ctaText: string;
  ctaLink?: string;
  availableHours: string;
  propertyId: number;
  propertyTypeName?: string;
  locationName: string;
  displayLocation: string;
  image: {
    mediaId: number;
    type: string;
    url: string;
    fileName: string | null;
    alt: string | null;
    width: number | null;
    height: number | null;
  };
  expiresAt: string;
  isActive: boolean;
}

const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

const aspectRatioMatches = (width: number, height: number, targetRatio: string, tolerance: number = 0.01): boolean => {
  const [targetW, targetH] = targetRatio.split(':').map(Number);
  const actualRatio = width / height;
  const expectedRatio = targetW / targetH;
  return Math.abs(actualRatio - expectedRatio) <= tolerance;
};

const detectBanner = (image: any): boolean => {
  if (!image || !image.width || !image.height) return false;
  const { width, height } = image;
  const rule = MEDIA_DETECTION_RULES.instagramBannerReel;
  const exactMatch = rule.allowedDimensions.some(dim => dim.width === width && dim.height === height);
  const ratioMatch = aspectRatioMatches(width, height, rule.aspectRatio, rule.ratioTolerance);
  const meetsMinHeight = height >= rule.minHeight;
  return exactMatch || (ratioMatch && meetsMinHeight);
};

const transformOffer = (apiOffer: ApiOffer) => ({
  id: apiOffer.id,
  title: apiOffer.title,
  description: apiOffer.description,
  couponCode: apiOffer.couponCode,
  ctaText: apiOffer.ctaText || "View Offer",
  ctaLink: apiOffer.ctaLink || "",
  availableHours: apiOffer.availableHours,
  location: apiOffer.locationName,
  propertyType: apiOffer.propertyTypeName || "Hotel",
  expiresAt: apiOffer.expiresAt,
  displayLocation: apiOffer.displayLocation,
  image: apiOffer.image?.url ? {
    src: apiOffer.image.url,
    alt: apiOffer.image.alt || apiOffer.title,
    width: apiOffer.image.width || null,
    height: apiOffer.image.height || null,
  } : null,
});

const getFallbackOffers = () => siteContent.text.dailyOffers?.offers || [];

export default function DailyOffers() {
  const { dailyOffers } = siteContent.text;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [offers, setOffers] = useState<any[]>(getFallbackOffers());
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getDailyOffers({ targetType: "GLOBAL", page: 0, size: 100 });
        const resData = response.data?.data || response.data || response;
        let offersData: ApiOffer[] = Array.isArray(resData.content) ? resData.content : [];
        const activeOffers = offersData
          .filter((offer: ApiOffer) => offer.isActive && (offer.displayLocation === "HOME_PAGE" || offer.displayLocation === "BOTH"))
          .map(transformOffer);
        if (activeOffers.length > 0) setOffers(activeOffers.reverse());
        else setOffers([]);
      } catch (err) {
        if (dailyOffers?.offers) setOffers(dailyOffers.offers);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [dailyOffers]);

  const uniqueLocations = ["All Locations", ...Array.from(new Set(offers.map((offer: any) => offer.location).filter(Boolean)))];
  const filteredOffers = selectedLocation === "All Locations" ? offers : offers.filter((offer: any) => offer.location === selectedLocation);
  const getCategory = (offer: any) => offer.propertyType || "Hotel";
  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  if (!offers || offers.length === 0) return null;

  return (
    <section className="relative w-full bg-muted py-10 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">{dailyOffers?.title || "Exclusive Daily Offers"}</h2>
            <div className="w-12 h-0.5 bg-primary mt-2" />
          </div>
          <div className="flex items-center gap-3">
            {uniqueLocations.length > 1 && (
              <div className="relative hidden sm:block">
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="appearance-none bg-background border border-border rounded-full py-1.5 pl-3 pr-8 text-sm font-medium outline-none shadow-sm">
                  {uniqueLocations.map((loc) => (<option key={String(loc)} value={String(loc)}>{String(loc)}</option>))}
                </select>
                <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            )}
            <button onClick={handlePrev} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronLeft size={16} /></button>
            <button onClick={handleNext} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            loop={filteredOffers.length > 3}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={setSwiperInstance}
            speed={600}
            className="w-full pb-4"
          >
            {filteredOffers.map((offer: any, index: number) => {
              const category = getCategory(offer);
              const isBanner = detectBanner(offer.image);

              return (
                <SwiperSlide key={offer.id || index} className="h-full">
                  {/* FIX: Added min-h-[580px] and h-full to ensure container consistency */}
                  <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full min-h-[580px]">
                    
                    {/* FIX: If it's a banner, image container takes h-full. Otherwise fixed h-[380px] */}
                    <div className={`relative overflow-hidden bg-muted flex-shrink-0 ${isBanner ? "h-full flex-1" : "h-[380px]"}`}>
                      {offer.image?.src ? (
                        <img
                          src={offer.image.src}
                          alt={offer.image.alt || offer.title}
                          className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${isBanner ? "object-cover" : "object-cover"}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Tag className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Overlays that should show even on banners if needed */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider rounded">
                          {category}
                        </span>
                      </div>

                      {offer.expiresAt && (
                        <div className="absolute top-3 right-3">
                          <CountdownTimer expiresAt={offer.expiresAt} />
                        </div>
                      )}
                    </div>

                    {!isBanner && (
                      <div className="p-4 flex flex-col flex-1 gap-2.5">
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
                        <p className="text-xs text-muted-foreground line-clamp-2 italic">"{offer.description}"</p>
                        {offer.availableHours && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{offer.availableHours}</span>
                          </div>
                        )}
                        <div className="mt-auto pt-4 border-t border-border space-y-3">
                          <div className="text-xs text-muted-foreground">
                            Code: <span className="font-mono text-foreground font-medium">{offer.couponCode || "N/A"}</span>
                          </div>
                          <button disabled className="w-full bg-muted text-muted-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-70">
                            {offer.ctaText}
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    )}
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