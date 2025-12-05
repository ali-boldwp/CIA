import HumintRequestDetail from "./HumintRequestDetail";

const HumintRequestDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth : [ 'admin' , 'manager'],
    routes: [
        {
            path: '/humintRequest-Detail/:id',
            element: <HumintRequestDetail />
        }
    ]
};

export default HumintRequestDetailConfig;
