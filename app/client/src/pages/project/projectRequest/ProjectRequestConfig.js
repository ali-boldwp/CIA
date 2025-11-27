import ProjectRequest from "./ProjectRequest"

const ProjectRequestConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    
    routes: [
        {
            path: '/dashboard/projectRequest',
            element: <ProjectRequest />
        }
    ]
};

export default ProjectRequestConfig;