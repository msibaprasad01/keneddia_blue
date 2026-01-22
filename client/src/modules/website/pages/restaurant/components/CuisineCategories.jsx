import { motion } from "framer-motion";
import { cuisineCategories } from "@/data/restaurantData";
import { UtensilsCrossed, Users, Flame, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";

const CATEGORY_ICONS = {
  "italian": UtensilsCrossed,
  "luxury-lounge": Users,
  "spicy-darbar": Flame,
  "takeaway": ShoppingBag
};

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
    const numDots = 40;
    const maxDistance = 120;

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
      style={{ opacity: 0.5 }}
    />
  );
};

export default function CuisineCategories() {
  const handleCategoryClick = (categoryId) => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      const elementPosition = menuSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-12 md:py-16 bg-background overflow-hidden">
      {/* Animated Dots Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedDotsBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        
        {/* Compact Organic Shapes */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-[10%] w-[300px] h-[300px] bg-primary rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-medium mb-3">
            Our Specialties
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore Our Cuisines
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Discover a world of flavors crafted with passion
          </p>
        </motion.div>

        {/* Compact Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cuisineCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id] || UtensilsCrossed;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1
                }}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer"
              >
                <motion.div
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.3 }
                  }}
                  className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/15 h-full"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                    {/* Replace this div with <img> when images are available */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-primary/30" />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                    
                    {/* Floating Icon Badge */}
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>

                  {/* Compact Content */}
                  <div className="relative p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                      {category.description}
                    </p>

                    {/* Explore Link */}
                    <div className="flex items-center gap-1.5 text-primary font-medium text-xs">
                      <span className="group-hover:underline">Explore Menu</span>
                      <motion.svg
                        className="w-3 h-3"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </div>

                    {/* Bottom Accent Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}