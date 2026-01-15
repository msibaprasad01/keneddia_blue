import { motion } from "framer-motion";
import { Users, Check, Maximize2 } from "lucide-react";
import { Room } from "@/data/hotelData";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: (roomId: string) => void;
  viewMode?: "grid" | "list";
}

export default function RoomCard({ room, isSelected, onSelect, viewMode = "grid" }: RoomCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-card border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${isSelected
        ? "border-primary shadow-lg ring-2 ring-primary/20"
        : "border-border hover:border-primary/50"
        }`}
    >
      {/* Room Image */}
      <div className="relative h-56 overflow-hidden group">
        <OptimizedImage
          {...room.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Availability Badge */}
        {room.available ? (
          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
            Available
          </div>
        ) : (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
            Sold Out
          </div>
        )}

        {/* Room Size */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <Maximize2 className="w-4 h-4" />
          <span className="text-sm font-medium">{room.size}</span>
        </div>
      </div>

      {/* Room Details */}
      <div className="p-6">
        {/* Room Name & Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
              {room.name}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Up to {room.maxOccupancy} guests</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-serif font-bold text-primary">
              {formatPrice(room.basePrice)}
            </p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
            Amenities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {room.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
          {room.amenities.length > 4 && (
            <p className="text-xs text-primary mt-2 font-medium">
              +{room.amenities.length - 4} more amenities
            </p>
          )}
        </div>

        {/* Select Button */}
        <button
          onClick={() => onSelect(room.id)}
          disabled={!room.available}
          className={`w-full px-6 py-3 font-bold uppercase tracking-widest rounded-lg transition-all ${isSelected
            ? "bg-primary text-primary-foreground shadow-lg"
            : room.available
              ? "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {isSelected ? "Selected" : room.available ? "Select Room" : "Unavailable"}
        </button>
      </div>
    </motion.div>
  );
}
