import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { restaurantStats } from "@/data/restaurantData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function CountUpAnimation({ end, duration = 2, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const endValue = parseInt(end);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function PerformanceMetrics() {
  const scrollRef = useRef(null);
  const barHeights = [75, 85, 70, 80];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-background dark:via-background dark:to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
           animate={{ 
             scale: [1, 1.15, 1],
             opacity: [0.03, 0.06, 0.03]
           }}
           transition={{ 
             duration: 15,
             repeat: Infinity,
             ease: "easeInOut"
           }}
           className="absolute top-0 right-[15%] w-[350px] h-[350px] bg-gray-400 dark:bg-primary rounded-full blur-3xl"
         />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2">
            Performance Metrics
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground mb-1">
            Excellence by Numbers
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
           {/* Navigation Buttons (Desktop) */}
           <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-12 -right-12 justify-between z-20 pointer-events-none">
             <Button
               variant="outline"
               size="icon"
               className="pointer-events-auto rounded-full bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
               onClick={() => scroll('left')}
             >
               <ChevronLeft className="h-5 w-5" />
             </Button>
             <Button
               variant="outline"
               size="icon"
               className="pointer-events-auto rounded-full bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
               onClick={() => scroll('right')}
             >
               <ChevronRight className="h-5 w-5" />
             </Button>
           </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar px-4 md:px-0"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
             {restaurantStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="snap-center flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <div className="bg-white/80 dark:bg-card/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-border shadow-lg p-6 flex flex-col items-center h-full">
                    {/* Bar Representation */}
                    <div className="relative w-full h-32 flex flex-col justify-end mb-4">
                       <motion.div
                         initial={{ height: 0 }}
                         whileInView={{ height: `${barHeights[index % barHeights.length]}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1.2, delay: 0.2 }}
                         className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg mx-auto relative overflow-hidden"
                       >
                         {/* Shimmer */}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-shimmer" />
                       </motion.div>
                       <div className="w-full h-0.5 bg-border rounded-full" />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                      </div>
                      <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                    </div>
                  </div>
                </motion.div>
             ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex md:hidden justify-center gap-2 mt-2">
            {restaurantStats.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
