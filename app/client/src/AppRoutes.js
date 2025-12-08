// src/AppRoutes.js
import React from "react";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import { getRoutesForRole } from "./config/routesConfig";

const AppRoutes = () => {
    const { user, loading } = useSelector((state) => state.auth);

    // Get current role (can be undefined when not logged in)
    const role = user?.role;

    // Always build routes and call useRoutes – no conditions around this hook
    const routes = getRoutesForRole(role);
    const element = useRoutes(routes);

    // While auth is loading, just render nothing (or a loader)
    if (loading) {
        return null; // or <div>Loading...</div>
    }

    // Once not loading, render the router output
    return element;
};

export default AppRoutes;
