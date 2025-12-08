import Pages from "./Pages"
import Dashboard from "./Pages/Dashboard";
import Projects from "../admin/Pages/Projects";
import ProjectSearch from "../admin/Pages/Projects/Search";
import ProjectTasks from "../admin/Pages/Projects/Tasks";
import RequestProject from "../admin/Pages/Projects/Request/New";


const salesConfig = {

    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'sales' ],
    routes: [
        {
            path: "/",
            element: <Pages />,
            children: [
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: 'project',
                    element: <Projects />,
                    children: [
                        {
                            index: true,
                            element: <RequestProject />
                        },
                        {
                            path: 'search/:keyword',
                            element: <ProjectSearch />
                        },
                        {
                            path: 'view/:id',
                            element: <ProjectTasks />
                        },
                    ]
                }
            ]
        }
    ]
};

export default salesConfig;