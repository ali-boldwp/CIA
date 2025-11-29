import Analyst from "./"

const AnalstListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/AnalystList',
            element: <Analyst />
        }
    ]
};

export default AnalstListConfig;