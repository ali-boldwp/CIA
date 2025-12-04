import Humint from "./Humint"

const HumintConfig = {
    settings: {
        layout: {
            config: {}
        }
    },



    routes: [
        {
            path: '/humintRequest',
            element: <Humint />
        }
    ]
};

export default HumintConfig;