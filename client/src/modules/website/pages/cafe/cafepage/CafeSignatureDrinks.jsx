import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  ImageOff,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteContent } from "@/data/siteContent";

const FILTERS = ["Brews", "Bites"];

const MENU_ITEMS = [
  {
    id: 1,
    title: "Single Origin Pour-Over",
    description:
      "Hand-poured through a single filter, this brew highlights the natural clarity and fruit tones of its origin bean.",
    image: siteContent.images.cafes.minimalist.src,
    tags: ["Brews", "Best Seller"],
    category: "Specialty Coffee",
    likes: 1180,
  },
  {
    id: 2,
    title: "Iced Matcha Latte",
    description:
      "Ceremonial-grade matcha whisked into cold oat milk for a smooth, grassy, and lightly sweet glass.",
    image: siteContent.images.cafes.library.src,
    tags: ["Brews", "Best Seller"],
    category: "Cold Beverages",
    likes: 960,
  },
  {
    id: 3,
    title: "Classic Cold Brew",
    description:
      "Slow-steeped overnight for 18 hours. Low acid, high clarity, cocoa and malt undertones.",
    image: siteContent.images.cafes.garden.src,
    tags: ["Brews", "Best Seller"],
    category: "Cold Coffee",
    likes: 1025,
  },
  {
    id: 4,
    title: "Hazelnut Cappuccino",
    description:
      "Toasted nut sweetness folded into velvet milk foam and a warm aromatic espresso base.",
    image: siteContent.images.cafes.parisian.src,
    tags: ["Brews", "Best Seller"],
    category: "Hot Coffee",
    likes: 890,
  },
  {
    id: 5,
    title: "Espresso Tonic",
    description:
      "Bright tonic sparkle, fresh espresso, and a citrus wedge — a sharper modern coffee serve.",
    image: siteContent.images.cafes.highTea.src,
    tags: ["Brews", "Best Seller"],
    category: "Special Brew",
    likes: 775,
  },
  {
    id: 6,
    title: "Salted Caramel Frappe",
    description:
      "Blended coffee, cream, and caramel in a frozen profile made for long slow cafe hours.",
    image: siteContent.images.cafes.bakery.src,
    tags: ["Brews", "Best Seller"],
    category: "Blended Coffee",
    likes: 840,
  },
  {
    id: 7,
    title: "Avocado Toast & Poached Egg",
    description:
      "Thick-cut sourdough, smashed avocado, two poached eggs, chilli flakes, and a drizzle of herb oil.",
    image: siteContent.images.cafes.minimalist.src,
    tags: ["Bites", "Best Seller"],
    category: "All-Day Brunch",
    likes: 1120,
  },
  {
    id: 8,
    title: "Belgian Waffle Stack",
    description:
      "Crisp on the outside, fluffy inside, topped with mascarpone, berries, and maple drizzle.",
    image: siteContent.images.cafes.bakery.src,
    tags: ["Bites", "Best Seller"],
    category: "Bakery",
    likes: 980,
  },
  {
    id: 9,
    title: "High Tea Platter for Two",
    description:
      "A tiered selection of finger sandwiches, petit fours, scones, and seasonal preserves.",
    image: siteContent.images.cafes.highTea.src,
    tags: ["Bites", "Best Seller"],
    category: "High Tea",
    likes: 870,
  },
  {
    id: 10,
    title: "Garden Brunch Board",
    description:
      "Cold cuts, artisan cheeses, seasonal fruit, house hummus, and warm flatbread on a sharing board.",
    image: siteContent.images.cafes.garden.src,
    tags: ["Bites", "Best Seller"],
    category: "Sharing Platter",
    likes: 810,
  },
  {
    id: 11,
    title: "Croissant & Jam",
    description:
      "Freshly baked butter croissant served warm with house-made seasonal jam and French-style cultured butter.",
    image: siteContent.images.cafes.parisian.src,
    tags: ["Bites", "Best Seller"],
    category: "Bakery",
    likes: 750,
  },
  {
    id: 12,
    title: "Smashed Banana Pancakes",
    description:
      "Fluffy banana pancakes topped with honey yoghurt, toasted granola, and a cocoa dust finish.",
    image: siteContent.images.cafes.library.src,
    tags: ["Bites", "Best Seller"],
    category: "All-Day Brunch",
    likes: 695,
  },
];

