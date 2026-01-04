import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Star, Building2, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Data from Hotels.tsx (kept internal as requested)
const properties = [
  {
    id: "mumbai",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    type: "Heritage",
    image: siteContent.images.hotels.mumbai,
    rating: "4.9",
    description: "Experience timeless elegance in the heart of South Mumbai. Our heritage property combines colonial charm with modern luxury.",
    amenities: ["Ocean View", "Heritage Architecture", "Fine Dining", "Spa & Wellness"],
    rooms: "120 Luxury Rooms",
    price: "₹12,500"
  },
  {
    id: "bengaluru",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    type: "Business",
    image: siteContent.images.hotels.bengaluru,
    rating: "4.8",
    description: "Perfect for business travelers and tech professionals. Modern amenities meet sophisticated comfort in the Silicon Valley of India.",
    amenities: ["Business Center", "High-Speed WiFi", "Conference Rooms", "Rooftop Bar"],
    rooms: "150 Executive Rooms",
    price: "₹10,800"
  },
  {
    id: "delhi",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    type: "Luxury",
    image: siteContent.images.hotels.delhi,
    rating: "5.0",
    description: "Unparalleled luxury in the capital's most prestigious location. Where world-class service meets timeless sophistication.",
    amenities: ["Presidential Suite", "Michelin Dining", "Private Butler", "Infinity Pool"],
    rooms: "200 Premium Suites",
    price: "₹18,900"
  },
  {
    id: "kolkata",
    name: "Kennedia Blu Kolkata",
    location: "Park Street, Kolkata",
    city: "Kolkata",
    type: "Heritage",
    image: siteContent.images.hotels.kolkata,
    rating: "4.9",
    description: "Nestled in the cultural heart of Kolkata. Rich history blends seamlessly with contemporary comfort and Bengali hospitality.",
    amenities: ["Heritage Tours", "Bengali Cuisine", "Art Gallery", "Garden Terrace"],
    rooms: "95 Heritage Rooms",
    price: "₹9,800"
  },
  {
    id: "hyderabad",
    name: "Kennedia Blu Hyderabad",
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    type: "City Hotel",
    image: siteContent.images.hotels.hyderabad,
    rating: "4.8",
    description: "Contemporary elegance in the City of Pearls. Experience royal hospitality with modern conveniences.",
    amenities: ["City Views", "Multi-Cuisine", "Fitness Center", "Event Spaces"],
    rooms: "135 Deluxe Rooms",
    price: "₹11,200"
  },
  {
    id: "chennai",
    name: "Kennedia Blu Chennai",
    location: "ECR, Chennai",
    city: "Chennai",
    type: "Resort",
    image: siteContent.images.hotels.chennai,
    rating: "4.9",
    description: "Beachfront paradise along the scenic East Coast Road. Relax and rejuvenate with breathtaking ocean views and coastal serenity.",
    amenities: ["Beach Access", "Water Sports", "Ayurvedic Spa", "Seafood Restaurant"],
    rooms: "80 Beach Villas",
    price: "₹14,500"
  },
];

