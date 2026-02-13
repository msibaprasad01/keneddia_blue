import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Share2,
  Heart,
  ChevronRight,
  Loader2,
  Star,
  Navigation,
  Image as ImageIcon,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { GetAllPropertyDetails, getAllGalleries } from "@/Api/Api";
import GalleryModal from "@/modules/website/components/hotel-detail/GalleryModal";
import { toast } from "react-hot-toast";

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface PropertyMedia {
  mediaId: number | null;
  type: string;
  url: string;
  fileName: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
}

interface RestaurantData {
  id: number;
  propertyId: number;
  name: string;
  location: string;
  city: string;
  type: string;
  tagline: string;
  rating: number | null;
  price: string;
  media: PropertyMedia[];
  coordinates: { lat: number; lng: number } | null;
  image: { src: string; alt: string };
  nearbyPlaces?: string[];
}

interface GalleryItem {
  id: number;
  category: string;
  propertyId: number;
  propertyName: string;
  media: PropertyMedia;
  isActive: boolean;
}

// ─── Fallback Data (Explicitly Typed) ───────────────────────────────────────

const FALLBACK_RESTAURANT: RestaurantData = {
  id: 0,
  propertyId: 0,
  name: "The Grand Dining Restaurant",
  location: "123 Heritage Lane, Near Gateway Arch",
  city: "Mumbai",
  type: "FINE DINING",
  tagline: "Experience culinary excellence in every bite.",
  rating: 4.8,
  price: "₹2,500",
  media: [
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200", type: "IMAGE", alt: "Restaurant Ambience", mediaId: null, fileName: null, width: null, height: null },
    { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800", type: "IMAGE", alt: "Interior", mediaId: null, fileName: null, width: null, height: null },
    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800", type: "IMAGE", alt: "Dish", mediaId: null, fileName: null, width: null, height: null },
    { url: "https://images.unsplash.com/photo-1550966841-3ee5ad0110d3?q=80&w=800", type: "IMAGE", alt: "Service", mediaId: null, fileName: null, width: null, height: null },
  ],
  coordinates: { lat: 18.922, lng: 72.8347 },
  image: { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200", alt: "The Grand Dining" },
  nearbyPlaces: ["0.2 km from Gateway of India", "2.5 km from Marine Drive"],
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

// ─── Component ───────────────────────────────────────────────────────────────

function ResturantBanner() {
  const params = useParams<{ propertyId?: string }>();
  
  // FIX: Explicitly typed useState to prevent 'SetStateAction<null>' error
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState<number>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    // Initializing with Fallback
    setRestaurant(FALLBACK_RESTAURANT);
    setLoading(false);
  }, []);

  const topGridImages = useMemo(() => {
    const combined = [...(restaurant?.media || []), ...galleryData.map((g) => g.media)];
    if (combined.length === 0) return FALLBACK_RESTAURANT.media;
    return combined.filter((m) => m && m.url);
  }, [restaurant?.media, galleryData]);

  const openGalleryAt = (index: number) => {
    setInitialGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("Added to bookmark");
    } else {
      toast("Removed from bookmark");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const socialPlatforms = [
    { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-[#25D366]', link: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-[#1877F2]', link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-[#E4405F]', link: `https://instagram.com` },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'bg-[#0A66C2]', link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;
  if (!restaurant) return null;

  return (
    <motion.div initial="initial" animate="animate" className="pt-24 pb-12 bg-gradient-to-b from-background to-muted/20">
      
      {/* ── Gallery Modal ── */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotel={{ 
            name: restaurant.name, 
            location: restaurant.location, 
            propertyId: restaurant.propertyId, 
            media: restaurant.media 
        }}
        initialImageIndex={initialGalleryIndex}
        galleryData={galleryData}
      />

      {/* ── Share Popup ── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-background border rounded-3xl p-8 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20}/></button>
              <h3 className="text-xl font-bold mb-6">Share This Place</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialPlatforms.map((p) => (
                  <a key={p.name} href={p.link} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all group">
                    <div className={`${p.color} text-white p-3 rounded-full group-hover:scale-110 transition-transform`}>{p.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{p.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.nav variants={fadeIn} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/resturants" className="hover:text-primary transition-colors">resturants</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold truncate">{restaurant.name}</span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <motion.div variants={staggerContainer} className="space-y-3 w-full">
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <span className="inline-flex bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{restaurant.type}</span>
              {restaurant.rating && <div className="flex items-center gap-1.5 bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm"><span>{restaurant.rating}</span><Star className="w-3 h-3 fill-white" /></div>}
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-serif font-bold tracking-tight">{restaurant.name}</motion.h1>
            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
              <div className="flex items-center gap-1.5 cursor-default"><MapPin className="w-4 h-4 text-primary" /><span className="text-sm font-medium">{restaurant.location}, {restaurant.city}</span></div>
              {restaurant.coordinates && <a href={`https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-destructive hover:underline flex items-center gap-1"><Navigation className="w-4 h-4" /> View Map</a>}
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4 pt-1">
               {restaurant.nearbyPlaces?.map((place, i) => (
                 <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                   <div className="w-1 h-1 rounded-full bg-primary/40" />
                   <span>{place}</span>
                 </div>
               ))}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-3">
            <Button variant="outline" className="rounded-full active:scale-95" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" className={`rounded-full active:scale-95 transition-all ${isBookmarked ? 'bg-destructive/10 border-destructive text-destructive' : ''}`} onClick={handleBookmark}>
              <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current text-destructive' : ''}`} /> 
              {isBookmarked ? "Bookmarked" : "Save"}
            </Button>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[440px] rounded-3xl overflow-hidden shadow-xl relative">
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(0)}>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage src={topGridImages[0]?.url || ""} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          </div>

          <div className="md:col-span-1 flex flex-col gap-3">
            {[1, 2].map((idx) => (
              <div key={idx} className="h-1/2 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(idx)}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                <OptimizedImage src={topGridImages[idx]?.url || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>

          <div className="md:col-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(3)}>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage src={topGridImages[3]?.url || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 text-black text-[11px] font-black shadow-lg transform transition-transform group-hover:scale-110 hover:bg-white"
              >
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>{topGridImages.length > 4 ? `+${topGridImages.length - 4} MORE` : 'VIEW GALLERY'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ResturantBanner;