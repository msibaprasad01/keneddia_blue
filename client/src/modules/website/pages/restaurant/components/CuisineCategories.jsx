import { motion } from "framer-motion";
import { cuisineCategories } from "@/data/restaurantData";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CuisineCategories() {
  const handleCategoryClick = (categoryId) => {
    // Logic to filter or navigate to menu
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
    <section className="relative py-12 md:py-16 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-3">
            Culinary Offerings
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore Our Sub-Verticals
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            From authentic Italian to fiery Indian flavors, discover the unique dining experiences we offer.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cuisineCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer"
            >
              <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-lg border border-border group-hover:shadow-xl transition-all duration-500">
                {/* Background Image */}
                <div className="absolute inset-0 bg-muted">
                  <img
                    src={category.image || `https://source.unsplash.com/800x600/?${category.title}`}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
                  
                  {/* Decorative Icon */}
                  <div className="mb-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-4 group-hover:translate-y-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-primary-foreground transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all duration-300">
                    <span>View Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

