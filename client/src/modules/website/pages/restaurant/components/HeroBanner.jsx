import { motion } from "framer-motion";
import { Calendar, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  const handleReservation = () => {
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
      const elementPosition = reservationSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleViewMenu = () => {
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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background pt-24 pb-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Organic Shape - Top Right - Continuous Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 right-[10%] w-[500px] h-[500px] bg-primary rounded-full blur-3xl"
        />
        
        {/* Organic Shape - Bottom Center Right - Continuous Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.08, 0.05],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-primary/60 rounded-full blur-2xl"
        />

        {/* Small Organic Shape - Left - Continuous Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.04, 0.07, 0.04],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] bg-primary/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl"
        />

        {/* Subtle dotted pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            {/* Main Heading - SHORTENED */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            >
              Recipes & Shopping in One Place
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed"
            >
              Experience the finest flavors from across Asia in an elegant setting. 
              Bring your own beverages and let us take care of the rest.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                onClick={handleReservation}
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve a Table
              </Button>
              
              <Button
                onClick={handleViewMenu}
                size="default"
                variant="outline"
                className="border-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground px-6 py-5 text-sm rounded-full transition-all duration-300"
              >
                <Menu className="w-4 h-4 mr-2" />
                View Menu
              </Button>
            </motion.div>

            {/* Cuisines Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              <span className="px-3 py-1.5 bg-card border border-border rounded-full text-card-foreground text-xs font-medium shadow-sm">
                Chinese
              </span>
              <span className="px-3 py-1.5 bg-card border border-border rounded-full text-card-foreground text-xs font-medium shadow-sm">
                Japanese
              </span>
              <span className="px-3 py-1.5 bg-card border border-border rounded-full text-card-foreground text-xs font-medium shadow-sm">
                Indian Tandoor
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Circular Food Images with Decorative Lines */}
          {/* Desktop View */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:flex items-center justify-center min-h-[500px]"
          >
            {/* Main Large Circular Image - Center - Continuous Float Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                scale: { duration: 0.8, delay: 0.6 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative z-20 w-[340px] h-[340px] rounded-full overflow-hidden shadow-2xl border-[6px] border-card"
            >
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
                alt="Signature Dish"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Top Right Small Circular Image - Continuous Float Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [20, 10, 20],
                x: [0, 5, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.8 },
                scale: { duration: 0.8, delay: 0.8 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                x: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute top-0 right-0 z-30 w-[180px] h-[180px] rounded-full overflow-hidden shadow-xl border-[6px] border-card"
            >
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400"
                alt="Tandoori"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Decorative Dashed Curved Lines - Continuous Drawing Animation */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 600 600"
              style={{ transform: 'scale(1.1)' }}
            >
              {/* Top curve - Continuous animation */}
              <motion.path
                d="M 100 50 Q 300 -50, 500 100"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
                className="text-primary opacity-40"
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Bottom-left curve - Continuous animation */}
              <motion.path
                d="M 50 450 Q 150 350, 250 380"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
                className="text-primary opacity-40"
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              {/* Right side connecting curve - Continuous animation */}
              <motion.path
                d="M 500 250 Q 580 350, 520 450"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
                className="text-primary opacity-40"
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />

              {/* Small decorative loop - Continuous animation */}
              <motion.path
                d="M 120 520 Q 80 480, 120 440 Q 160 480, 120 520"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
                className="text-primary opacity-30"
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.15, 0.3, 0.15]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
            </svg>

            {/* Floating decorative circles - Continuous pulse animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.08, 0.12, 0.08]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-[15%] left-[10%] w-28 h-28 bg-primary rounded-full blur-xl"
            />
            
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.06, 0.1, 0.06]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-[15%] left-[5%] w-20 h-20 bg-primary rounded-full blur-xl"
            />
          </motion.div>

          {/* Mobile/Tablet View - Compact Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative flex lg:hidden items-center justify-center py-8"
          >
            <div className="relative w-full max-w-md mx-auto h-[280px] sm:h-[320px]">
              {/* Main Large Circular Image - Center - Mobile */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full overflow-hidden shadow-2xl border-4 border-card"
              >
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
                  alt="Signature Dish"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Top Right Small Circular Image - Mobile */}
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  x: [0, 3, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-0 right-8 sm:right-12 z-30 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden shadow-xl border-4 border-card"
              >
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400"
                  alt="Tandoori"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom Left Small Circular Image - Mobile */}
              <motion.div
                animate={{ 
                  y: [0, 5, 0],
                  x: [0, -3, 0]
                }}
                transition={{ 
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-0 left-8 sm:left-12 z-10 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden shadow-xl border-4 border-card"
              >
                <img
                  src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400"
                  alt="Chinese Cuisine"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Mobile Decorative Dashed Lines */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 400 320"
              >
                {/* Top curve */}
                <motion.path
                  d="M 60 40 Q 200 -20, 320 80"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                  className="text-primary opacity-30"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.2, 0.35, 0.2]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Bottom curve */}
                <motion.path
                  d="M 80 280 Q 150 220, 200 240"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                  className="text-primary opacity-30"
                  animate={{ 
                    pathLength: [0, 1, 0],
                    opacity: [0.2, 0.35, 0.2]
                  }}
                  transition={{ 
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </svg>

              {/* Mobile Floating decorative circles */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.06, 0.1, 0.06]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-primary rounded-full blur-xl"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.05, 0.08, 0.05]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-[20%] left-[5%] w-12 h-12 bg-primary rounded-full blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}