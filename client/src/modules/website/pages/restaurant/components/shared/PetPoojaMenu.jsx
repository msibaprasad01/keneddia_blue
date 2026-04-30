import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
} from "lucide-react";

const PAGE_SIZE = 8;

export default function PetPoojaMenu({ categories = [], items = [] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const scrollRef = useRef(null);

  const activeCategory = categories[activeTab];

  const filteredItems = useMemo(
    () =>
      activeCategory
        ? items.filter(
            (it) => String(it.item_categoryid) === String(activeCategory.categoryid),
          )
        : [],
    [items, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const scrollToTab = (index) => {
    const container = scrollRef.current;
    if (container) {
      const tab = container.children[index];
      if (tab)
        container.scrollTo({
          left: tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2,
          behavior: "smooth",
        });
    }
  };

  const handleTabClick = (idx) => {
    setActiveTab(idx);
    setPage(1);
    scrollToTab(idx);
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      handleTabClick(activeTab - 1);
    }
  };

  const handleNext = () => {
    if (activeTab < categories.length - 1) {
      handleTabClick(activeTab + 1);
    }
  };

  if (!categories.length) return null;

  return (
    <section
      id="menu"
      className="py-16 bg-white dark:bg-[#050505] transition-colors duration-500"
    >
      <div className="container mx-auto px-6 max-w-[1200px]">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Utensils className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-serif dark:text-white">
              The <span className="italic text-primary">Selection</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={activeTab === 0}
              className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <ChevronLeft className="w-5 h-5 dark:text-white" />
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {activeTab + 1} / {categories.length}
            </div>
            <button
              onClick={handleNext}
              disabled={activeTab === categories.length - 1}
              className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <ChevronRight className="w-5 h-5 dark:text-white" />
            </button>
          </div>
        </div>

        {/* ── CATEGORY TAB SCROLLER ── */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-8 snap-x"
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.categoryid}
              onClick={() => handleTabClick(idx)}
              className={`relative shrink-0 px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all snap-center
                ${
                  activeTab === idx
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                    : "bg-transparent border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-primary/50"
                }`}
            >
              {cat.categoryname}
            </motion.button>
          ))}
        </div>

        {/* ── ITEM LIST ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + "-" + page}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-2"
          >
            {pagedItems.length === 0 ? (
              <p className="py-12 text-center text-zinc-400 dark:text-zinc-600">
                No items in this category.
              </p>
            ) : (
              pagedItems.map((item, i) => {
                const isVeg = String(item.item_attributeid) === "1";
                const outOfStock = item.in_stock === "0";

                return (
                  <motion.div
                    key={item.itemid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group flex items-start gap-5 p-4 rounded-2xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${
                      outOfStock ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image placeholder (PetPooja items have no image URL) */}
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <Utensils size={20} />
                    </div>

                    <div className="flex-1 border-b border-zinc-100 dark:border-white/5 pb-4 group-last:border-none">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            {item.itemname}
                          </h4>

                          {/* Veg / Non-Veg dot */}
                          {isVeg ? (
                            <span className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center shrink-0">
                              <span className="w-2 h-2 rounded-full bg-green-600 block" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center shrink-0">
                              <span className="w-2 h-2 rounded-full bg-red-600 block" />
                            </span>
                          )}

                          {!isVeg && (
                            <Flame size={14} className="text-red-500 fill-red-500" />
                          )}

                          {outOfStock && (
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                              Out of stock
                            </span>
                          )}
                        </div>

                        {item.price && (
                          <span className="text-xs font-bold text-primary shrink-0 ml-4">
                            ₹{parseFloat(item.price).toFixed(0)}
                          </span>
                        )}
                      </div>

                      {item.itemdescription && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                          {item.itemdescription}
                        </p>
                      )}

                      {item.itemallowaddon === "1" && (
                        <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">
                          Customisable
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredItems.length)} of{" "}
              {filteredItems.length} items
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                <ChevronLeft className="w-4 h-4 dark:text-white" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`el-${i}`} className="px-1 text-xs text-zinc-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${
                        page === p
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "border border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-primary/50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                <ChevronRight className="w-4 h-4 dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
