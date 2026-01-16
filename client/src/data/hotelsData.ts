// Centralized Hotel Data
import { siteContent } from "./siteContent";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  price: number;
  rating: number;
  image: any;
  description: string;
  amenities: string[];
}

export const CITIES = ["Bangalore", "Mumbai", "Goa", "Delhi", "Hyderabad", "Chennai"];

export const HOTELS_DATA: Hotel[] = [
  {
    id: "kb-blr-mg",
    name: "Kennedia Blu - Bangalore (MG Road)",
    city: "Bangalore",
    price: 12499,
    rating: 4.8,
    image: siteContent.images.hotels.bengaluru,
    description: "Experience the vibrant heart of the city with luxury suites and panoramic views.",
    amenities: ["Spa", "Pool", "Fine Dining", "Gym"],
  },
  {
    id: "kb-mum-juhu",
    name: "Kennedia Grand - Mumbai (Juhu)",
    city: "Mumbai",
    price: 15999,
    rating: 4.9,
    image: siteContent.images.hotels.mumbai,
    description: "Beachfront luxury meeting urban sophistication in the entertainment capital.",
    amenities: ["Beach Access", "Rooftop Bar", "Infinity Pool"],
  },
  {
    id: "kb-goa-resort",
    name: "Kennedia Resort - Goa",
    city: "Goa",
    price: 18499,
    rating: 4.7,
    image: siteContent.images.hotels.mumbai, // Reusing available image if Goa specific is missing or using placeholder
    description: "A tropical paradise featuring private villas and sunset cruises.",
    amenities: ["Private Beach", "Water Sports", "Casino"],
  },
  {
    id: "kb-del-suites",
    name: "Kennedia Suites - Delhi",
    city: "Delhi",
    price: 13999,
    rating: 4.8,
    image: siteContent.images.hotels.delhi,
    description: "Colonial elegance combined with modern luxury in the capital.",
    amenities: ["Heritage Tour", "Butler Service", "High Tea"],
  },
  {
    id: "kb-hyd-hitech",
    name: "Kennedia Blu - Hyderabad",
    city: "Hyderabad",
    price: 11999,
    rating: 4.6,
    image: siteContent.images.hotels.hyderabad,
    description: "Business and leisure seamlessly blended in the city of pearls.",
    amenities: ["Convention Center", "Pool", "24/7 Dining"],
  },
  {
    id: "kb-chn-marina",
    name: "Kennedia Blu - Chennai",
    city: "Chennai",
    price: 10999,
    rating: 4.5,
    image: siteContent.images.hotels.chennai,
    description: "Coastal charm with traditional hospitality.",
    amenities: ["Sea View", "Ayurvedic Spa", "Seafood Specialty"],
  },
  {
    id: "kb-blr-whitefield",
    name: "Kennedia Blu - Whitefield",
    city: "Bangalore",
    price: 9999,
    rating: 4.5,
    image: siteContent.images.hotels.bengaluru,
    description: "Modern comforts for the tech-savvy traveler.",
    amenities: ["Co-working Space", "Smart Rooms", "Gym"],
  },
  {
    id: "kb-mum-bandra",
    name: "Kennedia Suites - Bandra",
    city: "Mumbai",
    price: 14500,
    rating: 4.7,
    image: siteContent.images.hotels.mumbai,
    description: "Chic stays in the queen of suburbs.",
    amenities: ["Boutique Design", "Cafe", "Art Gallery"],
  }
];
