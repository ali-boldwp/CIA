import Pages from "./Pages"
import Dashboard from "./Pages/Dashboard";


const analystConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'analyst' ],
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

export default analystConfig;