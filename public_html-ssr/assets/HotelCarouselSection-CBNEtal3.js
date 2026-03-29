import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Grid3x3, Map, MapPin, ArrowRight, Building2, Star, ChevronLeft, ChevronRight, Home, Users, Wifi, Tag } from "lucide-react";
import { O as OptimizedImage, G as GetAllPropertyDetails, n as createCitySlug, o as createHotelSlug } from "../entry-server.js";
import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";
/* empty css                 */
import "react-dom/server";
import "react-router";
import "@tanstack/react-query";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "react-toastify";
import "@radix-ui/react-dialog";
import "cmdk";
import "axios";
import "@radix-ui/react-slot";
import "swiper/react";
import "swiper/modules";
import "react-hot-toast";
import "@radix-ui/react-avatar";
import "react-calendar";
import "@radix-ui/react-label";
import "@heroicons/react/24/outline";
import "@heroicons/react/24/solid";
const getAmenityName = (amenity) => {
  if (typeof amenity === "string") return amenity;
  if (amenity && typeof amenity === "object" && "name" in amenity && typeof amenity.name === "string") {
    return amenity.name;
  }
  return null;
};
const customPopupStyles = `
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 4px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  .leaflet-popup-content {
    margin: 8px;
    min-width: 200px;
  }
  .leaflet-popup-tip {
    display: none;
  }
  .custom-popup .leaflet-popup-close-button {
    display: none;
  }
`;
const mapApiToHotelUI = (item) => {
  const parent = item.propertyResponseDTO;
  const listing = item.propertyListingResponseDTOS?.find(
    (l) => l.isActive
  );
  const basePrice = listing?.price || 0;
  const discount = listing?.discountAmount || 0;
  const gstPercent = listing?.gstPercentage || 0;
  const discountPercent = basePrice > 0 ? Math.round(discount / basePrice * 100) : 0;
  return {
    id: listing?.id ? `${parent?.id}-${listing.id}` : `property-${parent?.id}`,
    propertyId: parent?.id,
    listingId: listing?.id,
    name: parent?.propertyName || "Unnamed Property",
    location: listing?.fullAddress || parent?.address || "N/A",
    city: parent?.locationName || "Unknown",
    type: listing?.propertyType || parent?.propertyTypes?.[0] || "Hotel",
    bookingEngineUrl: parent?.bookingEngineUrl || null,
    image: {
      src: listing?.media?.[0]?.url || listing?.media?.[0] || "",
      alt: parent?.propertyName
    },
    rating: listing?.rating || 0,
    description: listing?.tagline || listing?.subTitle || "Luxury comfort in the heart of the city",
    amenities: Array.isArray(listing?.amenities) ? listing.amenities.map((amenity) => getAmenityName(amenity)).filter(Boolean) : [],
    // Dynamic Capacity and Rooms
    rooms: listing?.capacity || 1,
    capacity: listing?.capacity || parent?.capacity || 0,
    pricing: {
      basePrice,
      discount,
      discountPercent,
      gstPercent
    },
    // Dynamic Coordinates from propertyResponseDTO
    coordinates: {
      lat: parent?.latitude || 20.5937,
      lng: parent?.longitude || 78.9629
    },
    isActive: parent?.isActive && (listing ? listing.isActive : true)
  };
};
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = customPopupStyles;
  if (!document.querySelector("style[data-leaflet-custom]")) {
    styleEl.setAttribute("data-leaflet-custom", "true");
    document.head.appendChild(styleEl);
  }
}
const calculatePricing = (pricing) => {
  const subtotal = (pricing.basePrice || 0) - (pricing.discount || 0);
  const gst = Math.round(subtotal * ((pricing.gstPercent || 0) / 100));
  const total = subtotal + gst;
  return {
    basePrice: pricing.basePrice || 0,
    discount: pricing.discount || 0,
    subtotal,
    gst,
    total
  };
};
function PriceBreakdown({
  pricing,
  calculated
}) {
  const [showDetails, setShowDetails] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "py-2.5 border-y border-border", children: !showDetails ? /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Pricing" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground line-through", children: [
          "₹",
          calculated.basePrice.toLocaleString("en-IN")
        ] }),
        pricing.discountPercent > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold", children: [
          pricing.discountPercent,
          "% OFF"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-primary", children: [
          "₹",
          calculated.total.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[8px] text-muted-foreground", children: "per night (incl. taxes)" })
      ] })
    ] })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3 text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-foreground", children: "Price Breakdown" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowDetails(false),
          className: "text-[9px] text-primary hover:underline font-medium",
          children: "Hide Details"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Base Price" }),
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        "₹",
        calculated.basePrice.toLocaleString("en-IN")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [
        pricing.discountLabel,
        pricing.discountPercent > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold", children: [
          pricing.discountPercent,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-600", children: [
        "- ₹",
        calculated.discount.toLocaleString("en-IN")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs pb-1.5 border-b border-border/50", children: [
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        "₹",
        calculated.subtotal.toLocaleString("en-IN")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        "GST (",
        pricing.gstPercent,
        "%)"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        "₹",
        calculated.gst.toLocaleString("en-IN")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1.5 border-t border-border bg-primary/5 -mx-2 px-2 py-1.5 rounded-lg mt-1.5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-foreground", children: "Total Amount" }),
        /* @__PURE__ */ jsx("p", { className: "text-[8px] text-muted-foreground", children: "per night (all taxes incl.)" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-primary", children: [
        "₹",
        calculated.total.toLocaleString("en-IN")
      ] })
    ] })
  ] }) });
}
function MapViewController({
  center,
  zoom
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 2,
      easeLinearity: 0.1
    });
  }, [center, zoom, map]);
  return null;
}
const getCityOptions = (hotelList) => {
  const uniqueCities = Array.from(
    new Set(
      (Array.isArray(hotelList) ? hotelList : []).map((hotel) => hotel?.city).filter(Boolean)
    )
  );
  return ["All Cities", ...uniqueCities];
};
function HotelCarouselSection({
  initialHotels = []
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState("gallery");
  const [isPaused, setIsPaused] = useState(false);
  const [cities, setCities] = useState(getCityOptions(initialHotels));
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loading, setLoading] = useState(initialHotels.length === 0);
  const [hotels, setHotels] = useState(initialHotels);
  const [filteredHotels, setFilteredHotels] = useState(initialHotels);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await GetAllPropertyDetails();
        const rawData = response?.data?.data || response?.data || [];
        if (Array.isArray(rawData)) {
          const mappedHotels = rawData.map((item) => mapApiToHotelUI(item)).filter(
            (hotel) => hotel.isActive && hotel.type?.toLowerCase() === "hotel"
          );
          const nextHotels = [...mappedHotels].reverse();
          setHotels(nextHotels);
          setCities(getCityOptions(nextHotels));
        }
      } catch (err) {
        console.error("Failed to load hotels", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);
  const getHotelDetailUrl = (hotel) => `/${createCitySlug(hotel.city || hotel.name)}/${createHotelSlug(hotel.name || hotel.city || "property", hotel.propertyId)}`;
  useEffect(() => {
    if (viewMode !== "gallery" || isPaused || filteredHotels.length <= 1)
      return;
    const interval = setInterval(() => {
      setActiveIndex(
        (prev) => prev === filteredHotels.length - 1 ? 0 : prev + 1
      );
    }, 5e3);
    return () => clearInterval(interval);
  }, [viewMode, isPaused, filteredHotels.length]);
  const handleBookNow = (hotel) => {
    if (!hotel.bookingEngineUrl) {
      console.warn("No booking engine URL available for this property.");
      return;
    }
    if (hotel.bookingEngineUrl.includes("checkin")) {
      window.open(hotel.bookingEngineUrl, "_blank");
      return;
    }
    const checkInDate = /* @__PURE__ */ new Date();
    const checkOutDate = /* @__PURE__ */ new Date();
    checkOutDate.setDate(checkInDate.getDate() + 1);
    const url = new URL(hotel.bookingEngineUrl);
    url.searchParams.set("checkin", checkInDate.toISOString().split("T")[0]);
    url.searchParams.set("checkout", checkOutDate.toISOString().split("T")[0]);
    url.searchParams.set("adults", "2");
    url.searchParams.set("children", "0");
    url.searchParams.set("rooms", "1");
    window.open(url.toString(), "_blank");
  };
  const goToHotelDetails = (hotel) => {
    navigate(getHotelDetailUrl(hotel));
  };
  const handlePrev = () => {
    setActiveIndex(
      (prev) => prev === 0 ? filteredHotels.length - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setActiveIndex(
      (prev) => prev === filteredHotels.length - 1 ? 0 : prev + 1
    );
  };
  useEffect(() => {
    if (selectedCity === "All Cities") {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter((hotel) => hotel.city === selectedCity));
    }
    setActiveIndex(0);
  }, [selectedCity, hotels]);
  if (loading) {
    return /* @__PURE__ */ jsx("section", { className: "py-6", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "Loading hotels…" }) }) });
  }
  if (filteredHotels.length === 0) {
    return /* @__PURE__ */ jsx("section", { className: "py-6", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "No hotels available." }) }) });
  }
  const activeHotel = filteredHotels[activeIndex];
  if (!activeHotel) {
    return /* @__PURE__ */ jsx("section", { className: "py-6", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "Loading hotels..." }) }) });
  }
  const activePricing = calculatePricing(activeHotel.pricing);
  const getVisibleCards = () => {
    const total = filteredHotels.length;
    if (total === 1) return [{ index: 0, position: "center" }];
    return [
      { index: (activeIndex - 1 + total) % total, position: "left" },
      { index: activeIndex, position: "center" },
      { index: (activeIndex + 1) % total, position: "right" }
    ];
  };
  const visibleCards = getVisibleCards();
  const createRedIcon = (isActive = false) => {
    return new L.Icon({
      iconUrl: isActive ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: isActive ? [35, 57] : [25, 41],
      iconAnchor: isActive ? [17, 57] : [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };
  return /* @__PURE__ */ jsx("section", { className: "py-6 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-xl p-4 shadow-sm mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block", children: viewMode === "gallery" ? "Premium Selection" : "Discover" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-serif text-foreground", children: "Our Collection" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-0.5 bg-background border border-border rounded-full p-0.5 shadow-sm", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setViewMode("gallery"),
              className: `flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === "gallery" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(Grid3x3, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Gallery" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setViewMode("map"),
              className: `flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === "map" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(Map, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Map" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-3 border-t border-border/50", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1", children: "Filter By:" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowCityDropdown(!showCityDropdown),
              className: "flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm",
              children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-primary" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: selectedCity }),
                /* @__PURE__ */ jsx(
                  ArrowRight,
                  {
                    className: `w-2.5 h-2.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-90" : ""}`
                  }
                )
              ]
            }
          ),
          showCityDropdown && /* @__PURE__ */ jsx("div", { className: "absolute top-full mt-1 left-0 w-48 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50", children: cities.map((city) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSelectedCity(city);
                setShowCityDropdown(false);
              },
              className: `w-full px-3 py-2 text-left text-xs hover:bg-secondary/50 transition-colors ${selectedCity === city ? "bg-secondary/30 font-semibold" : ""}`,
              children: city
            },
            city
          )) })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm", children: [
          /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3 text-primary" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Hotel" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 text-primary fill-current" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
            filteredHotels.length,
            " Properties"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: viewMode === "gallery" ? /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative h-[500px] flex items-center justify-center px-12",
              style: { perspective: "1000px" },
              children: [
                /* @__PURE__ */ jsx("div", { className: "relative w-full h-full flex items-center justify-center", children: visibleCards.map(({ index, position }) => {
                  const hotel = filteredHotels[index];
                  const isCenter = position === "center";
                  const isLeft = position === "left";
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `absolute transition-all duration-700 ease-out ${isCenter ? "z-30 scale-100 opacity-100" : "z-10 scale-65 opacity-35"}`,
                      style: {
                        transform: isCenter ? "translateX(0) rotateY(0deg)" : isLeft ? "translateX(-90%) rotateY(30deg)" : "translateX(90%) rotateY(-30deg)",
                        transformStyle: "preserve-3d"
                      },
                      children: /* @__PURE__ */ jsx("div", { className: "w-[340px] max-w-[80vw] h-[380px] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "relative h-full", children: [
                        /* @__PURE__ */ jsx(
                          OptimizedImage,
                          {
                            ...hotel.image,
                            className: "w-full h-full object-cover"
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
                        isCenter && /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg", children: [
                            /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-current" }),
                            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-900", children: hotel.rating || "N/A" })
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-5 text-white", children: [
                            /* @__PURE__ */ jsx("div", { className: "inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded border border-white/30", children: hotel.type }),
                            /* @__PURE__ */ jsx("h3", { className: "text-lg font-serif font-semibold mb-1", children: hotel.name }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs opacity-90 mb-1.5", children: [
                              /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1" }),
                              hotel.location
                            ] }),
                            /* @__PURE__ */ jsx("p", { className: "text-[11px] opacity-80 line-clamp-2 leading-relaxed", children: hotel.description })
                          ] })
                        ] })
                      ] }) })
                    },
                    `${position}-${hotel.id}`
                  );
                }) }),
                /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handlePrev,
                      className: "w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95",
                      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full border border-border", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
                    activeIndex + 1,
                    " / ",
                    filteredHotels.length
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleNext,
                      className: "w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:scale-110 active:scale-95",
                      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-xl h-[500px] flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 overflow-y-auto", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20", children: activeHotel.type }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200", children: [
                    /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-current" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-yellow-900", children: activeHotel.rating || "N/A" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-semibold text-foreground mb-1.5 line-clamp-2", children: activeHotel.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center text-muted-foreground mb-2.5 text-sm", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 mr-1.5" }),
                  /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: activeHotel.location })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed line-clamp-3", children: activeHotel.description })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-foreground mb-2", children: "Featured Amenities" }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: activeHotel.amenities.map(
                  (amenity, idx) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2 text-xs text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" }),
                        /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: amenity })
                      ]
                    },
                    idx
                  )
                ) })
              ] }),
              /* @__PURE__ */ jsx(
                PriceBreakdown,
                {
                  pricing: activeHotel.pricing,
                  calculated: activePricing
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 mt-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleBookNow(activeHotel),
                  className: "w-full py-3 bg-primary text-primary-foreground font-bold uppercase rounded-lg shadow-md flex items-center justify-center gap-2 text-sm",
                  children: [
                    "Book Room ",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => goToHotelDetails(activeHotel),
                  className: "w-full py-2 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors",
                  children: "View Full Details →"
                }
              )
            ] })
          ] })
        ] })
      },
      "gallery"
    ) : /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "relative",
              onMouseEnter: () => setIsPaused(true),
              onMouseLeave: () => setIsPaused(false),
              children: /* @__PURE__ */ jsxs("div", { className: "bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative h-[240px] overflow-hidden group", children: [
                  /* @__PURE__ */ jsx(
                    OptimizedImage,
                    {
                      ...activeHotel.image,
                      className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg", children: [
                      /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-current" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-900", children: activeHotel.rating || "N/A" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "bg-primary/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-primary-foreground", children: [
                      activeIndex + 1,
                      " / ",
                      filteredHotels.length
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 text-white", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                      /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-white/90" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs opacity-90", children: activeHotel.location })
                    ] }),
                    /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-bold mb-1", children: activeHotel.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs opacity-80 line-clamp-2", children: activeHotel.description })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handlePrev,
                      className: "absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10",
                      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleNext,
                      className: "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg hover:scale-110 z-10",
                      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx(Home, { className: "w-4 h-4 text-primary mx-auto mb-0.5" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Rooms" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeHotel.rooms })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-primary mx-auto mb-0.5" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Capacity" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeHotel.capacity })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx(Wifi, { className: "w-4 h-4 text-primary mx-auto mb-0.5" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Amenities" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeHotel.amenities.length })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-foreground mb-2", children: "Top Amenities" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: activeHotel.amenities.slice(0, 6).map((amenity, idx) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "px-2 py-0.5 bg-secondary/50 rounded-full text-[10px] font-medium text-foreground",
                        children: amenity
                      },
                      idx
                    )) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mb-3 pb-3 border-b border-border bg-muted/20 rounded-lg p-2.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1.5 border-t border-border/50", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-foreground", children: "Total" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[8px] text-muted-foreground", children: "per night" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-primary", children: [
                      "₹",
                      activePricing.total.toLocaleString("en-IN")
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleBookNow(activeHotel),
                      className: "w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-md text-sm",
                      children: [
                        "Book Now ",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                      ]
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "lg:sticky lg:top-6", children: /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-border shadow-2xl bg-card", children: /* @__PURE__ */ jsxs(
            MapContainer,
            {
              center: [
                activeHotel.coordinates.lat,
                activeHotel.coordinates.lng
              ],
              zoom: 12,
              scrollWheelZoom: true,
              className: "w-full h-full",
              style: { zIndex: 1 },
              children: [
                /* @__PURE__ */ jsx(
                  TileLayer,
                  {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                ),
                /* @__PURE__ */ jsx(
                  MapViewController,
                  {
                    center: [
                      activeHotel.coordinates.lat,
                      activeHotel.coordinates.lng
                    ],
                    zoom: 12
                  }
                ),
                filteredHotels.map((hotel, idx) => {
                  const isActive = idx === activeIndex;
                  const markerIcon = createRedIcon(isActive);
                  const hotelPricing = calculatePricing(hotel.pricing);
                  return /* @__PURE__ */ jsx(
                    Marker,
                    {
                      position: [
                        hotel.coordinates.lat,
                        hotel.coordinates.lng
                      ],
                      icon: markerIcon,
                      eventHandlers: {
                        click: () => setActiveIndex(idx)
                      },
                      children: /* @__PURE__ */ jsx(Popup, { closeButton: false, className: "custom-popup", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 min-w-[200px]", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsx("p", { className: "font-serif text-sm font-bold", children: hotel.name }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full", children: [
                            /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 text-yellow-500 fill-current" }),
                            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: hotel.rating || "N/A" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-muted-foreground", children: [
                          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 mr-1 text-red-500" }),
                          /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: hotel.location })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1 border-t", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold", children: "Total (incl. GST)" }),
                          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-primary", children: [
                            "₹",
                            hotelPricing.total.toLocaleString("en-IN")
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => goToHotelDetails(hotel),
                            className: "w-full text-xs bg-primary text-primary-foreground font-bold py-2 rounded",
                            children: "View Details"
                          }
                        )
                      ] }) })
                    },
                    hotel.id
                  );
                })
              ]
            }
          ) }) })
        ] })
      },
      "map"
    ) })
  ] }) });
}
export {
  HotelCarouselSection as default
};
