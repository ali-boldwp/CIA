 import ProjectRequestList from "./index";


const RequestListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/projectRequest-list',
            element: <ProjectRequestList />
        }
    ]
};

export default RequestListConfig;