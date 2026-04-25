import { useEffect } from "react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import WineBanner from "./winepage/WineBanner";
import WineSubCategories from "./winepage/WineSubCategories";
import AboutWinePage from "./winepage/AboutWinePage";
import WinepageEvents from "./winepage/WinepageEvents";
import WineSignatureDrinks from "./winepage/WineSignatureDrinks";
import WineTestimonials from "./winepage/WineTestimonials";
import WineGalleryPage from "./winepage/WineGalleryPage";
import WineReservationForm from "./winepage/WineReservationForm";
import { siteContent } from "@/data/siteContent";

const WINE_NAV_ITEMS = [
  { type: "link", label: "HOME", key: "home", href: "#home" },
  { type: "link", label: "MENU", key: "menu", href: "#menu" },
  { type: "link", label: "ABOUT", key: "about", href: "#about" },
  { type: "link", label: "GALLERY", key: "gallery", href: "#gallery" },
];

export default function WinePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar navItems={WINE_NAV_ITEMS} logo={siteContent.brand.logo_bar} />

      <main>
        <div id="home">
          <WineBanner />
        </div>

        <div id="menu">
          <div className="h-8 bg-linear-to-b from-[#E6E2D7] to-[#E4CDB0] dark:hidden sm:h-12" />
          <WineSignatureDrinks />
        </div>

        <div className="h-8 bg-linear-to-b from-[#E4CDB0] to-[#E6E2D7] dark:hidden sm:h-12" />
        <div id="about">
          <AboutWinePage />
        </div>

        <div className="h-8 bg-linear-to-b from-[#E6E2D7] to-[#E4CDB0] dark:hidden sm:h-12" />
        <div id="events">
          {/* <WinepageEvents /> */}
        </div>

        {/* <div className="h-12 bg-linear-to-b from-[#E4CDB0] to-[#E6E2D7] dark:hidden" />
        <WineTestimonials /> */}

        {/* <div className="h-12 bg-linear-to-b from-[#E6E2D7] to-[#ABBF9B] dark:hidden" /> */}
        <div id="gallery">
          <WineGalleryPage />
        </div>

        {/* <WineReservationForm /> */}
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
