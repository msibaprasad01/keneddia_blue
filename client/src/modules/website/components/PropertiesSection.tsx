import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Star, Building2, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Data shuffled in pattern: Cafe -> Hotel -> Restaurant -> Cafe
const properties = [
  // Cafe 1
  {
    id: "mumbai-cafe",
    name: "Kennedia Blu Cafe Mumbai",
    location: "Bandra, Mumbai",
    city: "Mumbai",
    type: "Cafe",
    image: siteContent.images.cafes.parisian,
    rating: "4.8",
    description: "A cozy Parisian-style cafe offering artisanal coffee and pastries.",
    amenities: ["Specialty Coffee", "Fresh Pastries", "Free WiFi", "Outdoor Seating"],
    capacity: "45 Seats",
    price: "₹450"
  },
  // Hotel 1
  {
    id: "mumbai-hotel",
    name: "Kennedia Blu Mumbai",
    location: "Colaba, Mumbai",
    city: "Mumbai",
    type: "Hotel",
    image: siteContent.images.hotels.mumbai,
    rating: "4.9",
    description: "Experience timeless elegance in the heart of South Mumbai.",
    amenities: ["Ocean View", "Heritage Architecture", "Fine Dining", "Spa & Wellness"],
    capacity: "120 Rooms",
    price: "₹12,500"
  },
  // Restaurant 1
  {
    id: "mumbai-restaurant",
    name: "Kennedia Blu Restaurant Mumbai",
    location: "Marine Drive, Mumbai",
    city: "Mumbai",
    type: "Restaurant",
    image: siteContent.images.bars.rooftop,
    rating: "4.9",
    description: "Rooftop fine dining with spectacular ocean views and cocktails.",
    amenities: ["Rooftop Dining", "Craft Cocktails", "Live Music", "Ocean Views"],
    capacity: "80 Covers",
    price: "₹2,500"
  },
  // Cafe 2
  {
    id: "bengaluru-cafe",
    name: "Kennedia Blu Cafe Bengaluru",
    location: "Koramangala, Bengaluru",
    city: "Bengaluru",
    type: "Cafe",
    image: siteContent.images.cafes.minimalist,
    rating: "4.7",
    description: "Modern minimalist coffee shop with expertly crafted brews.",
    amenities: ["Craft Coffee", "Power Outlets", "Co-working Space", "Vegan Options"],
    capacity: "60 Seats",
    price: "₹400"
  },
  // Hotel 2
  {
    id: "bengaluru-hotel",
    name: "Kennedia Blu Bengaluru",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    type: "Hotel",
    image: siteContent.images.hotels.bengaluru,
    rating: "4.8",
    description: "Perfect for business travelers and tech professionals.",
    amenities: ["Business Center", "High-Speed WiFi", "Conference Rooms", "Rooftop Bar"],
    capacity: "150 Rooms",
    price: "₹10,800"
  },
  // Restaurant 2
  {
    id: "bengaluru-restaurant",
    name: "Kennedia Blu Restaurant Bengaluru",
    location: "MG Road, Bengaluru",
    city: "Bengaluru",
    type: "Restaurant",
    image: siteContent.images.bars.speakeasy,
    rating: "4.8",
    description: "Intimate speakeasy-style restaurant with jazz and gourmet plates.",
    amenities: ["Jazz Nights", "Premium Spirits", "Private Dining", "Signature Cocktails"],
    capacity: "50 Covers",
    price: "₹2,200"
  },
  // Cafe 3
  {
    id: "delhi-cafe",
    name: "Kennedia Blu Cafe Delhi",
    location: "Khan Market, Delhi",
    city: "Delhi",
    type: "Cafe",
    image: siteContent.images.cafes.highTea,
    rating: "4.9",
    description: "Luxury high tea lounge offering premium teas and desserts.",
    amenities: ["High Tea Service", "Premium Teas", "Afternoon Tea", "Garden View"],
    capacity: "35 Seats",
    price: "₹850"
  },
  // Hotel 3
  {
    id: "delhi-hotel",
    name: "Kennedia Blu Delhi",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    type: "Hotel",
    image: siteContent.images.hotels.delhi,
    rating: "5.0",
    description: "Unparalleled luxury in the capital's most prestigious location.",
    amenities: ["Presidential Suite", "Michelin Dining", "Private Butler", "Infinity Pool"],
    capacity: "200 Suites",
    price: "₹18,900"
  },
  // Restaurant 3
  {
    id: "delhi-restaurant",
    name: "Kennedia Blu Restaurant Delhi",
    location: "Mehrauli, Delhi",
    city: "Delhi",
    type: "Restaurant",
    image: siteContent.images.bars.whiskey,
    rating: "5.0",
    description: "Classic whiskey lounge with rare spirits and fine dining.",
    amenities: ["Rare Whiskeys", "Wine Cellar", "Chef's Table", "Cigar Lounge"],
    capacity: "70 Covers",
    price: "₹3,500"
  },
];

