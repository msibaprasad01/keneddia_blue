// import { useEffect, useMemo, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ChevronDown,
//   ChevronUp,
//   ArrowLeft,
//   Sparkles,
//   ImageOff,
//   Heart,
// } from "lucide-react";

// // ─── DATA ────────────────────────────────────────────────────────────────────

// const CATEGORIES = [
//   {
//     id: "whiskey",
//     name: "Whiskey",
//     image:
//       "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
//     items: [
//       { id: 101, title: "Glenfiddich 12yr", description: "Fruity and mellow with hints of pear and subtle oak.", likes: 1240, tag: "Single Malt" },
//       { id: 102, title: "Johnnie Walker Black", description: "Smooth blend with dried fruit, vanilla, and a smoky finish.", likes: 980, tag: "Blended" },
//       { id: 103, title: "Maker's Mark", description: "Soft wheat bourbon with caramel, vanilla, and gentle spice.", likes: 870, tag: "Bourbon" },
//       { id: 104, title: "Jameson Irish", description: "Triple-distilled for a silky, light, and perfectly balanced dram.", likes: 760, tag: "Irish" },
//       { id: 105, title: "Laphroaig 10yr", description: "Intensely peaty with iodine notes and a long maritime finish.", likes: 690, tag: "Islay" },
//       { id: 106, title: "Bulleit Rye", description: "High rye mash bill delivering bold spice and a clean dry finish.", likes: 610, tag: "Rye" },
//     ],
//   },
//   {
//     id: "wine",
//     name: "Wine",
//     image:
//       "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
//     items: [
//       { id: 201, title: "Château Margaux", description: "Elegant Bordeaux with dark berry, cedar, and silky tannins.", likes: 1380, tag: "Red" },
//       { id: 202, title: "Pouilly-Fumé", description: "Crisp Loire Valley Sauvignon Blanc with flinty mineral character.", likes: 950, tag: "White" },
//       { id: 203, title: "Veuve Clicquot Brut", description: "Rich golden bubbles with toasty brioche and fresh citrus.", likes: 1100, tag: "Champagne" },
//       { id: 204, title: "Barolo Riserva", description: "Nebbiolo king with tar, rose, and commanding structure.", likes: 820, tag: "Red" },
//       { id: 205, title: "Sancerre Blanc", description: "Delicate gooseberry and white flower on a mineral spine.", likes: 740, tag: "White" },
//       { id: 206, title: "Whispering Angel Rosé", description: "Pale Provençal rosé with strawberry, peach, and a dry finish.", likes: 890, tag: "Rosé" },
//     ],
//   },
//   {
//     id: "beers",
//     name: "Beers",
//     image:
//       "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80",
//     items: [
//       { id: 301, title: "Weihenstephaner Hefe", description: "World's oldest brewery wheat beer — banana, clove, and haze.", likes: 1050, tag: "Wheat" },
//       { id: 302, title: "Guinness Draught", description: "Silky nitrogen pour with roasted coffee and dark chocolate.", likes: 1320, tag: "Stout" },
//       { id: 303, title: "Sierra Nevada Pale Ale", description: "Pioneering American pale ale with resinous pine and citrus hops.", likes: 870, tag: "Pale Ale" },
//       { id: 304, title: "Hoegaarden Wit", description: "Belgian white ale with orange peel, coriander, and a cloudy glow.", likes: 760, tag: "Witbier" },
//       { id: 305, title: "Duvel Golden Strong", description: "Deceptively strong Belgian golden ale, dry-hopped and effervescent.", likes: 680, tag: "Strong Ale" },
//       { id: 306, title: "Modelo Especial", description: "Clean, crisp Mexican lager with a light malt sweetness.", likes: 590, tag: "Lager" },
//     ],
//   },
//   {
//     id: "tasting-events",
//     name: "Tasting Events",
//     image:
//       "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
//     items: [
//       { id: 401, title: "Whiskey Master Class", description: "A guided flight through five single malts with the head sommelier.", likes: 520, tag: "Whiskey" },
//       { id: 402, title: "New World Wine Tour", description: "Six pours exploring Argentina, Chile, and South Africa.", likes: 480, tag: "Wine" },
//       { id: 403, title: "Craft Beer Lab", description: "Blind tasting of eight regional craft ales with food pairings.", likes: 410, tag: "Beer" },
//       { id: 404, title: "Champagne & Canapes", description: "Curated prestige cuvées paired with chef-crafted small bites.", likes: 640, tag: "Champagne" },
//       { id: 405, title: "Bourbon & Barbecue", description: "Four bourbons matched with house-smoked meats and sauces.", likes: 390, tag: "Bourbon" },
//       { id: 406, title: "Natural Wine Evening", description: "Organic, biodynamic, and low-intervention wines from small growers.", likes: 350, tag: "Natural Wine" },
//     ],
//   },
// ];

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// function DrinkImage({ src, alt }) {
//   const [errored, setErrored] = useState(false);
//   if (!src || errored) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-zinc-100">
//         <ImageOff size={32} className="text-zinc-300" />
//       </div>
//     );
//   }
//   return (
//     <img
//       src={src}
//       alt={alt}
//       className="h-full w-full object-cover"
//       onError={() => setErrored(true)}
//     />
//   );
// }

