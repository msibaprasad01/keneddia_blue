import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface PropertyMedia {
  mediaId: number | null;
  type: string;
  url: string;
  fileName: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
}

interface GalleryItem {
  id: number;
  category: string;
  categoryName?: string;
  propertyId: number;
  propertyName: string;
  media: PropertyMedia;
  isActive: boolean;
  displayOrder?: number;
}

interface HotelGalleryGridProps {
  galleryData: GalleryItem[];
  onOpenGallery: (index: number) => void;
}

// ── Empty slot placeholder ────────────────────────────────────────────────────
const EmptySlot = () => (
  <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
    <ImageIcon className="w-7 h-7 text-zinc-300" />
  </div>
);

// ── Mobile Carousel ───────────────────────────────────────────────────────────
function MobileCarousel({
  images,
  onOpen,
}: {
  images: PropertyMedia[];
  onOpen: (i: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg md:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => onOpen(current)}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
            touchStart.current = null;
          }}
        >
          <OptimizedImage
            src={images[current]?.url || ""}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-800" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
          >
            <ChevronRight className="w-4 h-4 text-zinc-800" />
          </button>
        </>
      )}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-[11px] font-bold px-3 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

// ── Desktop Grid ──────────────────────────────────────────────────────────────
function DesktopGrid({
  gridSlots,
  totalImages,
  onOpen,
  sortedImages,
}: {
  gridSlots: (PropertyMedia | null)[];
  totalImages: number;
  onOpen: (i: number) => void;
  sortedImages: PropertyMedia[];
}) {
  const remaining = totalImages > 4 ? totalImages - 4 : 0;

  // Find the index in sortedImages (for correct GalleryModal opening)
  const openByMedia = (media: PropertyMedia | null) => {
    if (!media) return;
    const idx = sortedImages.findIndex((m) => m.url === media.url);
    onOpen(idx >= 0 ? idx : 0);
  };

  const Tile = ({
    slot,
    className,
    children,
  }: {
    slot: PropertyMedia | null;
    className: string;
    children?: React.ReactNode;
  }) => (
    <div
      className={`relative overflow-hidden group bg-zinc-100 ${className} ${slot ? "cursor-pointer" : "cursor-default"}`}
      onClick={() => openByMedia(slot)}
    >
      {slot ? (
        <>
          <OptimizedImage
            src={slot.url}
            alt={slot.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        </>
      ) : (
        <EmptySlot />
      )}
      {children}
    </div>
  );

  return (
    <div className="hidden md:grid grid-cols-4 gap-3 h-[450px] rounded-2xl overflow-hidden shadow-xl">
      {/* Slot 0 — hero */}
      <Tile slot={gridSlots[0]} className="col-span-2 h-full" />

      {/* Slots 1 & 2 — stacked */}
      <div className="col-span-1 flex flex-col gap-3 h-full">
        <Tile slot={gridSlots[1]} className="flex-1" />
        <Tile slot={gridSlots[2]} className="flex-1" />
      </div>

      {/* Slot 3 — with VIEW GALLERY overlay */}
      <Tile slot={gridSlots[3]} className="col-span-1 h-full">
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <button
            className="pointer-events-auto bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 text-zinc-900 text-[11px] font-black shadow-lg transform transition-transform group-hover:scale-110 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(0);
            }}
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{remaining > 0 ? `+${remaining} MORE` : "VIEW GALLERY"}</span>
          </button>
        </div>
      </Tile>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function HotelGalleryGrid({ galleryData, onOpenGallery }: HotelGalleryGridProps) {
  /**
   * sortedItems: active items (excluding 3d), sorted by displayOrder.
   * Used for mobile carousel and gallery modal index alignment.
   */
  const sortedItems = useMemo(() => {
    return (galleryData || [])
      .filter(
        (g) =>
          g.isActive !== false &&
          g.media?.url &&
          g.categoryName?.toLowerCase() !== "3d",
      )
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  }, [galleryData]);

  const sortedImages = useMemo(() => sortedItems.map((g) => g.media), [sortedItems]);

  /**
   * gridSlots: 4-element array for desktop grid.
   *
   * 1. Items with displayOrder 1–4 go into that exact slot (0-indexed).
   * 2. Collisions or displayOrder outside 1–4 → overflow queue.
   * 3. Empty slots backfilled left-to-right from overflow.
   * 4. Still-empty slots → null (EmptySlot).
   */
  const gridSlots: (PropertyMedia | null)[] = useMemo(() => {
    const slots: (PropertyMedia | null)[] = [null, null, null, null];
    const overflow: PropertyMedia[] = [];

    sortedItems.forEach((item) => {
      const order = item.displayOrder;
      if (order && order >= 1 && order <= 4) {
        if (!slots[order - 1]) {
          slots[order - 1] = item.media;
        } else {
          overflow.push(item.media);
        }
      } else {
        overflow.push(item.media);
      }
    });

    for (let i = 0; i < 4; i++) {
      if (!slots[i] && overflow.length > 0) {
        slots[i] = overflow.shift()!;
      }
    }

    return slots;
  }, [sortedItems]);

  if (sortedImages.length === 0) {
    return (
      <div className="w-full h-48 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 gap-2 text-sm mb-8">
        <ImageIcon className="w-5 h-5" /> No gallery images available
      </div>
    );
  }

  return (
    <div className="mb-8">
      <MobileCarousel images={sortedImages} onOpen={onOpenGallery} />
      <DesktopGrid
        gridSlots={gridSlots}
        totalImages={sortedImages.length}
        onOpen={onOpenGallery}
        sortedImages={sortedImages}
      />
    </div>
  );
}