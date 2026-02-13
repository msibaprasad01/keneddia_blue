import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
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
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import GalleryModal from "@/modules/website/components/hotel-detail/GalleryModal";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

export default function CategoryHero({ content, propertyId }) {
  const navigate = useNavigate(); // Initialize navigate hook
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

  // Fallback to propertyId 27 if none provided, for the specific path requirement
  const restaurantPath = `/restaurant/${propertyId || 27}`;

  const gridImages = content.carouselImages || [
    content.heroImage,
    "https://images.unsplash.com/photo-1550966841-3ee5ad0110d3?q=80&w=1200",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200",
  ];

  const galleryMedia = gridImages.map((url, index) => ({
    url,
    type: "IMAGE",
    alt: `${content.title} ${index + 1}`
  }));

  const openGalleryAt = (index) => {
    setInitialGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(!isBookmarked ? "Added to bookmark" : "Removed from bookmark");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const socialPlatforms = [
    { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-[#25D366]', link: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-[#1877F2]', link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-[#E4405F]', link: `https://instagram.com` },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'bg-[#0A66C2]', link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <motion.div initial="initial" animate="animate" className="pt-24 pb-12 bg-gradient-to-b from-background to-muted/20">
      
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotel={{ 
            name: content.title, 
            location: "Ghaziabad, India", 
            propertyId: propertyId, 
            media: galleryMedia 
        }}
        initialImageIndex={initialGalleryIndex}
        galleryData={[]} 
      />

      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-background border rounded-3xl p-8 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20}/></button>
              <h3 className="text-xl font-bold mb-6">Share {content.title}</h3>
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
        {/* ── Updated Breadcrumb Navigation ── */}
        <motion.nav variants={fadeIn} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          {/* Navigate back to the specific restaurant page */}
          <Link to={restaurantPath} className="hover:text-primary transition-colors font-medium">
            Restaurant
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold truncate">{content.title}</span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <motion.div variants={staggerContainer} className="space-y-3 w-full text-left">
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                <Sparkles size={12} className="animate-pulse" /> PREMIUM EXPERIENCE
              </span>
              <div className="flex items-center gap-1.5 bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                <span>4.8</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-balance leading-tight">
              {content.title.split(" ")[0]}{" "}
              <span className="italic text-primary">
                {content.title.split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
              <div className="flex items-center gap-1.5 cursor-default">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Ghaziabad, India • ID: {propertyId}</span>
              </div>
              <a href="#" className="text-sm font-bold text-destructive hover:underline flex items-center gap-1">
                <Navigation className="w-4 h-4" /> View Map
              </a>
            </motion.div>
            
            <motion.p variants={fadeIn} className="text-zinc-500 dark:text-zinc-400 text-base max-w-2xl font-light italic">
               {content.description}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-3">
            <Button variant="outline" className="rounded-full active:scale-95" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button 
              variant="outline" 
              className={`rounded-full active:scale-95 transition-all ${isBookmarked ? 'bg-destructive/10 border-destructive text-destructive' : ''}`} 
              onClick={handleBookmark}
            >
              <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current text-destructive' : ''}`} /> 
              {isBookmarked ? "Saved" : "Save"}
            </Button>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[440px] rounded-3xl overflow-hidden shadow-xl relative">
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(0)}>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage src={gridImages[0]} alt={content.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          </div>

          <div className="md:col-span-1 flex flex-col gap-3">
            {[1, 2].map((idx) => (
              <div key={idx} className="h-1/2 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(idx)}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                <OptimizedImage src={gridImages[idx]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>

          <div className="md:col-span-1 relative group cursor-pointer overflow-hidden" onClick={() => openGalleryAt(3)}>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
            <OptimizedImage src={gridImages[3]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 text-black text-[11px] font-black shadow-lg transform transition-transform group-hover:scale-110 hover:bg-white"
              >
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>VIEW GALLERY</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}