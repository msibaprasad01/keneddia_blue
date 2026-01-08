// routes/SuperAdminRoutes.jsx
import { Route } from 'react-router-dom';

// Page
import SuperAdminDashboard from '../modules/superadmin/pages/SuperAdminDashboard.jsx';

const SuperAdminRoutes = [
  <Route
    key="super-admin-dashboard"
    path="/Dashboard"
    element={<SuperAdminDashboard />}
  />,
];

export default SuperAdminRoutes;
