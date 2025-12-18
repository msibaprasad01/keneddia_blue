import { useState, useRef } from "react";
import { Star, Upload, Send, Quote, X, Youtube, Image as ImageIcon, Film, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";

export default function OurStoryPreview() {
  const { experienceShowcase } = siteContent.text;
  const [mediaPreviews, setMediaPreviews] = useState<{ type: 'image' | 'video', url: string }[]>([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback if data isn't ready type-safe check
  if (!experienceShowcase) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => ({
        type: file.type.startsWith('video') ? 'video' as const : 'image' as const,
        url: URL.createObjectURL(file)
      }));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleYoutubeLinkAdd = () => {
    if (youtubeLink.trim()) {
      setShowYoutubeInput(false);
    }
  };

  const hasMedia = mediaPreviews.length > 0 || youtubeLink;
  const canSubmit = feedbackText.trim() || hasMedia;

  return (
    <section id="story" className="py-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Unified Container with Same Height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT: Experience Slider (Span 8) */}
          <div className="lg:col-span-8 order-2 lg:order-1 bg-card border border-border rounded-lg p-5 shadow-sm hover:border-primary/50 transition-all duration-300 hover:shadow-md flex flex-col">
            <div className="mb-5">
              <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase block mb-2">
                Guest Experiences
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                {experienceShowcase.title}
              </h2>
            </div>

            <div className="flex-grow">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 16 },
                }}
                speed={800}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                watchSlidesProgress={true}
                className="w-full experience-swiper py-2 !pb-12 lg:!pb-2"
              >
                {experienceShowcase.items.map((item: any, index: number) => (
                  <SwiperSlide key={index} className="h-auto">
                    <div className="group bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-md">
                      {/* Image Top */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <OptimizedImage
                          src={item.image.src}
                          alt={item.image.alt}
                          priority={index < 3}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white/90">
                          <Quote className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Content Bottom */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-base font-serif font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-grow italic">
                          "{item.description}"
                        </p>
                        <div className="mt-auto pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
                          <span className="text-foreground truncate">{item.author}</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Rating and Explore More - Below Cards */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">
                  5.0★ from 2,500+ reviews
                </span>
              </motion.div>

              {/* Explore More */}
              <button className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                Explore more
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT: Enhanced Submission Panel (Span 4) */}
          <div className="lg:col-span-4 order-1 lg:order-2 bg-card border border-border rounded-lg p-5 shadow-sm hover:border-primary/50 transition-all duration-300 hover:shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                Share Your Moment
              </h4>
            </div>

            <div className="space-y-4 flex-grow flex flex-col">
              {/* Media Preview Area - Shows when media exists */}
              <AnimatePresence>
                {hasMedia && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {mediaPreviews.map((media, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-secondary/50 group">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/10">
                            <Film className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {youtubeLink && (
                      <div className="relative aspect-square rounded-md overflow-hidden bg-red-500/10 border border-red-500/20 flex items-center justify-center group">
                        <Youtube className="w-8 h-8 text-red-500" />
                        <button
                          onClick={() => {
                            setYoutubeLink("");
                            setShowYoutubeInput(false);
                          }}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Conditional Upload Section */}
              {/* Scenario 1: No YouTube link - Show upload options */}
              {!youtubeLink && (
                <div className="flex gap-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-grow border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/30 transition-colors group min-h-[100px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                      {mediaPreviews.length > 0 ? 'Add More' : 'Upload Media'}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                      className={`p-3 rounded-lg border transition-all ${showYoutubeInput
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40'
                        }`}
                      title="Add YouTube Link"
                    >
                      <Youtube className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario 2: YouTube link exists - Show message instead of upload */}
              {youtubeLink && (
                <div className="border border-border/50 rounded-lg p-4 bg-secondary/20">
                  <p className="text-xs text-muted-foreground text-center italic">
                    YouTube link added. Remove it to upload images/videos.
                  </p>
                </div>
              )}

              {/* YouTube Link Input - Conditional */}
              <AnimatePresence>
                {showYoutubeInput && !youtubeLink && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      placeholder="Paste YouTube link here..."
                      className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <button
                      onClick={handleYoutubeLinkAdd}
                      disabled={!youtubeLink.trim()}
                      className="w-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add YouTube Link
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text Input - Conditional based on scenario */}
              <div className="flex-grow">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    hasMedia
                      ? "Add description (optional)..."
                      : "Describe your experience..."
                  }
                  className="w-full h-full min-h-[80px] bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/70 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={!canSubmit}
                className="w-full bg-primary text-primary-foreground text-xs font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {hasMedia && !feedbackText ? 'Submit Media' : 'Confirm Submission'}
                <Send className="w-3 h-3" />
              </button>

              {/* Submission Info */}
              <p className="text-[10px] text-muted-foreground text-center italic">
                {!hasMedia && !feedbackText && "Add text or media to submit"}
                {hasMedia && !feedbackText && "Media ready to submit"}
                {feedbackText && !hasMedia && "Text feedback ready"}
                {feedbackText && hasMedia && "Complete submission ready"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}