import { motion, useInView } from "framer-motion";
import { MapPin, Star, Award, Users, Building2, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { siteContent } from "@/data/siteContent";

const stats = [
  {
    id: 1,
    label: "Properties Across India",
    value: 45,
    icon: Building2,
    suffix: "+",
  },
  {
    id: 2,
    label: "Five Star Ratings",
    value: 28,
    icon: Star,
    suffix: "",
  },
  {
    id: 3,
    label: "Industry Awards",
    value: 85,
    icon: Award,
    suffix: "+",
  },
  {
    id: 4,
    label: "Guests Annually",
    value: 2.5,
    icon: Users,
    suffix: "M",
    isDecimal: true,
  },
];

const locations = [
  { state: "Karnataka", city: "Bangalore" },
  { state: "Uttar Pradesh", city: "Varanasi" },
  { state: "Rajasthan", city: "Jaipur" },
  { state: "Maharashtra", city: "Mumbai" },
  { state: "Tamil Nadu", city: "Chennai" },
  { state: "Kerala", city: "Kochi" },
  { state: "Delhi", city: "New Delhi" },
  { state: "Goa", city: "Panaji" },
];

const highlights = [
  "Premium locations in heritage cities",
  "State-of-the-art conference facilities",
  "Award-winning culinary experiences",
  "Sustainable hospitality practices",
  "24/7 concierge services",
  "Wellness & spa amenities",
];

// Counter animation hook - Continuous animation
function useCountUp(end: number, duration: number = 2000, isDecimal: boolean = false) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false }); // Changed to false for continuous

  useEffect(() => {
    if (!isInView) {
      setCount(0); // Reset to 0 when out of view
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      if (isDecimal) {
        setCount(parseFloat((progress * end).toFixed(1)));
      } else {
        setCount(Math.floor(progress * end));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration, isDecimal]);

  return { count, countRef };
}

// Individual stat card component with counter
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { count, countRef } = useCountUp(stat.value, 2000, stat.isDecimal);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-primary/10 p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors duration-500 group"
    >
      <stat.icon className="w-8 h-8 text-primary mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="text-4xl md:text-5xl font-serif text-foreground mb-2">
        {stat.isDecimal ? count.toFixed(1) : count}
        <span className="text-primary text-2xl align-top">{stat.suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function GlobalPresence() {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Image with Parallax feel */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply">
        <img
          src={siteContent.images.globalPresence.map}
          alt="India Presence Map"
          className="w-full h-full object-cover grayscale invert"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
            >
              Domestic Footprint
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-serif text-foreground mb-8 leading-tight"
            >
              Redefining Luxury Across <br />
              <span className="text-foreground/50 italic">India's Finest Cities</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-light leading-relaxed mb-10 max-w-lg"
            >
              From the tech hub of Bangalore to the spiritual heart of Varanasi, 
              Kennedia Blu Hotels creates experiences that honor India's rich heritage 
              while delivering world-class hospitality standards.
            </motion.p>

            {/* Locations Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10">
              {locations.map((location, index) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center space-x-2 text-foreground/80"
                >
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {location.city}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {location.state}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Highlights with Dot Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Why Choose Kennedia Blu
                </h3>
              </div>
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="text-sm text-muted-foreground font-light">
                    {highlight}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Grid with Animated Numbers */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}