// function AnimatedCounter({ target }) {
//   const [count, setCount] = useState(Math.floor(target * 0.8));
//   useEffect(() => {
//     let current = Math.floor(target * 0.8);
//     const increment = Math.max(1, Math.ceil((target - current) / 40));
//     const timer = window.setInterval(() => {
//       current += increment;
//       if (current >= target) {
//         setCount(target);
//         window.clearInterval(timer);
//       } else {
//         setCount(current);
//       }
//     }, 20);
//     return () => window.clearInterval(timer);
//   }, [target]);
//   return <span>{count.toLocaleString()}</span>;
// }

// // ─── CATEGORY LIST PAGE ───────────────────────────────────────────────────────

// function CategoryPage({ category, onBack }) {
//   return (
//     <motion.div
//       key="category-page"
//       initial={{ opacity: 0, x: 60 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 60 }}
//       transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//       className="min-h-screen bg-[#0d0d0d] pb-20 pt-10"
//     >
//       <div className="mx-auto max-w-[1400px] px-6 md:px-12">
//         {/* Back button */}
//         <button
//           type="button"
//           onClick={onBack}
//           className="mb-10 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-amber-500/60 hover:text-amber-400"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         {/* Header */}
//         <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-400">
//               <Sparkles className="h-3.5 w-3.5" />
//               {category.name} Collection
//             </div>
//             <h2 className="text-4xl font-serif text-white md:text-5xl">
//               Our <span className="italic text-amber-400">{category.name}</span>
//             </h2>
//           </div>
//           <p className="max-w-xs text-sm font-light leading-relaxed text-zinc-500">
//             Explore our curated selection of premium {category.name.toLowerCase()} — each chosen for character, story, and taste.
//           </p>
//         </div>

//         {/* Category hero banner */}
//         <div className="relative mb-14 h-52 w-full overflow-hidden rounded-[2rem] md:h-72">
//           <DrinkImage src={category.image} alt={category.name} />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
//           <h3 className="absolute bottom-8 left-10 text-4xl font-serif italic text-white opacity-90">
//             {category.name}
//           </h3>
//         </div>

//         {/* Items grid */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {category.items.map((item, index) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.07 }}
//               className="group flex flex-col rounded-[1.75rem] border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.06)]"
//             >
//               <div className="mb-4 flex items-start justify-between">
//                 <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
//                   {item.tag}
//                 </span>
//                 <div className="flex items-center gap-1 text-amber-400">
//                   <Heart size={13} className="fill-amber-400" />
//                   <span className="text-xs font-black">
//                     <AnimatedCounter target={item.likes} />+
//                   </span>
//                 </div>
//               </div>

//               <h4 className="mb-2 text-xl font-serif text-white">{item.title}</h4>
//               <p className="text-[13px] italic leading-snug text-zinc-500">
//                 "{item.description}"
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// export default function BestSellers() {
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [expanded, setExpanded] = useState(false);

