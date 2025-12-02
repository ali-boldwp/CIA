import NewProject from "./NewProject";

const NewProjectConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],
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
