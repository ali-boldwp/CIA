// src/config/routesConfig.js
import Utils from "@libs/utils";
import RoleBasedRoot from "./RoleBasedRoot";
import LoginConfig from "../pages/auth/Login/LoginConfig";

// All your role-specific configs (they only contain nested children routes)
import AdminConfig from "../pages/admin/adminConfig";
import ManagerConfig from "../pages/Manager/Dashboard/ManagerConfig";
import AnalystConfig from "../pages/Analyst/analystConfig";
import salesConfig from "../pages/Sales/salesConfig";
import SalesDashboardConfig from "../pages/sales/dashboard/SalesDashboardConfig";
// ... import every other config

const routeConfigs = [
    LoginConfig,
    AdminConfig,
    ManagerConfig,
    AnalystConfig,
    salesConfig,
    SalesDashboardConfig,
    // ... all others
];

// Generate all the nested routes (project, humint, tasks, etc.)
const generatedRoutes = Utils.generateRoutesFromConfigs(routeConfigs);

const routes = [
    ...generatedRoutes,

    // This is the only "/" route you will ever need
    {
        path: "/",
        element: <RoleBasedRoot />,
    },

    // Optional: catch-all for 404
    {
        path: "*",
        element: <div>404 - Page Not Found</div>,
    },
];

export default routes;