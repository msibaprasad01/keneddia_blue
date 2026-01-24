import { motion, useAnimation } from "framer-motion";
import { banquetServices } from "@/data/restaurantData";
import { PartyPopper, Briefcase, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const SERVICE_ICONS = {
  "Birthday Party": PartyPopper,
  "Business Meetings": Briefcase,
  "Wedding Party": Heart
};

export default function BanquetsAndCatering() {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  // Duplicate services multiple times for smooth infinite loop
  const duplicatedServices = [...banquetServices, ...banquetServices, ...banquetServices];

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [0, -(100 / 3) * banquetServices.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 10, // Faster speed - was 20
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls, banquetServices.length]);

  const handleEnquire = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-10 md:py-14 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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
          className="absolute top-0 right-[20%] w-[300px] h-[300px] bg-primary rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Compact Section Header */}
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
            className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2"
          >
            Special Events
          </motion.span>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Banquets & Catering
          </h2>
          
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Host your special moments in our elegant BYOB space
          </p>
        </motion.div>

        {/* Carousel Container - Show 3 items */}
        <div className="relative mb-8">
          {/* Gradient Overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              animate={controls}
              className="flex gap-4 md:gap-6"
            >
              {duplicatedServices.map((service, index) => {
                const Icon = SERVICE_ICONS[service.title] || PartyPopper;
                
                return (
                  <motion.div
                    key={`${service.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % banquetServices.length) * 0.1 }}
                    className="group flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <div className="h-full bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 md:p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer min-h-[220px] flex flex-col">
                      {/* Icon */}
                      <div className="mb-5">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                        {service.description}
                      </p>

                      {/* Decorative Element */}
                      <motion.div
                        className="mt-4 h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent rounded-full"
                        initial={{ width: "30%" }}
                        whileInView={{ width: "70%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Pause Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPaused ? 1 : 0 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 text-xs text-muted-foreground z-20 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Paused - Hover to explore</span>
            </div>
          </motion.div>
        </div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleEnquire}
            size="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 text-sm rounded-full shadow-lg hover:shadow-xl transition-all group"
          >
            Enquire Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Auto-scroll indicator */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            Hover on cards to pause auto-scroll
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}