//   const primaryCategories = CATEGORIES.slice(0, 4);
//   const extraCategories = CATEGORIES.slice(4);

//   const renderCard = (category, index, keyPrefix = "") => (
//     <motion.div
//       key={`${keyPrefix}${category.id}`}
//       initial={{ opacity: 0, y: 24 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: index * 0.08 }}
//       onClick={() => setActiveCategory(category)}
//       className="group relative flex cursor-pointer flex-col items-center rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-8 text-center transition-shadow hover:shadow-xl"
//     >
//       {/* Image */}
//       <div className="relative -mt-24 mb-4 aspect-square w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
//         <DrinkImage src={category.image} alt={category.name} />
//         {/* Overlay on hover */}
//         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//           <span className="rounded-full border border-white/70 bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
//             View List
//           </span>
//         </div>
//       </div>

//       {/* Name */}
//       <h3 className="mb-1 text-2xl font-serif leading-tight text-zinc-900">
//         {category.name}
//       </h3>
//       <p className="text-xs text-zinc-400">{category.items.length} selections</p>
//     </motion.div>
//   );

//   return (
//     <div className="relative overflow-hidden">
//       <AnimatePresence mode="wait">
//         {activeCategory ? (
//           <CategoryPage
//             key="detail"
//             category={activeCategory}
//             onBack={() => setActiveCategory(null)}
//           />
//         ) : (
//           <motion.section
//             key="grid"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             className="bg-[#E4CDB0] pb-2 pt-16 dark:bg-[#050505]"
//           >
//             <div className="mx-auto max-w-[1400px] px-6 text-left md:px-12">
//               {/* Header */}
//               <div className="mb-20 flex flex-col items-start justify-between gap-8 lg:flex-row">
//                 <div className="min-w-0 flex-1 lg:max-w-[80%]">
//                   <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-700">
//                     <Sparkles className="h-3.5 w-3.5" />
//                     Menu Spotlight
//                   </div>
//                   <h2 className="mb-2 text-3xl font-serif md:text-4xl">
//                     Best Seller{" "}
//                     <span className="italic text-amber-700">Drinks Menu</span>
//                   </h2>
//                   <div className="max-w-[80%]">
//                     <p className="text-sm font-light leading-relaxed text-zinc-500">
//                       Click any category below to explore our curated selection of premium drinks and tasting experiences.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Primary cards grid */}
//               <div className="grid grid-cols-1 gap-x-6 gap-y-20 pt-16 md:grid-cols-2 lg:grid-cols-4">
//                 {primaryCategories.map((cat, index) => renderCard(cat, index))}
//               </div>

//               {/* Show more */}
//               {extraCategories.length > 0 && (
//                 <div className="px-5 pb-5 pt-8 lg:px-0 lg:pb-6">
//                   <div className="flex justify-center">
//                     <button
//                       type="button"
//                       onClick={() => setExpanded((c) => !c)}
//                       className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition-all hover:border-amber-500/40 hover:text-amber-700"
//                     >
//                       {expanded ? "Show Less" : `Show More (${extraCategories.length})`}
//                       {expanded ? (
//                         <ChevronUp className="h-4 w-4" />
//                       ) : (
//                         <ChevronDown className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>

