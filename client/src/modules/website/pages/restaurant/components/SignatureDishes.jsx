import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dishCategories, signatureDishes } from "@/data/restaurantData";
import { ArrowRight, ChefHat, Sparkles, ShoppingCart, Clock, Star, Flame, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Robust Dish Card Component with Image Fallback
const DishCard = ({ dish, currentPage, index, setHoveredDish, hoveredDish, handleOrder }) => {
  const isHovered = hoveredDish === dish.name;
  
  // Image Fallback Strategy
  // 1. Provided Data Image
  // 2. Unsplash by Name
  // 3. Unsplash by Category
  // 4. Reliable Generic Fallback
  const [imgSrc, setImgSrc] = useState(dish.image || `https://source.unsplash.com/600x450/?${encodeURIComponent(dish.name)},food`);
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const handleImageError = () => {
    const errorCount = imgErrorCount + 1;
    setImgErrorCount(errorCount);

    if (errorCount === 1) {
       // Fallback 1: Try Category Image
       setImgSrc(`https://source.unsplash.com/600x450/?${dish.category},food`);
    } else if (errorCount === 2) {
       // Fallback 2: Generic Restaurant Food
       setImgSrc("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop");
    }
  };

  return (
    <motion.div
      layout
      key={`${dish.name}-${currentPage}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHoveredDish(dish.name)}
      onMouseLeave={() => setHoveredDish(null)}
      className="group relative h-full"
    >
      <motion.div
        layout
        animate={{
          height: isHovered ? "auto" : "100%", // Maintain height alignment when not hovered
          zIndex: isHovered ? 10 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col w-full absolute top-0 left-0 ${isHovered ? 'shadow-2xl ring-1 ring-primary/20' : ''}`}
        style={{ minHeight: '320px' }} // Consistency base
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={imgSrc}
            alt={dish.name}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Floating Price Badge */}
          <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-primary-foreground shadow-lg">
            {dish.price || "₹349"}
          </div>

          {/* Quick Info on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-bold text-base leading-tight mb-1 drop-shadow-sm">
              {dish.name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] opacity-90 font-medium">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                <span>20m</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>Spicy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-card/95 backdrop-blur-sm border-t border-border/50"
            >
              {/* Description */}
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                {dish.description || "A delicious culinary experience crafted with fresh ingredients and aromatic spices."}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1.5">
                  <ChefHat className="w-3 h-3 text-primary" />
                  <span>Chef Special</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Fresh Today</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-foreground/70 mb-1">Key Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {["Organic", "Fresh Herbs", "Premium"].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Order Button */}
              <Button 
                onClick={() => handleOrder(dish.name)}
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-md group/btn"
              >
                <ShoppingCart className="w-3 h-3 mr-2" />
                <span>Order Now</span>
                <Sparkles className="w-3 h-3 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State - Minimal Info */}
        {!isHovered && (
          <div className="p-3 flex items-center justify-between text-muted-foreground/80 bg-card flex-grow">
            <div className="text-[11px]">
              Tap to explore details
            </div>
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </motion.div>
      
      {/* Spacer to reserve grid height */}
      <div className="w-full" style={{ height: '320px' }} />
    </motion.div>
  );
};

export default function SignatureDishes() {
  const [activeTab, setActiveTab] = useState(dishCategories[0].id);
  const [hoveredDish, setHoveredDish] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const filteredDishes = signatureDishes.filter(
    dish => dish.category === activeTab
  );

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const displayedDishes = filteredDishes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || totalPages <= 1 || hoveredDish) return; // Pause on hover

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, totalPages, activeTab, hoveredDish]);

  const handleOrder = (dishName) => {
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    setCurrentPage(0);
    setHoveredDish(null);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section id="menu" className="py-12 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header - Compact */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-3"
          >
            <ChefHat className="w-3 h-3" />
            <span>Chef's Selection</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Signature Dishes
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Curated culinary masterpieces prepared with passion
          </p>
        </div>

        {/* Category Tabs - Compact */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {dishCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                activeTab === category.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div 
          className="relative min-h-[340px]" // Reserve visual space
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredDish(null);
          }}
        >
          {/* Dishes Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {displayedDishes.map((dish, index) => (
                <DishCard 
                  key={`${dish.name}-${index}`}
                  dish={dish}
                  index={index}
                  currentPage={currentPage}
                  hoveredDish={hoveredDish}
                  setHoveredDish={setHoveredDish}
                  handleOrder={handleOrder}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons for Carousel */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-8 h-8 rounded-full bg-card border border-border shadow-lg hover:shadow-xl hover:scale-110 hover:border-primary transition-all duration-300 flex items-center justify-center group z-30 opacity-0 group-hover:opacity-100"
                aria-label="Previous dishes"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-8 h-8 rounded-full bg-card border border-border shadow-lg hover:shadow-xl hover:scale-110 hover:border-primary transition-all duration-300 flex items-center justify-center group z-30 opacity-0 group-hover:opacity-100"
                aria-label="Next dishes"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`transition-all duration-300 rounded-full h-1.5 ${
                    index === currentPage
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}