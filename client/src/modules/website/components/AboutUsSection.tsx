import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Hotel,
  UtensilsCrossed,
  Coffee,
  Wine,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getAboutUsAdmin } from "@/Api/Api";

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
  ventures: any[];
  recognitions: any[];
  createdAt: string;
  updatedAt: string;
}

const brandLogos = [
  { label: "Hotel", icon: Hotel, logo: siteContent.brand.logo_hotel.image },
  {
    label: "Restaurant",
    icon: UtensilsCrossed,
    logo: siteContent.brand.logo.image,
  },
  { label: "Cafe", icon: Coffee, logo: siteContent.brand.logo_cafe.image },
  { label: "Liquor Shop", icon: Wine, logo: siteContent.brand.logo_bar.image },
];

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function AboutUsSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAboutUs = async () => {
    try {
      setIsLoading(true);
      const response = await getAboutUsAdmin();
      console.log("About Us API response:", response?.data);
      
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the latest entry (last item in array)
        const latestData = response.data[response.data.length - 1];
        setAboutUsData(latestData);
      }
    } catch (error) {
      console.error("Error fetching About Us:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  // Dynamic media items with fallback
  const mediaItems = [
    {
      type: "video",
      src: aboutUsData?.videoUrl 
        ? getYouTubeEmbedUrl(aboutUsData.videoUrl)
        : "https://www.youtube.com/embed/oqqrdFmYkO0",
      poster: siteContent.images.about.main,
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
            <div
              className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl bg-card border border-border/10"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
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
                    <div className="w-full h-full relative bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`${mediaItems[currentMediaIndex].src as string}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1`}
                        title={aboutUsData?.videoTitle || "Brand Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <OptimizedImage
                      src={(mediaItems[currentMediaIndex].src as any).src}
                      alt={
                        (mediaItems[currentMediaIndex].src as any).alt ||
                        "Gallery Image"
                      }
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {mediaItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentMediaIndex === index
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Header Section */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 text-muted-foreground">
                {aboutUsData?.sectionTitle || siteContent.text.about.sectionTitle}
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-4 text-foreground">
                {aboutUsData?.subTitle || siteContent.brand.name}
              </h3>

              <p className="text-lg font-light leading-relaxed text-muted-foreground">
                {aboutUsData?.description || 
                  `${siteContent.text.about.carousel[0].description} ${siteContent.brand.tagline}`
                }
              </p>
            </div>

            {/* Brand Logos Grid - Static with logo text preserved */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70 text-muted-foreground">
                {aboutUsData?.ventures && aboutUsData.ventures.length > 0 
                  ? "Our Ventures" 
                  : "Our Ventures"}
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {brandLogos.map((brand) => (
                  <div
                    key={brand.label}
                    className="flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 bg-slate-900/90 dark:bg-accent/5 border border-border/10">
                      <img
                        src={brand.logo.src}
                        alt={brand.label}
                        className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:scale-[1.15]"
                        style={{
                          filter: "none",
                          mixBlendMode: "normal",
                        }}
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-medium opacity-60 group-hover:opacity-100 transition-opacity text-muted-foreground">
                      {brand.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Globally Recognized Section - Dynamic with fallback */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70 text-muted-foreground">
                Globally Recognized
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(aboutUsData?.recognitions && aboutUsData.recognitions.length > 0
                  ? aboutUsData.recognitions
                  : (siteContent.text as any).recognitions || []
                ).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-secondary/20 border border-border/50 rounded-lg p-3 text-center group hover:border-primary/30 transition-colors"
                  >
                    <div className="text-lg font-serif font-bold text-primary mb-0.5 tracking-tight">
                      {item.score}
                    </div>
                    <div className="text-[9px] uppercase tracking-tighter font-bold text-foreground mb-1 leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-medium opacity-60">
                      {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Details Link - Dynamic with fallback */}
            <div>
              <Link
                to={aboutUsData?.ctaButtonUrl || "/about"}
                className="inline-flex items-center text-xs font-medium tracking-wide hover:underline underline-offset-4 transition-all text-muted-foreground hover:text-primary"
              >
                {aboutUsData?.ctaButtonText || "More details"}
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}