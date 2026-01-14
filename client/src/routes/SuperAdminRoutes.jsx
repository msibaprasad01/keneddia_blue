// routes/SuperAdminRoutes.jsx
import { Route } from 'react-router-dom';

// Existing Pages
import HomePageDashboard from '@/modules/superadmin/pages/Homepage/HomePageDashboard';
import SuperAdminDashboard from '@/modules/superadmin/pages/Dashboard/SuperAdminDashboard';

// Top-Level Pages
import Location from '@/modules/superadmin/pages/Location/Location';
import ManageUsers from '@/modules/superadmin/pages/ManageUsers/ManageUsers';
import Analytics from '@/modules/superadmin/pages/Analytics/Analytics';
import Reports from '@/modules/superadmin/pages/Reports/Reports';

// Hotel Module
import Hotel from '@/modules/superadmin/pages/Hotel/Hotel';
import Rooms from '@/modules/superadmin/pages/Hotel/Rooms';
import Amenities from '@/modules/superadmin/pages/Hotel/Amenities';
import Bookings from '@/modules/superadmin/pages/Hotel/Bookings';
import Pricing from '@/modules/superadmin/pages/Hotel/Pricing';

// Cafe Module
import Cafe from '@/modules/superadmin/pages/Cafe/Cafe';
import CafeMenu from '@/modules/superadmin/pages/Cafe/Menu';
import CafeOrders from '@/modules/superadmin/pages/Cafe/Orders';
import Tables from '@/modules/superadmin/pages/Cafe/Tables';
import Inventory from '@/modules/superadmin/pages/Cafe/Inventory';

// Restaurant Module
import Restaurant from '@/modules/superadmin/pages/Restaurant/Restaurant';
import RestaurantMenu from '@/modules/superadmin/pages/Restaurant/Menu';
import Reservations from '@/modules/superadmin/pages/Restaurant/Reservations';
import RestaurantOrders from '@/modules/superadmin/pages/Restaurant/Orders';
import Kitchen from '@/modules/superadmin/pages/Restaurant/Kitchen';

// Wine & Dine Module
import WineDine from '@/modules/superadmin/pages/WineDine/WineDine';
import WineList from '@/modules/superadmin/pages/WineDine/WineList';
import Packages from '@/modules/superadmin/pages/WineDine/Packages';
import Events from '@/modules/superadmin/pages/WineDine/Events';

const SuperAdminRoutes = [
  // Existing Routes
  <Route
    key="super-admin-dashboard"
    path="/Dashboard"
    element={<SuperAdminDashboard />}
  />,
  <Route
    key="super-admin-Homepage-dashboard"
    path="/Homepage-Dashboard"
    element={<HomePageDashboard />}
  />,

  // Top-Level Routes
  <Route
    key="super-admin-location"
    path="/Location"
    element={<Location />}
  />,
  <Route
    key="super-admin-manage-users"
    path="/ManageUsers"
    element={<ManageUsers />}
  />,
  <Route
    key="super-admin-analytics"
    path="/Analytics"
    element={<Analytics />}
  />,
  <Route
    key="super-admin-reports"
    path="/Reports"
    element={<Reports />}
  />,

  // Hotel Module Routes
  <Route
    key="super-admin-hotel"
    path="/Hotel"
    element={<Hotel />}
  />,
  <Route
    key="super-admin-hotel-rooms"
    path="/Hotel/Rooms"
    element={<Rooms />}
  />,
  <Route
    key="super-admin-hotel-amenities"
    path="/Hotel/Amenities"
    element={<Amenities />}
  />,
  <Route
    key="super-admin-hotel-bookings"
    path="/Hotel/Bookings"
    element={<Bookings />}
  />,
  <Route
    key="super-admin-hotel-pricing"
    path="/Hotel/Pricing"
    element={<Pricing />}
  />,

  // Cafe Module Routes
  <Route
    key="super-admin-cafe"
    path="/Cafe"
    element={<Cafe />}
  />,
  <Route
    key="super-admin-cafe-menu"
    path="/Cafe/Menu"
    element={<CafeMenu />}
  />,
  <Route
    key="super-admin-cafe-orders"
    path="/Cafe/Orders"
    element={<CafeOrders />}
  />,
  <Route
    key="super-admin-cafe-tables"
    path="/Cafe/Tables"
    element={<Tables />}
  />,
  <Route
    key="super-admin-cafe-inventory"
    path="/Cafe/Inventory"
    element={<Inventory />}
  />,

  // Restaurant Module Routes
  <Route
    key="super-admin-restaurant"
    path="/Restaurant"
    element={<Restaurant />}
  />,
  <Route
    key="super-admin-restaurant-menu"
    path="/Restaurant/Menu"
    element={<RestaurantMenu />}
  />,
  <Route
    key="super-admin-restaurant-reservations"
    path="/Restaurant/Reservations"
    element={<Reservations />}
  />,
  <Route
    key="super-admin-restaurant-orders"
    path="/Restaurant/Orders"
    element={<RestaurantOrders />}
  />,
  <Route
    key="super-admin-restaurant-kitchen"
    path="/Restaurant/Kitchen"
    element={<Kitchen />}
  />,

  // Wine & Dine Module Routes
  <Route
    key="super-admin-winedine"
    path="/WineDine"
    element={<WineDine />}
  />,
  <Route
    key="super-admin-winedine-winelist"
    path="/WineDine/WineList"
    element={<WineList />}
  />,
  <Route
    key="super-admin-winedine-packages"
    path="/WineDine/Packages"
    element={<Packages />}
  />,
  <Route
    key="super-admin-winedine-events"
    path="/WineDine/Events"
    element={<Events />}
  />,
];

export default SuperAdminRoutes;

