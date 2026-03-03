import { useState, useRef } from "react";
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
  propertyId: number;
  propertyName: string;
  media: PropertyMedia;
  isActive: boolean;
}

interface HotelGalleryGridProps {
  galleryData: GalleryItem[];
  onOpenGallery: (index: number) => void;
}

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
          <OptimizedImage src={images[current]?.url || ""} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
        <ChevronLeft className="w-4 h-4 text-zinc-800" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
        <ChevronRight className="w-4 h-4 text-zinc-800" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-[11px] font-bold px-3 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

// ── Desktop Grid ──────────────────────────────────────────────────────────────
// Exact layout from reference:
//   [  large hero (col 1-2)  ] [ top small  ] [ VIEW GALLERY ]
//                               [ btm small  ]
function DesktopGrid({ images, onOpen }: { images: PropertyMedia[]; onOpen: (i: number) => void }) {
  const remaining = images.length > 4 ? images.length - 4 : 0;

  // Reusable tile wrapper
  const Tile = ({
    index,
    className,
    children,
  }: {
    index: number;
    className: string;
    children?: React.ReactNode;
  }) => (
    <div
      className={`relative overflow-hidden cursor-pointer group bg-zinc-100 ${className}`}
      onClick={() => onOpen(index)}
    >
      {images[index] ? (
        <>
          <OptimizedImage
            src={images[index].url}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        </>
      ) : null}
      {children}
    </div>
  );

  return (
    <div className="hidden md:grid grid-cols-4 gap-3 h-[450px] rounded-2xl overflow-hidden shadow-xl">

      {/* Col 1–2: hero */}
      <Tile index={0} className="col-span-2 h-full" />

      {/* Col 3: two stacked */}
      <div className="col-span-1 flex flex-col gap-3 h-full">
        <Tile index={1} className="flex-1" />
        <Tile index={2} className="flex-1" />
      </div>

      {/* Col 4: 4th image + VIEW GALLERY overlay */}
      <Tile index={3} className="col-span-1 h-full">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 text-zinc-900 text-[11px] font-black shadow-lg transform transition-transform group-hover:scale-110">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{remaining > 0 ? `+${remaining} MORE` : "VIEW GALLERY"}</span>
          </div>
        </div>
      </Tile>

    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function HotelGalleryGrid({ galleryData, onOpenGallery }: HotelGalleryGridProps) {
  const images = galleryData.filter((g) => g.media?.url).map((g) => g.media);

  if (images.length === 0) return (
    <div className="w-full h-48 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 gap-2 text-sm mb-8">
      <ImageIcon className="w-5 h-5" /> No gallery images available
    </div>
  );

  return (
    <div className="mb-8">
      <MobileCarousel images={images} onOpen={onOpenGallery} />
      <DesktopGrid images={images} onOpen={onOpenGallery} />
    </div>
  );
}