import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import { siteContent } from "@/data/siteContent";

import "swiper/css";

function OfferCard({ offer, index }) {
  const accentStyles = [
    "from-[#9e003f] via-[#b10046] to-[#7f0033] text-white",
    "from-[#ffb400] via-[#ffcb45] to-[#ffab00] text-[#2f1f00]",
    "from-[#b0004b] via-[#cb0055] to-[#8a003b] text-white",
    "from-[#ffb000] via-[#ffc73a] to-[#f59e0b] text-[#2f1f00]",
  ];
  const accentClass = accentStyles[index % accentStyles.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`group relative flex h-[148px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r p-4 shadow-[0_14px_28px_-18px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.55)] ${accentClass}`}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
      </div>

      <a
        href={offer.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 z-20"
        aria-label={offer.ctaText || "View Offer"}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-current backdrop-blur-md transition-colors hover:bg-white hover:text-black">
          <ExternalLink className="h-4 w-4" />
        </div>
      </a>

      <div className="relative z-10 min-w-0">
        {offer.location && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/16 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-md ring-1 ring-white/20">
            <MapPin className="h-3 w-3" />
            {offer.location}
          </div>
        )}

        <h3 className="line-clamp-2 text-lg font-black leading-[1.1] tracking-tight">
          {offer.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[13px] leading-snug opacity-90">
          {offer.description}
        </p>
      </div>

      <div className="relative z-10 mt-4 border-t border-white/20 pt-3" />
    </motion.div>
  );
}

export default function RestaurantOffers() {
  const [swiper, setSwiper] = useState(null);
  const offers = siteContent?.text?.dailyOffers?.offers || [];

  if (!offers.length) return null;

  return (
    <section id="offers" className="bg-muted py-10">
      <div className="container mx-auto px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Curated Savings
            </span>
            <h2 className="text-2xl font-serif md:text-3xl">
              {siteContent?.text?.dailyOffers?.title || "Restaurant Offers"}
            </h2>
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            <button
              onClick={() => swiper?.slidePrev()}
              className="rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-white/50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-white/50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.2 },
            1200: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={setSwiper}
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={`${offer.title}-${index}`}>
              <OfferCard offer={offer} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