//                   <AnimatePresence initial={false}>
//                     {expanded && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0, y: 10 }}
//                         animate={{ opacity: 1, height: "auto", y: 0 }}
//                         exit={{ opacity: 0, height: 0, y: 10 }}
//                         transition={{ duration: 0.25 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
//                           {extraCategories.map((cat, index) =>
//                             renderCard(cat, index, "extra-")
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  ImageOff,
  Star,
} from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "919999999999"; // ← Replace with your real number

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "whiskey",
    name: "Whiskey",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=85",
    tagline: "Aged to Perfection",
    items: [
      {
        id: 101,
        brand: "Glenfiddich",
        title: "12 Year Old",
        tag: "Single Malt",
        origin: "Scotland",
        abv: "40%",
        rating: 4.8,
        description: "Fruity, mellow with fresh pear notes and a hint of vanilla oak.",
        image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
        logo: "🥃",
        accent: "#C9922A",
      },
      {
        id: 102,
        brand: "Johnnie Walker",
        title: "Black Label",
        tag: "Blended Scotch",
        origin: "Scotland",
        abv: "40%",
        rating: 4.6,
        description: "Smooth dark fruit, vanilla sweetness, and a signature smoky finish.",
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80",
        logo: "🥃",
        accent: "#1A1A1A",
      },
      {
        id: 103,
        brand: "Maker's Mark",
        title: "Bourbon",
        tag: "Bourbon",
        origin: "Kentucky, USA",
        abv: "45%",
        rating: 4.5,
        description: "Soft wheat mash with rich caramel, toasted wood, and gentle spice.",
        image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80",
        logo: "🥃",
        accent: "#8B1A1A",
      },
      {
        id: 104,
        brand: "Jameson",
        title: "Irish Whiskey",
        tag: "Irish",
        origin: "Ireland",
        abv: "40%",
        rating: 4.4,
        description: "Triple-distilled for exceptional smoothness — light, nutty, perfectly balanced.",
        image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
        logo: "🥃",
        accent: "#2D5A27",
      },
      {
        id: 105,
        brand: "Laphroaig",
        title: "10 Year Old",
        tag: "Islay Single Malt",
        origin: "Islay, Scotland",
        abv: "40%",
        rating: 4.7,
        description: "Intensely peated with bold iodine, seaweed, and a long maritime finish.",
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80",
        logo: "🥃",
        accent: "#1E3A5F",
      },
      {
        id: 106,
        brand: "Bulleit",
        title: "Frontier Rye",
        tag: "Rye Whiskey",
        origin: "Kentucky, USA",
        abv: "45%",
        rating: 4.3,
        description: "High-rye boldness with warming spice, dried fruit, and a clean dry close.",
        image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80",
        logo: "🥃",
        accent: "#8B6914",
      },
    ],
  },
  {
    id: "wine",
    name: "Wine",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=85",
    tagline: "From Vine to Glass",
    items: [
      {
        id: 201,
        brand: "Château Margaux",
        title: "Premier Grand Cru",
        tag: "Red Bordeaux",
        origin: "Bordeaux, France",
        abv: "13.5%",
        rating: 4.9,
        description: "Opulent dark berry, cedar, violet, and silky polished tannins.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
        logo: "🍷",
        accent: "#6B1A2A",
      },
      {
        id: 202,
        brand: "Cloudy Bay",
        title: "Sauvignon Blanc",
        tag: "White Wine",
        origin: "Marlborough, NZ",
        abv: "13%",
        rating: 4.6,
        description: "Zesty passionfruit, citrus, and fresh herb on a crisp mineral finish.",
        image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80",
        logo: "🍷",
        accent: "#C8A951",
      },
      {
        id: 203,
        brand: "Veuve Clicquot",
        title: "Yellow Label Brut",
        tag: "Champagne",
        origin: "Reims, France",
        abv: "12%",
        rating: 4.8,
        description: "Toasty brioche, fresh apple, and a pinpoint persistent mousse.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        logo: "🥂",
        accent: "#F5C842",
      },
      {
        id: 204,
        brand: "Antinori",
        title: "Tignanello",
        tag: "Super Tuscan",
        origin: "Tuscany, Italy",
        abv: "14%",
        rating: 4.7,
        description: "Iconic blend of Sangiovese with dark plum, tobacco, and earthy depth.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
        logo: "🍷",
        accent: "#A0291E",
      },
      {
        id: 205,
        brand: "Whispering Angel",
        title: "Côtes de Provence",
        tag: "Rosé",
        origin: "Provence, France",
        abv: "13%",
        rating: 4.5,
        description: "Pale, elegant Provençal rosé with strawberry, peach, and a bone-dry finish.",
        image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&q=80",
        logo: "🌸",
        accent: "#D4A0A0",
      },
      {
        id: 206,
        brand: "Caymus",
        title: "Special Selection",
        tag: "Napa Cabernet",
        origin: "Napa Valley, USA",
        abv: "14.5%",
        rating: 4.9,
        description: "Plush and rich — blackcurrant, mocha, cassis, and a velvety seamless finish.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
        logo: "🍷",
        accent: "#3D1A0E",
      },
    ],
  },
  {
    id: "beers",
    name: "Beers",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=85",
    tagline: "Brewed with Passion",
    items: [
      {
        id: 301,
        brand: "Weihenstephaner",
        title: "Hefeweissbier",
        tag: "Wheat Beer",
        origin: "Bavaria, Germany",
        abv: "5.4%",
        rating: 4.8,
        description: "World's oldest brewery — banana, clove, and a beautifully hazy golden body.",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        logo: "🍺",
        accent: "#D4A017",
      },
      {
        id: 302,
        brand: "Guinness",
        title: "Draught",
        tag: "Irish Stout",
        origin: "Dublin, Ireland",
        abv: "4.2%",
        rating: 4.7,
        description: "Silky nitrogen cascade with roasted coffee, dark chocolate, and a creamy head.",
        image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80",
        logo: "🍺",
        accent: "#1A1A1A",
      },
      {
        id: 303,
        brand: "Sierra Nevada",
        title: "Pale Ale",
        tag: "American Pale Ale",
        origin: "California, USA",
        abv: "5.6%",
        rating: 4.5,
        description: "The craft beer pioneer — resinous pine, citrus hops, and a clean bitter finish.",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        logo: "🍺",
        accent: "#2E7D32",
      },
      {
        id: 304,
        brand: "Hoegaarden",
        title: "Witbier",
        tag: "Belgian White",
        origin: "Hoegaarden, Belgium",
        abv: "4.9%",
        rating: 4.4,
        description: "Refreshing wheat beer with orange peel, coriander, and a dreamy haze.",
        image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80",
        logo: "🍺",
        accent: "#C8A951",
      },
      {
        id: 305,
        brand: "Duvel",
        title: "Golden Strong",
        tag: "Belgian Strong Ale",
        origin: "Breendonk, Belgium",
        abv: "8.5%",
        rating: 4.6,
        description: "Deceivingly drinkable golden ale — dry-hopped, effervescent, powerfully smooth.",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        logo: "🍺",
        accent: "#E8B84B",
      },
      {
        id: 306,
        brand: "Modelo",
        title: "Especial",
        tag: "Mexican Lager",
        origin: "Mexico City, Mexico",
        abv: "4.4%",
        rating: 4.2,
        description: "Clean, crisp, and effortlessly refreshing with a gentle malt sweetness.",
        image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80",
        logo: "🍺",
        accent: "#C8960C",
      },
    ],
  },
  {
    id: "tasting-events",
    name: "Tasting Events",
    image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=800&q=85",
    tagline: "Guided Sensory Journeys",
    items: [
      {
        id: 401,
        brand: "House Experience",
        title: "Whiskey Master Class",
        tag: "Monthly",
        origin: "In-House",
        abv: "Varies",
        rating: 4.9,
        description: "Five single malts, one sommelier, one hour of guided discovery.",
        image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=400&q=80",
        logo: "🎓",
        accent: "#C9922A",
      },
      {
        id: 402,
        brand: "House Experience",
        title: "New World Wine Tour",
        tag: "Bi-Monthly",
        origin: "In-House",
        abv: "Varies",
        rating: 4.8,
        description: "Six pours exploring the bold new voices of South America and Oceania.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
        logo: "🌍",
        accent: "#6B1A2A",
      },
      {
        id: 403,
        brand: "House Experience",
        title: "Craft Beer Lab",
        tag: "Weekly",
        origin: "In-House",
        abv: "Varies",
        rating: 4.6,
        description: "Eight blind ales, food pairings, and a deep dive into brewing heritage.",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        logo: "🔬",
        accent: "#2E7D32",
      },
      {
        id: 404,
        brand: "House Experience",
        title: "Champagne & Canapés",
        tag: "Special",
        origin: "In-House",
        abv: "Varies",
        rating: 4.9,
        description: "Prestige cuvées paired with chef-crafted bites — an evening of pure elegance.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        logo: "🥂",
        accent: "#F5C842",
      },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function DrinkImage({ src, alt, className = "" }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored)
    return (
      <div className={`flex items-center justify-center bg-zinc-800 ${className}`}>
        <ImageOff size={28} className="text-zinc-600" />
      </div>
    );
  return (
    <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErrored(true)} />
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-zinc-700"}
        />
      ))}
      <span className="ml-1 text-[11px] font-bold text-amber-400">{rating}</span>
    </div>
  );
}

