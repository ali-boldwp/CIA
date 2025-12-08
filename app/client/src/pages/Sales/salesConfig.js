import Pages from "./Pages"
import Dashboard from "./Pages/Dashboard";


const salesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'Sales' ],
    routes: [
        {
            element: <Pages />,
            children: [
                {
                    index: true,
                    element: <Dashboard />
                }
            ]
        }
    ]
};

export default salesConfig;