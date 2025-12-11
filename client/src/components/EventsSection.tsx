import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "./ui/OptimizedImage";

export default function EventsSection() {
  const { events } = siteContent.text;

  if (!events) return null;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {events.title}
            </h2>
            <div className="h-1 w-24 bg-primary rounded-full" />
          </div>
          <Link href="/events">
            <a className="group flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              View All Events
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.items.map((event, index) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden">
                <OptimizedImage
                  src={event.image.src}
                  alt={event.image.alt}
                  priority={false}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {event.date}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
                <Link href={`/events/${event.slug}`}>
                  <a className="inline-flex items-center text-sm font-bold text-primary uppercase tracking-wider hover:underline underline-offset-4">
                    View Details
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
