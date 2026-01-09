import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Calendar, Search, Star, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom CSS for Leaflet popups
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

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = customPopupStyles;
  if (!document.querySelector('style[data-leaflet-custom]')) {
    styleEl.setAttribute('data-leaflet-custom', 'true');
    document.head.appendChild(styleEl);
  }
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  image: any;
  price: string;
  rating: string;
  reviews: number;
  description: string;
  amenities: string[];
  features?: string[];
  rooms: number;
  checkIn: string;
  checkOut: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface CollectionSectionProps {
  filteredHotels: Hotel[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  cities: string[];
  showCityDropdown: boolean;
  setShowCityDropdown: (show: boolean) => void;
  onHotelSelect: (hotel: Hotel) => void;
}

export default function CollectionSection({
  filteredHotels,
  selectedCity,
  setSelectedCity,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  handleSearch,
  isSearching,
  cities,
  showCityDropdown,
  setShowCityDropdown,
  onHotelSelect,
}: CollectionSectionProps) {

  // Create custom red icon
  const createRedIcon = () => {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <section id="collection" className="py-8 bg-secondary/5 relative">
      <div className="container mx-auto px-6">
        {/* Slim Compact Header with Full Width Background */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                Discover
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-foreground">Our Collection</h2>
            </div>

            {/* Right: Compact Inline Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full outline-none hover:border-primary/50 transition-colors text-xs shadow-sm"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium">{selectedCity}</span>
                  <ArrowRight
                    className={`w-2.5 h-2.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-90" : ""
                      }`}
                  />
                </button>
                {showCityDropdown && (
                  <div className="absolute top-full mt-1 w-48 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-secondary/50 transition-colors ${selectedCity === city ? "bg-secondary/30 font-semibold" : ""
                          }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Check-in Date */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm">
                <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  placeholder="Check-in"
                  className="bg-transparent outline-none text-xs font-medium w-24"
                />
              </div>

              {/* Check-out Date */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm">
                <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  placeholder="Check-out"
                  className="bg-transparent outline-none text-xs font-medium w-24"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors uppercase tracking-wider text-xs font-bold disabled:opacity-50 shadow-sm"
              >
                {isSearching ? (
                  <Search className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Search className="w-3 h-3" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Cards (60%) + Map (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start mt-6">
          {/* LEFT: Auto-Scrolling Carousel - 60% */}
          <div className="relative space-y-4 overflow-hidden min-h-[600px]">
            {/* Top Row - Scroll Left to Right */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-scroll-left">
                {/* Duplicate hotels for infinite scroll */}
                {[...filteredHotels, ...filteredHotels].map((hotel, idx) => (
                  <div
                    key={`top-${hotel.id}-${idx}`}
                    className="flex-shrink-0 w-[280px] bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => onHotelSelect(hotel)}
                  >
                    {/* Hotel Image */}
                    <div className="relative h-40 overflow-hidden">
                      <OptimizedImage
                        {...hotel.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold">{hotel.rating}</span>
                      </div>
                    </div>

                    {/* Hotel Info */}
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-foreground mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-xs mb-2">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">from</span>
                        <span className="text-base font-bold text-primary">{hotel.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row - Scroll Right to Left */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-scroll-right">
                {/* Duplicate hotels for infinite scroll (reversed) */}
                {[...filteredHotels, ...filteredHotels].reverse().map((hotel, idx) => (
                  <div
                    key={`bottom-${hotel.id}-${idx}`}
                    className="flex-shrink-0 w-[280px] bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => onHotelSelect(hotel)}
                  >
                    {/* Hotel Image */}
                    <div className="relative h-40 overflow-hidden">
                      <OptimizedImage
                        {...hotel.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold">{hotel.rating}</span>
                      </div>
                    </div>

                    {/* Hotel Info */}
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-foreground mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-xs mb-2">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">from</span>
                        <span className="text-base font-bold text-primary">{hotel.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlays for fade effect */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none z-10" />
          </div>

          {/* RIGHT: Map View - 40% with 70% height centered */}
          <div className="lg:sticky lg:top-6 h-full flex items-center">
            <div className="w-full">
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-border shadow-2xl bg-card">
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                  style={{ zIndex: 1 }}
                  maxBounds={[
                    [6.0, 68.0], // Southwest coordinates of India
                    [35.0, 97.0], // Northeast coordinates of India
                  ]}
                  minZoom={5}
                  maxZoom={18}
                >
                  {/* Map Tiles */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Hotel Markers */}
                  {filteredHotels.map((hotel) => {
                    const redIcon = createRedIcon();

                    return (
                      <Marker
                        key={hotel.id}
                        position={[hotel.coordinates.lat, hotel.coordinates.lng]}
                        icon={redIcon}
                        eventHandlers={{
                          click: () => onHotelSelect(hotel),
                          mouseover: (e) => {
                            e.target.openPopup();
                          },
                          mouseout: (e) => {
                            e.target.closePopup();
                          },
                        }}
                      >
                        <Popup closeButton={false} className="custom-popup">
                          <div className="space-y-2 min-w-[200px]">
                            <div className="flex items-center justify-between">
                              <p className="font-serif text-sm font-bold text-foreground">
                                {hotel.name}
                              </p>
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs font-bold">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1 text-red-500" />
                              {hotel.location}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-xs text-muted-foreground">Starting from</span>
                              <span className="text-base font-bold text-primary">{hotel.price}</span>
                            </div>
                            <button
                              onClick={() => onHotelSelect(hotel)}
                              className="w-full text-xs bg-primary text-primary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                            >
                              View Details <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations for Auto-Scrolling */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}