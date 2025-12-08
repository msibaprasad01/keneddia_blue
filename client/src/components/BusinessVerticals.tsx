import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
// Assets
import hotelImg from "@assets/generated_images/architectural_detail_of_hotel.png";
import cafeImg from "@assets/generated_images/upscale_cafe_interior.png";
import barImg from "@assets/generated_images/moody_luxury_bar_interior.png";

const verticals = [
  {
    id: "hotels",
    title: "Hotels & Resorts",
    image: hotelImg,
    route: "/hotels",
    subcategories: [
      "Luxury Hotels",
      "Beach Resorts",
      "Urban Properties",
      "Heritage Hotels",
    ],
    featured: true,
  },
  {
    id: "cafes",
    title: "Cafes & Dining",
    image: cafeImg,
    route: "/cafes",
    subcategories: [
      "Fine Dining",
      "Casual Cafes",
      "Rooftop Restaurants",
      "Specialty Coffee",
    ],
  },
  {
    id: "bars",
    title: "Bars & Lounges",
    image: barImg,
    route: "/bars",
    subcategories: [
      "Cocktail Bars",
      "Wine Lounges",
      "Sky Bars",
      "Pool Bars",
    ],
  },
  {
    id: "events",
    title: "Events & Conferences",
    image: cafeImg,
    route: "/events",
    subcategories: [
      "Banquet Halls",
      "Conference Centers",
      "Wedding Venues",
      "Exhibition Spaces",
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment",
    image: barImg,
    route: "/entertainment",
    subcategories: [
      "Nightclubs",
      "Live Music Venues",
      "Theaters",
      "Gaming Lounges",
    ],
  },
];

export default function BusinessVerticals() {
  const [activeVertical, setActiveVertical] = useState(verticals[0]);
  const [activeTab, setActiveTab] = useState<"verticals" | "companies">("verticals");
  const [, setLocation] = useLocation();
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveVertical((current) => {
        const currentIndex = verticals.findIndex((v) => v.id === current.id);
        const nextIndex = (currentIndex + 1) % verticals.length;
        return verticals[nextIndex];
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleCardClick = (vertical: typeof verticals[0]) => {
    setActiveVertical(vertical);
    setIsAutoPlaying(false); // Pause autoplay when user manually selects
    
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    // Navigate to the active vertical's route
    setLocation(activeVertical.route);
  };

  const handleVerticalNavigate = (vertical: typeof verticals[0]) => {
    // Navigate to the vertical's route
    setLocation(vertical.route);
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            OUR BUSINESSES
          </h2>
          
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("verticals")}
              className={`text-base font-medium pb-2 transition-colors relative ${
                activeTab === "verticals"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Verticals
              {activeTab === "verticals" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Card Grid (2x2) with reduced row gap */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-x-4 gap-y-1 auto-rows-fr">
            {verticals.map((vertical, index) => (
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => handleCardClick(vertical)}
                onClick={() => handleVerticalNavigate(vertical)}
                className="relative aspect-4/3 overflow-hidden cursor-pointer group"
              >
                {/* Background Image */}
                <img
                  src={vertical.image}
                  alt={vertical.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                {index === 0 ? (
                  // First card - Gradient overlay with arrow
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-90 group-hover:opacity-95 transition-opacity" />
                ) : (
                  // Other cards - Dark overlay
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {vertical.title}
                    </h3>
                    {index === 0 && (
                      <ArrowRight className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                {/* Active Indicator - Dynamic based on activeVertical */}
                {activeVertical.id === vertical.id && (
                  <motion.div
                    layoutId="activeCard"
                    className="absolute inset-0 ring-4 ring-cyan-400 pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side - Featured Slide with reduced height */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVertical.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="relative h-full min-h-[400px] lg:min-h-[550px] overflow-hidden"
              >
                {/* Background Image */}
                <img
                  src={activeVertical.image}
                  alt={activeVertical.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/30 to-transparent" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 lg:p-12">
                  {/* Vertical Title - Large & Elegant */}
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-white to-white" />
                      <Sparkles className="w-6 h-6 text-white" />
                      <div className="w-12 h-0.5 bg-linear-to-r from-white via-white to-transparent" />
                    </div>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                      {activeVertical.title}
                    </h3>
                  </motion.div>

                  {/* Subcategory Tags - Creative Layout */}
                  <div className="relative grid grid-cols-2 gap-4 max-w-2xl w-full">
                    {activeVertical.subcategories.map((subcategory, index) => (
                      <motion.button
                        key={subcategory}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className="group relative overflow-hidden"
                      >
                        {/* Card Background */}
                        <div className="relative px-6 py-4 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                          
                          {/* Diagonal Line Accent */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-2xl" />
                          
                          {/* Text */}
                          <div className="relative flex items-center justify-between">
                            <span className="text-white font-semibold text-sm md:text-base">
                              {subcategory}
                            </span>
                            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}