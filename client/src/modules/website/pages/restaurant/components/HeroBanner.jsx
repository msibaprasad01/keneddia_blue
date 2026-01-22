import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
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

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000')`,
          }}
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 tracking-tight">
            Kennedia Blu
          </h1>

          {/* Subheading - Cuisines */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-lg md:text-xl lg:text-2xl text-white/90 font-light">
              Chinese
            </span>
            <span className="text-white/60">·</span>
            <span className="text-lg md:text-xl lg:text-2xl text-white/90 font-light">
              Japanese
            </span>
            <span className="text-white/60">·</span>
            <span className="text-lg md:text-xl lg:text-2xl text-white/90 font-light">
              Indian Tandoor
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Where Flavors Meet Elegance
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleReservation}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reserve a Table
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
