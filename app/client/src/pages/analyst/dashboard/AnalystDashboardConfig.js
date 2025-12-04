import AnalystDashboard from "./AnalystDashboard";


const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    auth: [ 'analyst' ],

    routes: [
        {
            path: '/dashboard/analyst',
            element: <AnalystDashboard />
        }
    ]
};

export default DashboardConfig;