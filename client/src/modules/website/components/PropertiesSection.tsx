import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Star,
  Building2,
  Phone,
  Mail,
  Loader2,
  Share2,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { GetAllPropertyDetails } from "@/Api/Api";
import { properties as staticProperties } from "@/data/properties";
import { toast } from "react-hot-toast";

interface ApiProperty {
  id: number;
  propertyId: number;
  listingId: number;
  propertyName: string;
  propertyType: string;
  city: string;
  mainHeading: string;
  subTitle: string;
  fullAddress: string;
  tagline: string;
  rating: number | null;
  capacity: number | null;
  price: number;
  amenities: string[];
  isActive: boolean;
  media: any[];
  gstPercentage?: number;
  discountAmount?: number;
}

// Create a separate component for each carousel item to avoid closure issues
const CarouselItem = ({
  property,
  isActive,
  onShare,
}: {
  property: ApiProperty;
  isActive: boolean;
  onShare: (property: ApiProperty) => void;
}) => {
  const navigate = useNavigate();
  
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/hotels/${property.propertyId}`;
    
    console.log("🎯 EXPLORE CLICK - START", {
      timestamp: new Date().toISOString(),
      listingId: property.listingId,
      propertyId: property.propertyId,
      mainHeading: property.mainHeading,
      targetUrl: targetUrl,
      isActive: isActive,
    });
    
    navigate(targetUrl);
    
    console.log("🎯 EXPLORE CLICK - NAVIGATING TO:", targetUrl);
  };

  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${
        isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
      }`}
    >
      <OptimizedImage
        src={property.media?.[0]?.url || ""}
        alt={property.propertyName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-center px-8 lg:px-12">
        <div className="max-w-xl text-white">
          <button
            onClick={() => onShare(property)}
            className="mb-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <p className="text-white/90 text-sm mb-4 line-clamp-2">
            {property.tagline}
          </p>
          <h1 className="text-3xl lg:text-5xl font-serif mb-4 leading-tight">
            {property.mainHeading}
            <br />
            <span className="italic font-light">{property.subTitle}</span>
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {property.city}
            </div>
            {property.rating && (
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold">{property.rating}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleExploreClick}
            className="inline-flex items-center gap-3 uppercase text-sm font-bold tracking-widest group cursor-pointer"
          >
            Explore Now
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-all">
              <ArrowRight size={20} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PropertiesSection() {
  const fallbackData: ApiProperty[] = staticProperties.map((p) => ({
    id: p.id,
    propertyId: p.id,
    listingId: p.id,
    propertyName: p.headline1,
    propertyType: p.type,
    city: p.city,
    mainHeading: p.headline1,
    subTitle: p.headline2,
    fullAddress: p.location,
    tagline: p.tagline,
    rating: parseFloat(p.rating),
    capacity: parseInt(p.capacity) || 0,
    price: parseInt(p.price.replace(/[^0-9]/g, "")) || 0,
    amenities: p.amenities,
    isActive: true,
    media: [{ url: p.image.src }],
  }));

  const [apiProperties, setApiProperties] = useState<ApiProperty[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFullPropertyData = async () => {
      try {
        setLoading(true);
        const response = await GetAllPropertyDetails();
        const rawData = response?.data || response;

        if (Array.isArray(rawData)) {
          const formattedProperties: ApiProperty[] = rawData.flatMap((item: any) => {
            const parent = item.propertyResponseDTO;
            const listings = item.propertyListingResponseDTOS || [];

            if (listings.length === 0) {
              return [
                {
                  id: parent?.id,
                  propertyId: parent?.id,
                  listingId: parent?.id,
                  propertyName: parent?.propertyName || "Unnamed Property",
                  propertyType: parent?.propertyTypes?.[0] || "Property",
                  city: parent?.locationName || "Unknown",
                  mainHeading: parent?.propertyName || "Unnamed Property",
                  subTitle: "",
                  fullAddress: parent?.address || "",
                  tagline: "",
                  rating: null,
                  capacity: null,
                  price: 0,
                  gstPercentage: 0,
                  discountAmount: 0,
                  amenities: [],
                  isActive: parent?.isActive ?? false,
                  media: [],
                },
              ];
            }

            return listings.map((listing: any) => ({
              id: listing.id,
              propertyId: parent?.id,
              listingId: listing.id,
              propertyName: parent?.propertyName || "Unnamed Property",
              propertyType: listing?.propertyType || parent?.propertyTypes?.[0] || "Property",
              city: parent?.locationName || "Unknown",
              mainHeading: listing?.mainHeading || parent?.propertyName,
              subTitle: listing?.subTitle || "",
              fullAddress: listing?.fullAddress || parent?.address || "",
              tagline: listing?.tagline || "",
              rating: listing?.rating || null,
              capacity: listing?.capacity || null,
              price: listing?.price || 0,
              gstPercentage: listing?.gstPercentage || 0,
              discountAmount: listing?.discountAmount || 0,
              amenities: listing?.amenities || [],
              isActive: (parent?.isActive && listing?.isActive) ?? false,
              media: listing?.media || [],
            }));
          });

          console.log("=== FINAL FLATTENED PROPERTIES ===");
          console.table(
            formattedProperties.map((p) => ({
              "Listing ID": p.id,
              "Property ID (Nav)": p.propertyId,
              "Main Heading": p.mainHeading,
              City: p.city,
              Price: `₹${p.price}`,
              Active: p.isActive,
            }))
          );

          const activeProperties = formattedProperties.filter((p) => p.isActive);
          console.log(`✅ Active Properties: ${activeProperties.length}`);
          
          setApiProperties(activeProperties);
        }
      } catch (error) {
        console.error("❌ Failed to fetch properties:", error);
        toast.error("Could not load latest properties");
      } finally {
        setLoading(false);
      }
    };

    fetchFullPropertyData();
  }, []);

  const uniqueCities = [
    "All Cities",
    ...Array.from(new Set(apiProperties.map((p) => p.city))),
  ];
  const uniqueTypes = ["All Types", "Hotel", "Cafe", "Restaurant"];

  const filteredProperties = apiProperties.filter((p) => {
    const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
    const matchType = selectedType === "All Types" || p.propertyType === selectedType;
    return matchCity && matchType;
  });

  const RESAVENUE_CONFIG = {
    baseUrl: "https://bookings.resavenue.com/resBooking4/searchRooms",
    defaultRegCode: "TXGZ0113",
    dateFormat: "dd/MM/yyyy",
  };

  const generateResAvenueUrl = ({
    checkIn,
    checkOut,
    adults = 2,
    regCode = RESAVENUE_CONFIG.defaultRegCode,
  }: {
    checkIn?: Date;
    checkOut?: Date;
    adults?: number;
    regCode?: string;
  }) => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const arrDate = format(checkIn || today, RESAVENUE_CONFIG.dateFormat);
    const depDate = format(checkOut || nextDay, RESAVENUE_CONFIG.dateFormat);

    const params = new URLSearchParams({
      targetTemplate: "4",
      regCode,
      curr: "INR",
      arrDate,
      depDate,
      arr_date: arrDate,
      dep_date: depDate,
      adult_1: String(adults),
    });
    return `${RESAVENUE_CONFIG.baseUrl}?${params.toString()}`;
  };

  useEffect(() => {
    if (filteredProperties.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= filteredProperties.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [filteredProperties.length]);

  useEffect(() => {
    if (filteredProperties.length > 0) {
      console.log("🔄 Active Index Changed:", {
        activeIndex,
        totalProperties: filteredProperties.length,
        activeProperty: {
          listingId: filteredProperties[activeIndex]?.listingId,
          propertyId: filteredProperties[activeIndex]?.propertyId,
          mainHeading: filteredProperties[activeIndex]?.mainHeading,
        },
      });
    }
  }, [activeIndex, filteredProperties]);

  const activeProperty = filteredProperties[activeIndex];

  const handleShare = async (property: ApiProperty) => {
    const shareUrl = `${window.location.origin}/hotels/${property.propertyId}`;
    const shareData = {
      title: property.mainHeading,
      text: `${property.tagline}`,
      url: shareUrl,
    };

    console.log("📤 Sharing property:", {
      listingId: property.listingId,
      propertyId: property.propertyId,
      url: shareUrl,
    });

    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied!");
      }
    } catch (err) {
      console.error("❌ Share failed:", err);
    }
  };

  const handleExternalBook = (property: ApiProperty) => {
    const bookingUrl = generateResAvenueUrl({});
    console.log("🎫 External booking for:", {
      listingId: property.listingId,
      propertyId: property.propertyId,
      bookingUrl,
    });
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  const getActionButtonText = (type: string) => {
    switch (type) {
      case "Hotel":
        return { primary: "Book Room", secondary: "Reserve Table" };
      case "Cafe":
      case "Restaurant":
        return { primary: "Reserve Table", secondary: null };
      default:
        return { primary: "Book Now", secondary: null };
    }
  };

  const calculatePricing = (property?: ApiProperty) => {
    if (!property || !property.price) return { gstAmount: 0, discount: 0, total: 0 };
    const basePrice = property.price;
    const discount = property.discountAmount || 0;
    const gstRate = property.gstPercentage || 0;
    const priceAfterDiscount = Math.max(basePrice - discount, 0);
    const gstAmount = (priceAfterDiscount * gstRate) / 100;
    return { gstAmount, discount, total: priceAfterDiscount + gstAmount };
  };

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-serif text-foreground mb-1.5">
                Explore Our Properties
              </h2>
              <div className="w-16 h-0.5 bg-primary rounded-full" />
            </div>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setActiveIndex(0);
                }}
                className="appearance-none bg-background border rounded-full py-2 pl-4 pr-10 text-sm font-medium outline-none shadow-sm transition-all"
              >
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
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
                className="appearance-none bg-background border rounded-full py-2 pl-4 pr-10 text-sm font-medium outline-none shadow-sm transition-all"
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
          <div className="grid grid-cols-1 lg:grid-cols-[60%_38%] gap-6">
            <div className="relative h-[320px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              {filteredProperties.map((property, index) => (
                <CarouselItem
                  key={`carousel-${property.propertyId}-${property.listingId}`}
                  property={property}
                  isActive={index === activeIndex}
                  onShare={handleShare}
                />
              ))}
            </div>

            {activeProperty && (
              <div className="bg-card border rounded-2xl p-6 shadow-lg">
                <div className="pb-4 border-b">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif font-semibold">Property Details</h3>
                    <Building2 className="text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Capacity</p>
                      <p className="font-semibold">{activeProperty.capacity || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Base Price</p>
                      <p className="text-xl font-bold">
                        ₹{activeProperty.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {(() => {
                    const { gstAmount, discount, total } = calculatePricing(activeProperty);
                    return (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Discount</span>
                          <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>GST ({activeProperty.gstPercentage}%)</span>
                          <span>+₹{gstAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed">
                          <span className="text-xs font-bold uppercase">Total Amount</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="py-6 border-b">
                  <h3 className="font-serif font-semibold mb-4">Top Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activeProperty.amenities?.slice(0, 4).map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <button
                    onClick={() => handleExternalBook(activeProperty)}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    {getActionButtonText(activeProperty.propertyType).primary}{" "}
                    <ArrowRight size={18} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2.5 border rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-secondary/10 transition-colors">
                      <Phone size={16} /> Call
                    </button>
                    <button className="py-2.5 border rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-secondary/10 transition-colors">
                      <Mail size={16} /> Email
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/10 rounded-xl border-2 border-dashed border-primary/20">
            <p className="text-muted-foreground">No matching properties found.</p>
          </div>
        )}
      </div>
    </section>
  );
}