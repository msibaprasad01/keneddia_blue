import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight, Utensils, CalendarCheck } from "lucide-react";

export default function CategoryMenu({ menu, themeColor }) {
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useRef(null);

  // Navigation logic
  const handleNext = () => {
    if (activeTab < menu.length - 1) {
      setActiveTab(activeTab + 1);
      scrollToTab(activeTab + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
      scrollToTab(activeTab - 1);
    }
  };

  const scrollToTab = (index) => {
    const container = scrollContainerRef.current;
    if (container) {
      const tab = container.children[index];
      container.scrollTo({
        left: tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="menu" className="py-16 bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Utensils className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-serif dark:text-white">
              The <span className="italic text-primary">Selection</span>
            </h2>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              disabled={activeTab === 0}
              className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <ChevronLeft className="w-5 h-5 dark:text-white" />
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {activeTab + 1} / {menu.length}
            </div>
            <button 
              onClick={handleNext}
              disabled={activeTab === menu.length - 1}
              className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <ChevronRight className="w-5 h-5 dark:text-white" />
            </button>
          </div>
        </div>

        {/* --- TAB SCROLLER --- */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-8 snap-x"
        >
          {menu.map((section, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`relative flex-shrink-0 px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all snap-center
                ${activeTab === idx 
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-transparent border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-primary/50"
                }`}
            >
              {section.category}
            </motion.button>
          ))}
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-10"
          >
            {/* 1. DECREASED MAIN CATEGORY IMAGE */}
            <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden border border-zinc-100 dark:border-white/5">
              <img 
                src={menu[activeTab].categoryImage} 
                className="w-full h-full object-cover" 
                alt="Category Banner" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 text-white">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Explore</p>
                 <h3 className="text-3xl font-serif uppercase tracking-tight">{menu[activeTab].category}</h3>
              </div>
            </div>

            {/* 2. SUB-ITEMS IN CARD FORMAT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu[activeTab].items.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 rounded-[2rem] p-5 hover:shadow-xl transition-all group"
                >
                  {/* Item Image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    {item.isSpicy && (
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full backdrop-blur-sm">
                        <Flame size={14} className="text-red-500 fill-red-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Item Info */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                      {item.description}
                    </p>
                    
                    {/* Action Button instead of Price */}
                    <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <CalendarCheck size={14} />
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}