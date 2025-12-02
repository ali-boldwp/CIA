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
        },
        {
            path: '/projectDetail/:id',
            element: <ProjectDetail />
        }
    ]
};

export default ProjectDetailConfig;