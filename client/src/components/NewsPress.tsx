import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

export default function NewsPress() {
  const { news } = siteContent.text;

  if (!news) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-sm font-semibold text-primary tracking-[0.2em] uppercase mb-4">
            Updates & Recognition
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            {news.title}
          </h2>
          <div className="w-20 h-0.5 bg-gray-200" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {news.items.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-3/2 overflow-hidden rounded-xl mb-6">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                <OptimizedImage
                  src={item.image.src}
                  alt={item.image.alt}
                  priority={false}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Meta */}
              <div className="mb-3 flex items-center gap-4 text-sm text-gray-400">
                <span>{item.date}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span className="uppercase tracking-wider">Press</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 mb-6 leading-relaxed flex-grow">
                {item.description}
              </p>

              {/* Link */}
              <Link href={`/news/${item.slug}`}>
                <a className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Read More
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
