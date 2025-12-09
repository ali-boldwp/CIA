// src/config/routesConfig.js
import React from "react";
import Utils from "@libs/utils";

import LoginConfig from "../pages/auth/Login/LoginConfig";
import AdminConfig from "../pages/admin/adminConfig";
import AnalystConfig from "../pages/Analyst/analystConfig";
import SalesConfig from "../pages/Sales/salesConfig";
import ProjectSearch from "../pages/admin/Pages/Projects/Search";
import NotFound from "../pages/Components/404";
import Messenger from "../pages/Messenger/Messenger";

// 1) All configs together
const allRouteConfigs = [
    LoginConfig,
    AdminConfig,
    AnalystConfig,
    SalesConfig
    // ...add any others here
];

// 2) Helper: filter configs by role
const filterConfigsByRole = (role) => {
    return allRouteConfigs.filter((config) => {
        // configs without auth are public
        if (!config.auth || config.auth.length === 0) return true;
        if (!role) return false;
        return config.auth.includes(role);
    });
};

// 3) ROLE-BASED ROUTES (used by AppRoutes)
export const getRoutesForRole = (role) => {
    const allowedConfigs = filterConfigsByRole(role);

    const generatedRoutes = Utils.generateRoutesFromConfigs(allowedConfigs);

    const routes = [
        ...generatedRoutes,
        {
            path: "/messenger",
            element: <Messenger />,
        },
        {
            path: "/messenger/:id",
            element: <Messenger />,
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ];

    return routes;
};

// 4) DEFAULT EXPORT (used by App.js / AppContext)
//    This is a "generic" routes list (all configs) –
//    it does NOT affect what AppRoutes actually renders.
const generatedRoutesAll = Utils.generateRoutesFromConfigs(allRouteConfigs);

const routes = [
    ...generatedRoutesAll,
    {
        path: "*",
        element: <NotFound />,
    },
];

export default routes;
