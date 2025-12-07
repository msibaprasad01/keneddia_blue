import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Assets
import awardImg from "@assets/generated_images/luxury_hotel_awards_trophy.png";

const ratings = [
  {
    source: "Condé Nast Traveler",
    score: "98/100",
    label: "Gold List 2024",
    quote: "Unparalleled service in an architectural marvel.",
  },
  {
    source: "Forbes Travel Guide",
    score: "5 Star",
    label: "Global Rating",
    quote: "The definition of modern luxury hospitality.",
  },
  {
    source: "Michelin Guide",
    score: "3 Keys",
    label: "Hotel Selection",
    quote: "An exceptional stay that becomes the destination itself.",
  },
];

export default function RatingsAndAwards() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Side */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <div className="absolute inset-0 border border-primary/20 translate-x-4 translate-y-4 z-0" />
              <img
                src={awardImg}
                alt="Award Trophy"
                className="w-full h-full object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700 mix-blend-multiply"
              />
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
            >
              World Class Recognition
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-serif text-foreground mb-12"
            >
              Excellence is our <br />
              <span className="text-foreground/50 italic">Only Standard</span>
            </motion.h2>

            <div className="space-y-8">
              {ratings.map((item, index) => (
                <motion.div
                  key={item.source}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-card/30 border border-primary/10 p-6 hover:bg-card/50 transition-colors duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-serif text-foreground">{item.source}</h3>
                      <p className="text-xs uppercase tracking-widest text-primary mt-1">
                        {item.label}
                      </p>
                    </div>
                    <div className="text-3xl font-light text-foreground/90 mt-2 md:mt-0">
                      {item.score}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic font-serif text-lg">
                    "{item.quote}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
