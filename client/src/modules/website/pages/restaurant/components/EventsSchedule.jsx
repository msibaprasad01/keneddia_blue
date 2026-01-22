import { motion } from "framer-motion";
import { eventsSchedule } from "@/data/restaurantData";
import { Calendar, Clock, User, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsSchedule() {
  const handleReserve = () => {
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-foreground/95 via-foreground to-foreground/90 dark:from-background/95 dark:via-background dark:to-background/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
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
            Upcoming Events
          </h2>
          <p className="text-background/70 dark:text-foreground/70 text-lg max-w-2xl mx-auto">
            Join us for unforgettable experiences and celebrations
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {eventsSchedule.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-background/10 dark:bg-foreground/5 backdrop-blur-sm border border-background/20 dark:border-foreground/10 rounded-2xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                {/* Date Badge (if available) */}
                {event.date && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{event.date}</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-background dark:text-foreground mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                {/* Guest (if available) */}
                {event.guest && (
                  <div className="flex items-center gap-2 mb-3 text-background/80 dark:text-foreground/80">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Special Guest: {event.guest}</span>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center gap-2 mb-4 text-background/80 dark:text-foreground/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{event.time}</span>
                </div>

                {/* Description */}
                <p className="text-background/70 dark:text-foreground/70 leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* Decorative Line */}
                <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-20 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleReserve}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all group"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Reserve for Event
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
