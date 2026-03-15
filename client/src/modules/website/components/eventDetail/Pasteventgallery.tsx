import { useState } from "react";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================
interface GalleryItem {
  id: number;
  src: string;
  label: string;
}

interface PastEventGalleryProps {
  eventId: string | number;
  images: { url: string; alt?: string }[];
}

// ============================================================================
// FLOATING GALLERY CARD
// ============================================================================
function FloatingGalleryCard({ item }: { item: GalleryItem }) {
  return (
    <div className="relative group w-[180px] h-[260px] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
      
      {/* Image */}
      <img
        src={item.src}
        alt={item.label}
        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <span className="text-[#E33E33] text-[9px] font-black uppercase tracking-widest mb-0.5">
          Past Event
        </span>
        <p className="text-white text-xs font-semibold">{item.label}</p>
      </div>

      {/* Expand icon */}
      <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 size={12} className="text-white" />
      </div>
    </div>
  );
}

// ============================================================================
// PAST EVENT GALLERY
// ============================================================================
export default function PastEventGallery({ images }: PastEventGalleryProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  // Map API images
  const items: GalleryItem[] = images.map((img, i) => ({
    id: i,
    src: img.url,
    label: img.alt || `Highlight ${i + 1}`,
  }));

  const { scrollYProgress } = useScroll();
  const bgX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const track1Variants = {
    animate: {
      x: ["-15%", "15%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "mirror" as const,
          duration: 18,
          ease: "linear",
        },
      },
    },
  };

  const track2Variants = {
    animate: {
      x: ["15%", "-15%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "mirror" as const,
          duration: 26,
          ease: "linear",
        },
      },
    },
  };

  if (items.length === 0) return null;

  const track1Items =
    items.length < 4 ? [...items, ...items, ...items] : [...items, ...items];

  const track2Items = [...items].reverse();
  const track2Doubled =
    track2Items.length < 4
      ? [...track2Items, ...track2Items, ...track2Items]
      : [...track2Items, ...track2Items];

  return (
    <section className="space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Camera className="w-4 h-4 text-[#E33E33] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E33E33]">
            Past Highlights
          </span>
          {/* <span className="text-[10px] text-muted-foreground font-medium">
            ({items.length} {items.length === 1 ? "photo" : "photos"})
          </span> */}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setManualOffset((p) => p + 120)}
            className="p-2 rounded-full border border-border hover:bg-[#E33E33] hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={() => setManualOffset((p) => p - 120)}
            className="p-2 rounded-full border border-border hover:bg-[#E33E33] hover:text-white transition-all active:scale-95"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Floating Canvas */}
      <div
        className="relative h-[360px] rounded-[2rem] overflow-hidden border border-border/50 bg-zinc-50 dark:bg-zinc-950 shadow-inner"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background watermark */}
        <motion.div
          style={{ x: bgX }}
          className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[8rem] font-black text-zinc-900/[0.03] dark:text-white/[0.02] pointer-events-none select-none italic uppercase"
        >
          MOMENTS MEMORIES MOMENTS
        </motion.div>

        {/* Track 1 */}
        <motion.div
          variants={track1Variants}
          animate={isPaused ? {} : "animate"}
          style={{ translateX: manualOffset }}
          className="absolute top-1/2 -translate-y-1/2 flex gap-5 whitespace-nowrap"
        >
          {track1Items.map((item, i) => (
            <FloatingGalleryCard key={`t1-${i}`} item={item} />
          ))}
        </motion.div>

        {/* Track 2 */}
        <motion.div
          variants={track2Variants}
          animate={isPaused ? {} : "animate"}
          style={{ translateX: -manualOffset }}
          className="absolute top-1/2 -translate-y-1/2 flex gap-5 whitespace-nowrap opacity-0 pointer-events-none"
        >
          {track2Doubled.map((item, i) => (
            <FloatingGalleryCard key={`t2-${i}`} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}