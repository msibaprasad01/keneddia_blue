import { Routes } from "react-router-dom";

import WebsiteRoutes from "./WebsiteRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Website */}
      {WebsiteRoutes}

      {/* Super Admin */}
      {SuperAdminRoutes}
    </Routes>
  );
};

export default AppRoutes;
