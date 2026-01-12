import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Star, Building2, Phone, Mail } from "lucide-react";
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
    price: "₹450",
    tagline: "Experience artisanal coffee in an authentic Parisian atmosphere",
    headline1: "Where every cup",
    headline2: "tells a story"
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
    price: "₹12,500",
    tagline: "Discover timeless elegance in the heart of Mumbai's heritage district",
    headline1: "Where luxury meets",
    headline2: "tradition"
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
    price: "₹2,500",
    tagline: "Elevate your dining experience with breathtaking ocean views and craft cocktails",
    headline1: "Dining above",
    headline2: "the city lights"
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
    price: "₹400",
    tagline: "Modern minimalism meets expertly crafted coffee in the heart of Koramangala",
    headline1: "Coffee crafted for",
    headline2: "innovators"
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
    price: "₹10,800",
    tagline: "Designed for the modern business traveler with seamless connectivity",
    headline1: "Your home in the",
    headline2: "tech capital"
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
    price: "₹2,200",
    tagline: "Step into a hidden world of jazz, cocktails, and culinary excellence",
    headline1: "Where music and",
    headline2: "flavors collide"
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
    price: "₹850",
    tagline: "Indulge in the refined art of afternoon tea with garden views",
    headline1: "Elegance served",
    headline2: "by the cup"
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
    price: "₹18,900",
    tagline: "Experience unparalleled luxury in India's most prestigious location",
    headline1: "The pinnacle of",
    headline2: "hospitality"
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
    price: "₹3,500",
    tagline: "Savor rare spirits and exceptional cuisine in a refined atmosphere",
    headline1: "Sophistication in",
    headline2: "every pour"
  },
];

export default function PropertiesSection() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeIndex, setActiveIndex] = useState(0);

  const uniqueCities = ["All Cities", ...Array.from(new Set(properties.map(p => p.city)))];
  const uniqueTypes = ["All Types", "Hotel", "Cafe", "Restaurant"];

  const filteredProperties = properties.filter(p => {
    const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
    const matchType = selectedType === "All Types" || p.type === selectedType;
    return matchCity && matchType;
  });

  // Auto-slide effect - every 5 seconds
  useEffect(() => {
    if (filteredProperties.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === filteredProperties.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredProperties.length]);

  const activeProperty = filteredProperties[activeIndex];

  // Get next property for thumbnail preview
  const nextProperty = filteredProperties[(activeIndex + 1) % filteredProperties.length];

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  // Get type-specific button text
  const getActionButtonText = (type: string) => {
    switch (type) {
      case "Hotel": return { primary: "Book Room", secondary: "Reserve Table" };
      case "Cafe": return { primary: "Reserve Table", secondary: null };
      case "Restaurant": return { primary: "Reserve Table", secondary: null };
      default: return { primary: "Book Now", secondary: null };
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
          <div className="relative">
            {/* Hero Carousel Container */}
            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Slides */}
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === activeIndex
                      ? 'opacity-100 translate-x-0'
                      : index < activeIndex
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  {/* Background Image */}
                  <OptimizedImage
                    {...property.image}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Content Overlay - Left Side */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-12">
                      <div className="max-w-2xl">
                        {/* Tagline */}
                        <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed max-w-md">
                          {property.tagline}
                        </p>

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-3 mb-6">
                          {filteredProperties.map((_, idx) => (
                            <div key={idx} className="flex flex-col items-start gap-1">
                              <span className={`text-xs font-medium ${idx === activeIndex ? 'text-white' : 'text-white/40'}`}>
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className={`h-0.5 transition-all duration-500 ${
                                idx === activeIndex ? 'w-12 bg-white' : 'w-8 bg-white/30'
                              }`} />
                            </div>
                          ))}
                        </div>

                        {/* Property Type Label */}
                        <div className="inline-block mb-3">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            Kennedia Blu {property.type}
                          </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-3">
                          <span className="font-serif font-normal block leading-tight">
                            {property.headline1}
                          </span>
                          <span className="font-serif italic font-light block leading-tight">
                            {property.headline2}
                          </span>
                        </h1>

                        {/* Location & Rating */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center text-white/90">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">{property.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-bold text-white">{property.rating}</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button className="group flex items-center gap-3 text-white hover:gap-4 transition-all duration-300">
                          <span className="text-sm font-semibold uppercase tracking-wider">
                            Explore Now
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Next Property Thumbnail - Bottom Right */}
                  {filteredProperties.length > 1 && index === activeIndex && (
                    <div className="absolute bottom-6 right-6 group cursor-pointer">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <OptimizedImage
                          {...nextProperty.image}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold">Next</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Navigation Dots - Bottom Left */}
              <div className="absolute bottom-6 left-12 flex items-center gap-2 z-10">
                {filteredProperties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeIndex
                        ? 'w-3 h-3 bg-white'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Property Details Card - Below Carousel */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Info Cards */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-semibold text-foreground">
                    Details
                  </h3>
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Capacity
                    </p>
                    <p className="text-sm font-semibold text-foreground">{activeProperty.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Starting From
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {activeProperty.price}
                      <span className="text-sm text-muted-foreground font-normal">
                        {activeProperty.type === 'Hotel' ? '/night' : '/person'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                  Amenities
                </h3>
                <div className="space-y-2">
                  {activeProperty.amenities.slice(0, 4).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                  Get in Touch
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const buttonText = getActionButtonText(activeProperty.type);
                    return (
                      <>
                        <button className="w-full py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                          {buttonText.primary}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        {buttonText.secondary && (
                          <button className="w-full py-3 bg-background border-2 border-primary text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-primary hover:text-primary-foreground transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                            {buttonText.secondary}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 border border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 text-sm">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="py-2 border border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 text-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>
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
    </section>
  );
}