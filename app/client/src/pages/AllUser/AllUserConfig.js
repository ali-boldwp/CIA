import AllUser from "./AllUser"

const AllUserConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],
    routes: [
        {
            path: '/allUser',
            element: <AllUser />
        }
    ]
};

export default AllUserConfig;