import NewProject from "./NewProject";

const NewProjectConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/project',
            element: <NewProject />
        },
        {
            path: '/project/:id',
            element: <NewProject />
        }
    ]
};

export default NewProjectConfig;
