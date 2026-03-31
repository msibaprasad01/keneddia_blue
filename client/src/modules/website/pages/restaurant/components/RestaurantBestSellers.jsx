import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["Veg", "Non-Veg", "Best Seller"];

const BEST_SELLERS = [
  {
    id: 1,
    title: "Hyderabadi Biryani",
    description: "Dum-cooked rice, deep spice layers, and signature slow-cooked aroma.",
    image:
      "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=900&q=80",
    route: "/restaurant/spicy-darbar",
    tags: ["Non-Veg", "Best Seller"],
  },
  {
    id: 2,
    title: "Kebabs",
    description: "Charred grills, smoky marinades, and platter-style indulgence.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    route: "/restaurant/luxury-lounge",
    tags: ["Non-Veg", "Best Seller"],
  },
  {
    id: 3,
    title: "Korma And Curries",
    description: "Rich gravies and comforting classics finished with polished presentation.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
    route: "/restaurant/spicy-darbar",
    tags: ["Veg", "Best Seller"],
  },
  {
    id: 4,
    title: "Desserts",
    description: "Signature endings with warm textures, cream notes, and plated elegance.",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
    route: "/restaurant/italian",
    tags: ["Veg", "Best Seller"],
  },
  
];

export default function RestaurantBestSellers() {
  const [activeFilter, setActiveFilter] = useState("Best Seller");
  const [expanded, setExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeFilter === "Best Seller") {
      return BEST_SELLERS.filter((item) => item.tags.includes("Best Seller"));
    }
    return BEST_SELLERS.filter((item) => item.tags.includes(activeFilter));
  }, [activeFilter]);

  const primaryItems = filteredItems.slice(0, 4);
  const extraItems = filteredItems.slice(4);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setExpanded(false);
  };

  return (
    <section className="bg-background py-10">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-[#fffaf0] via-white to-[#fff4d6] shadow-[0_24px_60px_-38px_rgba(0,0,0,0.28)]">
          <div className="border-b border-border/50 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Menu Spotlight
                </div>
                <h2 className="text-2xl font-serif text-foreground md:text-3xl">
                  Best Seller Categories
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Discover the dishes guests keep coming back for, grouped into the strongest-performing menu favorites.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                      activeFilter === filter
                        ? filter === "Veg"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : filter === "Non-Veg"
                            ? "border-rose-400 bg-white text-rose-500"
                            : "border-amber-400 bg-amber-400 text-[#402900]"
                        : "border-border bg-white/80 text-foreground hover:border-primary/40"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:p-6">
            {primaryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  // to={item.route}
                  className="group flex h-full flex-col rounded-[24px] border border-[#f2ead4] bg-[#fffbea] p-4 text-center shadow-[0_18px_35px_-28px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_45px_-24px_rgba(0,0,0,0.28)]"
                >
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-md sm:h-28 sm:w-28">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {extraItems.length > 0 && (
            <div className="border-t border-border/50 px-5 pb-5 pt-1 lg:px-6 lg:pb-6">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
                >
                  {expanded ? "Show Less" : `Show More (${extraItems.length})`}
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                      {extraItems.map((item, index) => (
                        <motion.div
                          key={`extra-${item.id}`}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                        >
                          <Link
                            to={item.route}
                            className="group flex h-full flex-col rounded-[24px] border border-[#f2ead4] bg-[#fffbea] p-4 text-center shadow-[0_18px_35px_-28px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_45px_-24px_rgba(0,0,0,0.28)]"
                          >
                            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-md sm:h-28 sm:w-28">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>

                            <h3 className="text-lg font-semibold tracking-tight text-foreground">
                              {item.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {item.description}
                            </p>

                            <div className="mt-auto pt-4">
                              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                                Explore Category
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
