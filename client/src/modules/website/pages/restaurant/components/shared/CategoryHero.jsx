import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Share2,
  Heart,
  ChevronRight,
  Star,
  Navigation,
  Image as ImageIcon,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Sparkles,
  Twitter,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import GalleryModal from "@/modules/website/components/hotel-detail/GalleryModal";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

// ── Fallbacks ─────────────────────────────────────────────────────────────────
const FALLBACK_LOCATION = "Ghaziabad, India";
const FALLBACK_NEARBY = [
  "0.2 km from Gateway of India",
  "2.5 km from Marine Drive",
];
const FALLBACK_TAGLINE = "PREMIUM EXPERIENCE";
const FALLBACK_MAPS_LINK =
  "https://google.com/maps/place/kennedia+blu+restaurant+ghaziabad/data=!4m2!3m1!1s0x390cf1005bab4c6f:0xb455a48e012d76e7?sa=X&ved=1t:242&ictx=111";

export default function CategoryHero({
  content,
  propertyId,
  galleryData = [],
  propertyData,
}) {
  const navigate = useNavigate();
  console.log('propertyData->',propertyData)
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareReactions, setShowShareReactions] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

  const restaurantPath = `/resturant/${propertyId || 27}`;

  // ── Derive fields from propertyData, fall back to statics ─────────────────
  const location = useMemo(() => {
    if (!propertyData) return FALLBACK_LOCATION;
    return (
      propertyData.fullAddress ??
      propertyData.address ??
      propertyData.location ??
      FALLBACK_LOCATION
    );
  }, [propertyData]);

  const city = useMemo(() => {
    if (!propertyData) return "";
    return propertyData.city ?? propertyData.locationName ?? "";
  }, [propertyData]);

  const tagline = useMemo(() => {
    if (!propertyData) return FALLBACK_TAGLINE;
    return propertyData.tagline ?? propertyData.subTitle ?? FALLBACK_TAGLINE;
  }, [propertyData]);

  const rating = useMemo(() => {
    return propertyData?.rating ?? null;
  }, [propertyData]);

  const nearbyPlaces = useMemo(() => {
    if (propertyData?.nearbyLocations?.length > 0) {
      return propertyData.nearbyLocations.map((n) => ({
        nearbyLocationName: n.nearbyLocationName,
        googleMapLink: n.googleMapLink,
      }));
    }
    // fallback from content prop (old static shape) or hardcoded
    if (content?.nearbyPlaces?.length > 0) {
      return content.nearbyPlaces.map((p) =>
        typeof p === "string" ? { nearbyLocationName: p } : p,
      );
    }
    return FALLBACK_NEARBY.map((name) => ({ nearbyLocationName: name }));
  }, [propertyData, content]);

  const mapsLink = useMemo(() => {
    if (propertyData?.latitude && propertyData?.longitude) {
      return `https://www.google.com/maps?q=${propertyData.latitude},${propertyData.longitude}`;
    }
    if (propertyData?.coordinates?.lat && propertyData?.coordinates?.lng) {
      return `https://www.google.com/maps?q=${propertyData.coordinates.lat},${propertyData.coordinates.lng}`;
    }
    return FALLBACK_MAPS_LINK;
  }, [propertyData]);

  // ── Gallery images ─────────────────────────────────────────────────────────
  const gridImages =
    galleryData.length > 0
      ? galleryData.filter((g) => g.media?.url).map((g) => g.media.url)
      : [content.heroImage];

  const galleryMedia =
    galleryData.length > 0
      ? galleryData
          .filter((g) => g.media?.url)
          .map((g) => ({
            mediaId: g.media.mediaId,
            url: g.media.url,
            type: g.media.type,
            fileName: g.media.fileName,
            alt: g.media.alt,
          }))
      : [];

  const openGalleryAt = (index) => {
    setInitialGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    isBookmarked
      ? toast("Removed from bookmark")
      : toast.success("Added to bookmark");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={20} />,
      color: "bg-[#25D366]",
      link: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      color: "bg-[#1877F2]",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X",
      icon: <Twitter size={18} />,
      color: "bg-black",
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      color: "bg-[#0A66C2]",
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="pt-24 pb-12 bg-gradient-to-b from-background to-muted/20"
    >
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotel={{
          name: content.title,
          location: location,
          propertyId: propertyId,
          media: galleryMedia,
        }}
        initialImageIndex={initialGalleryIndex}
        galleryData={galleryData}
      />

      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeIn}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={restaurantPath}
            className="hover:text-primary transition-colors font-medium"
          >
            Restaurant
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold truncate">
            {content.title}
          </span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <motion.div
            variants={staggerContainer}
            className="space-y-3 w-full text-left"
          >
            {/* Badge + Rating */}
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                <Sparkles size={12} className="animate-pulse" /> {tagline}
              </span>
              {rating && (
                <div className="flex items-center gap-1.5 bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                  <span>{rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
              )}
            </motion.div>

            {/* ── TITLE — kept exactly as original ── */}
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-balance leading-tight"
            >
              {content.title.split(" ")[0]}{" "}
              <span className="italic text-primary">
                {content.title.split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            <div className="space-y-2">
              {/* Location row */}
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground"
              >
                <div className="flex items-center gap-1.5 cursor-default">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {location}
                    {city && location !== city ? `, ${city}` : ""}
                    {" • ID: "}
                    {propertyId}
                  </span>
                </div>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-destructive hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-4 h-4" /> View Map
                </a>
              </motion.div>

              {/* Nearby landmarks */}
              {nearbyPlaces.length > 0 && (
                <motion.div
                  variants={fadeIn}
                  className="flex flex-wrap items-center gap-4 pt-1"
                >
                  {nearbyPlaces.map((place, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground/80"
                    >
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      {place.googleMapLink ? (
                        <a
                          href={place.googleMapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition cursor-pointer"
                        >
                          {place.nearbyLocationName}
                        </a>
                      ) : (
                        <span>{place.nearbyLocationName}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Share + Save */}
          <div className="flex gap-3 relative">
            <div
              className="relative"
              onMouseEnter={() => setShowShareReactions(true)}
              onMouseLeave={() => setShowShareReactions(false)}
            >
              <AnimatePresence>
                {showShareReactions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -60, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/10 shadow-2xl rounded-full px-2.5 py-2 flex gap-2.5 z-50 backdrop-blur-md"
                  >
                    {socialPlatforms.map((platform, index) => (
                      <motion.a
                        key={platform.name}
                        href={platform.link}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.2, y: -3 }}
                        className={`${platform.color} text-white p-2.5 rounded-full shadow-lg transition-transform flex items-center justify-center`}
                      >
                        {platform.icon}
                        <span className="sr-only">{platform.name}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                variant="outline"
                className="rounded-full active:scale-95"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>

            <Button
              variant="outline"
              className={`rounded-full active:scale-95 transition-all ${isBookmarked ? "bg-destructive/10 border-destructive text-destructive" : ""}`}
              onClick={handleBookmark}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current text-destructive" : ""}`}
              />
              {isBookmarked ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Photo grid */}
        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[440px] rounded-3xl overflow-hidden shadow-xl relative"
        >
          <div
            className="md:col-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => openGalleryAt(0)}
          >
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage
              src={gridImages[0]}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <div className="md:col-span-1 flex flex-col gap-3">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="h-1/2 relative group cursor-pointer overflow-hidden"
                onClick={() => openGalleryAt(idx)}
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                <OptimizedImage
                  src={gridImages[idx]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div
            className="md:col-span-1 relative group cursor-pointer overflow-hidden"
            onClick={() => openGalleryAt(3)}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage
              src={gridImages[3]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryOpen(true);
                }}
                className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 text-black text-[11px] font-black shadow-lg transform transition-transform group-hover:scale-110 hover:bg-white"
              >
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>
                  {gridImages.length > 4
                    ? `+${gridImages.length - 4} MORE`
                    : "VIEW GALLERY"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
