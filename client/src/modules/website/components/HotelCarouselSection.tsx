import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Star, Building2, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const featuredHotels = [
  {
    id: "mumbai",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    type: "Heritage",
    image: siteContent.images.hotels.mumbai,
    rating: "4.9",
    description: "Experience timeless elegance in the heart of South Mumbai with colonial charm.",
    amenities: ["Ocean View", "Heritage Architecture", "Fine Dining", "Spa & Wellness"],
    capacity: "120 Rooms",
    price: "₹12,500"
  },
  {
    id: "delhi",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    type: "Luxury",
    image: siteContent.images.hotels.delhi,
    rating: "5.0",
    description: "Unparalleled luxury in the capital's most prestigious location.",
    amenities: ["Presidential Suite", "Michelin Dining", "Private Butler", "Infinity Pool"],
    capacity: "200 Suites",
    price: "₹18,900"
  },
  {
    id: "bengaluru",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    type: "Business",
    image: siteContent.images.hotels.bengaluru,
    rating: "4.8",
    description: "Perfect for business travelers and tech professionals in Silicon Valley.",
    amenities: ["Business Center", "High-Speed WiFi", "Conference Rooms", "Rooftop Bar"],
    capacity: "150 Rooms",
    price: "₹10,800"
  },
  {
    id: "chennai",
    name: "Kennedia Blu Chennai",
    location: "ECR, Chennai",
    city: "Chennai",
    type: "Resort",
    image: siteContent.images.hotels.chennai,
    rating: "4.9",
    description: "Beachfront paradise along the scenic East Coast Road with ocean views.",
    amenities: ["Beach Access", "Water Sports", "Ayurvedic Spa", "Seafood Restaurant"],
    capacity: "80 Villas",
    price: "₹14,500"
  },
  {
    id: "hyderabad",
    name: "Kennedia Blu Hyderabad",
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    type: "City Hotel",
    image: siteContent.images.hotels.hyderabad,
    rating: "4.8",
    description: "Contemporary elegance in the City of Pearls with royal hospitality.",
    amenities: ["City Views", "Multi-Cuisine", "Fitness Center", "Event Spaces"],
    capacity: "135 Rooms",
    price: "₹11,200"
  }
];

export default function HotelCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === featuredHotels.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featuredHotels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featuredHotels.length - 1 ? 0 : prev + 1));
  };

  const activeHotel = featuredHotels[activeIndex];

  // Calculate visible cards for 3D effect
  const getVisibleCards = () => {
    const total = featuredHotels.length;
    return [
      { index: (activeIndex - 1 + total) % total, position: 'left' },
      { index: activeIndex, position: 'center' },
      { index: (activeIndex + 1) % total, position: 'right' }
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="py-6 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Slim Compact Header with Full Width Background */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                Premium Selection
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-foreground">Featured Properties</h2>
            </div>

            {/* Right: Compact Inline Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* City Filter */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="font-medium">All Cities</span>
              </button>

              {/* Type Filter */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="font-medium">All Types</span>
              </button>

              {/* Quick Stats Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs">
                <Star className="w-3 h-3 text-primary fill-current" />
                <span className="font-semibold text-foreground">{featuredHotels.length} Properties</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
          {/* LEFT: 3D Carousel - 60% width */}
          <div className="relative h-[500px] flex items-center justify-center px-12" style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              {visibleCards.map(({ index, position }) => {
                const hotel = featuredHotels[index];
                const isCenter = position === 'center';
                const isLeft = position === 'left';
                const isRight = position === 'right';

                return (
                  <div
                    key={hotel.id}
                    className={`absolute transition-all duration-700 ease-out ${isCenter
                        ? 'z-30 scale-100 opacity-100'
                        : 'z-10 scale-65 opacity-35'
                      }`}
                    style={{
                      transform: isCenter
                        ? 'translateX(0) rotateY(0deg)'
                        : isLeft
                          ? 'translateX(-90%) rotateY(30deg)'
                          : 'translateX(90%) rotateY(-30deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="w-[340px] max-w-[80vw] h-[380px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
                      <div className="relative h-full">
                        <OptimizedImage
                          {...hotel.image}
                          className="w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badge */}
                        {isCenter && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                              <span className="text-xs font-bold text-gray-900">{hotel.rating}</span>
                            </div>
                          </div>
                        )}

                        {/* Property Info Overlay */}
                        {isCenter && (
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <div className="inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30">
                              {hotel.type}
                            </div>
                            <h3 className="text-lg font-serif font-semibold mb-1">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center text-xs opacity-90 mb-1.5">
                              <MapPin className="w-3 h-3 mr-1" />
                              {hotel.location}
                            </div>
                            <p className="text-[11px] opacity-80 line-clamp-2 leading-relaxed">
                              {hotel.description}
                            </p>
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
                aria-label="Previous Hotel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full border border-border">
                <span className="text-xs font-semibold text-foreground">
                  {activeIndex + 1} / {featuredHotels.length}
                </span>
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95"
                aria-label="Next Hotel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Content Panel - 40% width */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xl h-[500px] flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                    Hotel
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-yellow-900">{activeHotel.rating}</span>
                    <span className="text-[10px] text-yellow-700">Exceptional</span>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-semibold text-foreground mb-1.5 line-clamp-2">
                  {activeHotel.name}
                </h3>

                <div className="flex items-center text-muted-foreground mb-2.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  <span className="line-clamp-1">{activeHotel.location}</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {activeHotel.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Featured Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeHotel.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span className="line-clamp-1">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="flex items-center justify-between py-3 border-y border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Accommodation
                  </p>
                  <p className="text-sm font-semibold text-foreground">{activeHotel.capacity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Starting From
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {activeHotel.price}
                    <span className="text-xs text-muted-foreground font-normal">/night</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button className="w-full py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 text-sm">
                Book Room
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

    </section>
  );
}