import { Route } from "react-router-dom";

import Home from "@/modules/website/pages/Home";
import Hotels from "@/modules/website/pages/Hotels";
import HotelDetail from "@/modules/website/pages/HotelDetail";
import RoomSelection from "@/modules/website/pages/RoomSelection";
import Cafes from "@/modules/website/pages/Cafes";
import Bars from "@/modules/website/pages/Bars";
import Events from "@/modules/website/pages/Events";
import Entertainment from "@/modules/website/pages/Entertainment";
import About from "@/modules/website/pages/About";
import Reviews from "@/modules/website/pages/Reviews";
import Login from "@/modules/auth/login";
import NotFound from "@/modules/website/pages/not-found";
import OfferDetails from "@/modules/website/pages/OfferDetails";
import PropertyDetails from "@/modules/website/pages/PropertyDetails";
import EventDetails from "@/modules/website/pages/EventDetails";
import NewsDetails from "@/modules/website/pages/NewsDetails";
import HotelNewsDetails from "@/modules/website/pages/hotel/HotelNewsDetails";
import HotelOfferDetails from "@/modules/website/pages/hotel/HotelOfferDetails";
import NewsListing from "@/modules/website/pages/NewsListing";
import Careers from "@/modules/website/pages/Careers";
import Checkout from "@/modules/website/pages/Checkout";

const WebsiteRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="hotels" path="/hotels" element={<Hotels />} />,
  <Route key="hotel-detail" path="/hotels/:city" element={<HotelDetail />} />,
  <Route key="room-selection" path="/hotels/:hotelId/rooms" element={<RoomSelection />} />,
  <Route key="cafes" path="/cafes" element={<Cafes />} />,
  <Route key="bars" path="/bars" element={<Bars />} />,
  <Route key="events" path="/events" element={<Events />} />,
  <Route key="entertainment" path="/entertainment" element={<Entertainment />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="reviews" path="/reviews" element={<Reviews />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="careers" path="/careers" element={<Careers />} />,

  // Detail Pages
  <Route key="offer-details" path="/offers/:id" element={<OfferDetails />} />,
  <Route key="property-details" path="/properties/:id" element={<PropertyDetails />} />,
  <Route key="event-details" path="/events/:id" element={<EventDetails />} />,

  // News
  <Route key="news-listing" path="/news" element={<NewsListing />} />,
  <Route key="news-details" path="/news/:id" element={<NewsDetails />} />,

  // 404
  <Route key="not-found" path="*" element={<NotFound />} />,
  // Hotel Detail Pages
  <Route key="hotel-news-details" path="/hotel/news/:slug" element={<HotelNewsDetails />} />,
  <Route key="hotel-offer-details" path="/hotel/offers/:id" element={<HotelOfferDetails />} />,
  <Route key="checkout" path="/checkout" element={<Checkout />} />,
];

export default WebsiteRoutes;
