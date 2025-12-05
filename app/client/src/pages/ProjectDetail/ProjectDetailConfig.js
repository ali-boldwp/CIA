import ProjectDetail from "./ProjectDetail"

const ProjectDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

   auth : [ 'admin' , 'manager'],

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