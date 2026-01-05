import Pages from "./Pages"
import Dashboard from "./Pages/Dashboard";
import Hument from "../admin/Pages/Humint";
import Humints from "../admin/Pages/Humint/List";
import HumentNew from "../admin/Pages/Humint/New";
import HumentRequest from "../admin/Pages/Humint/Request";
import HumentRequestView from "../admin/Pages/Humint/View";
import Projects from "../admin/Pages/Projects";
import ProjectSearch from "../admin/Pages/Projects/Search";
import ProjectTasks from "../admin/Pages/Projects/Tasks";
import ViewTask from "../admin/Pages/Projects/Tasks/View";


const analystConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'analyst' ],
    routes: [
        {
            path: '/',
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
                            path: 'search/:keyword',
                            element: <ProjectSearch />
                        },
                        {
                            path: 'view/:id',
                            element: <ProjectTasks />
                        },
                        {
                            path: 'view/:id/tasks/:taskId/progress',
                            element: <ViewTask/>
                        }
                    ]
                },
                {
                    path: 'humint',
                    element: <Hument />,
                    children: [
                        {
                            index: true,
                            element: <Humints />
                        },
                        {
                            path: 'new',
                            element: <HumentNew />
                        },
                        {
                            path: 'new/:id',
                            element: <HumentRequest />
                        },
                        {
                            path: 'request/:id',
                            element: <HumentRequestView />
                        }
                    ]
                }
            ]
        }
    ]
};

export default analystConfig;