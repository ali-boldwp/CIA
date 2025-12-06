import Admin from "./Admin"

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
            element: <Admin />
        }
    ]
};

export default AdminConfig;