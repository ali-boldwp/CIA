import React from 'react';
import { Navigate } from 'react-router-dom';
import Utils from '@libs/utils';
import DashboardConfig from '../pages/admin/dashboard/DashboardConfig';
import LoginConfig from "../pages/auth/Login/LoginConfig";

const routeConfigs = [ LoginConfig, DashboardConfig ];

const routes = [
    ...Utils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        element: <Navigate to="/login" />
    }
];

console.log( routes );

export default routes;