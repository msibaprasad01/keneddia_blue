import { motion } from "framer-motion";
import { banquetServices } from "@/data/restaurantData";
import { PartyPopper, Briefcase, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICE_ICONS = {
  "Birthday Party": PartyPopper,
  "Business Meetings": Briefcase,
  "Wedding Party": Heart
};

export default function BanquetsAndCatering() {
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Banquets & Catering
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Host your special moments in our elegant BYOB space
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {banquetServices.map((service, index) => {
            const Icon = SERVICE_ICONS[service.title] || PartyPopper;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Decorative Element */}
                  <div className="mt-6 h-1 w-12 bg-primary/30 rounded-full group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            );
          })}
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
            onClick={handleEnquire}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all group"
          >
            Enquire Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