export default function PropertiesSection() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeIndex, setActiveIndex] = useState(0);

  const uniqueCities = ["All Cities", ...Array.from(new Set(properties.map(p => p.city)))];
  const uniqueTypes = ["All Types", ...Array.from(new Set(properties.map(p => p.type)))];

  const filteredProperties = properties.filter(p => {
    const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
    const matchType = selectedType === "All Types" || p.type === selectedType;
    return matchCity && matchType;
  });

  // Auto-slide effect - every 3 seconds
  useEffect(() => {
    if (filteredProperties.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === filteredProperties.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [filteredProperties.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? filteredProperties.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === filteredProperties.length - 1 ? 0 : prev + 1));
  };

  const activeProperty = filteredProperties[activeIndex];

  // Calculate visible cards (prev, current, next)
  const getVisibleCards = () => {
    const total = filteredProperties.length;
    if (total === 0) return [];
    if (total === 1) return [{ index: 0, position: 'center' }];
    if (total === 2) return [
      { index: activeIndex, position: 'center' },
      { index: (activeIndex + 1) % total, position: 'right' }
    ];
    
    return [
      { index: (activeIndex - 1 + total) % total, position: 'left' },
      { index: activeIndex, position: 'center' },
      { index: (activeIndex + 1) % total, position: 'right' }
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="py-12 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-1.5">
              Explore Our Properties
            </h2>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setActiveIndex(0);
                }}
                className="appearance-none bg-background border border-border rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none shadow-sm hover:border-primary/50 transition-all"
              >
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setActiveIndex(0);
                }}
                className="appearance-none bg-background border border-border rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none shadow-sm hover:border-primary/50 transition-all"
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* LEFT: 3D Carousel */}
            <div className="relative h-[450px] flex items-center justify-center perspective-1000">
              <div className="relative w-full h-full flex items-center justify-center">
                {visibleCards.map(({ index, position }) => {
                  const property = filteredProperties[index];
                  const isCenter = position === 'center';
                  const isLeft = position === 'left';
                  const isRight = position === 'right';

                  return (
                    <div
                      key={property.id}
                      className={`absolute transition-all duration-700 ease-out ${
                        isCenter 
                          ? 'z-30 scale-100 opacity-100' 
                          : 'z-10 scale-75 opacity-40'
                      }`}
                      style={{
                        transform: isCenter 
                          ? 'translateX(0) rotateY(0deg)' 
                          : isLeft
                          ? 'translateX(-75%) rotateY(25deg)'
                          : 'translateX(75%) rotateY(-25deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="w-72 h-[380px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative h-full">
                          <OptimizedImage
                            {...property.image}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Badge */}
                          {isCenter && (
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                <span className="text-xs font-bold text-gray-900">{property.rating}</span>
                              </div>
                            </div>
                          )}

                          {/* Property Info Overlay */}
                          {isCenter && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="inline-block px-2 py-0.5 mb-1.5 text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30">
                                {property.type}
                              </div>
                              <h3 className="text-xl font-serif font-semibold mb-0.5">
                                {property.name}
                              </h3>
                              <div className="flex items-center text-xs opacity-90">
                                <MapPin className="w-3 h-3 mr-1" />
                                {property.location}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Previous Property"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full border border-border">
                  <span className="text-xs font-semibold text-foreground">
                    {activeIndex + 1} / {filteredProperties.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Next Property"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT: Content Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                      {activeProperty.type}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-yellow-900">{activeProperty.rating}</span>
                      <span className="text-[10px] text-yellow-700">Exceptional</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-1.5">
                    {activeProperty.name}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground mb-3 text-sm">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    <span>{activeProperty.location}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeProperty.description}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Featured Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeProperty.amenities.map((amenity, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rooms & Price */}
                <div className="flex items-center justify-between py-3 border-y border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Accommodation
                    </p>
                    <p className="text-sm font-semibold text-foreground">{activeProperty.rooms}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Starting From
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {activeProperty.price}
                      <span className="text-xs text-muted-foreground font-normal">/night</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button className="w-full py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 text-sm">
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <button className="py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs">
                      <Phone className="w-3.5 h-3.5" />
                      Call Us
                    </button>
                    <button className="py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs">
                      <Mail className="w-3.5 h-3.5" />
                      Enquire
                    </button>
                  </div>

                  <button className="w-full py-2 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
                    View Full Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 rounded-2xl border-2 border-dashed border-primary/20">
            <Building2 className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No properties found matching your selection.</p>
            <button
              onClick={() => { setSelectedCity("All Cities"); setSelectedType("All Types"); }}
              className="mt-4 px-6 py-2 text-sm text-primary font-semibold hover:underline border border-primary/30 rounded-full hover:bg-primary/5 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* CSS for 3D perspective */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}