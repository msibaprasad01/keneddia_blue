import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Building2,
  Coffee,
  Wine,
  Music,
  Drama,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { useState, useEffect } from "react";
import { OptimizedImage } from "./ui/OptimizedImage";

// Lucide icon map
const IconMap = {
  hotels: Building2,
  cafes: Coffee,
  bars: Wine,
  events: Briefcase,
  entertainment: Music,
};

const verticals = [
  { id: "hotels", title: "Hotels & Resorts", icon: "hotels", description: "Luxury stays globally" },
  { id: "cafes", title: "Cafes & Dining", icon: "cafes", description: "Artisan culinary delights" },
  { id: "bars", title: "Bars & Lounges", icon: "bars", description: "Signature cocktails" },
  { id: "events", title: "Events & Conf.", icon: "events", description: "Grand venues" },
  { id: "entertainment", title: "Entertainment", icon: "entertainment", description: "Live shows & nightlife" },
];

export default function BusinessVerticals() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2"
          >
            Kennedia Group
          </motion.h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            A diverse ecosystem of luxury hospitality brands.
          </p>
        </div>

        {isMobile ? (
          <MobileTimeline verticals={verticals} />
        ) : (
          <DesktopTree verticals={verticals} />
        )}
      </div>
    </section>
  );
}

function DesktopTree({ verticals }: { verticals: typeof verticals }) {
  const midPoint = Math.ceil(verticals.length / 2);
  const leftSide = verticals.slice(0, midPoint);
  const rightSide = verticals.slice(midPoint);

  return (
    // Increased max-w and min-h for 10% larger size
    <div className="relative w-full max-w-5xl mx-auto min-h-[400px] flex justify-center items-center">
      {/* Central Root Node - Replaced text with Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="w-30 h-30 rounded-full bg-card shadow-[0_0_35px_rgba(192,57,43,0.15)] border-4 border-secondary flex items-center justify-center relative z-20 overflow-hidden"
        >
          <div className="w-22 h-22 flex items-center justify-center">
            <OptimizedImage
              src={siteContent.brand.logo.image.src}
              alt={siteContent.brand.logo.image.alt}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border border-blue-200 animate-ping opacity-20" />
          <div className="absolute -inset-3 rounded-full border border-blue-100 opacity-20" />
        </motion.div>
      </div>

      {/* Grid Layout - Slightly increased gap for size */}
      <div className="grid grid-cols-3 w-full h-full gap-6">
        {/* Left Column */}
        <div className="flex flex-col justify-center items-end py-6 pr-10 space-y-8">
          {leftSide.map((v, i) => (
            <BranchNode key={v.id} item={v} align="right" delay={i * 0.1} />
          ))}
        </div>

        {/* Center Column (Spacer) */}
        <div className="flex items-center justify-center pointer-events-none" />

        {/* Right Column */}
        <div className="flex flex-col justify-center items-start py-6 pl-10 space-y-8">
          {rightSide.map((v, i) => (
            <BranchNode key={v.id} item={v} align="left" delay={0.2 + (i * 0.1)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BranchNode({ item, align, delay }: { item: any, align: 'left' | 'right', delay: number }) {
  const Icon = IconMap[item.icon as keyof typeof IconMap] || Building2;
  const isRightAligned = align === 'right';

  return (
    <motion.div
      initial={{ opacity: 0, x: isRightAligned ? -15 : 15 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`relative group flex items-center gap-4 ${isRightAligned ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
    >
      {/* Connector Line - Slightly longer for scale */}
      <div className={`absolute top-1/2 w-10 h-[1px] bg-blue-200 transition-all duration-500 group-hover:w-14 group-hover:bg-blue-400 ${isRightAligned ? '-right-14 translate-x-0' : '-left-14 translate-x-0'}`} />

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{item.description}</p>
      </div>

      {/* Node Bubble */}
      <Link href={`/${item.id}`}>
        <a className="relative z-20 flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-card shadow-md border border-border flex items-center justify-center group-hover:scale-105 group-hover:border-primary group-hover:shadow-primary/20 transition-all duration-300">
            <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </div>
        </a>
      </Link>
    </motion.div>
  );
}

function MobileTimeline({ verticals }: { verticals: typeof verticals }) {
  return (
    <div className="relative pl-6 border-l border-dashed border-blue-200 space-y-8 py-4">
      {verticals.map((v, i) => {
        const Icon = IconMap[v.icon as keyof typeof IconMap] || Building2;
        return (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />

            <Link href={`/${v.id}`}>
              <a className="block bg-card p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{v.title}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-300" />
                </div>
              </a>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}