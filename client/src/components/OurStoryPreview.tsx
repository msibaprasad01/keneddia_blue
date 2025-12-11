import { motion } from "framer-motion";
import { Link } from "wouter";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

export default function OurStoryPreview() {
  const { ourStory } = siteContent.text;

  if (!ourStory) return null;

  return (
    <section className="bg-[#FAF9F6]"> {/* Soft beige / off-white */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Content Side */}
        <div className="flex flex-col justify-center px-6 py-20 lg:p-24 xl:p-32 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-primary font-medium tracking-[0.25em] uppercase mb-6">
              Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight">
              {ourStory.headline}
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mb-8" />
            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
              {ourStory.summary}
            </p>
            <Link href={ourStory.link}>
              <a className="inline-block px-10 py-4 border-2 border-yellow-600 text-yellow-700 font-semibold tracking-wide uppercase hover:bg-yellow-600 hover:text-white transition-all duration-300">
                {ourStory.ctaText}
              </a>
            </Link>
          </motion.div>
        </div>

        {/* Image Side */}
        <div className="relative h-[400px] lg:h-auto order-1 lg:order-2">
          <div className="absolute inset-0">
            <OptimizedImage
              src={ourStory.image.src}
              alt={ourStory.image.alt}
              priority={false}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Blend Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-transparent lg:bg-gradient-to-l lg:via-transparent lg:to-transparent opacity-50" />
        </div>
      </div>
    </section>
  );
}
