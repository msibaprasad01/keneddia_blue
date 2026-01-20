import { Hotel, Room } from "@/data/hotelData";
import { Button } from "@/components/ui/button";
import { Check, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MobileBookingBarProps {
  hotel: Hotel;
  selectedRoom: Room | null;
  onSelectRoom: () => void;
}

export default function MobileBookingBar({ hotel, selectedRoom, onSelectRoom }: MobileBookingBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      {/* Expandable Details */}
      {isExpanded && selectedRoom && (
        <div className="px-4 py-3 border-b border-border bg-secondary/5 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{selectedRoom.name}</p>
              <p className="text-xs text-muted-foreground">{selectedRoom.size} • Max {selectedRoom.maxOccupancy} guests</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRoom.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-[10px] px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                {amenity}
              </span>
            ))}
            {selectedRoom.amenities.length > 3 && (
              <span className="text-[10px] px-2 py-1 bg-secondary rounded-full text-primary font-medium">
                +{selectedRoom.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Booking Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Price Section */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => selectedRoom && setIsExpanded(!isExpanded)}
          >
            {selectedRoom ? (
              <div>
                <p className="text-xs text-muted-foreground">Total for 1 night</p>
                <p className="text-lg font-serif font-bold text-primary">{formatPrice(selectedRoom.basePrice)}</p>
                <p className="text-[9px] text-muted-foreground">+ taxes & fees</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-lg font-serif font-bold text-muted-foreground/60">{hotel.price}</p>
                <p className="text-[9px] text-muted-foreground">per night</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => selectedRoom ? console.log("Proceeding to book", selectedRoom.id) : onSelectRoom()}
            className="font-bold uppercase tracking-wider px-6 py-5 text-sm shadow-lg"
            variant={selectedRoom ? "default" : "secondary"}
          >
            {selectedRoom ? "Book Now" : "Select Room"}
          </Button>
        </div>

        {/* Trust Indicators */}
        {selectedRoom && (
          <div className="flex items-center justify-center gap-1 mt-2 text-[9px] text-muted-foreground">
            <Check className="w-3 h-3 text-green-500" />
            <span>Best Price Guarantee • Instant Confirmation</span>
          </div>
        )}
      </div>
    </div>
  );
}