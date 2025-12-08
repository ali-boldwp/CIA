import Admin from "./Admin"

import Dashboard from "./dashboard/Dashboard";

const AdminConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],
    routes: [
        {
            path: '/admin',
            element: <Admin />,
            children: [
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: 'users',
                    element: <Dashboard />
                }
            ]
        }
    ]
};

export default AdminConfig;