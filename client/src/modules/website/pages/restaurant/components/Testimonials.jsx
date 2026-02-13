import React, { useRef, useState, ChangeEvent } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Quote,
  Star,
  Sparkles,
  X,
  User,
  Mail,
  Phone,
  Upload,
  Image as ImageIcon,
  Video,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

// --- Mock Data ---
const FEEDBACK_DATA = [
  {
    id: 1,
    name: "Arjun Mehta",
    text: "The Signature Butter Chicken is easily the best in Ghaziabad. Incredible atmosphere!",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Khan",
    text: "A perfect BYOB spot for family gatherings. The staff is exceptionally polite.",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Das",
    text: "Love the Dim Sum platter. The flavors are authentic and presentation is top-notch.",
    img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=400",
    rating: 4,
  },
  {
    id: 4,
    name: "Rohan V.",
    text: "The live music on weekends pairs perfectly with their Tandoori Jhinga.",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400",
    rating: 5,
  },
  {
    id: 5,
    name: "Elena G.",
    text: "Sophisticated settings and very clean. Highly recommend for corporate dinners.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400",
    rating: 5,
  },
];

const FeedbackCard = ({ item }) => (
  <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-lg mb-6 flex flex-col gap-3 group transition-all hover:scale-[1.02]">
    <div className="flex gap-0.5">
      {[...Array(item.rating)].map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
      ))}
    </div>
    <p className="text-zinc-600 dark:text-zinc-300 text-[13px] leading-relaxed italic">
      "{item.text}"
    </p>
    <div className="relative h-28 w-full rounded-xl overflow-hidden grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700">
      <img
        src={item.img}
        className="w-full h-full object-cover"
        alt="User Post"
      />
    </div>
    <div className="flex items-center gap-3 pt-1">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px]">
        {item.name.charAt(0)}
      </div>
      <span className="text-[10px] font-bold dark:text-white uppercase tracking-tighter">
        {item.name}
      </span>
    </div>
  </div>
);

export default function AutoTestimonials() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [step, setStep] = useState(1); // 1: Info, 2: Review Content
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 5,
    text: "",
  });
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) => ({
        type: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file),
        file,
      }));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.text) return toast.error("Please write a short review.");
    setIsSubmitting(true);

    // Simulate API Call
    await new Promise((r) => setTimeout(r, 2000));

    setIsSubmitting(false);
    setShowReviewModal(false);
    toast.success("Thank you! Your story has been submitted for review.");
    // Reset form
    setStep(1);
    setFormData({ name: "", email: "", phone: "", rating: 5, text: "" });
    setMediaPreviews([]);
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden min-h-[750px] flex items-center"
    >
      {/* --- BACKGROUND DECOR --- */}
      <motion.div
        style={{ x: bgTextX }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[12rem] lg:text-[18rem] font-black text-zinc-900/[0.03] dark:text-white/[0.01] pointer-events-none select-none italic uppercase z-0"
      >
        Guest Stories Feedback
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* --- LEFT: CONTENT --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                  Testimonials
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-zinc-900 dark:text-white leading-[1.1]">
                Voices of <br />
                <span className="italic text-zinc-400 dark:text-white/30 decoration-primary/20 underline decoration-1 underline-offset-8">
                  Delight.
                </span>
              </h2>
              <p className="text-zinc-500 dark:text-white/40 text-lg font-light leading-relaxed max-w-sm pt-4">
                Real moments shared by our guests. Experience the legacy of
                flavors through their eyes.
              </p>

              <Button
                onClick={() => setShowReviewModal(true)}
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 group"
              >
                Share Your Story{" "}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-8 border-t border-zinc-100 dark:border-white/10 flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-serif dark:text-white leading-none">
                  4.9
                </p>
                <div className="flex gap-0.5 mt-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-primary text-primary"
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-tight">
                Trusted by <br /> 1,200+ Guests
              </p>
            </div>
          </div>

          {/* --- RIGHT: AUTO CAROUSEL --- */}
          <div className="lg:col-span-7 h-[650px] relative rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] backdrop-blur-2xl">
            <div className="grid grid-cols-2 gap-6 h-full p-6 overflow-hidden relative group">
              <div className="flex flex-col gap-6 animate-marquee-up group-hover:[animation-play-state:paused]">
                {[...FEEDBACK_DATA, ...FEEDBACK_DATA, ...FEEDBACK_DATA].map(
                  (item, i) => (
                    <FeedbackCard key={`up-${i}`} item={item} />
                  ),
                )}
              </div>
              <div className="flex flex-col gap-6 animate-marquee-down group-hover:[animation-play-state:paused]">
                {[...FEEDBACK_DATA, ...FEEDBACK_DATA, ...FEEDBACK_DATA].map(
                  (item, i) => (
                    <FeedbackCard key={`down-${i}`} item={item} />
                  ),
                )}
              </div>
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-50/80 dark:from-[#050505]/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-50/80 dark:from-[#050505]/80 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* --- REVIEW SUBMISSION MODAL --- */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl relative border border-zinc-100 dark:border-white/5"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Edit2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl dark:text-white">
                      Submit Your Story
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">
                      Step {step} of 2
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {step === 1 ? (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-1 gap-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-primary">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                          <Input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="How should we address you?"
                            className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-primary">
                            Email
                          </Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="email@example.com"
                            className="h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-primary">
                            Phone
                          </Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Mobile number"
                            className="h-14 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={!formData.name || !formData.email}
                      onClick={() => setStep(2)}
                      className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-primary transition-all"
                    >
                      Next Step <ChevronRight size={14} className="ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                      <p className="text-[10px] font-black uppercase text-zinc-400">
                        Rate your experience
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setFormData({ ...formData, rating: star })
                            }
                          >
                            <Star
                              size={32}
                              className={`${formData.rating >= star ? "fill-primary text-primary" : "text-zinc-300 dark:text-zinc-600"} transition-all`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-primary">
                        Your Feedback
                      </Label>
                      <textarea
                        value={formData.text}
                        onChange={(e) =>
                          setFormData({ ...formData, text: e.target.value })
                        }
                        className="w-full h-32 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-sm dark:text-white border-none focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="Tell us about the flavors, service, and atmosphere..."
                      />
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-primary">
                          Add Photos/Videos
                        </Label>
                        <span className="text-[10px] text-zinc-400">
                          {mediaPreviews.length} files added
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {mediaPreviews.map((m, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden group shadow-md"
                          >
                            {m.type === "image" ? (
                              <img
                                src={m.url}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-black flex items-center justify-center text-white">
                                <Video size={16} />
                              </div>
                            )}
                            <button
                              onClick={() =>
                                setMediaPreviews((p) =>
                                  p.filter((_, idx) => idx !== i),
                                )
                              }
                              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:text-primary hover:border-primary transition-all gap-1"
                        >
                          <Upload size={20} />
                          <span className="text-[8px] font-bold uppercase">
                            Upload
                          </span>
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="h-14 rounded-xl px-8 dark:text-white"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={isSubmitting}
                        onClick={handleFinalSubmit}
                        className="flex-1 h-14 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            Submit Experience{" "}
                            <Send size={14} className="ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee-up { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes marquee-down { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
        .animate-marquee-up { animation: marquee-up 40s linear infinite; }
        .animate-marquee-down { animation: marquee-down 40s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef444433; border-radius: 10px; }
      `}</style>
    </section>
  );
}

// Sub-component Helper Icons for header
const Edit2 = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const ArrowRight = ({ className, size = 18 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
const ChevronRight = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
