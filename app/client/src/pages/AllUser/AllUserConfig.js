import AllUser from "./AllUser"

const AllUserConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/allUser',
            element: <AllUser />
        }
    ]
};

export default AllUserConfig;