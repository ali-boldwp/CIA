import Analyst from "./"

const AnalstListConfig  = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],
    routes: [
        {
            path: '/AnalystList',
            element: <Analyst />
        }
    ]
};

export default AnalstListConfig ;