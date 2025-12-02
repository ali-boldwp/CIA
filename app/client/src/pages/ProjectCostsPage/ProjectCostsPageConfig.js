import ProjectCostsPage from "./ProjectCostsPage";


const ProjectRequestConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    auth: [ 'admin', 'manager' ],
    routes: [
        {
            path: '/projectCost',
            element: <ProjectCostsPage />
        }
    ]
};

export default ProjectRequestConfig;