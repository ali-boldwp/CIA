import ProjectCostsPage from "./ProjectCostsPage";


const ProjectRequestConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/projectCost',
            element: <ProjectCostsPage />
        }
    ]
};

export default ProjectRequestConfig;