import { motion } from "framer-motion";
import { restaurantInfo } from "@/data/restaurantData";
import { Clock, Phone, Award } from "lucide-react";

export default function AboutRestaurant() {
  const { name, description, hours, contact, specialOffer } = restaurantInfo;

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000"
                alt="Restaurant Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Floating Badge */}
            {specialOffer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-2xl max-w-[280px]"
              >
                <Award className="w-8 h-8 mb-2" />
                <h4 className="font-bold text-lg mb-1">{specialOffer.title}</h4>
                <p className="text-sm opacity-90 mb-2">{specialOffer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-80">{specialOffer.timing}</span>
                  <span className="text-xl font-bold">{specialOffer.price}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              About {name} Restaurant
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {description}
            </p>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Opening Hours */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Opening Hours</h4>
                  <p className="text-muted-foreground text-sm">
                    {hours.days}
                  </p>
                  <p className="text-foreground font-medium">{hours.time}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Contact Us</h4>
                  <div className="flex flex-wrap gap-2">
                    {contact.phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-full text-sm font-medium transition-all"
                      >
                        <Phone className="w-3 h-3" />
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
