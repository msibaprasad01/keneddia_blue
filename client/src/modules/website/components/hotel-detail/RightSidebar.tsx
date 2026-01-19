
import { Hotel } from "@/data/hotelData";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Star, Utensils, ChevronRight, Info } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { siteContent } from "@/data/siteContent";

interface RightSidebarProps {
  hotel: Hotel;
}

export default function RightSidebar({ hotel }: RightSidebarProps) {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 sticky top-24">

      {/* Price Summary Card - STICKY PRIORITY */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <Star className="w-24 h-24" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-primary">{hotel.price}</span>
                <span className="text-xs text-muted-foreground">/ night</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">+ taxes & fees</p>
            </div>
            <div className="text-right">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                Best Price Guarantee
              </div>
            </div>
          </div>

          <Button
            onClick={() => scrollToSection('room-options')}
            className="w-full font-bold uppercase tracking-wider py-6 text-sm shadow-md hover:shadow-lg transition-all"
          >
            Select Room
          </Button>

          <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
            <Check className="w-3 h-3 text-green-500" /> No hidden fees • Free cancellation options
          </p>
        </div>
      </div>

      {/* Mini Map Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm group">
        <div className="h-32 relative bg-secondary/20">
          {/* Static Map Preview - employing a gradient/placeholder if actual static map api isn't used */}
          <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary/40" />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-end">
              <span className="bg-white/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                {hotel.city}
              </span>
            </div>
            <div className="text-white">
              <p className="text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary-foreground" /> {hotel.location}
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-card border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => scrollToSection('location')}
          >
            View Full Map on Page
          </Button>
        </div>
      </div>

      {/* Amenities Snapshot */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h4 className="text-sm font-serif font-bold text-foreground mb-3 flex items-center justify-between">
          Amenities
          <span
            className="text-[10px] text-primary cursor-pointer hover:underline font-normal"
            onClick={() => scrollToSection('amenities')}
          >
            View All
          </span>
        </h4>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {hotel.amenities.slice(0, 6).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full shrink-0" />
              <span className="text-xs text-muted-foreground truncate" title={amenity}>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Food & Dining Snapshot */}
      {hotel.dining && hotel.dining.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-serif font-bold text-foreground mb-3 flex items-center justify-between">
            Food & Dining
            <span
              className="text-[10px] text-primary cursor-pointer hover:underline font-normal"
              onClick={() => scrollToSection('food-dining')}
            >
              View Details
            </span>
          </h4>
          <div className="space-y-3">
            {hotel.dining.slice(0, 2).map((place, idx) => (
              <div key={idx} className="flex gap-3 items-start group cursor-pointer" onClick={() => scrollToSection('food-dining')}>
                <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                  {place.image ? (
                    <OptimizedImage {...place.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Utensils className="w-4 h-4 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-foreground truncate">{place.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{place.cuisine}</p>
                  <p className="text-[10px] text-green-600 truncate mt-0.5">{place.timings.split(',')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assistance Card */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full shrink-0">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground mb-1">Need assistance?</p>
          <p className="text-[10px] text-muted-foreground mb-2">Our concierge team is available 24/7 to help you plan your stay.</p>
          <button className="text-[10px] font-bold text-primary hover:underline">Contact Concierge</button>
        </div>
      </div>

    </div>
  );
}
