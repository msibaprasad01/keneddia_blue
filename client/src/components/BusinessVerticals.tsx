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
import { isRouteAvailable } from "@/lib/routes";

// Lucide icon map
const IconMap = {
  hotels: Building2,
  cafes: Coffee,
  bars: Wine,
  events: Briefcase,
  entertainment: Music,
};

interface VerticalItem {
  id: string;
  title: string;
  icon: keyof typeof IconMap;
  description: string;
}

const verticals: VerticalItem[] = [
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
    <section className="py-8 bg-gradient-to-b from-background to-secondary/10 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold text-[#F5F7FA] mb-2"
          >
            Kennedia Group
          </motion.h2>
          <p className="text-sm text-[#C7CBD6] max-w-lg mx-auto">
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

function DesktopTree({ verticals }: { verticals: VerticalItem[] }) {
  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-[500px] flex flex-col items-center justify-center py-10">

      {/* 1. Parent Node (Top Center) */}
      <div className="relative z-20 mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-full bg-[#1A1A1A] shadow-[0_0_40px_rgba(177,18,38,0.3)] border-4 border-primary/20 flex items-center justify-center relative z-20"
        >
          <div className="text-center">
            <h2 className="text-5xl font-serif font-bold text-[#F5F7FA] tracking-wider leading-none">
              KB
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-primary mt-1 font-bold">Group</p>
          </div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite] opacity-20" />
          <div className="absolute -inset-4 rounded-full border border-primary/10 opacity-20" />
        </motion.div>

        {/* Central Vertical Connector going DOWN */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 h-16 w-[1px] bg-linear-to-b from-primary/50 to-primary/20" />
      </div>

      {/* 2. Horizontal Connector Bar */}
      {/* Spans across the width of the children to connect them */}
      <div className="relative w-4/5 h-[1px] bg-primary/20 mb-8">
        {/* Vertical lines connecting to each child will branch from here */}
      </div>

      <div className="flex justify-between items-start w-full px-4 relative -mt-8"> {/* Negative margin to pull up to line */}
        {verticals.map((v: VerticalItem, i: number) => (
          <BranchNode key={v.id} item={v} index={i} total={verticals.length} />
        ))}
      </div>
    </div>
  );
}

function BranchNode({ item, index, total }: { item: any, index: number, total: number }) {
  const Icon = IconMap[item.icon as keyof typeof IconMap] || Building2;
  const isCenter = index === Math.floor(total / 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center text-center group relative w-1/5"
    >
      {/* Vertical Connector Line from horizontal bar to visual node */}
      <div className="h-8 w-[1px] bg-primary/20 mb-4 group-hover:bg-primary/60 transition-colors duration-500" />

      {/* Visual Icon Node */}
      {isRouteAvailable(`/${item.id}`) ? (
        <Link href={`/${item.id}`}>
          <a className="block">
            <div className="w-16 h-16 rounded-2xl bg-[#222] border border-white/5 shadow-lg flex items-center justify-center mb-4 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(177,18,38,0.2)] transition-all duration-300">
              <Icon className="w-6 h-6 text-[#C7CBD6] group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
            </div>
          </a>
        </Link>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-[#222] border border-white/5 shadow-lg flex items-center justify-center mb-4 opacity-50 cursor-not-allowed">
          <Icon className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
        </div>
      )}

      {/* Text Content */}
      <h3 className="text-sm font-bold text-[#F5F7FA] group-hover:text-primary transition-colors leading-tight mb-1">
        {item.title}
      </h3>
      <p className="text-xs text-[#C7CBD6]/70 leading-snug max-w-[120px]">
        {item.description}
      </p>
    </motion.div>
  );
}

function MobileTimeline({ verticals }: { verticals: VerticalItem[] }) {
  return (
    <div className="relative pl-6 border-l border-dashed border-blue-200 space-y-8 py-4">
      {verticals.map((v: VerticalItem, i: number) => {
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
                    <h3 className="text-base font-bold text-[#F5F7FA]">{v.title}</h3>
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