// WhatsApp SVG
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 32 32" fill="white" style={{ width: size, height: size }}>
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.52.663 4.882 1.818 6.932L2 30l7.302-1.784A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 01-5.892-1.607l-.422-.25-4.333 1.059 1.098-4.205-.275-.434A11.543 11.543 0 014.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.344-8.656c-.347-.174-2.055-1.014-2.375-1.13-.32-.115-.552-.173-.784.174-.232.347-.9 1.13-1.102 1.362-.202.232-.405.26-.752.086-.347-.174-1.464-.539-2.788-1.719-1.031-.917-1.726-2.05-1.929-2.397-.202-.347-.022-.534.152-.706.156-.155.347-.405.52-.607.174-.202.232-.347.347-.579.116-.232.058-.434-.029-.607-.087-.174-.784-1.89-1.074-2.59-.283-.68-.57-.588-.784-.598-.202-.01-.434-.012-.666-.012-.232 0-.607.087-.925.434-.318.347-1.216 1.188-1.216 2.897s1.245 3.36 1.418 3.592c.174.231 2.449 3.738 5.934 5.24.83.358 1.477.572 1.982.732.832.265 1.59.228 2.188.138.667-.1 2.055-.84 2.346-1.652.29-.812.29-1.508.202-1.652-.086-.144-.318-.231-.665-.405z" />
    </svg>
  );
}

