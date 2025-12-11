import placeholderImg from "@assets/placeholder.svg";
import brandLogo from "@assets/logo/kb-logo2.jpg";

// Import Best Available Assets (Generic Luxury / Neutral)
import heroExterior from "@assets/generated_images/luxury_hotel_exterior_at_twilight.png";
import heroLobby from "@assets/generated_images/luxury_hotel_lobby_interior.png";
import heroLounge from "@assets/generated_images/exclusive_rooftop_lounge_at_night.png";
import aboutMain from "@assets/generated_images/architectural_detail_of_hotel.png";
import aboutLeader from "@assets/generated_images/luxury_hotel_awards_trophy.png";

// Hotel Images (Mapping generic luxury to cities)
import hotelMumbai from "@assets/generated_images/opulent_hotel_lobby_in_dubai.png"; // Generic Opulence
import hotelBengaluru from "@assets/generated_images/modern_hotel_suite_in_tokyo.png"; // Generic Modern Suite
import hotelDelhi from "@assets/generated_images/luxury_hotel_exterior_at_twilight.png"; // Reuse Hero
import hotelKolkata from "@assets/generated_images/chic_hotel_room_in_paris.png"; // Generic Chic Room
import hotelHyderabad from "@assets/generated_images/rooftop_pool_in_singapore.png"; // Generic Pool
import hotelChennai from "@assets/generated_images/luxury_hotel_room_interior_in_london.png";
import barSpeakeasy from "@assets/generated_images/speakeasy_jazz_bar.png";
import barRooftop from "@assets/generated_images/rooftop_cocktail_bar.png";
import barWhiskey from "@assets/generated_images/classic_whiskey_lounge.png";
import barBeach from "@assets/generated_images/beachside_sunset_bar.png";
import barLounge from "@assets/generated_images/exclusive_rooftop_lounge_at_night.png";
import barJazz from "@assets/generated_images/moody_luxury_bar_interior.png";

// Cafes
import cafeParisian from "@assets/generated_images/parisian_style_cafe_interior.png";
import cafeMinimalist from "@assets/generated_images/modern_minimalist_coffee_shop.png";
import cafeBakery from "@assets/generated_images/artisan_bakery_cafe.png";
import cafeHighTea from "@assets/generated_images/luxury_high_tea_lounge.png";
import cafeGarden from "@assets/generated_images/garden_terrace_cafe.png";
import cafeLibrary from "@assets/generated_images/cozy_library_cafe.png";

// Global Presence & Business
import mapImage from "@assets/generated_images/world_map_with_golden_pins.png";
import cafeUpscale from "@assets/generated_images/upscale_cafe_interior.png";

export const siteContent = {
  brand: {
    name: "Kennedia Blu",
    tagline: "Redefining luxury hospitality with a commitment to excellence, comfort, and authentic experiences.",
    logo: {
      text: "Kennedia Blu",
      image: { src: brandLogo, alt: "Kennedia Blu - Hotel | Restaurant | Cafe", priority: true },
      fallbackText: "KENNEDIA BLU"
    }
  },
  images: {
    globalPlaceholder: placeholderImg,
    hero: {
      slide1: { src: heroExterior, alt: "Luxury Hotel Exterior at Twilight", priority: true },
      slide2: { src: heroLobby, alt: "Grand Hotel Lobby", priority: true },
      slide3: { src: heroLounge, alt: "Rooftop Lounge at Night", priority: true },
    },
    about: {
      main: { src: aboutMain, alt: "Architectural Detail of Hotel", priority: false },
      leadership: { src: aboutLeader, alt: "Luxury Hotel Awards Trophy", priority: false },
    },
    hotels: {
      mumbai: { src: hotelMumbai, alt: "Kennedia Blu Mumbai Lobby", priority: false },
      bengaluru: { src: hotelBengaluru, alt: "Kennedia Blu Bengaluru Suite", priority: false },
      delhi: { src: hotelDelhi, alt: "Kennedia Blu Delhi Exterior", priority: false },
      kolkata: { src: hotelKolkata, alt: "Kennedia Blu Kolkata Room", priority: false },
      hyderabad: { src: hotelHyderabad, alt: "Kennedia Blu Hyderabad Pool", priority: false },
      chennai: { src: hotelChennai, alt: "Kennedia Blu Chennai Room", priority: false },
    },
    bars: {
      speakeasy: { src: barSpeakeasy, alt: "Jazz Speakeasy Bar", priority: false },
      rooftop: { src: barRooftop, alt: "Rooftop Cocktail Bar", priority: false },
      whiskey: { src: barWhiskey, alt: "Classic Whiskey Lounge", priority: false },
      beach: { src: barBeach, alt: "Beachside Sunset Bar", priority: false },
      lounge: { src: barLounge, alt: "Exclusive VIP Lounge", priority: false },
      jazz: { src: barJazz, alt: "Moody Jazz Bar", priority: false },
    },
    cafes: {
      parisian: { src: cafeParisian, alt: "Parisian Style Cafe", priority: false },
      minimalist: { src: cafeMinimalist, alt: "Modern Minimalist Coffee Shop", priority: false },
      bakery: { src: cafeBakery, alt: "Artisan Bakery", priority: false },
      highTea: { src: cafeHighTea, alt: "Luxury High Tea Lounge", priority: false },
      garden: { src: cafeGarden, alt: "Garden Terrace Cafe", priority: false },
      library: { src: cafeLibrary, alt: "Cozy Library Cafe", priority: false },
    },
    events: {
      jazz: { src: barSpeakeasy, alt: "Jazz Music Event", priority: false },
      gala: { src: heroLobby, alt: "Gala Event at Lobby", priority: false },
      highTea: { src: cafeHighTea, alt: "High Tea Event", priority: false },
    },
    globalPresence: {
      map: { src: mapImage, alt: "India Presence Map", priority: false },
    },
    businessVerticals: {
      hotel: { src: aboutMain, alt: "Hotel Vertical", priority: false },
      cafe: { src: cafeUpscale, alt: "Cafe Vertical", priority: false },
      bar: { src: barJazz, alt: "Bar Vertical", priority: false },
    }
  },
  text: {
    hero: {
      slides: [
        {
          title: "A Legacy of Global Hospitality & Timeless Luxury",
          subtitle: "Kennedia Blu Group",
        },
        {
          title: "Where Luxury Meets Experience",
          subtitle: "Kennedia Blu Group",
        },
        {
          title: "Built on Passion and Purpose",
          subtitle: "Kennedia Blu Group",
        }
      ]
    },
    about: {
      sectionTitle: "About Kennedia Blu",
      discoverTitle: "Discover Kennedia Blu",
      carousel: [
        {
          title: "Trusted Hospitality Brand",
          description: "Kennedia Blu is built on trust and excellence, delivering premium hospitality experiences that exceed customer expectations.",
        },
        {
          title: "Commitment to Quality",
          description: "We focus on top-class service standards, attention to detail, and customer satisfaction across every touchpoint.",
        },
        {
          title: "Leadership Excellence",
          description: "Led by industry veterans with decades of experience in hospitality, driving innovation and consistent service quality.",
        }
      ]
    }
  }
};
