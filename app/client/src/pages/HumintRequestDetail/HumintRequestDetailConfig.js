import HumintRequestDetail from "./HumintRequestDetail";

const HumintRequestDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth : [ 'admin' , 'manager','analyst'],
    routes: [
        {
            path: '/humintRequest-Detail/:id',
            element: <HumintRequestDetail />
        },
        {
            path: '/humintRequest-Detail',
            element: <HumintRequestDetail />
        }
    ]
};

export default HumintRequestDetailConfig;
