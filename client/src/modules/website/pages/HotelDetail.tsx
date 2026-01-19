
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Share2,
  Heart,
  Check,
  Building2,
  Utensils,
  Map as MapIcon,
  ChevronRight,
  Info
} from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getHotelById } from "@/data/hotelData";
import { siteContent } from "@/data/siteContent";
import PropertyMap from "@/modules/website/components/PropertyMap";
import FindYourStay from "@/modules/website/components/FindYourStay";
import HotelStickyNav from "@/modules/website/components/HotelStickyNav";
import RoomList from "@/modules/website/components/RoomList";
import { Button } from "@/components/ui/button";

export default function HotelDetail() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const hotel = hotelId ? getHotelById(hotelId) : null;

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Hotel Not Found</h1>
          <button
            onClick={() => navigate("/hotels")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "room-options", label: "Room Options" },
    { id: "about-hotel", label: "About Hotel" },
    { id: "amenities", label: "Amenities" },
    { id: "food-dining", label: "Food & Dining" },
    { id: "location", label: "Location" },
    { id: "policies", label: "Guest Policies" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-20">
      <Navbar logo={siteContent.brand.logo_hotel} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/hotels" className="hover:text-foreground">Hotels</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{hotel.name}</span>
        </div>
      </div>

      {/* TOP SECTION: Header & Media */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Header Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">5 Star Luxury</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{hotel.name}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  {hotel.location}
                  <span className="text-primary hover:underline cursor-pointer text-xs font-semibold ml-2" onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}>View Map</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                {hotel.rating} <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-sm font-medium underline cursor-pointer">{hotel.reviews} Verified Reviews</span>
            </div>
          </div>

          {/* Pricing Card (Desktop right) */}
          <div className="hidden lg:block w-80 bg-card border border-border rounded-xl p-4 shadow-sm h-fit">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Starting from</p>
                <p className="text-2xl font-serif font-bold text-primary">{hotel.price}</p>
                <p className="text-[10px] text-muted-foreground">+ taxes & fees / night</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-bold mb-1">Login for best rates</p>
              </div>
            </div>
            <Button className="w-full font-bold uppercase tracking-wider" onClick={() => document.getElementById('room-options')?.scrollIntoView({ behavior: 'smooth' })}>
              Select Room
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-xl overflow-hidden">
          <div className="md:col-span-2 h-full relative group cursor-pointer">
            <OptimizedImage {...hotel.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          <div className="md:col-span-1 flex flex-col gap-2 h-full">
            <div className="h-1/2 relative cursor-pointer"><OptimizedImage src={hotel.roomTypes[0]?.image.src || hotel.image.src} alt="Room" className="w-full h-full object-cover" /></div>
            <div className="h-1/2 relative cursor-pointer"><OptimizedImage src={hotel.dining?.[0]?.image?.src || hotel.image.src} alt="Dining" className="w-full h-full object-cover" /></div>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2 h-full">
            <div className="h-1/2 relative cursor-pointer"><OptimizedImage src={siteContent.images.hero.slide2.src} alt="Lobby" className="w-full h-full object-cover" /></div>
            <div className="h-1/2 relative cursor-pointer group">
              <OptimizedImage src={siteContent.images.hero.slide3.src} alt="Pool" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium border border-white/50 px-3 py-1 rounded backdrop-blur-sm">+12 More Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <FindYourStay />
      </div>

      {/* Sticky Navigation */}
      <HotelStickyNav sections={sections} />

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-12">

          {/* Room Options */}
          <section id="room-options" className="scroll-mt-40">
            <h2 className="text-2xl font-serif font-bold mb-6">Choose Your Room</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <span className="px-3 py-1 bg-secondary border border-border rounded-full text-xs font-medium whitespace-nowrap">Free Cancellation</span>
              <span className="px-3 py-1 bg-secondary border border-border rounded-full text-xs font-medium whitespace-nowrap">Breakfast Included</span>
              <span className="px-3 py-1 bg-secondary border border-border rounded-full text-xs font-medium whitespace-nowrap">Pay at Hotel</span>
            </div>
            <RoomList rooms={hotel.roomTypes} onSelectRoom={(id) => console.log('Selected', id)} />
          </section>

          {/* About Hotel */}
          <section id="about-hotel" className="scroll-mt-40 pt-8 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-4">About {hotel.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{hotel.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.features.map((feature, idx) => (
                <div key={idx} className="bg-secondary/10 p-4 rounded-lg border border-border/50 text-center">
                  <Star className="w-5 h-5 text-primary mx-auto mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section id="amenities" className="scroll-mt-40 pt-8 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Food & Dining */}
          <section id="food-dining" className="scroll-mt-40 pt-8 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Food & Dining</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.dining?.map((place, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                  <div className="h-40 relative">
                    {place.image ? (
                      <OptimizedImage {...place.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Utensils className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-serif font-bold mb-1">{place.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{place.cuisine}</p>
                    <div className="mt-auto pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">Open:</span> {place.timings}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section id="location" className="scroll-mt-40 pt-8 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Location</h2>
            <p className="text-muted-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {hotel.location}, {hotel.city}
            </p>
            <PropertyMap property={hotel} />

            {/* Nearby Places */}
            {hotel.nearbyPlaces && (
              <div className="mt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Nearby Places</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hotel.nearbyPlaces.map((place, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{place.name}</p>
                        <p className="text-[10px] text-muted-foreground">{place.type}</p>
                      </div>
                      <span className="text-xs font-bold text-primary">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Guest Policies */}
          <section id="policies" className="scroll-mt-40 pt-8 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Guest Policies</h2>
            <div className="bg-secondary/5 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" /> Check-in / Check-out
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Check-in: <span className="text-foreground font-medium">{hotel.checkIn}</span></li>
                  <li>Check-out: <span className="text-foreground font-medium">{hotel.checkOut}</span></li>
                  <li>Minimum Age: {hotel.policies?.checkInAge || 18} years</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" /> Other Policies
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Pets: <span className="text-foreground font-medium">{hotel.policies?.pets ? "Allowed" : "Not Allowed"}</span></li>
                  <li>Cancellation: {hotel.policies?.cancellation}</li>
                  <li>Extra Bed: {hotel.policies?.extraBed ? "Available on request" : "Not available"}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Rail (Sticky Booking Summary could go here if layout changes, but keeping it empty for now as per Goibibo style of wide content or using for ads/promos) */}
        <div className="hidden lg:block space-y-6">
          {/* Could replicate the price card here sticky */}
          <div className="sticky top-24">
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
              <h3 className="font-serif font-bold text-lg mb-4">Why Book With Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Best Price Guarantee</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>No Hidden Fees</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Instant Confirmation</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>24/7 Customer Support</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h3 className="font-serif font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">Call our expert travel desk for assistance.</p>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
