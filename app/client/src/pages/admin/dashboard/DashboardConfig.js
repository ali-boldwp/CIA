import Dashboard from "./Dashboard"

const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin' ],
    routes: [
        {
            path: '/dashboard',
            element: <Dashboard />
        }
    ]
};

export default DashboardConfig;