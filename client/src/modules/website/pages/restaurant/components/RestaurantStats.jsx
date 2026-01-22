import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { restaurantStats } from "@/data/restaurantData";

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

export default function RestaurantStats() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 dark:from-background dark:via-background/95 dark:to-background/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-background dark:text-foreground mb-4">
            Our Journey in Numbers
          </h2>
          <p className="text-background/70 dark:text-foreground/70 text-lg max-w-2xl mx-auto">
            Excellence backed by experience and dedication
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {restaurantStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-background/10 dark:bg-foreground/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-background/20 dark:border-foreground/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                {/* Number */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-2">
                  <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-background/80 dark:text-foreground/80 text-sm md:text-base font-medium">
                  {stat.label}
                </div>

                {/* Decorative Line */}
                <div className="mt-4 h-1 w-12 bg-primary/30 mx-auto rounded-full group-hover:w-20 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
