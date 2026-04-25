import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Wine_GALLERY_ITEMS } from "./WineGalleryData";

const CATEGORIES = ["All", "Interior", "Brews", "Bakery", "Events", "Outdoor"];

export default function WineGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalDirection, setModalDirection] = useState(1);

  const filtered = useMemo(() => {
    const normalized = Wine_GALLERY_ITEMS.map((item) => ({
      id: item.id,
      category:
        item.categoryName.charAt(0) +
        item.categoryName.slice(1).toLowerCase(),
      image: item.media.url,
      alt: item.media.alt || item.media.fileName || item.propertyName,
    }));
    return activeCategory === "All"
      ? normalized
      : normalized.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (!isAutoPlaying || filtered.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % filtered.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, filtered.length]);

  const goTo = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    setIsAutoPlaying(false);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
    setIsAutoPlaying(false);
  };

  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
    setIsAutoPlaying(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  const modalPrev = useCallback(() => {
    setModalDirection(-1);
    setModalIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const modalNext = useCallback(() => {
    setModalDirection(1);
    setModalIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") modalPrev();
      if (e.key === "ArrowRight") modalNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, modalPrev, modalNext]);

  const current = filtered[currentIndex];
  const bgImage = current?.image;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.85,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.85,
      rotateY: dir > 0 ? -15 : 15,
    }),
  };

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <AnimatePresence mode="sync">
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "rgba(0,0,0,0.55)" }}
      />

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.45em] text-white/50 mb-2">
            Visual Gallery
          </p>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl text-white tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Moments from the{" "}
            <span className="italic" style={{ color: "#c8a97e" }}>
              Wine
            </span>
          </h2>
        </motion.div>

       

        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {filtered.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative flex items-center justify-center transition-all duration-300"
                style={{ width: 28, height: 28 }}
              >
                <span
                  className="font-mono transition-all duration-300"
                  style={{
                    color: i === currentIndex ? "#fff" : "rgba(255,255,255,0.35)",
                    fontWeight: i === currentIndex ? 700 : 400,
                    fontSize: i === currentIndex ? "15px" : "13px",
                  }}
                >
                  {i + 1}
                </span>
                {i === currentIndex && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1.5px solid rgba(255,255,255,0.6)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
            {filtered.length > 8 && (
              <span className="text-white/30 text-xs font-mono">
                +{filtered.length - 8}
              </span>
            )}
          </div>
        )}

        <div
          className="relative flex items-center justify-center w-full"
          style={{ perspective: "1200px" }}
        >
          <button
            onClick={prev}
            className="absolute z-20 rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95 sm:p-3"
            style={{
              left: "clamp(2px, 2vw, 32px)",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="relative overflow-hidden"
            style={{
              width: "clamp(220px, 72vw, 420px)",
              aspectRatio: "9/11",
              borderRadius: "clamp(1.25rem, 3vw, 2.5rem)",
              border: "1.5px solid rgba(255,255,255,0.22)",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.5), 0 30px 90px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)",
              background: "#111118",
            }}
          >
            <div
              className="absolute top-0 inset-x-0 h-1/2 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)",
              }}
            />

            <AnimatePresence custom={direction} mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 cursor-zoom-in group"
                  onClick={() => openModal(currentIndex)}
                >
                  <img
                    src={current.image}
                    alt={current.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div
                      className="p-2 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <ZoomIn size={14} color="white" />
                    </div>
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.88) 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <p
                      className="uppercase tracking-[0.35em] mb-1"
                      style={{ color: "#c8a97e", fontSize: "9px" }}
                    >
                      {current.category}
                    </p>
                    <p
                      className="text-white leading-tight"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(15px, 2.5vw, 20px)",
                      }}
                    >
                      {current.alt}
                    </p>
                    <p
                      className="text-white/40 mt-1 font-mono"
                      style={{ fontSize: "10px" }}
                    >
                      {String(currentIndex + 1).padStart(2, "0")} /{" "}
                      {String(filtered.length).padStart(2, "0")}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!current && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/30 text-sm">No items</p>
              </div>
            )}
          </div>

          <button
            onClick={next}
            className="absolute z-20 rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95 sm:p-3"
            style={{
              right: "clamp(2px, 2vw, 32px)",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {filtered.length > 0 && (
          <div
            className="rounded-full overflow-hidden"
            style={{
              width: "clamp(100px, 30vw, 160px)",
              height: "2px",
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#c8a97e" }}
              animate={{
                width: `${((currentIndex + 1) / filtered.length) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && filtered[modalIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); modalPrev(); }}
              className="absolute left-2 top-1/2 z-10 rounded-full p-2.5 transition-all duration-200 hover:scale-110 active:scale-95 sm:left-6 sm:top-auto sm:p-3"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <div
              className="relative flex h-full w-full items-center justify-center px-12 py-20 sm:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence custom={modalDirection} mode="wait">
                <motion.div
                  key={filtered[modalIndex].id}
                  custom={modalDirection}
                  initial={{ opacity: 0, x: modalDirection > 0 ? 80 : -80, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: modalDirection > 0 ? -80 : 80, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex w-full max-w-4xl flex-col items-center gap-4"
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
                      maxHeight: "75vh",
                      width: "100%",
                    }}
                  >
                    <img
                      src={filtered[modalIndex].image}
                      alt={filtered[modalIndex].alt}
                      style={{
                        width: "100%",
                        maxHeight: "75vh",
                        objectFit: "contain",
                        display: "block",
                        background: "#0a0a0f",
                      }}
                    />
                  </div>

                  <div className="flex w-full flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p
                        className="uppercase tracking-[0.35em] mb-0.5"
                        style={{ color: "#c8a97e", fontSize: "9px" }}
                      >
                        {filtered[modalIndex].category}
                      </p>
                      <p
                        className="text-white text-base sm:text-lg leading-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {filtered[modalIndex].alt}
                      </p>
                    </div>
                      <p className="ml-0 shrink-0 text-white/35 font-mono text-xs sm:ml-4">
                      {String(modalIndex + 1).padStart(2, "0")} /{" "}
                      {String(filtered.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex max-w-full gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {filtered.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => { setModalDirection(i > modalIndex ? 1 : -1); setModalIndex(i); }}
                        className="shrink-0 overflow-hidden transition-all duration-200"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "0.5rem",
                          border: i === modalIndex
                            ? "2px solid #c8a97e"
                            : "2px solid rgba(255,255,255,0.1)",
                          opacity: i === modalIndex ? 1 : 0.45,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.alt}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); modalNext(); }}
              className="absolute right-2 top-1/2 z-10 rounded-full p-2.5 transition-all duration-200 hover:scale-110 active:scale-95 sm:right-6 sm:top-auto sm:p-3"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
