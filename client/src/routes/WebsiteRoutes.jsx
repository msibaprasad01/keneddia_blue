import { Route } from "react-router-dom";

import Home from "@/modules/website/pages/Home";
import Hotels from "@/modules/website/pages/Hotels";
import Cafes from "@/modules/website/pages/Cafes";
import Bars from "@/modules/website/pages/Bars";
import Events from "@/modules/website/pages/Events";
import Entertainment from "@/modules/website/pages/Entertainment";
import About from "@/modules/website/pages/About";
import Reviews from "@/modules/website/pages/Reviews";
import Login from "@/modules/auth/login";
import NotFound from "@/modules/website/pages/not-found";

const WebsiteRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="hotels" path="/hotels" element={<Hotels />} />,
  <Route key="cafes" path="/cafes" element={<Cafes />} />,
  <Route key="bars" path="/bars" element={<Bars />} />,
  <Route key="events" path="/events" element={<Events />} />,
  <Route key="entertainment" path="/entertainment" element={<Entertainment />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="reviews" path="/reviews" element={<Reviews />} />,
  <Route key="login" path="/login" element={<Login />} />,

  // 404
  <Route key="not-found" path="*" element={<NotFound />} />,
];

export default WebsiteRoutes;
