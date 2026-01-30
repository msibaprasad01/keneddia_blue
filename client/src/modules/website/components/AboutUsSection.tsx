import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Hotel,
  UtensilsCrossed,
  Coffee,
  Wine,
} from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { 
  getAboutUsAdmin, 
  getVenturesByAboutUsId, 
  getPublicRecognitionsByAboutUsId 
} from "@/Api/Api";

interface Venture {
  id: number;
  ventureName: string;
  logoUrl: string;
  isActive: boolean;
}

interface Recognition {
  id: number;
  value: string;
  title: string;
  subTitle: string;
  isActive: boolean;
}

interface AboutUsData {
  id: number;
  sectionTitle: string;
  subTitle: string;
  description: string;
  videoUrl: string;
  videoTitle: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function AboutUsSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch: About Us Section
  const fetchAboutUs = async () => {
    try {
      setIsLoading(true);
      const response = await getAboutUsAdmin();
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        const latestData = response.data[response.data.length - 1];
        setAboutUsData(latestData);
      }
    } catch (error) {
      console.error("Error fetching About Us:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Secondary Fetch: Ventures and Recognitions based on AboutUs ID
  const fetchRelatedData = async (id: number) => {
    try {
      const [venturesRes, recognitionsRes] = await Promise.all([
        getVenturesByAboutUsId(id),
        getPublicRecognitionsByAboutUsId(id)
      ]);

      if (venturesRes?.data) setVentures(venturesRes.data);
      if (recognitionsRes?.data) setRecognitions(recognitionsRes.data);
    } catch (error) {
      console.error("Error fetching related About Us data:", error);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  useEffect(() => {
    if (aboutUsData?.id) {
      fetchRelatedData(aboutUsData.id);
    }
  }, [aboutUsData?.id]);

  const mediaItems = [
    {
      type: "video",
      src: aboutUsData?.videoUrl 
        ? getYouTubeEmbedUrl(aboutUsData.videoUrl)
        : "https://www.youtube.com/embed/oqqrdFmYkO0",
    },
    {
      type: "image",
      src: siteContent.images.about.leadership,
      alt: "Award Winning Service",
    },
    {
      type: "image",
      src: siteContent.images.hero.slide2,
      alt: "Luxury Interiors",
    },
  ];

  return (
    <section className="py-10 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-muted" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-stretch">
          
          {/* Left Column: Media Showcase */}
          <div className="relative group flex flex-col">
            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/10 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  {mediaItems[currentMediaIndex].type === "video" ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`${mediaItems[currentMediaIndex].src}?autoplay=0&mute=1&controls=1`}
                      title={aboutUsData?.videoTitle || "Brand Video"}
                      className="w-full h-full object-cover aspect-video"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={(mediaItems[currentMediaIndex].src as any).src || mediaItems[currentMediaIndex].src}
                      alt="Showcase"
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {mediaItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentMediaIndex === index ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 text-muted-foreground">
                {aboutUsData?.sectionTitle || "ABOUT US"}
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-4 text-foreground">
                {aboutUsData?.subTitle || "Our Legacy"}
              </h3>
              <p className="text-lg font-light leading-relaxed text-muted-foreground">
                {aboutUsData?.description || "Loading our story..."}
              </p>
            </div>

            {/* Dynamic Ventures Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-70 text-muted-foreground">
                Our Ventures
              </h4>
              <div className="flex flex-wrap gap-8">
                {ventures.length > 0 ? (
                  ventures.map((venture) => (
                    <div key={venture.id} className="flex flex-col items-center space-y-3 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-900/90 border border-white/10 transition-transform group-hover:-translate-y-1">
                        <img 
                          src={venture.logoUrl} 
                          alt={venture.ventureName} 
                          className="w-10 h-10 object-contain rounded-full" 
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                        {venture.ventureName}
                      </span>
                    </div>
                  ))
                ) : (
                  // Fallback static ventures if API returns empty
                  [
                    { label: "Hotel", icon: Hotel },
                    { label: "Dining", icon: UtensilsCrossed },
                    { label: "Cafe", icon: Coffee },
                    { label: "Bar", icon: Wine }
                  ].map((v, i) => (
                    <div key={i} className="flex flex-col items-center space-y-3 opacity-40">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <v.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest">{v.label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dynamic Recognitions Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70 text-muted-foreground">
                Globally Recognized
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {recognitions.length > 0 ? (
                  recognitions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-secondary/20 border border-border/50 rounded-lg p-4 text-center group hover:border-primary/30 transition-all"
                    >
                      <div className="text-xl font-serif font-bold text-primary mb-1">
                        {item.value}
                      </div>
                      <div className="text-[10px] uppercase tracking-tighter font-bold text-foreground mb-1 leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-medium opacity-60">
                        {item.subTitle}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback skeletons/static data
                  [1, 2, 3].map((i) => (
                    <div key={i} className="bg-secondary/10 border border-border/20 rounded-lg p-4 h-24 animate-pulse" />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}