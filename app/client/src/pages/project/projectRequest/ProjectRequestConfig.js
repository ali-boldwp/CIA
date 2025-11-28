import ProjectRequest from "./ProjectRequest"

const ProjectRequestConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    
    routes: [
        {
            path: '/projectRequest',
            element: <ProjectRequest />
        }
    ]
};

export default ProjectRequestConfig;