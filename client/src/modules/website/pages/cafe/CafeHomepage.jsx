import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import * as MapboxSearch from "@mapbox/search-js-core";
const { SearchBoxCore } = MapboxSearch;
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import CafeHeroBanner from "./components/CafeHeroBanner";
import CafeProperties from "./components/CafeProperties";
import CafeAbout from "./components/CafeAbout";
import CafeCoffeeStory from "./components/CafeCoffeeStory";
import CafeBestSellers from "./components/CafeBestSellers";
import CafeShowcaseSlider from "./components/CafeShowcaseSlider";
import CafeNewsSection from "./components/CafeNewsSection";
import CafeGuestReviews from "./components/CafeGuestReviews";
import CafeQuickBooking from "./components/CafeQuickBooking";

const CAFE_NAV_ITEMS = [
  { type: "link", label: "HOME", key: "home", href: "#home" },
  { type: "link", label: "ABOUT", key: "about", href: "#about" },
  { type: "link", label: "SHOWCASE", key: "showcase", href: "#showcase" },
  { type: "link", label: "NEWS", key: "news", href: "#news" },
  { type: "link", label: "RESERVATION", key: "reservation", href: "#reservation" },
];

const MAPBOX_ACCESS_TOKEN =
  "import.meta.env.VITE_MAPBOX_ACCESS_TOKEN";

export default function CafeHomepage() {
  const [places, setPlaces] = useState([]);

  // ── react-geolocated hook ────────────────────────────────────────────────
  const { coords, isGeolocationAvailable, isGeolocationEnabled, positionError } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: false },
      userDecisionTimeout: 5000,
      watchPosition: false,
    });

  // ── Scroll to top on mount ───────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Geolocation status logging ───────────────────────────────────────────
  useEffect(() => {
    if (!isGeolocationAvailable) {
      console.warn("CafeHomepage: Geolocation not supported by this browser.");
      return;
    }
    if (isGeolocationEnabled === false) {
      console.warn("CafeHomepage: Location permission denied.");
      return;
    }
    if (positionError) {
      console.warn(
        "CafeHomepage: Position error —",
        positionError.code === 1 ? "Permission denied" : "Location unavailable"
      );
      return;
    }
    if (!coords) {
      console.log("CafeHomepage: Waiting for user coordinates...");
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, positionError, coords]);

  // ── fetchNearby — runs only once real coords are available ───────────────
  useEffect(() => {
    if (!coords) return;

    const { latitude, longitude } = coords;
    console.log("User Coordinates:", { latitude, longitude });

    const fetchNearby = async () => {
      try {
        const search = new SearchBoxCore({ accessToken: MAPBOX_ACCESS_TOKEN });

        // Search nearby airports — valid Mapbox category, used to derive nearby city names
        const result = await search.category("airport", {
          proximity: [longitude, latitude],
          limit: 10,
        });

        console.log("Found:", result.features);

        // Deduplicate city names (context.place.name), sorted by nearest distance
        const seenCities = new Set();
        const nearbyCities = result.features
          .map((f) => ({
            city: f.properties.context?.place?.name || null,
            distanceKm: (f.properties.distance / 1000).toFixed(2),
          }))
          .filter((entry) => {
            if (!entry.city || seenCities.has(entry.city)) return false;
            seenCities.add(entry.city);
            return true;
          })
          .map((entry) => `${entry.city} — ${entry.distanceKm}km`)
          .join(" | ");

        console.log("Nearby Cities:", nearbyCities);

        setPlaces(result.features);
      } catch (error) {
        console.error("Mapbox search failed:", error);
      }
    };


    fetchNearby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  return (
    <div className="min-h-screen bg-background [scrollbar-gutter:stable]">
      <Navbar navItems={CAFE_NAV_ITEMS} logo={siteContent.brand.logo_cafe} />

      <main>
        <div id="home">
          <CafeHeroBanner />
        </div>
        {/* <CafeQuickBooking /> */}
        <CafeCoffeeStory />
        <CafeProperties />
        <CafeBestSellers />
        <CafeAbout />
        <CafeShowcaseSlider />
        <CafeNewsSection />
        <CafeGuestReviews />
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
