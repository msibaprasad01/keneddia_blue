import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

export default function EventsSection() {
  const { events } = siteContent.text;

  if (!events) return null;

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {events.title}
            </h2>
            <div className="h-0.5 w-16 bg-primary" />
          </div>
          <Link href="/events">
            <a className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
              All Events
              <ArrowRight className="w-4 h-4" />
            </a>
          </Link>
        </div>

        {/* Compact Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.items.map((event, index) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="group relative"
            >
              <Link href={`/events/${event.slug}`}>
                <a className="block">
                  {/* Compact Card - 30% shorter */}
                  <div className="relative aspect-[4/3.5] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500">
                    {/* Background Image */}
                    <OptimizedImage
                      src={event.image.src}
                      alt={event.image.alt}
                      priority={false}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Stronger Gradient Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                    {/* Date Badge - High Contrast for Dark Mode */}
                    <div className="absolute top-3 right-3 bg-primary shadow-xl border border-white/20">
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wide">
                          {event.date}
                        </span>
                      </div>
                    </div>

                    {/* Content - Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1.5 line-clamp-2 group-hover:text-primary transition-colors drop-shadow-lg">
                        {event.title}
                      </h3>
                      <p className="text-xs text-white/90 mb-3 line-clamp-2 leading-relaxed drop-shadow-md">
                        {event.description}
                      </p>

                      {/* View Details Link */}
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}