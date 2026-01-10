// routes/SuperAdminRoutes.jsx
import { Route } from 'react-router-dom';

// Page
import HomePageDashboard from '@/modules/superadmin/pages/Homepage/HomePageDashboard';
import SuperAdminDashboard from '@/modules/superadmin/pages/Dashboard/SuperAdminDashboard';
const SuperAdminRoutes = [
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
];

export default SuperAdminRoutes;
