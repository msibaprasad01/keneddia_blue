import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ArrowRight,
  Share2,
  Heart,
  Check,
  Clock,
  Home,
  ChevronRight,
  Building2,
} from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getHotelById } from "@/data/hotelData";
import { siteContent } from "@/data/siteContent";
import PropertyMap from "@/modules/website/components/PropertyMap";

export default function HotelDetail() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const hotel = hotelId ? getHotelById(hotelId) : null;

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The hotel you're looking for doesn't exist.
          </p>
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: `Check out ${hotel.name} at Kennedia Blu!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Link copied to clipboard!");
    }
  };

  const handleBookNow = () => {
    navigate(`/hotels/${hotel.id}/rooms`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar logo={siteContent.brand.logo_hotel} />

      {/* Breadcrumb */}
      <div className="bg-secondary/5 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/hotels"
              className="hover:text-foreground transition-colors"
            >
              Hotels
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{hotel.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <OptimizedImage
          {...hotel.image}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 uppercase tracking-wider drop-shadow-2xl"
          >
            {hotel.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-6 text-white/90"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-lg uppercase tracking-wide">
                {hotel.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-lg font-bold">
                {hotel.rating} ({hotel.reviews} reviews)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                About This Property
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {hotel.description}
              </p>
            </motion.div>

            {/* Amenities & Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Amenities */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Amenities
                </h3>
                <ul className="space-y-3">
                  {hotel.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Highlights
                </h3>
                <ul className="space-y-3">
                  {hotel.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary/10 border border-secondary/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                Property Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Total Rooms
                  </p>
                  <p className="text-xl font-serif font-semibold text-foreground">
                    {hotel.rooms}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Check-in
                  </p>
                  <p className="text-xl font-serif font-semibold text-foreground">
                    {hotel.checkIn}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Check-out
                  </p>
                  <p className="text-xl font-serif font-semibold text-foreground">
                    {hotel.checkOut}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* LOCATION MAP SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
                Location & Nearby
              </h2>
              <PropertyMap property={hotel} />
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-lg sticky top-24"
            >
              <div className="mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Starting from
                </p>
                <p className="text-4xl font-serif font-bold text-primary mb-1">
                  {hotel.price}
                </p>
                <p className="text-xs text-muted-foreground">per night</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-foreground">
                      {hotel.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-semibold text-foreground">
                    {hotel.reviews.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-foreground">
                    {hotel.city}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group mb-3"
              >
                Book Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-red-500 flex items-center justify-center gap-2"
                  title="Save"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Free cancellation up to 24 hours before check-in
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
