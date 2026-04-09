import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";

const GALLERY_ITEMS = [
  { id: 1, category: "Interior", image: siteContent.images.cafes.parisian.src, alt: "Parisian Cafe Interior" },
  { id: 2, category: "Brews", image: siteContent.images.cafes.minimalist.src, alt: "Coffee Brew Bar" },
  { id: 3, category: "Bakery", image: siteContent.images.cafes.bakery.src, alt: "Artisan Bakery Counter" },
  { id: 4, category: "Events", image: siteContent.images.cafes.highTea.src, alt: "High Tea Setup" },
  { id: 5, category: "Outdoor", image: siteContent.images.cafes.garden.src, alt: "Garden Terrace" },
  { id: 6, category: "Interior", image: siteContent.images.cafes.library.src, alt: "Library Corner" },
  { id: 7, category: "Brews", image: siteContent.images.cafes.library.src, alt: "Library Cafe" },
  { id: 8, category: "Events", image: siteContent.images.cafes.garden.src, alt: "Outdoor Event" },
];

const CATEGORIES = ["All", "Interior", "Brews", "Bakery", "Events", "Outdoor"];

export default function CafeGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const lightboxPrev = () =>
    setLightboxIndex((c) => (c - 1 + filtered.length) % filtered.length);
  const lightboxNext = () =>
    setLightboxIndex((c) => (c + 1) % filtered.length);

  return (
    <section className="py-16 lg:py-28 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-primary text-[11px] font-bold uppercase tracking-[0.4em]">
                Visual Gallery
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white tracking-tight">
              Moments from the <span className="italic text-primary">Cafe</span>
            </h2>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-primary/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openLightbox(index)}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                index % 5 === 0 ? "col-span-2 row-span-2" : ""
              }`}
              style={{ aspectRatio: index % 5 === 0 ? "1/1" : "3/4" }}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Camera className="w-5 h-5 text-zinc-900" />
                </div>
              </div>
              <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {item.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            className="absolute left-5 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <motion.img
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={filtered[lightboxIndex].image}
            alt={filtered[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            className="absolute right-5 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 text-white/60 text-sm">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </section>
  );
}
