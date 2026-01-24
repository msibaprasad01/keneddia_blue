import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dishCategories, signatureDishes } from "@/data/restaurantData";
import { Eye, Menu as MenuIcon, Sparkles, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animated Dots Background Component
const AnimatedDotsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const dots = [];
    const numDots = 30;
    const maxDistance = 100;

    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    const getPrimaryColor = () => {
      const style = getComputedStyle(document.documentElement);
      const primaryHSL = style.getPropertyValue('--primary').trim();
      return `hsl(${primaryHSL})`;
    };

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const primaryColor = getPrimaryColor();

      dots.forEach((dot, i) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[j].x - dot.x;
          const dy = dots[j].y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = (1 - distance / maxDistance) * 0.2;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  );
};

export default function SignatureDishes() {
  const [activeTab, setActiveTab] = useState(dishCategories[0].id);

  const filteredDishes = signatureDishes.filter(
    dish => dish.category === activeTab
  );

  const handleViewFullMenu = () => {
    alert("Full menu feature coming soon!");
  };

  return (
    <section id="menu" className="relative py-12 md:py-16 bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedDotsBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
        
        {/* Organic Shapes */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-primary rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.05, 0.02],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-[5%] left-[5%] w-[350px] h-[350px] bg-primary rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2"
          >
            <ChefHat className="w-3 h-3" />
            <span>Chef's Selection</span>
          </motion.span>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Signature Dishes
          </h2>
          
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Curated culinary masterpieces
          </p>
        </motion.div>

        {/* Compact Category Pills with Scroll */}
        <div className="mb-8 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {dishCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-full font-medium text-xs transition-all duration-300 ${
                  activeTab === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card/60 backdrop-blur-sm text-foreground hover:bg-primary/10 border border-border"
                }`}
              >
                {category.name}
                
                {/* Active indicator */}
                {activeTab === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Compact Dishes Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
          >
            {filteredDishes.map((dish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  {/* Compact Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img 
                      src={dish.image || `https://source.unsplash.com/400x400/?${dish.name.replace(/\s+/g, ',')},food`} 
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                    
                    {/* Sparkle Effect */}
                    <motion.div
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="absolute top-2 right-2 z-10"
                    >
                      <Sparkles className="w-4 h-4 text-white drop-shadow-md" />
                    </motion.div>

                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-full text-xs font-bold shadow-lg"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                      {dish.name}
                    </h3>
                    {dish.description && (
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                    
                    {/* Animated indicator */}
                    <motion.div
                      className="mt-2 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "50%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleViewFullMenu}
            size="default"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-3 text-sm rounded-full transition-all group shadow-lg"
          >
            <MenuIcon className="w-4 h-4 mr-2" />
            View Full Menu
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.span>
          </Button>

          {/* Indicator */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            Hover on dishes to explore
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}