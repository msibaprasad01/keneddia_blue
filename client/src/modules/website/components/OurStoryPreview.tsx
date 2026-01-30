import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Star,
  Upload,
  Send,
  Quote,
  X,
  Youtube,
  Image as ImageIcon,
  Film,
  ArrowRight,
  Play,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  getGuestExperienceSection,
  createGuestExperienceByGuest,
} from "@/Api/Api";
import "swiper/css";

// --- Types & Interfaces ---

interface MediaPreview {
  type: "video" | "image";
  url: string;
  file: File;
}

interface ExperienceItem {
  id: string | number;
  title: string;
  description: string;
  author: string;
  type: "video" | "image";
  videoUrl?: string;
  thumbnail?: { src: string };
  image?: { src: string; alt: string };
}

interface ApiResponseItem {
  id: string | number;
  title?: string;
  description?: string;
  author?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export default function OurStoryPreview() {
  const { experienceShowcase } = siteContent.text;

  // Typed State
  const [guestExperiences, setGuestExperiences] = useState<ExperienceItem[]>(
    [],
  );
  const [isLoadingExperiences, setIsLoadingExperiences] =
    useState<boolean>(true);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [showYoutubeInput, setShowYoutubeInput] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pagination state
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);

  // Typed Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const fetchGuestExperience = async (loadMore: boolean = false) => {
    try {
      if (!loadMore) {
        setIsLoadingExperiences(true);
      }

      const params: { size: number; lastId?: string } = { size: 20 };
      if (loadMore && lastId) {
        params.lastId = lastId;
      }

      const res = await getGuestExperienceSection(params);

      const responseData = res?.data?.data || res?.data || res;

      if (responseData?.content && Array.isArray(responseData.content)) {
        const apiItems: ApiResponseItem[] = responseData.content;

        const latestFirstItems = [...apiItems].reverse();

        const mappedExperiences: ExperienceItem[] = latestFirstItems.map(
          (item) => {
            const baseItem = {
              id: item.id,
              title: item.title || "Guest Experience",
              description: item.description || "",
              author: item.author || "Anonymous Guest",
            };

            const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];

            if (item.videoUrl) {
              return {
                ...baseItem,
                type: "video",
                videoUrl: item.videoUrl,
                thumbnail: item.imageUrl ? { src: item.imageUrl } : undefined,
              };
            }

            if (item.imageUrl) {
              const isVideoInImageUrl = videoExtensions.some((ext) =>
                item.imageUrl.toLowerCase().includes(ext),
              );

              return isVideoInImageUrl
                ? { ...baseItem, type: "video", videoUrl: item.imageUrl }
                : {
                    ...baseItem,
                    type: "image",
                    image: {
                      src: item.imageUrl,
                      alt: item.title || "Experience",
                    },
                  };
            }

            return {
              ...baseItem,
              type: "image",
              image: {
                src: siteContent.images.hero.slide1.src,
                alt: item.title || "Experience",
              },
            };
          },
        );

        if (loadMore) {
          setGuestExperiences((prev) => [...prev, ...mappedExperiences]);
        } else {
          setGuestExperiences(mappedExperiences);
        }

        setLastId(responseData.lastId);
        setHasNext(responseData.hasNext || false);
      } else {
        if (!loadMore) setGuestExperiences([]);
      }
    } catch (error) {
      console.error("Error fetching Guest Experience:", error);
      if (!loadMore) setGuestExperiences([]);
    } finally {
      setIsLoadingExperiences(false);
    }
  };

  useEffect(() => {
    fetchGuestExperience();
  }, []);

  const displayItems =
    guestExperiences.length > 0
      ? guestExperiences
      : ((experienceShowcase?.items || []) as any[]);

  if (!experienceShowcase) return null;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: MediaPreview[] = Array.from(files).map((file) => ({
        type: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file),
        file: file,
      }));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleYoutubeLinkAdd = () => {
    if (youtubeLink.trim()) {
      setShowYoutubeInput(false);
    }
  };

  const handleVideoPlay = (index: number) => {
    setPlayingVideo(index);
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false;
      video.play();
      setMutedVideos((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleVideoPause = (index: number) => {
    setPlayingVideo(null);
    videoRefs.current[index]?.pause();
  };

  const toggleMute = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !video.muted;
      setMutedVideos((prev) => ({ ...prev, [index]: !prev[index] }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append(
        "title",
        feedbackText.substring(0, 50) || "Guest Experience",
      );
      formData.append("description", feedbackText || "No description provided");
      formData.append("author", authorName.trim() || "Anonymous Guest");

      if (youtubeLink) {
        formData.append("mediaType", "youtube");
        formData.append("youtubeUrl", youtubeLink);
      } else if (mediaPreviews.length > 0) {
        const firstMedia = mediaPreviews[0];
        formData.append("mediaType", firstMedia.type);
        if (firstMedia.file) {
          formData.append("file", firstMedia.file);
        }
      } else {
        formData.append("mediaType", "text");
      }

      await createGuestExperienceByGuest(formData);
      setSubmitSuccess(true);
      await fetchGuestExperience(false);

      setTimeout(() => {
        setFeedbackText("");
        setAuthorName("");
        setMediaPreviews([]);
        setYoutubeLink("");
        setShowYoutubeInput(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message || "Failed to submit. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNext && !isLoadingExperiences) {
      fetchGuestExperience(true);
    }
  };

  const hasMedia = mediaPreviews.length > 0 || youtubeLink;
  const canSubmit = (feedbackText.trim() || hasMedia) && !isSubmitting;

  return (
    <section
      id="story"
      className="py-12 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT: Experience Slider */}
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
                loop={displayItems.length > 1}
                className="w-full experience-swiper py-2 !pb-12 lg:!pb-2"
              >
                {isLoadingExperiences && guestExperiences.length === 0 ? (
                  <SwiperSlide>
                    <div className="h-96 flex items-center justify-center bg-card border border-border rounded-lg">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  </SwiperSlide>
                ) : displayItems.length === 0 ? (
                  <SwiperSlide>
                    <div className="h-96 flex flex-col items-center justify-center bg-card border border-border rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No guest experiences yet.
                      </p>
                    </div>
                  </SwiperSlide>
                ) : (
                  displayItems.map((item, index) => (
                    <SwiperSlide key={item.id || index} className="h-auto">
                      <div className="group bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-md">
                        {item.type === "video" ? (
                          <div
                            className="relative w-full"
                            style={{ paddingBottom: "125%" }}
                          >
                            <div className="absolute inset-0 bg-black">
                              <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                src={item.videoUrl}
                                poster={item.thumbnail?.src}
                                className="w-full h-full object-cover"
                                loop
                                playsInline
                                muted
                                onEnded={() => setPlayingVideo(null)}
                              />
                              {playingVideo !== index && (
                                <div
                                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center cursor-pointer hover:bg-black/40"
                                  onClick={() => handleVideoPlay(index)}
                                >
                                  <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Play
                                      className="w-8 h-8 text-primary ml-1"
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              )}
                              {playingVideo === index && (
                                <div
                                  className="absolute inset-0 cursor-pointer"
                                  onClick={() => handleVideoPause(index)}
                                />
                              )}
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
                                <Film className="w-3 h-3 text-white" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                                  REEL
                                </span>
                              </div>
                              {playingVideo === index && (
                                <button
                                  onClick={(e) => toggleMute(index, e)}
                                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white z-10"
                                >
                                  {mutedVideos[index] ? (
                                    <VolumeX className="w-3.5 h-3.5" />
                                  ) : (
                                    <Volume2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              <div
                                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity z-10 ${playingVideo === index ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
                              >
                                <h3 className="text-sm font-serif font-bold text-white mb-1">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-white/90 truncate">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <OptimizedImage
                                src={item.image?.src || ""}
                                alt={item.image?.alt || ""}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white/90">
                                <Quote className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                              <h3 className="text-base font-serif font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-grow italic">
                                "{item.description}"
                              </p>
                              <div className="mt-auto pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
                                <span className="text-foreground truncate">
                                  {item.author}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">
                  5.0★ from {guestExperiences.length || 2500}+ reviews
                </span>
              </motion.div>

              {/* {hasNext ? (
                <button onClick={handleLoadMore} disabled={isLoadingExperiences} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50">
                  {isLoadingExperiences ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</> : <>Load more <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              ) : (
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  Explore more <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )} */}
            </div>
          </div>

          {/* RIGHT: Submission Panel */}
          <div className="lg:col-span-4 order-1 lg:order-2 bg-card border border-border rounded-lg p-5 shadow-sm hover:border-primary/50 transition-all duration-300 hover:shadow-md flex flex-col">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Send className="w-4 h-4 text-primary" /> Share Your Moment
            </h4>

            <div className="space-y-4 flex-grow flex flex-col">
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      Successfully submitted!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (optional)..."
                className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
              />

              <AnimatePresence>
                {hasMedia && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {mediaPreviews.map((media, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-md overflow-hidden bg-secondary/50 group"
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <div className="bg-black w-full h-full flex items-center justify-center">
                            <Film className="text-white w-6 h-6" />
                          </div>
                        )}
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {youtubeLink && (
                      <div className="relative aspect-square rounded-md overflow-hidden bg-red-500/10 flex items-center justify-center group">
                        <Youtube className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!youtubeLink && (
                <div className="flex gap-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-grow border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 min-h-[100px]"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                      Upload Media
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
                  <button
                    onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                    className={`p-3 rounded-lg border ${showYoutubeInput ? "bg-primary/10 border-primary text-primary" : "bg-secondary/20 text-muted-foreground"}`}
                  >
                    <Youtube className="w-5 h-5" />
                  </button>
                </div>
              )}

              {showYoutubeInput && !youtubeLink && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Paste YouTube link..."
                    className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-xs"
                  />
                  <button
                    onClick={handleYoutubeLinkAdd}
                    className="w-full bg-primary/10 text-primary py-2 rounded-lg text-xs font-medium"
                  >
                    Add Link
                  </button>
                </div>
              )}

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  hasMedia
                    ? "Add description (optional)..."
                    : "Describe your experience..."
                }
                className="w-full h-full min-h-[80px] bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
              />

              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    {hasMedia && !feedbackText
                      ? "Submit Media"
                      : "Confirm Submission"}{" "}
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
