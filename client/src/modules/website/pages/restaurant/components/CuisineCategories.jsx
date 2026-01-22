import { motion } from "framer-motion";
import { cuisineCategories } from "@/data/restaurantData";
import { UtensilsCrossed, Users, Flame, ShoppingBag } from "lucide-react";

const CATEGORY_ICONS = {
  "italian": UtensilsCrossed,
  "luxury-lounge": Users,
  "spicy-darbar": Flame,
  "takeaway": ShoppingBag
};

export default function CuisineCategories() {
  const handleCategoryClick = (categoryId) => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      const elementPosition = menuSection.getBoundingClientRect().top;
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
            Explore Our Cuisines
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover a world of flavors crafted with passion and authenticity
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cuisineCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id] || UtensilsCrossed;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">
                  {/* Icon Background */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="w-24 h-24 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex flex-col h-full min-h-[200px]">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                      {category.description}
                    </p>

                    {/* Hover Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Explore Menu</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
