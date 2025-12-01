import SalesDashboard from "./SalesDashboard";


const SalesDashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin' , 'manager' , 'sales' ],
    routes: [
        {
            path: '/dashboard/sales',
            element: <SalesDashboard />
        }
    ]
};

export default SalesDashboardConfig;