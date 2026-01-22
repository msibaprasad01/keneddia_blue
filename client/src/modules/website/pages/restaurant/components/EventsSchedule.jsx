import { motion } from "framer-motion";
import { eventsSchedule } from "@/data/restaurantData";
import { Calendar, Clock, User, Ticket, Sparkles } from "lucide-react";
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
    <section className="relative py-10 md:py-14 bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-primary rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.05, 0.02],
            rotate: [0, -90, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-primary rounded-full blur-3xl"
        />

        {/* Dotted pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2"
          >
            <Sparkles className="w-3 h-3" />
            <span>What's Coming</span>
          </motion.span>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Upcoming Events
          </h2>
          
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Join us for unforgettable experiences
          </p>
        </motion.div>

        {/* Timeline Style Events */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />

            {/* Events */}
            <div className="space-y-6">
              {eventsSchedule.map((event, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative grid md:grid-cols-2 gap-4 md:gap-8 items-center ${
                      isEven ? '' : 'md:text-right'
                    }`}
                  >
                    {/* Date Circle - Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20"
                      >
                        <Calendar className="w-5 h-5 text-primary" />
                        
                        {/* Pulsing ring */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 rounded-full border-2 border-primary"
                        />
                      </motion.div>
                    </div>

                    {/* Content Card - Alternating sides */}
                    <div className={`${isEven ? 'md:col-start-1' : 'md:col-start-2'} col-span-1`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                      >
                        {/* Date Badge - Mobile */}
                        {event.date && (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full mb-3 ${
                            isEven ? '' : 'md:float-right'
                          }`}>
                            <Calendar className="w-3 h-3 text-primary" />
                            <span className="text-xs font-semibold text-primary">{event.date}</span>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                          {event.title}
                        </h3>

                        {/* Meta Info */}
                        <div className={`flex flex-wrap gap-3 mb-3 ${isEven ? '' : 'md:justify-end'}`}>
                          {event.guest && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span className="text-xs">{event.guest}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{event.time}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">
                          {event.description}
                        </p>

                        {/* Decorative Arrow */}
                        <div className={`flex items-center gap-2 ${isEven ? '' : 'md:justify-end'}`}>
                          <motion.div
                            className="h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full"
                            initial={{ width: "20%" }}
                            whileInView={{ width: "40%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className={`hidden md:block ${isEven ? 'md:col-start-2' : 'md:col-start-1'}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={handleReserve}
            size="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 text-sm rounded-full shadow-lg hover:shadow-xl transition-all group"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Reserve Your Spot
          </Button>

          {/* Timeline indicator */}
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
            Limited seats available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}