// WhatsApp hover button — slides in label from the right
function WhatsAppButton({ item, categoryName }) {
  const [hovered, setHovered] = useState(false);
  const message = encodeURIComponent(
    `Hi! I'm interested in *${item.brand} – ${item.title}* (${categoryName}). Could you share more details?`
  );
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div
      className="absolute bottom-4 right-4 z-10 flex items-center justify-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 12, scaleX: 0.8 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            exit={{ opacity: 0, x: 12, scaleX: 0.8 }}
            style={{ originX: 1 }}
            className="mr-2 whitespace-nowrap rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-bold text-white shadow-lg shadow-green-900/50"
          >
            Query on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-green-900/40"
        aria-label="Query on WhatsApp"
      >
        <WhatsAppIcon size={20} />
      </motion.a>
    </div>
  );
}

// ─── BRAND CARD ───────────────────────────────────────────────────────────────

function BrandCard({ item, categoryName, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-zinc-900 transition-all duration-300 hover:border-white/10 hover:shadow-2xl"
    >
      {/* ── Image ── */}
      <div className="relative h-48 w-full overflow-hidden">
        <DrinkImage
          src={item.image}
          alt={item.title}
          className="h-full w-full transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark gradient so bottom text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

        {/* Tag pill – top left */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm"
          style={{ backgroundColor: item.accent + "dd" }}
        >
          {item.tag}
        </span>

        {/* Logo badge – top right */}
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xl shadow-md backdrop-blur-md">
          {item.logo}
        </div>

        {/* WhatsApp hover button */}
        <WhatsAppButton item={item} categoryName={categoryName} />
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-5">
        {/* Brand row */}
        <div className="mb-1 flex items-center justify-between gap-2">
          <span
            className="truncate text-[11px] font-black uppercase tracking-widest"
            style={{ color: item.accent }}
          >
            {item.brand}
          </span>
          <span className="shrink-0 text-[10px] text-zinc-500">{item.origin}</span>
        </div>

        {/* Title */}
        <h4 className="mb-2 font-serif text-[1.2rem] leading-tight text-white">
          {item.title}
        </h4>

        {/* Rating + ABV */}
        <div className="mb-3 flex items-center justify-between">
          <StarRating rating={item.rating} />
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
            ABV {item.abv}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-[12px] italic leading-relaxed text-zinc-500">
          "{item.description}"
        </p>
      </div>

      {/* Accent bar */}
      <div
        className="h-[3px] w-full transition-all duration-500 group-hover:h-[5px]"
        style={{ backgroundColor: item.accent, opacity: 0.75 }}
      />
    </motion.div>
  );
}

// ─── CATEGORY DETAIL PAGE ─────────────────────────────────────────────────────

function CategoryPage({ category, onBack }) {
  return (
    <motion.div
      key="cat-page"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0a0a0a] pb-24 pt-10"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-amber-500/60 hover:text-amber-400"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Hero banner */}
        <div className="relative mb-14 h-64 w-full overflow-hidden rounded-[2rem] md:h-80">
          <DrinkImage src={category.image} alt={category.name} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {category.tagline}
            </div>
            <h2 className="font-serif text-5xl italic text-white md:text-6xl">{category.name}</h2>
            <p className="mt-2 text-sm text-white/40">{category.items.length} premium selections</p>
          </div>
        </div>

        {/* Brand cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item, i) => (
            <BrandCard key={item.id} item={item} categoryName={category.name} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── CATEGORY GRID CARD (main page) ──────────────────────────────────────────

function CategoryGridCard({ category, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col items-center rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-8 text-center transition-shadow hover:shadow-xl"
    >
      <div className="relative -mt-24 mb-4 aspect-square w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
        <DrinkImage src={category.image} alt={category.name} className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-white/70 bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            Explore
          </span>
        </div>
      </div>
      <h3 className="mb-1 font-serif text-2xl leading-tight text-zinc-900">{category.name}</h3>
      <p className="text-xs italic text-zinc-500">{category.tagline}</p>
      <p className="mt-0.5 text-[11px] text-zinc-400">{category.items.length} selections</p>
    </motion.div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function BestSellers() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const primaryCategories = CATEGORIES.slice(0, 4);
  const extraCategories = CATEGORIES.slice(4);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {activeCategory ? (
          <CategoryPage
            key="detail"
            category={activeCategory}
            onBack={() => setActiveCategory(null)}
          />
        ) : (
          <motion.section
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#E4CDB0] pb-2 pt-16 dark:bg-[#050505]"
          >
            <div className="mx-auto max-w-[1400px] px-6 text-left md:px-12">
              {/* Header */}
              <div className="mb-20 flex flex-col items-start justify-between gap-8 lg:flex-row">
                <div className="min-w-0 flex-1 lg:max-w-[80%]">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Menu Spotlight
                  </div>
                  <h2 className="mb-2 font-serif text-3xl md:text-4xl">
                    Best Seller{" "}
                    <span className="italic text-amber-700">Drinks Menu</span>
                  </h2>
                  <div className="max-w-[80%]">
                    <p className="text-sm font-light leading-relaxed text-zinc-500">
                      Select a category to explore our curated selection. Hover over any item to enquire directly via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary grid */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-20 pt-16 md:grid-cols-2 lg:grid-cols-4">
                {primaryCategories.map((cat, i) => (
                  <CategoryGridCard
                    key={cat.id}
                    category={cat}
                    index={i}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>

              {/* Show more */}
              {extraCategories.length > 0 && (
                <div className="px-5 pb-5 pt-8 lg:px-0 lg:pb-6">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setExpanded((c) => !c)}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition-all hover:border-amber-500/40 hover:text-amber-700"
                    >
                      {expanded ? "Show Less" : `Show More (${extraCategories.length})`}
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
                          {extraCategories.map((cat, i) => (
                            <CategoryGridCard
                              key={cat.id}
                              category={cat}
                              index={i}
                              onClick={() => setActiveCategory(cat)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}