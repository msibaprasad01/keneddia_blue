import { motion } from "framer-motion";
import { Link } from "wouter";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

export default function OurStoryPreview() {
  const { ourStory } = siteContent.text;

  if (!ourStory) return null;

  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Content Side - Reduced Padding */}
        <div className="flex flex-col justify-center px-6 py-12 lg:p-16 xl:p-20 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-primary font-medium tracking-[0.2em] text-xs uppercase mb-4">
              Who We Are
            </span>
            {/* Reduced Title Size */}
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
              {ourStory.headline}
            </h2>
            <div className="w-16 h-1 bg-primary mb-6" />

            {/* Reduced Text Size */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {ourStory.summary}
            </p>

            <Link href={ourStory.link}>
              <a className="inline-block px-8 py-3 border border-primary text-primary font-semibold tracking-wide uppercase hover:bg-primary hover:text-white transition-all duration-300 text-sm">
                {ourStory.ctaText}
              </a>
            </Link>
          </motion.div>
        </div>

        {/* Image Side - 50% Size & Centered */}
        <div className="relative h-[300px] lg:h-auto order-1 lg:order-2 flex items-center justify-center bg-secondary/30">
          <div className="relative w-1/2 aspect-square shadow-2xl rounded-sm overflow-hidden transform">
            <OptimizedImage
              src={ourStory.image.src}
              alt={ourStory.image.alt}
              priority={false}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
