import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UtensilsCrossed,
  Heart,
  ChefHat,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResturantpageOffers from "./ResturantpageOffers";
import { useNavigate } from "react-router-dom";
import resturant_buffet1 from "@/assets/resturant_images/resturant_buffet1.jpeg";
import {
  getAllBuffetSectionHeaders,
  getAllBuffetItems,
  getOfferHeaderById,
} from "@/Api/RestaurantApi";

// --- Static Fallback Data ---
const BUFFET_DATA_FALLBACK = [
  { id: "b1", img: resturant_buffet1 },
  { id: "b2", img: resturant_buffet1 },
  { id: "b3", img: resturant_buffet1 },
];

const BUFFET_HEADER_FALLBACK = {
  headlinePart1: "Buffet",
  headlinePart2: "Selection",
  description: "Explore international delicacies curated for every occasion.",
};

const OFFER_HEADER_FALLBACK = {
  headLine1: "Today's",
  headLine2: "Deals",
  description: "Claim your rewards on your favorite culinary treats.",
};

const SIGNATURE_DATA = [
  {
    id: "s1",
    name: "Butter Chicken",
    cuisine: "North Indian",
    description:
      "Our legendary cream-based curry with succulent clay-oven grilled chicken pieces.",
    img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800",
    likes: 1240,
    category: "italian",
  },
  {
    id: "s2",
    name: "Tandoori Jhinga",
    cuisine: "Coastal Tandoor",
    description:
      "Jumbo prawns marinated in a secret coastal spice mix and charred to perfection.",
    img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800",
    likes: 850,
    category: "italian",
  },
  {
    id: "s3",
    name: "Truffle Dim Sum",
    cuisine: "Asian Fusion",
    description:
      "Hand-rolled translucent dumplings infused with aromatic black truffle oil.",
    img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800",
    likes: 2100,
    category: "italian",
  },
  {
    id: "s4",
    name: "Szechuan Prawns",
    cuisine: "Szechuan",
    description:
      "Fiery wok-tossed prawns glazed in a bold and spicy authentic Szechuan pepper sauce.",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    likes: 1800,
    category: "italian",
  },
];

