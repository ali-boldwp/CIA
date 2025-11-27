import SalesDashboard from "./SalesDashboard";


const SalesDashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/dashboard/sales',
            element: <SalesDashboard />
        }
    ]
};

export default SalesDashboardConfig;