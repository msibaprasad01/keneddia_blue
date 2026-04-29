import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ImageOff } from "lucide-react";

// ─── TYPE ACCENTS ─────────────────────────────────────────────────────────────
const TYPE_ACCENTS = {
  Whiskey: { color: "#C9922A", dot: "#D4A017" },
  Wine: { color: "#8B1A2A", dot: "#C4485A" },
  Beers: { color: "#B8860B", dot: "#D4B035" },
  Tastings: { color: "#556B5E", dot: "#7AA088" },
};

// ─── CATEGORY DATA ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Whiskey", id: "whiskey", tag: "Single Malts & Blends", image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=85", property: "Kennedia Blu", location: "ghaziabad" },
  { name: "Wine", id: "wine", tag: "Fine Estates", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=85", property: "Kennedia Blu", location: "ghaziabad" },
  { name: "Beers", id: "beers", tag: "Craft & Imported", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=85", property: "Kennedia Blu", location: "ghaziabad" },
  { name: "Tastings", id: "tastings", tag: "Master Classes", image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=85", property: "Kennedia Blu", location: "ghaziabad" },
];

// ─── CATEGORY CARD ────────────────────────────────────────────────────────────
function CategoryCard({ category, index }) {
  const [hovered, setHovered] = useState(false);
  const accent = TYPE_ACCENTS[category.name] || TYPE_ACCENTS.Wine;
  const navigate = useNavigate();

  const generateSlug = (text) => text?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

  const handleExplore = () => {
    const citySlug = category.location.toLowerCase();
    const propSlug = generateSlug(category.property);
    const typeSlug = category.id;
    navigate(`/wine-detail/${citySlug}/${propSlug}/${typeSlug}`);
  };

  const [errored, setErrored] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleExplore}
      className="group relative flex h-full min-h-[108px] cursor-pointer select-none items-center overflow-hidden rounded-[1.5rem] border border-stone-200/90 bg-white px-4 py-4 shadow-[0_14px_40px_-28px_rgba(66,28,35,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-34px_rgba(66,28,35,0.45)] dark:border-white/[0.07] dark:bg-[#1A0C13]"
    >
      <div
        className="absolute left-0 top-0 h-full w-[3px] transition-all duration-500"
        style={{ background: hovered ? `linear-gradient(to bottom, ${accent.dot}, ${accent.color})` : "transparent" }}
      />

      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200/80 dark:bg-zinc-900 dark:ring-white/10">
          {(!category.image || errored) ? (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 dark:bg-zinc-900">
              <ImageOff size={18} className="text-stone-300 dark:text-zinc-700" />
            </div>
          ) : (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700"
              style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
              onError={() => setErrored(true)}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="mb-1 text-[10px] font-black uppercase tracking-[0.28em]"
            style={{ color: accent.color }}
          >
            {category.tag}
          </p>
          <h3 className="truncate font-serif text-lg capitalize leading-tight text-stone-900 dark:text-stone-100">
            {category.name}
          </h3>
          <p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">
            {category.property}
          </p>
        </div>

        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${accent.dot}, ${accent.color})`,
            transform: hovered ? "translateX(2px)" : "translateX(0px)",
          }}
        >
          <ArrowRight size={20} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, ${accent.color}08 0%, transparent 45%)`,
        }}
      />
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WineSignatureDrinks() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F4] pt-20 pb-24 dark:bg-[#0D0508]">
       <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "128px" }} />
       
       <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-12 max-w-2xl text-center md:text-left">
             <div className="mb-5 flex justify-center md:justify-start items-center gap-3">
               <div className="h-px w-10 bg-[#8B1A2A]/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B1A2A]">Sommelier Selection</span>
               <div className="h-px w-10 bg-[#8B1A2A]/40 md:hidden" />
             </div>
             <h2 className="font-serif text-4xl leading-[1.1] text-stone-900 md:text-5xl dark:text-stone-100">
               Signature <em className="not-italic text-[#8B1A2A] dark:text-[#C8956A]">Collections</em>
             </h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map((category, i) => (
              <CategoryCard key={category.id} category={category} index={i} />
            ))}
          </div>
       </div>
    </section>
  );
}