export default function PropertiesSection() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showExtraInfo, setShowExtraInfo] = useState(true);

  const uniqueCities = ["All Cities", ...Array.from(new Set(properties.map(p => p.city)))];
  const uniqueTypes = ["All Types", "Hotel", "Cafe", "Restaurant"];

  const filteredProperties = properties.filter(p => {
    const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
    const matchType = selectedType === "All Types" || p.type === selectedType;
    return matchCity && matchType;
  });

  // Auto-slide effect - every 4 seconds
  useEffect(() => {
    if (filteredProperties.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === filteredProperties.length - 1 ? 0 : prev + 1));
    }, 4000);

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

  // Get type-specific button text
  const getActionButtonText = (type: string) => {
    switch (type) {
      case "Hotel": return "Book Room";
      case "Cafe": return "Reserve Table";
      case "Restaurant": return "Reserve Table";
      default: return "Book Now";
    }
  };

  const getCapacityLabel = (type: string) => {
    switch (type) {
      case "Hotel": return "Accommodation";
      case "Cafe": return "Seating";
      case "Restaurant": return "Capacity";
      default: return "Capacity";
    }
  };

  const getPriceLabel = (type: string) => {
    switch (type) {
      case "Hotel": return "/night";
      case "Cafe": return "/person";
      case "Restaurant": return "/person";
      default: return "/unit";
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 items-start">
            {/* LEFT: 3D Carousel - 65% width */}
            <div className="relative h-[550px] flex items-center justify-center perspective-1000">
              <div className="relative w-full h-full flex items-center justify-center">
                {visibleCards.map(({ index, position }) => {
                  const property = filteredProperties[index];
                  const isCenter = position === 'center';
                  const isLeft = position === 'left';
                  const isRight = position === 'right';

                  return (
                    <div
                      key={property.id}
                      className={`absolute transition-all duration-700 ease-out ${isCenter
                          ? 'z-30 scale-100 opacity-100'
                          : 'z-10 scale-75 opacity-40'
                        }`}
                      style={{
                        transform: isCenter
                          ? 'translateX(0) rotateY(0deg)'
                          : isLeft
                            ? 'translateX(-65%) rotateY(20deg)'
                            : 'translateX(65%) rotateY(-20deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="w-[420px] h-[480px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
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
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <div className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30">
                                {property.type}
                              </div>
                              <h3 className="text-2xl font-serif font-semibold mb-1.5">
                                {property.name}
                              </h3>
                              <div className="flex items-center text-sm opacity-90 mb-2.5">
                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                {property.location}
                              </div>
                              <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                                {property.description}
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

            {/* RIGHT: Enhanced Content Panel - 35% width */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xl h-[550px] flex flex-col">
              {/* Toggle Button */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Property Details
                </h4>
                <button
                  onClick={() => setShowExtraInfo(!showExtraInfo)}
                  className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors px-2 py-1 border border-primary/30 rounded-full hover:bg-primary/5"
                >
                  {showExtraInfo ? 'Show Less' : 'Show More'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                      {activeProperty.type}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full border border-yellow-200">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-yellow-900">{activeProperty.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-foreground mb-1 line-clamp-2">
                    {activeProperty.name}
                  </h3>

                  <div className="flex items-center text-muted-foreground mb-2 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{activeProperty.location}</span>
                  </div>

                  {showExtraInfo && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                      {activeProperty.description}
                    </p>
                  )}
                </div>

                {/* Amenities - Compact Grid */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Amenities
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {activeProperty.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                        <span className="line-clamp-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra Info Section */}
                {showExtraInfo && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    {/* Operating Hours */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Operating Hours
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Mon - Fri</span>
                          <span className="font-medium text-foreground">
                            {activeProperty.type === 'Hotel' ? '24/7' : '8:00 AM - 11:00 PM'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Sat - Sun</span>
                          <span className="font-medium text-foreground">
                            {activeProperty.type === 'Hotel' ? '24/7' : '9:00 AM - 12:00 AM'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Contact Information
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>+91 {Math.floor(Math.random() * 9000000000) + 1000000000}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="line-clamp-1">{activeProperty.id}@kennedia.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacity & Price */}
                <div className="flex items-center justify-between py-2.5 border-y border-border">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      {getCapacityLabel(activeProperty.type)}
                    </p>
                    <p className="text-xs font-semibold text-foreground">{activeProperty.capacity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Starting From
                    </p>
                    <p className="text-base font-bold text-primary">
                      {activeProperty.price}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {getPriceLabel(activeProperty.type)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="space-y-2 mt-4">
                <button className="w-full py-2.5 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-1.5 text-xs">
                  {getActionButtonText(activeProperty.type)}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 border border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3" />
                    Call
                  </button>
                  <button className="py-2 border border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 text-[11px]">
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                  <button className="py-2 border border-primary/50 text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1 text-[11px]">
                    <Building2 className="w-3 h-3" />
                    Explore
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