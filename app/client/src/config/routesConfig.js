import React from 'react';
import { Navigate } from 'react-router-dom';
import Utils from '@libs/utils';
import DashboardConfig from '../pages/admin/dashboard/DashboardConfig';
import LoginConfig from "../pages/auth/Login/LoginConfig";
import ManagerConfig from '../pages/Manager/Dashboard/ManagerConfig';

const routeConfigs = [ LoginConfig, DashboardConfig ,ManagerConfig];

const routes = [
    ...Utils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        element: <Navigate to="/login" />
    }
];

console.log( routes );

export default routes;