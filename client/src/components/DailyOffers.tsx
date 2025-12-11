import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Tag } from "lucide-react";
import { siteContent } from "@/data/siteContent";

export default function DailyOffers() {
  const { dailyOffers } = siteContent.text;

  // Guard clause in case data isn't ready
  if (!dailyOffers) return null;

  return (
    <section className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
      {/* Background with Parallax-like feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        {/* Using a high-quality luxury image from existing assets as background base */}
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url(${siteContent.images.hero.slide3.src})` }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {/* Tag / Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full mb-6">
            <Tag className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-medium tracking-wide uppercase">
              Limited Time Offer
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            {dailyOffers.offer.title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
            {dailyOffers.offer.description}
          </p>

          {/* Coupon Code & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
              <span className="text-gray-400 text-sm uppercase block mb-1">Coupon Code</span>
              <span className="text-2xl font-mono text-white tracking-wider">{dailyOffers.offer.couponCode}</span>
            </div>

            <Link href={dailyOffers.offer.link}>
              <a className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                {dailyOffers.offer.ctaText}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
