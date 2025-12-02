import ProjectRequest from "./ProjectRequest"

const ProjectRequestConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager', 'sales' ],
    routes: [
        {
            path: '/projectRequest',
            element: <ProjectRequest />
        }
    ]
};

export default ProjectRequestConfig;