// --- Buffet Carousel ---
function BuffetCarousel({ items, onBook }) {
  const [active, setActive] = useState(0);
  const total = items.length;
  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);

  const positionStyles = {
    center: { zIndex: 30, scale: 1, x: "0%", opacity: 1 },
    left: { zIndex: 10, scale: 0.9, x: "-25%", opacity: 0.2 },
    right: { zIndex: 10, scale: 0.9, x: "25%", opacity: 0.2 },
    hidden: { zIndex: 0, scale: 0.7, opacity: 0 },
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full h-[400px] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Desktop Carousel */}
        <div className="hidden md:block relative w-full h-full">
          {items.map((item, idx) => {
            const pos =
              idx === active
                ? "center"
                : idx === (active - 1 + total) % total
                  ? "left"
                  : idx === (active + 1) % total
                    ? "right"
                    : "hidden";

            const imgSrc = item.media?.url || item.img || resturant_buffet1;

            return (
              <motion.div
                key={item.id}
                animate={positionStyles[pos]}
                transition={{ duration: 0.6 }}
                className={`absolute inset-0 m-auto w-[55%] h-[85%] rounded-[32px] overflow-hidden shadow-xl border border-white/20 backdrop-blur-md ${pos === "center" ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <img
                  src={imgSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={item.itemName || ""}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-left">
                  {item.price > 0 && (
                    <span className="w-fit px-3 py-1 rounded-full text-white text-[9px] font-black uppercase mb-3 bg-primary">
                      ₹{item.price}
                    </span>
                  )}
                  {item.itemName && (
                    <h3 className="text-white font-serif text-2xl mb-1">
                      {item.itemName}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-white/70 text-xs italic mb-4 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                  {item.ctaLink && item.ctaButtonText && (
                    <a
                      href={item.ctaLink}
                      className="w-fit py-2 px-6 rounded-full text-white text-[10px] font-black uppercase bg-primary"
                    >
                      {item.ctaButtonText}
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Stack */}
        <div className="md:hidden w-full space-y-4 px-2">
          {items.map((item) => {
            const imgSrc = item.media?.url || item.img || resturant_buffet1;
            return (
              <div
                key={item.id}
                className="h-60 rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={imgSrc}
                  className="w-full h-full object-cover"
                  alt={item.itemName || "Buffet"}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav Arrows (desktop) */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/80 dark:bg-zinc-800/80 rounded-full shadow"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/80 dark:bg-zinc-800/80 rounded-full shadow"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(Math.floor(target * 0.8));
  useEffect(() => {
    let start = count;
    const increment = (target - start) / 125;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

export default function EnhancedCulinaryCuration({ propertyId }) {
  console.log(propertyId);
  const navigate = useNavigate();

  // --- API State ---
  const [buffetHeader, setBuffetHeader] = useState(BUFFET_HEADER_FALLBACK);
  const [buffetItems, setBuffetItems] = useState(BUFFET_DATA_FALLBACK);
  const [offerHeader, setOfferHeader] = useState(OFFER_HEADER_FALLBACK);

  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    item: null,
    type: "book",
  });
  const [likedItems, setLikedItems] = useState({});

  // --- Fetch APIs — all filtered by numericPropertyId (prop from ResturantSubCategories) ---
  useEffect(() => {
    if (!propertyId) return;

    // Buffet Section Header — filter by propertyId, pick first active match
    getAllBuffetSectionHeaders()
      .then((res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (data && data.length > 0) {
          const matched = data.filter(
            (h) => h.propertyId === propertyId && h.isActive,
          );
          const active = matched[0];
          if (active) {
            setBuffetHeader({
              headlinePart1:
                active.headlinePart1 || BUFFET_HEADER_FALLBACK.headlinePart1,
              headlinePart2:
                active.headlinePart2 || BUFFET_HEADER_FALLBACK.headlinePart2,
              description:
                active.description || BUFFET_HEADER_FALLBACK.description,
            });
          }
        }
      })
      .catch(() => {
        // keep fallback
      });

    // Buffet Items — filter by propertyId + isActive, sort by displayOrder
    getAllBuffetItems()
      .then((res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (data && data.length > 0) {
          const matched = data
            .filter((item) => item.propertyId === propertyId && item.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder);
          setBuffetItems(matched.length > 0 ? matched : BUFFET_DATA_FALLBACK);
        }
      })
      .catch(() => {
        // keep fallback
      });

    // Offer Header — fetch by propertyId, validate it matches before applying
    getOfferHeaderById(propertyId)
      .then((res) => {
        const data = res?.data || res;
        if (data && data.propertyId === propertyId && data.isActive) {
          setOfferHeader({
            headLine1: data.headLine1 || OFFER_HEADER_FALLBACK.headLine1,
            headLine2: data.headLine2 || OFFER_HEADER_FALLBACK.headLine2,
            description: data.description || OFFER_HEADER_FALLBACK.description,
          });
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, [propertyId]);

  const handleLikeSubmit = () => {
    if (bookingModal.item) {
      setLikedItems((prev) => ({ ...prev, [bookingModal.item.id]: true }));
      setBookingModal({ isOpen: false, item: null, type: "book" });
    }
  };

  return (
    <div className="bg-white dark:bg-[#050505] transition-colors duration-500 pb-10">
      {/* 1. BUFFET & OFFERS */}
      <section className="pt-20 pb-12 border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Buffet Column */}
            <div className="lg:w-[70%] flex flex-col pt-8">
              {/* Buffet Header — from API */}
              <div className="mb-6 h-[100px]">
                <h2 className="text-3xl md:text-4xl font-serif dark:text-white mb-2">
                  {buffetHeader.headlinePart1}{" "}
                  <span className="italic text-primary">
                    {buffetHeader.headlinePart2}
                  </span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light truncate">
                  {buffetHeader.description}
                </p>
              </div>

              {/* Buffet Carousel — from API */}
              <BuffetCarousel
                items={buffetItems}
                onBook={(item) =>
                  setBookingModal({ isOpen: true, item, type: "book" })
                }
              />
            </div>

            {/* Offers Column */}
            <div className="lg:w-[30%] bg-zinc-50/50 dark:bg-white/[0.02] rounded-[40px] p-8 border border-zinc-100 dark:border-white/5 flex flex-col justify-end">
              {/* Offer Header — from API */}
              <div className="mb-6 h-[80px]">
                <h3 className="text-2xl font-serif dark:text-white mb-1">
                  {offerHeader.headLine1}{" "}
                  <span className="italic text-primary">
                    {offerHeader.headLine2}
                  </span>
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-light truncate">
                  {offerHeader.description}
                </p>
              </div>
              <ResturantpageOffers propertyId={propertyId} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE DISHES — unchanged */}
      <section className="pt-16 pb-2">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif dark:text-white mb-2">
                Signature{" "}
                <span className="italic text-primary">Masterpieces</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">
                Handcrafted masterpieces using premium ingredients and
                traditional techniques.
              </p>
            </div>
            {/* Chef Spotlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-5 bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-primary/10 max-w-lg shadow-sm"
            >
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=200"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  alt="Chef"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full border-2 border-white dark:border-zinc-900">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Quote className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-[10px] font-bold dark:text-zinc-400 uppercase tracking-widest">
                    Chef's Remark
                  </span>
                </div>
                <p className="text-sm italic dark:text-zinc-200 leading-snug">
                  "We don't just serve food; we serve memories crafted with
                  heritage spices."
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 pt-10">
            {SIGNATURE_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/resturant/${item.category}`)}
                className="group relative bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 p-8 flex-col items-center text-center flex cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl -mt-24 mb-4 transition-transform duration-700 group-hover:scale-105">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />

                  {/* Heart Icon in "Cross" Section */}
                  <button
                    onClick={() =>
                      setBookingModal({ isOpen: true, item, type: "like" })
                    }
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-primary hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={18}
                      className={likedItems[item.id] ? "fill-primary" : ""}
                    />
                  </button>
                </div>

                {/* Arrow Section: Item Category Tag */}
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                  {item.cuisine}
                </span>

                <div className="flex flex-col w-full items-center">
                  <h3 className="text-2xl font-serif text-zinc-900 dark:text-white mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-zinc-500 text-[13px] leading-snug line-clamp-2 italic mb-3">
                    "{item.description}"
                  </p>

                  {/* Like Counter */}
                  <div className="flex items-center justify-center gap-1.5 text-primary">
                    <Heart size={14} className="fill-primary" />
                    <span className="text-sm font-black">
                      <AnimatedCounter
                        target={
                          likedItems[item.id] ? item.likes + 1 : item.likes
                        }
                      />
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking / Like Modal — unchanged */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative text-left"
            >
              <button
                onClick={() =>
                  setBookingModal({ isOpen: false, item: null, type: "book" })
                }
                className="absolute top-6 right-6 p-2 text-zinc-400"
              >
                <X />
              </button>
              <h3 className="text-2xl font-serif mb-2 dark:text-white">
                {bookingModal.type === "like"
                  ? "Show your love"
                  : `Reserve ${bookingModal.item?.name || bookingModal.item?.itemName}`}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 italic">
                {bookingModal.type === "like"
                  ? "Share your details to like this dish."
                  : "Please provide your details below."}
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  className="h-14 rounded-2xl bg-zinc-50 border-none"
                />
                <Input
                  placeholder="Phone Number"
                  className="h-14 rounded-2xl bg-zinc-50 border-none"
                />
                <Button
                  onClick={
                    bookingModal.type === "like"
                      ? handleLikeSubmit
                      : () =>
                          setBookingModal({
                            isOpen: false,
                            item: null,
                            type: "book",
                          })
                  }
                  className="w-full h-14 bg-primary rounded-2xl font-black uppercase shadow-lg"
                >
                  {bookingModal.type === "like"
                    ? "Submit Like"
                    : "Confirm Request"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
