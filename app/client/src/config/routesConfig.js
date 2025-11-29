import React from 'react';
import { Navigate } from 'react-router-dom';
import Utils from '@libs/utils';
import DashboardConfig from '../pages/admin/dashboard/DashboardConfig';
import LoginConfig from "../pages/auth/Login/LoginConfig";
import ProjectRequestConfig from '../pages/project/projectRequest/ProjectRequestConfig';
import ManagerConfig from '../pages/Manager/Dashboard/ManagerConfig';
import AnalystDashboardConfig from "../pages/analyst/dashboard/AnalystDashboardConfig";
import SalesDashboardConfig from "../pages/sales/dashboard/SalesDashboardConfig";
import NewProjectConfig from "../pages/newProjectPage/NewProjectConfig";
import EmployeeListConfig from "../pages/EmployeeList/EmployeeListConfig";
import AnalstListConfig from "../pages/AnalystList/AnalystListConfig";
import AnalistProfileCon from "../pages/AnalystProfile/AnalystProfileCon";
import ProjectCostsPageConfig from "../pages/ProjectCostsPage/ProjectCostsPageConfig";

const routeConfigs = [ LoginConfig, DashboardConfig ,AnalystDashboardConfig ,SalesDashboardConfig ,NewProjectConfig ,ManagerConfig , ProjectRequestConfig , EmployeeListConfig , AnalistProfileCon , AnalstListConfig , ProjectCostsPageConfig];

const routes = [
    ...Utils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        element: <Navigate to="/login" />
    }
];

console.log( routes );

export default routes;