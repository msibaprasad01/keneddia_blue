import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { useSsrData } from "@/ssr/SsrDataContext";
import WineHeroBanner from "./components/WineHeroBanner";

const WineBestSellers = lazy(() => import("./components/WineBestSellers"));
const WineProperties = lazy(() => import("./components/WineProperties"));
const WineAbout = lazy(() => import("./components/WineAbout"));
const WineShowcaseSlider = lazy(() => import("./components/WineShowcaseSlider"));
const WineGuestReviews = lazy(() => import("./components/WineGuestReviews"));
const WineQuickBooking = lazy(() => import("./components/WineQuickBooking"));

const WINE_NAV_ITEMS = [
  { type: "link", label: "HOME", key: "home", href: "#home" },
  { type: "link", label: "ABOUT", key: "about", href: "#about" },
  { type: "link", label: "COLLECTION", key: "collection", href: "#collection" },
  { type: "link", label: "SHOWCASE", key: "showcase", href: "#showcase" },
  { type: "link", label: "REVIEWS", key: "reviews", href: "#reviews" },
  { type: "link", label: "RESERVATION", key: "reservation", href: "#reservation" },
];

function SectionFallback({ height = "h-40" }) {
  return (
    <div className={`container mx-auto px-4 ${height}`}>
      <div className="h-full animate-pulse rounded-xl bg-muted/30" />
    </div>
  );
}

export default function WineHomepage() {
  const { wineHomepage: ssr } = useSsrData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background [scrollbar-gutter:stable]">
      <Navbar navItems={WINE_NAV_ITEMS} logo={siteContent.brand.logo_bar} />

      <main>
        <div id="home">
          <WineHeroBanner initialSlides={ssr?.heroSlides} />
        </div>

        <div className="h-12 bg-linear-to-b from-[#E6E2D7] to-white dark:hidden" />
        <div id="collection">
          <Suspense fallback={<SectionFallback height="h-96" />}>
            <WineBestSellers />
          </Suspense>
        </div>

        <div className="h-12 bg-linear-to-b from-white to-[#E4CDB0] dark:hidden" />
        <div id="wine-properties">
          <Suspense fallback={<SectionFallback height="h-[32rem]" />}>
            <WineProperties locationMatch={null} />
          </Suspense>
        </div>

        <div className="h-12 bg-linear-to-b from-[#E4CDB0] to-white dark:hidden" />
        <div id="about">
          <Suspense fallback={<SectionFallback height="h-80" />}>
            <WineAbout />
          </Suspense>
        </div>

        <div className="h-12 bg-linear-to-b from-white to-[#E6E2D7] dark:hidden" />
        <div id="showcase">
          <Suspense fallback={<SectionFallback height="h-[28rem]" />}>
            <WineShowcaseSlider />
          </Suspense>
        </div>

        <div className="h-12 bg-linear-to-b from-[#E6E2D7] to-[#E4CDB0] dark:hidden" />
        <div id="reservation">
          <Suspense fallback={<SectionFallback height="h-80" />}>
            <WineQuickBooking />
          </Suspense>
        </div>

        <div className="h-12 bg-linear-to-b from-[#E4CDB0] to-[#ABBF9B] dark:hidden" />
        <div id="reviews">
          <Suspense fallback={<SectionFallback height="h-[36rem]" />}>
            <WineGuestReviews />
          </Suspense>
        </div>
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
