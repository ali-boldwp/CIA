import Admin from "./Admin"

import Index from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import ProjectsList from "./Pages/Projects/List";
import ProjectSearch from "./Pages/Projects/Search";
import NewProject from "./Pages/Projects/New";
import CreateProject from "./Pages/Projects/New/Create"
import RequestProject from "./Pages/Projects/New/Request";

const AdminConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'manager' ],
    routes: [
        {
            path: '/',
            element: <Admin />,
            children: [
                {
                    index: true,
                    element: <Index />
                },
                {
                    path: 'project',
                    element: <Projects />,
                    children: [
                        {
                            index: true,
                            element: <ProjectsList />
                        },
                        {
                            path: 'all',
                            element: <ProjectsList />
                        },
                        {
                            path: 'search/:keyword',
                            element: <ProjectSearch />
                        },
                        {
                            path: 'new',
                            element: <NewProject />,
                            children: [
                                {
                                    index: true,
                                    element: <CreateProject />
                                },
                                {
                                    path: ':id',
                                    element: <CreateProject />
                                },
                                {
                                    path: 'request',
                                    element: <RequestProject />
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default AdminConfig;