function CoffeeImage({ src, alt }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100">
        <ImageOff size={32} className="text-zinc-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(Math.floor(target * 0.8));

  useEffect(() => {
    let current = Math.floor(target * 0.8);
    const increment = Math.max(1, Math.ceil((target - current) / 40));
    const timer = window.setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 20);

    return () => window.clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function CafeSignatureDrinks() {
  const [activeFilter, setActiveFilter] = useState("Brews");
  const [expanded, setExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [likedItems, setLikedItems] = useState({});
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [likeModal, setLikeModal] = useState({ isOpen: false, item: null });
  const [likeForm, setLikeForm] = useState({ name: "", phone: "", description: "" });

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => item.tags.includes(activeFilter));
  }, [activeFilter, menuItems]);

  const primaryItems = filteredItems.slice(0, 4);
  const extraItems = filteredItems.slice(4);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setExpanded(false);
  };

  const handleLikeSubmit = () => {
    if (!likeModal.item) return;
    setLikeSubmitting(true);
    window.setTimeout(() => {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === likeModal.item.id ? { ...item, likes: item.likes + 1 } : item,
        ),
      );
      setLikedItems((prev) => ({ ...prev, [likeModal.item.id]: true }));
      setLikeModal({ isOpen: false, item: null });
      setLikeForm({ name: "", phone: "", description: "" });
      setLikeSubmitting(false);
      toast.success("Thanks for the love!");
    }, 500);
  };

  const closeLikeModal = () => {
    setLikeModal({ isOpen: false, item: null });
    setLikeForm({ name: "", phone: "", description: "" });
    setLikeSubmitting(false);
  };

  const renderCard = (item, index, keyPrefix = "") => (
    <motion.div
      key={`${keyPrefix}${item.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative flex cursor-pointer flex-col items-center rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-8 text-center"
    >
      <div className="relative -mt-24 mb-4 aspect-square w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
        <CoffeeImage src={item.image} alt={item.title} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLikeModal({ isOpen: true, item });
          }}
          className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-primary shadow-md backdrop-blur-md transition-transform hover:scale-110"
          aria-label={`Like ${item.title}`}
        >
          <Heart size={18} className={likedItems[item.id] ? "fill-primary" : ""} />
        </button>
      </div>

      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
        {item.category}
      </span>

      <div className="flex w-full flex-col items-center">
        <h3 className="mb-2 text-2xl font-serif leading-tight text-zinc-900">
          {item.title}
        </h3>
        {item.description && (
          <p className="mb-3 line-clamp-2 text-[13px] italic leading-snug text-zinc-500">
            "{item.description}"
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 text-primary">
          <Heart size={14} className="fill-primary" />
          <span className="text-sm font-black">
            <AnimatedCounter target={item.likes} />+
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="bg-white pb-2 pt-16">
      <div className="mx-auto max-w-[1400px] px-6 text-left md:px-12">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 lg:max-w-[80%]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Cafe Menu Spotlight
            </div>
            <h2 className="mb-2 text-3xl font-serif md:text-4xl">
              Our Signature <span className="italic text-primary">Menu</span>
            </h2>
            <div className="max-w-[80%]">
              <p className="text-sm font-light leading-relaxed text-zinc-500">
                From specialty brews and cold glasses to bakery bites and brunch boards — these are the items guests come back for.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? filter === "Brews"
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-20 pt-16 md:grid-cols-2 lg:grid-cols-4">
          {primaryItems.map((item, index) => renderCard(item, index))}
        </div>

        {extraItems.length > 0 && (
          <div className="px-5 pb-5 pt-8 lg:px-0 lg:pb-6">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition-all hover:border-primary/40 hover:text-primary"
              >
                {expanded ? "Show Less" : `Show More (${extraItems.length})`}
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
                    {extraItems.map((item, index) => renderCard(item, index, "extra-"))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {likeModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-zinc-100 bg-white p-10 text-left shadow-2xl"
            >
              <button
                type="button"
                onClick={closeLikeModal}
                className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100"
              >
                <X size={20} />
              </button>
              <h3 className="mb-2 text-2xl font-serif text-zinc-900">Show your love</h3>
              <p className="mb-6 text-xs italic text-zinc-500">
                Share your details to like {likeModal.item?.title || "this item"}.
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={likeForm.name}
                  onChange={(e) => setLikeForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-14 rounded-2xl border-none bg-zinc-50 shadow-sm"
                />
                <Input
                  placeholder="Phone Number"
                  value={likeForm.phone}
                  onChange={(e) => setLikeForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="h-14 rounded-2xl border-none bg-zinc-50 shadow-sm"
                />
                <Input
                  placeholder="Leave a comment"
                  value={likeForm.description}
                  onChange={(e) => setLikeForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="h-14 rounded-2xl border-none bg-zinc-50 shadow-sm"
                />
                <Button
                  disabled={!likeForm.name || !likeForm.phone || likeSubmitting}
                  onClick={handleLikeSubmit}
                  className="h-14 w-full rounded-2xl bg-primary font-black uppercase text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95"
                >
                  {likeSubmitting ? (
                    <Loader2 size={18} className="mx-auto animate-spin" />
                  ) : (
                    "Submit Like"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
