import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
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
import ProjectDetailConfig from "../pages/ProjectDetail/ProjectDetailConfig";
import AnalistProfileCon from "../pages/AnalystProfile/AnalystProfileCon";
import ProjectCostsPageConfig from "../pages/ProjectCostsPage/ProjectCostsPageConfig";
import AllUserConfig from "../pages/AllUser/AllUserConfig";
import RequestListConfig from "../pages/ProjectRequestList/RequestListConfig";
import MessengerConfig from "../pages/Messenger/MessengerConfig";
import TaskPageConfig from "../pages/taskPage/TaskPageConfig";
import HumintConfig from "../pages/Humint/HumintConfig";
import HumintRequestFormConfig from "../pages/HumintRequestForm/HumintRequestFormConfig";
import HumintListConfig from "../pages/HumintList/HumintListConfig";
import HumintRequestDetailConfig from "../pages/HumintRequestDetail/HumintRequestDetailConfig";

import AdminConfig from "../pages/admin/adminConfig";


const routeConfigs = [
    LoginConfig,
    AdminConfig,
    DashboardConfig,
    AnalystDashboardConfig,
    SalesDashboardConfig,
    NewProjectConfig,
    ManagerConfig,
    ProjectRequestConfig,
    EmployeeListConfig,
    AnalistProfileCon,
    AnalstListConfig,
    ProjectCostsPageConfig,
    ProjectDetailConfig,
    AllUserConfig,
    RequestListConfig,
    MessengerConfig,
    TaskPageConfig,
    HumintConfig,
    HumintRequestFormConfig,
    HumintListConfig,
    HumintRequestDetailConfig

];

const CheckRole = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        // while user is still loading, do nothing
        if (user === undefined) return;

        // no user -> go login
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        // user exists -> redirect to /{role}
        navigate(`/${user.role}`, { replace: true });
    }, [user, navigate]);

    return null;
};


const routes = [
    ...Utils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        element: <CheckRole to="/login"/>
    }
];

console.log(routes);

export default routes;