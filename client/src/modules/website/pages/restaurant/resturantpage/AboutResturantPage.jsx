import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Clock, Phone, MapPin, Instagram, Facebook, 
  Twitter, MessageCircle, Contact2, X, MessageSquare 
} from "lucide-react";

// Assets
import aboutimg1 from '@/assets/resturant_images/3dGallery/3dGallery3.jpeg';
import aboutimg2 from '@/assets/resturant_images/3dGallery/3dGallery4.jpeg';
import aboutimg3 from '@/assets/resturant_images/3dGallery/3dGallery5.jpeg';

// --- DATA CONFIGURATION ---
const ABOUT_DATA = {
  bgText: "Authentic Heritage Dining",
  badge: {
    icon: <MapPin className="w-4 h-4 text-primary" />,
    text: "Kennedia Blu Restaurant Ghaziabad"
  },
  title: {
    main: "Experience elegance, taste",
    highlight: "and unforgettable dining."
  },
  description: [
    "We believe dining is more than just a meal; it’s a ",
    { text: " curated premium experience", bold: true },
    ". Our philosophy balances bold Indian tradition with refined global elegance, all within a ",
    { text: "thoughtfully designed setting", italic: true, color: "text-primary" },
    "."
  ],
  stats: [
    {
      id: "availability",
      label: "Availability",
      icon: <Clock className="w-3 h-3 text-primary" />,
      mainText: "11:00 AM — 11:30 PM",
      subText: "MONDAY — SUNDAY"
    }
  ],
  socials: [
    { icon: <Instagram size={14} />, link: "#" },
    { icon: <Facebook size={14} />, link: "#" },
    { icon: <Twitter size={14} />, link: "#" },
    { icon: <MessageCircle size={14} />, link: "#" }
  ],
  carouselImages: [aboutimg1, aboutimg2, aboutimg3]
};

// --- POPUP COMPONENT ---
const ContactPopup = ({ isOpen, onClose }) => {
  const contactOptions = [
    {
      name: "WhatsApp",
      sub: "Instant Chat",
      icon: <MessageSquare size={24} />,
      link: "https://wa.me/919999999999",
      bgColor: "bg-[#25D366]",
      lightBg: "bg-[#25D366]/10"
    },
    {
      name: "Direct Call",
      sub: "Speak to Host",
      icon: <Phone size={24} />,
      link: "tel:+919999999999",
      bgColor: "bg-primary",
      lightBg: "bg-primary/10"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 z-[101] shadow-2xl border border-zinc-100 dark:border-white/10"
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-zinc-900 dark:text-white italic">Quick Connect</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest font-bold">Choose preferred method</p>
              </div>
              <div className="grid gap-4">
                {contactOptions.map((opt, i) => (
                  <a key={i} href={opt.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-2xl ${opt.lightBg} transition-all group`}>
                    <div className={`w-12 h-12 ${opt.bgColor} text-white rounded-xl flex items-center justify-center shadow-lg`}>{opt.icon}</div>
                    <div className="text-left">
                      <span className="block font-bold text-sm text-zinc-900 dark:text-white">{opt.name}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{opt.sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function AboutResturantPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const containerRef = useRef(null);

  // Automatic Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % ABOUT_DATA.carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15px", "15px"]);

  return (
    <section ref={containerRef} id="about" className="relative py-16 md:py-20 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      <ContactPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* DECORATIVE BACKGROUND TEXT */}
      <motion.div style={{ x: textX }} className="absolute top-1/4 left-0 whitespace-nowrap text-[8rem] md:text-[12rem] font-black text-zinc-100 dark:text-white/[0.02] pointer-events-none select-none italic uppercase z-0">
        {ABOUT_DATA.bgText}
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT: AUTO CAROUSEL IMAGE */}
          <div className="lg:col-span-4 relative max-w-sm mx-auto lg:mx-0">
            <motion.div style={{ y: imageY }} className="relative rounded-2xl overflow-hidden aspect-square shadow-xl border border-zinc-100 dark:border-white/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  src={ABOUT_DATA.carouselImages[imgIndex]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  alt="Restaurant Carousel"
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            {/* SOCIAL LINKS */}
            <div className="absolute -bottom-4 left-4 flex gap-2">
              {ABOUT_DATA.socials.map((social, i) => (
                <a key={i} href={social.link} className="w-9 h-9 bg-white dark:bg-zinc-900 shadow-lg rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors border border-zinc-100 dark:border-white/10">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {ABOUT_DATA.badge.icon}
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                  {ABOUT_DATA.badge.text}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 dark:text-white leading-tight tracking-tight">
                {ABOUT_DATA.title.main} <br />
                <span className="italic text-zinc-400 dark:text-white/40">{ABOUT_DATA.title.highlight}</span>
              </h2>
              
              <p className="text-zinc-600 dark:text-white/70 text-base md:text-lg leading-relaxed font-light max-w-3xl">
                {ABOUT_DATA.description.map((part, idx) => {
                  if (typeof part === 'string') return part;
                  return (
                    <span key={idx} className={`${part.bold ? 'text-zinc-900 dark:text-white font-medium' : ''} ${part.italic ? 'italic font-medium' : ''} ${part.color || ''}`}>
                      {part.text}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-white/10">
              {/* STATS FROM ARRAY */}
              {ABOUT_DATA.stats.map((stat) => (
                <div key={stat.id} className="group">
                  <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    {stat.icon} {stat.label}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-zinc-900 dark:text-white font-serif text-lg md:text-xl italic leading-tight">
                      {stat.mainText}
                    </p>
                    <p className="text-zinc-400 dark:text-white/30 text-[9px] font-bold tracking-widest uppercase">
                      {stat.subText}
                    </p>
                  </div>
                </div>
              ))}

              {/* CONNECT SECTION */}
              <div className="group cursor-pointer" onClick={() => setIsPopupOpen(true)}>
                <h4 className="text-zinc-400 dark:text-white/40 font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" /> Connect
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm active:scale-95">
                    <Contact2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-900 dark:text-white font-serif text-lg md:text-xl italic block leading-tight">Get In Touch</span>
                    <span className="text-zinc-400 dark:text-white/30 text-[9px] font-bold tracking-widest uppercase">Direct Reservation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}