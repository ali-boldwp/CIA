import AnalystDashboard from "./AnalystDashboard";


const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/dashboard/analyst',
            element: <AnalystDashboard />
        }
    ]
};

export default DashboardConfig;