import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function VerticalAbout({ title, description, features = [] }) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                        About Our {title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        {description}
                    </p>
                    
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-foreground/80 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                         <img 
                            src={`https://source.unsplash.com/800x800/?${encodeURIComponent(title)},interior,restaurant`} 
                            alt={`${title} Ambiance`}
                            className="w-full h-full object-cover"
                         />
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -left-6 z-[-1] w-full h-full border-2 border-primary/20 rounded-2xl" />
                </motion.div>
            </div>
        </div>
    </section>
  );
}
