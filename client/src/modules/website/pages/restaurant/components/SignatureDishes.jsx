import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dishCategories, signatureDishes } from "@/data/restaurantData";
import { Eye, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignatureDishes() {
  const [activeTab, setActiveTab] = useState(dishCategories[0].id);

  const filteredDishes = signatureDishes.filter(
    dish => dish.category === activeTab
  );

  const handleViewFullMenu = () => {
    // Could navigate to a full menu page or open a modal
    alert("Full menu feature coming soon!");
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-muted/30">
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
            Signature Dishes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our carefully curated selection of culinary masterpieces
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {dishCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === category.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-card text-foreground hover:bg-primary/10 border border-border"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            {filteredDishes.map((dish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  {/* Image Placeholder */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MenuIcon className="w-16 h-16 text-primary/30" />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white text-foreground rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4" />
                        View Dish
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {dish.name}
                    </h3>
                    {dish.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {dish.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View Full Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleViewFullMenu}
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full transition-all group"
          >
            <MenuIcon className="w-5 h-5 mr-2" />
            View Full Menu
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
