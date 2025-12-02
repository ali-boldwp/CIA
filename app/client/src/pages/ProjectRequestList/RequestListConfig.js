 import ProjectRequestList from "./index";


const RequestListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    auth: [ 'admin', 'manager' ],

    routes: [
        {
            path: '/projectRequest-list',
            element: <ProjectRequestList />
        }
    ]
};

export default RequestListConfig;