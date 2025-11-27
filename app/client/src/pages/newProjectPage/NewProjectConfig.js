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
        }
    ]
};

export default NewProjectConfig;