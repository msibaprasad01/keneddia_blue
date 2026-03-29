import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown, Loader2, Calendar, Users, Minus, Plus, X, BedDouble, Home, Maximize, Map } from "lucide-react";
import { B as Button, a0 as cn, C as Calendar$1, a1 as Dialog, a2 as DialogContent, a3 as getLocationsByType, a4 as searchRooms, n as createCitySlug, o as createHotelSlug } from "../entry-server.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B0tp2Gbr.js";
import { format, addDays } from "date-fns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
import "@radix-ui/react-popover";
const ITEMS_PER_PAGE = 3;
const getRoomImage = (room) => room.image || room.media?.find((item) => item?.type === "IMAGE" && item?.url)?.url || room.media?.find((item) => item?.url)?.url || "";
const markerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
function QuickBooking() {
  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    null
  );
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showMap, setShowMap] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        const res = await getLocationsByType("Hotel");
        const data = res?.data || res || [];
        const activeLocations = data.filter((l) => l.isActive);
        setLocations(activeLocations);
      } catch (err) {
        console.error("Failed to load hotel locations", err);
        setLocations([]);
      } finally {
        setLocationsLoading(false);
      }
    };
    fetchLocations();
  }, []);
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };
  const RESAVENUE_CONFIG = {
    baseUrl: "https://bookings.resavenue.com/resBooking4/searchRooms",
    defaultRegCode: "TXGZ0113",
    dateFormat: "dd/MM/yyyy"
  };
  const generateResAvenueUrl = ({
    checkIn: checkIn2,
    checkOut: checkOut2,
    adults,
    regCode = RESAVENUE_CONFIG.defaultRegCode
  }) => {
    if (!checkIn2 || !checkOut2) return null;
    const arrDate = format(checkIn2, RESAVENUE_CONFIG.dateFormat);
    const depDate = format(checkOut2, RESAVENUE_CONFIG.dateFormat);
    const params = new URLSearchParams({
      targetTemplate: "4",
      regCode,
      curr: "INR",
      arrDate,
      depDate,
      arr_date: arrDate,
      dep_date: depDate,
      adult_1: String(adults ?? 1)
    });
    return `${RESAVENUE_CONFIG.baseUrl}?${params.toString()}`;
  };
  const handleCheckInSelect = (date) => {
    setCheckIn(date);
    if (date) {
      setCheckInOpen(false);
      if (!checkOut) {
        setTimeout(() => setCheckOutOpen(true), 150);
      }
    }
  };
  const handleCheckOutSelect = (date) => {
    setCheckOut(date);
    if (date) {
      setCheckOutOpen(false);
    }
  };
  const handleSearch = async () => {
    setHasSearched(true);
    setCurrentPage(1);
    setIsSearching(true);
    try {
      const params = {
        propertyType: "Hotel",
        // Filter by hotel type
        page: 0,
        size: 50
      };
      if (selectedLocation) {
        params.locationId = selectedLocation.id;
      }
      if (checkIn) {
        params.checkIn = format(checkIn, "yyyy-MM-dd");
      }
      if (checkOut) {
        params.checkOut = format(checkOut, "yyyy-MM-dd");
      }
      if (guests.adults + guests.children > 0) {
        params.minOccupancy = guests.adults + guests.children;
      }
      const response = await searchRooms(params);
      const data = response?.data || response;
      const rooms = data?.content || data || [];
      const availableRooms = rooms.filter(
        (room) => room.bookable && room.active && room.status === "AVAILABLE"
      );
      setSearchResults(availableRooms);
      if (availableRooms.length === 1) {
        handleBook(availableRooms[0]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const handleBook = (room) => {
    const bookingUrl = generateResAvenueUrl({
      checkIn,
      checkOut,
      adults: guests.adults,
      regCode: RESAVENUE_CONFIG.defaultRegCode
    });
    if (!bookingUrl) {
      const cityName = selectedLocation?.locationName || room.locationName;
      if (!cityName) {
        console.error("No location found for hotel navigation.");
        return;
      }
      const citySlug = createCitySlug(cityName);
      const propertyPath = `/${citySlug}/${createHotelSlug(room.propertyName || cityName || "property", room.propertyId)}`;
      navigate(propertyPath);
      return;
    }
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };
  const getRoomTypeBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case "DELUXE":
        return "bg-purple-100 text-purple-700";
      case "SUITE":
        return "bg-amber-100 text-amber-700";
      case "STANDARD":
        return "bg-blue-100 text-blue-700";
      case "PREMIUM":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const paginatedRooms = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 -mt-10 relative z-30 mb-12", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        layout: true,
        className: "bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md",
        children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 bg-primary/5 border-b border-border/10 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg", children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-medium text-foreground", children: "Find Your Stay" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Best Prices Guaranteed" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6 mb-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Location" }),
                /* @__PURE__ */ jsxs(Popover, { open: locationOpen, onOpenChange: setLocationOpen, children: [
                  /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: cn(
                        "w-full justify-between text-left font-normal bg-background/50 h-14 px-4 group border-border/60 hover:border-primary/50 transition-colors",
                        !selectedLocation && "text-muted-foreground"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                          /* @__PURE__ */ jsx(MapPin, { className: "mr-2 h-4 w-4 text-primary" }),
                          selectedLocation?.locationName || "Select Location"
                        ] }),
                        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(PopoverContent, { className: "w-[280px] p-0", align: "start", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-border/50", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Select Location" }) }),
                    /* @__PURE__ */ jsx("div", { className: "max-h-[280px] overflow-y-auto", children: locationsLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: cn(
                            "px-3 py-2.5 cursor-pointer text-sm font-medium transition-colors flex items-center gap-2",
                            selectedLocation === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          ),
                          onClick: () => handleLocationSelect(null),
                          children: [
                            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                            "All Locations"
                          ]
                        }
                      ),
                      locations.map((location) => /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: cn(
                            "px-3 py-2.5 cursor-pointer text-sm transition-colors flex items-center justify-between",
                            selectedLocation?.id === location.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                          ),
                          onClick: () => handleLocationSelect(location),
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 opacity-50" }),
                              location.locationName
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: location.state })
                          ]
                        },
                        location.id
                      )),
                      locations.length === 0 && !locationsLoading && /* @__PURE__ */ jsx("div", { className: "px-3 py-4 text-center text-sm text-muted-foreground", children: "No locations available" })
                    ] }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Check-in" }),
                /* @__PURE__ */ jsxs(Popover, { open: checkInOpen, onOpenChange: setCheckInOpen, children: [
                  /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: cn(
                        "w-full justify-between text-left font-normal bg-background/50 h-14 px-4 group border-border/60 hover:border-primary/50 transition-colors",
                        !checkIn && "text-muted-foreground"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                          /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4 text-primary" }),
                          checkIn ? format(checkIn, "MMM dd, yyyy") : "Select Date"
                        ] }),
                        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    PopoverContent,
                    {
                      className: "w-auto p-0 shadow-xl",
                      align: "start",
                      sideOffset: 8,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "p-3 border-b bg-muted/30", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Select Check-in Date" }) }),
                        /* @__PURE__ */ jsx(
                          Calendar$1,
                          {
                            value: checkIn,
                            onChange: (value) => {
                              if (value instanceof Date) {
                                handleCheckInSelect(value);
                              }
                            },
                            minDate: /* @__PURE__ */ new Date(),
                            maxDate: addDays(/* @__PURE__ */ new Date(), 365)
                          }
                        ),
                        checkIn && /* @__PURE__ */ jsxs("div", { className: "p-3 border-t bg-muted/30 flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            "Selected:",
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: format(checkIn, "MMM dd, yyyy") })
                          ] }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "sm",
                              className: "h-7 text-xs",
                              onClick: () => setCheckIn(void 0),
                              children: "Clear"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Check-out" }),
                /* @__PURE__ */ jsxs(Popover, { open: checkOutOpen, onOpenChange: setCheckOutOpen, children: [
                  /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: cn(
                        "w-full justify-between text-left font-normal bg-background/50 h-14 px-4 group border-border/60 hover:border-primary/50 transition-colors",
                        !checkOut && "text-muted-foreground"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                          /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4 text-primary" }),
                          checkOut ? format(checkOut, "MMM dd, yyyy") : "Select Date"
                        ] }),
                        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    PopoverContent,
                    {
                      className: "w-auto p-0 shadow-xl",
                      align: "start",
                      sideOffset: 8,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "p-3 border-b bg-muted/30", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Select Check-out Date" }) }),
                        /* @__PURE__ */ jsx(
                          Calendar$1,
                          {
                            value: checkOut,
                            onChange: (value) => {
                              if (value instanceof Date) {
                                handleCheckOutSelect(value);
                              }
                            },
                            minDate: checkIn ? addDays(checkIn, 1) : /* @__PURE__ */ new Date(),
                            maxDate: addDays(/* @__PURE__ */ new Date(), 365)
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "p-3 border-t bg-muted/30 flex items-center justify-between", children: [
                          checkIn && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            "Check-in:",
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: format(checkIn, "MMM dd") })
                          ] }),
                          checkOut && /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "sm",
                              className: "h-7 text-xs ml-auto",
                              onClick: () => setCheckOut(void 0),
                              children: "Clear"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Guests & Rooms" }),
                /* @__PURE__ */ jsxs(Popover, { open: guestsOpen, onOpenChange: setGuestsOpen, children: [
                  /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "w-full justify-between text-left font-normal bg-background/50 h-14 px-4 group border-border/60 hover:border-primary/50 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                          /* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4 text-primary" }),
                          guests.adults + guests.children,
                          " Guests, ",
                          guests.rooms,
                          " ",
                          "Room"
                        ] }),
                        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(PopoverContent, { className: "w-80 p-0", align: "start", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-border/50", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Guests & Rooms" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Adults" }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ages 13+" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                adults: Math.max(1, prev.adults - 1)
                              })),
                              disabled: guests.adults <= 1,
                              children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { className: "w-6 text-center text-sm font-semibold", children: guests.adults }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                adults: prev.adults + 1
                              })),
                              children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Children" }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ages 2-12" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                children: Math.max(0, prev.children - 1)
                              })),
                              disabled: guests.children <= 0,
                              children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { className: "w-6 text-center text-sm font-semibold", children: guests.children }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                children: prev.children + 1
                              })),
                              children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border/50", children: [
                        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Rooms" }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                rooms: Math.max(1, prev.rooms - 1)
                              })),
                              disabled: guests.rooms <= 1,
                              children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { className: "w-6 text-center text-sm font-semibold", children: guests.rooms }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "outline",
                              size: "icon",
                              className: "h-8 w-8 rounded-full",
                              onClick: () => setGuests((prev) => ({
                                ...prev,
                                rooms: prev.rooms + 1
                              })),
                              children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-border/50 bg-muted/30", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "w-full",
                        size: "sm",
                        onClick: () => setGuestsOpen(false),
                        children: "Done"
                      }
                    ) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: handleSearch,
                  disabled: isSearching,
                  className: "w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold uppercase tracking-wide text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-70",
                  children: isSearching ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                    "Searching..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                    "Book"
                  ] })
                }
              ) })
            ] }),
            (selectedLocation || checkIn || checkOut) && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                className: "flex flex-wrap items-center gap-2 mb-4",
                children: [
                  selectedLocation && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
                    selectedLocation.locationName,
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setSelectedLocation(null),
                        className: "ml-1 hover:bg-primary/20 rounded-full p-0.5",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                      }
                    )
                  ] }),
                  checkIn && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                    format(checkIn, "MMM dd"),
                    checkOut && ` - ${format(checkOut, "MMM dd")}`,
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => {
                          setCheckIn(void 0);
                          setCheckOut(void 0);
                        },
                        className: "ml-1 hover:bg-primary/20 rounded-full p-0.5",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                      }
                    )
                  ] })
                ]
              }
            ),
            hasSearched && !isSearching && searchResults.length > 0 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: "border-t border-border/10 pt-6",
                children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: [
                    "Available Rooms",
                    " ",
                    selectedLocation ? `in ${selectedLocation.locationName}` : "in All Locations",
                    " ",
                    "(",
                    searchResults.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: paginatedRooms.map((room) => {
                    const roomImage = getRoomImage(room);
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "bg-background border border-border/50 rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-md hover:border-primary/30 transition-all",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-full md:w-48 h-40 md:h-auto bg-muted flex items-center justify-center flex-shrink-0", children: roomImage ? /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: roomImage,
                              alt: room.roomName,
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-muted-foreground", children: [
                            /* @__PURE__ */ jsx(BedDouble, { className: "w-10 h-10 opacity-30" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] mt-1 opacity-50", children: "No Image" })
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                                /* @__PURE__ */ jsx("h5", { className: "font-serif text-lg font-medium", children: room.roomName }),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: cn(
                                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                      getRoomTypeBadgeColor(room.roomType)
                                    ),
                                    children: room.roomType
                                  }
                                ),
                                /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium", children: room.status })
                              ] }),
                              room.propertyName && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mb-1 flex items-center gap-1", children: [
                                /* @__PURE__ */ jsx(Home, { className: "w-3 h-3" }),
                                " ",
                                room.propertyName
                              ] }),
                              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2 line-clamp-2", children: room.description }),
                              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-2", children: [
                                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                                  /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
                                  "Max ",
                                  room.maxOccupancy,
                                  " guests"
                                ] }),
                                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                                  /* @__PURE__ */ jsx(Maximize, { className: "w-3 h-3" }),
                                  room.roomSize,
                                  " ",
                                  room.roomSizeUnit?.replace("_", " ")
                                ] }),
                                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                                  "Floor ",
                                  room.floorNumber
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                                room.amenitiesAndFeatures?.slice(0, 4).map((amenity) => /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: "text-[10px] bg-secondary/30 px-2 py-0.5 rounded text-muted-foreground",
                                    children: amenity.name
                                  },
                                  amenity.id
                                )),
                                room.amenitiesAndFeatures?.length > 4 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-primary", children: [
                                  "+",
                                  room.amenitiesAndFeatures.length - 4,
                                  " more"
                                ] })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:border-l md:pl-4 border-border/10", children: [
                              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Starting from" }),
                                /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-primary", children: [
                                  "₹",
                                  room.basePrice?.toLocaleString("en-IN")
                                ] }),
                                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground", children: "per night" })
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                                /* @__PURE__ */ jsx(
                                  Button,
                                  {
                                    size: "sm",
                                    onClick: () => handleBook(room),
                                    className: "w-full md:w-auto px-6",
                                    children: "Book Now"
                                  }
                                ),
                                room.coordinates && /* @__PURE__ */ jsxs(
                                  Button,
                                  {
                                    size: "sm",
                                    variant: "ghost",
                                    className: "h-6 text-[10px] text-muted-foreground hover:text-primary gap-1",
                                    onClick: () => setShowMap(room),
                                    children: [
                                      /* @__PURE__ */ jsx(Map, { className: "w-3 h-3" }),
                                      " Show on Map"
                                    ]
                                  }
                                )
                              ] })
                            ] })
                          ] })
                        ]
                      },
                      `room-${room.roomId}`
                    );
                  }) }),
                  totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2 mt-6", children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                        disabled: currentPage === 1,
                        children: "Previous"
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm flex items-center px-3 bg-muted rounded-md", children: [
                      "Page ",
                      currentPage,
                      " of ",
                      totalPages
                    ] }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                        disabled: currentPage === totalPages,
                        children: "Next"
                      }
                    )
                  ] })
                ]
              }
            ),
            isSearching && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 border-t border-border/10 mt-6", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Searching for available rooms..." })
            ] }),
            hasSearched && !isSearching && searchResults.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground border-t border-border/10 pt-6 mt-6", children: [
              /* @__PURE__ */ jsx(BedDouble, { className: "w-12 h-12 mx-auto opacity-20 mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "No rooms found matching your criteria." }),
              /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "Try adjusting your filters or selecting a different location." })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: !!showMap,
        onOpenChange: (open) => !open && setShowMap(null),
        children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-3xl p-0 overflow-hidden h-[500px]", children: showMap && showMap.coordinates && /* @__PURE__ */ jsxs("div", { className: "w-full h-full relative", children: [
          /* @__PURE__ */ jsxs(
            MapContainer,
            {
              center: [showMap.coordinates.lat, showMap.coordinates.lng],
              zoom: 14,
              scrollWheelZoom: true,
              className: "w-full h-full",
              children: [
                /* @__PURE__ */ jsx(
                  TileLayer,
                  {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Marker,
                  {
                    position: [showMap.coordinates.lat, showMap.coordinates.lng],
                    icon: markerIcon,
                    children: /* @__PURE__ */ jsx(Popup, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-bold", children: showMap.roomName }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs", children: showMap.propertyName })
                    ] }) })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 z-[400] bg-white p-4 rounded-lg shadow-lg max-w-xs", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-1", children: showMap.roomName }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: showMap.description }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => {
                  setShowMap(null);
                  handleBook(showMap);
                },
                className: "w-full",
                children: "Book This Room"
              }
            )
          ] })
        ] }) })
      }
    )
  ] });
}
export {
  QuickBooking as default
};
