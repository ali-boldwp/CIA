// src/AppRoutes.jsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './config/routesConfig';
import RequireAuth from './RequireAuth';

function AppRoutes() {

    // 🔐 Wrap routes that contain an "auth" field
    const authWrappedRoutes = routes.map(route => {
        if (!route.auth) {
            return route; // public route → no wrapper
        }

        return {
            ...route,
            element: (
                <RequireAuth allowedRoles={route.auth}>
                    {route.element}
                </RequireAuth>
            )
        };
    });

    // console.log('AUTH WRAPPED ROUTES:', authWrappedRoutes);

    // 🎯 Send final routes to React Router v6
    const element = useRoutes(authWrappedRoutes);

    return element;
}

export default AppRoutes;
