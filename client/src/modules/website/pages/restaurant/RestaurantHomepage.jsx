import { useEffect } from "react";
import RestaurantNavbar from "./components/RestaurantNavbar";
import HeroBanner from "./components/HeroBanner";
import CuisineCategories from "./components/CuisineCategories";
import AboutRestaurant from "./components/AboutRestaurant";
import RestaurantStats from "./components/RestaurantStats";
import BanquetsAndCatering from "./components/BanquetsAndCatering";
import EventsSchedule from "./components/EventsSchedule";
import SignatureDishes from "./components/SignatureDishes";
import ReservationForm from "./components/ReservationForm";
import Testimonials from "./components/Testimonials";
import RestaurantFooter from "./components/RestaurantFooter";

export default function RestaurantHomepage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant-specific Navbar */}
      <RestaurantNavbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <div id="home">
          <HeroBanner />
        </div>

        {/* Cuisine Categories */}
        <CuisineCategories />

        {/* About Section */}
        <AboutRestaurant />

        {/* Statistics */}
        <RestaurantStats />

        {/* Banquets & Catering */}
        <BanquetsAndCatering />

        {/* Events Schedule */}
        <EventsSchedule />

        {/* Signature Dishes / Menu */}
        <SignatureDishes />

        {/* Reservation Form */}
        <ReservationForm />

        {/* Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <RestaurantFooter />
    </div>
  );
}
