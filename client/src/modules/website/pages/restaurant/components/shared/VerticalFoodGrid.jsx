import { signatureDishes } from "@/data/restaurantData";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, Clock, Star, Flame, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const VerticalDishCard = ({ dish, index }) => {
  const [imgSrc, setImgSrc] = useState(dish.image || `https://source.unsplash.com/600x450/?${encodeURIComponent(dish.name)},food`);
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const handleImageError = () => {
    const errorCount = imgErrorCount + 1;
    setImgErrorCount(errorCount);
    if (errorCount === 1) {
       setImgSrc(`https://source.unsplash.com/600x450/?${dish.category},food`);
    } else if (errorCount === 2) {
       setImgSrc("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={imgSrc}
          alt={dish.name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-foreground shadow-sm">
          {dish.price || "₹349"}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
          {dish.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
          {dish.description || "A masterfully crafted dish featuring the finest ingredients."}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
             <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 20m
             </div>
             <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Spicy
             </div>
             <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> 4.8
             </div>
        </div>

        <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors group/btn">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order Now
        </Button>
      </div>
    </motion.div>
  );
};

export default function VerticalFoodGrid({ categoryId, title }) {
  const dishes = signatureDishes.filter(d => d.category === categoryId);
  // If no specific dishes found for category, fallback to show some generic ones or empty state
  // ideally we should have data. For demo, we might show all if empty, or show empty.
  // Assuming data exists as per previous context.

  if (dishes.length === 0) {
      return (
          <div className="py-20 text-center text-muted-foreground">
              <p>Menu items coming soon for this category.</p>
          </div>
      );
  }

  return (
    <section id="vertical-menu" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
           <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">
             Our Menu
           </span>
           <h2 className="text-3xl md:text-4xl font-bold text-foreground">
             {title} Delicacies
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <VerticalDishCard key={index} dish={dish} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
