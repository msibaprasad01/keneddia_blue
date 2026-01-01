import { useState, useRef } from "react";
import { ArrowRight, MapPin, Star, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

import "swiper/css";
import "swiper/css/navigation";

// Data from Hotels.tsx (kept internal as requested)
// Enriched with 'type' for filtering
const properties = [
  {
    id: "mumbai",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    type: "Heritage",
    image: siteContent.images.hotels.mumbai,
    rating: "4.9",
  },
  {
    id: "bengaluru",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    type: "Business",
    image: siteContent.images.hotels.bengaluru,
    rating: "4.8",
  },
  {
    id: "delhi",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    type: "Luxury",
    image: siteContent.images.hotels.delhi,
    rating: "5.0",
  },
  {
    id: "kolkata",
    name: "Kennedia Blu Kolkata",
    location: "Park Street, Kolkata",
    city: "Kolkata",
    type: "Heritage",
    image: siteContent.images.hotels.kolkata,
    rating: "4.9",
  },
  {
    id: "hyderabad",
    name: "Kennedia Blu Hyderabad",
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    type: "City Hotel",
    image: siteContent.images.hotels.hyderabad,
    rating: "4.8",
  },
  {
    id: "chennai",
    name: "Kennedia Blu Chennai",
    location: "ECR, Chennai",
    city: "Chennai",
    type: "Resort",
    image: siteContent.images.hotels.chennai,
    rating: "4.9",
  },
];

export default function PropertiesSection() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const uniqueCities = ["All Cities", ...Array.from(new Set(properties.map(p => p.city)))];
  const uniqueTypes = ["All Types", ...Array.from(new Set(properties.map(p => p.type)))];

  const filteredProperties = properties.filter(p => {
    const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
    const matchType = selectedType === "All Types" || p.type === selectedType;
    return matchCity && matchType;
  });

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              Explore Our Properties
            </h2>
            <div className="w-16 h-0.5 bg-primary mt-3" />
          </div>

          {/* Filters & Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <div className="relative hidden sm:block">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-background border border-border rounded-full py-1.5 pl-3 pr-8 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer outline-none shadow-sm hover:border-primary/50 transition-colors"
              >
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Building2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-background border border-border rounded-full py-1.5 pl-3 pr-8 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer outline-none shadow-sm hover:border-primary/50 transition-colors"
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
              aria-label="Previous Property"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10 relative cursor-pointer"
              aria-label="Next Property"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {filteredProperties.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={filteredProperties.length > 3}
            autoplay={{ delay: 6000, disableOnInteraction: true }}
            onSwiper={setSwiperInstance}
            speed={700}
            className="w-full pb-4"
          >
            {filteredProperties.map((property) => (
              <SwiperSlide key={property.id} className="h-full">
                <div className="group bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:border-primary/40 transition-colors duration-300">
                  {/* Image - Top - Aspect 3:2 */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <OptimizedImage
                      {...property.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wider">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{property.rating} Exceptional</span>
                      </div>
                    </div>
                  </div>

                  {/* Content - Bottom */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                        {property.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>

                    <div className="flex items-center text-muted-foreground text-xs mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.location}
                    </div>

                    <div className="mt-auto flex gap-3 pt-3 border-t border-border/50">
                      <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary/50 rounded transition-colors border border-transparent hover:border-border">
                        Details
                      </button>
                      <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors shadow-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-primary/20">
            <Building2 className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-base font-medium">No properties found matching your selection.</p>
            <button
              onClick={() => { setSelectedCity("All Cities"); setSelectedType("All Types") }}
              className="mt-3 text-sm text-primary font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
