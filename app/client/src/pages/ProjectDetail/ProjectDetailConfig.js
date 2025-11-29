import ProjectDetail from "./ProjectDetail"

const ProjectDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/projectDetail',
            element: <ProjectDetail />
        }
    ]
};

export default ProjectDetailConfig;