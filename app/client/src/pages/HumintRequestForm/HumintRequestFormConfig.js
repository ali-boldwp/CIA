import HumintRequestForm from "./HumintRequestForm";


const HumintRequestFormConfig = {
    settings: {
        layout: {
            config: {}
        }
    },



    routes: [
        {
            path: '/humintRequest-Page',
            element: <HumintRequestForm />
        },
        {
            path: '/humintRequest-Page/:id',
            element: <HumintRequestForm />
        }
    ]
};

export default HumintRequestFormConfig;