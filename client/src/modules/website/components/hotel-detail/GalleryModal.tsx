
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { Hotel } from "@/data/hotelData";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ImageAsset } from "@/types/media";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  initialImageIndex?: number;
}

export default function GalleryModal({ isOpen, onClose, hotel, initialImageIndex = 0 }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [activeCategory, setActiveCategory] = useState("All");

  // Aggregate all images
  // In a real app, these would come from a comprehensive media list in the hotel object
  // For now, we will construct a list from available data points
  const allImages: { src: ImageAsset, category: string, caption: string }[] = [
    { src: hotel.image, category: "Property", caption: "Main Exterior" },
    ...hotel.roomTypes.map(r => ({ src: r.image, category: "Rooms", caption: r.name })),
    ...(hotel.dining || []).map(d => d.image ? { src: d.image, category: "Dining", caption: d.name } : null).filter(Boolean) as any,
    // Add duplicates/placeholders to verify navigation if list is short
  ];

  const filteredImages = activeCategory === "All"
    ? allImages
    : allImages.filter(img => img.category === activeCategory);

  const categories = ["All", "Property", "Rooms", "Dining"];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 text-white bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
          <div>
            <h3 className="text-lg font-serif font-bold">{hotel.name}</h3>
            <p className="text-xs opacity-70">{filteredImages[currentIndex]?.caption || hotel.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image Area */}
        <div className="flex-1 flex items-center justify-center relative px-4 md:px-16 overflow-hidden">

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-[80vh] max-w-full aspect-video rounded-lg overflow-hidden shadow-2xl"
          >
            <OptimizedImage
              {...filteredImages[currentIndex].src}
              className="object-contain w-full h-full"
            />
          </motion.div>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Footer / Thumbnails */}
        <div className="bg-black/80 backdrop-blur-md border-t border-white/10 p-4 pb-8 md:pb-4">
          {/* Categories */}
          <div className="flex justify-center gap-4 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${activeCategory === cat ? "bg-white text-black" : "text-white/60 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Thumbnails Strip */}
          <div className="flex gap-2 overflow-x-auto justify-center px-4 no-scrollbar h-16">
            {filteredImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-24 h-16 rounded-md overflow-hidden cursor-pointer transition-all ${idx === currentIndex ? "ring-2 ring-primary scale-105 opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
              >
                <OptimizedImage {...img.src} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
