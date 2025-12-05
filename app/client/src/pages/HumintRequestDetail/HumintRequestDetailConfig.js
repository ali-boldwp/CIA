import HumintRequestDetail from "./HumintRequestDetail";

const HumintRequestDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/humintRequest-Detail/:id',
            element: <HumintRequestDetail />
        }
    ]
};

export default HumintRequestDetailConfig;
