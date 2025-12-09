import placeholderImg from "@assets/placeholder.svg";

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
    }
  },
  images: {
    globalPlaceholder: placeholderImg,
    hero: {
      slide1: heroExterior,
      slide2: heroLobby,
      slide3: heroLounge,
    },
    about: {
      main: aboutMain,
      leadership: aboutLeader,
    },
    hotels: {
      mumbai: hotelMumbai,
      bengaluru: hotelBengaluru,
      delhi: hotelDelhi,
      kolkata: hotelKolkata,
      hyderabad: hotelHyderabad,
      chennai: hotelChennai,
    },
    bars: {
      speakeasy: barSpeakeasy,
      rooftop: barRooftop,
      whiskey: barWhiskey,
      beach: barBeach,
      lounge: barLounge,
      jazz: barJazz,
    },
    cafes: {
      parisian: cafeParisian,
      minimalist: cafeMinimalist,
      bakery: cafeBakery,
      highTea: cafeHighTea,
      garden: cafeGarden,
      library: cafeLibrary,
    },
    events: {
      jazz: barSpeakeasy,
      gala: heroLobby,
      highTea: cafeHighTea,
    },
    globalPresence: {
      map: mapImage,
    },
    businessVerticals: {
      hotel: aboutMain,
      cafe: cafeUpscale,
      bar: barJazz,
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
