import Admin from "./Admin"

import View from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import ProjectsList from "./Pages/Projects/List";
import ProjectSearch from "./Pages/Projects/Search";
import NewProject from "./Pages/Projects/New";
import CreateProject from "./Pages/Projects/New/Create"
import ProjectRequestList from "./Pages/Projects/Request/List";
import ProjectView from "./Pages/Projects/View";
import ProjectTasks from "./Pages/Projects/Tasks";
import ProjectCost from "./Pages/Projects/Cost";
import Hument from "./Pages/Humint";
import HumentNew from "./Pages/Humint/New";
import HumentRequest from "./Pages/Humint/Request";
import Humints from "./Pages/Humint/List";
import HumentRequestView from "./Pages/Humint/View";
import RequestProject from "./Pages/Projects/Request/New";
import Users from "./Pages/Users";
import UsersList from "./Pages/Users/List";
import Categories from "./Pages/Categories";
import CategoriesList from "./Pages/Categories/List";
import CategoryView from "./Pages/Categories/View";
import Profile from "./Pages/Profile";
import FoamFields from "./Pages/Categories/Task/Components";
import NewChapter from "./Pages/Categories/Chapter/main";

const AdminConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: ['admin', 'manager'],
    routes: [
        {
            path: "/",
            element: <Admin/>,
            children: [
                {
                    index: true,
                    element: <View/>
                },
                {
                    path: 'profile',
                    element: <Profile/>
                },
                {
                    path: 'project',
                    element: <Projects/>,
                    children: [
                        {
                            index: true,
                            element: <ProjectsList/>
                        },
                        {
                            path: 'search/:keyword',
                            element: <ProjectSearch/>
                        },
                        {
                            path: 'all',
                            element: <ProjectsList/>
                        },
                        {
                            path: 'view/:id',
                            element: <ProjectView/>
                        },
                        {
                            path: 'view/:id/tasks',
                            element: <ProjectTasks/>
                        },
                        {
                            path: 'view/:id/cost',
                            element: <ProjectCost/>
                        },
                        {
                            path: 'new',
                            element: <NewProject/>,
                            children: [
                                {
                                    index: true,
                                    element: <CreateProject/>
                                },
                                {
                                    path: ':id',
                                    element: <CreateProject/>
                                }
                            ]
                        },
                        {
                            path: 'request',
                            element: <NewProject/>,
                            children: [
                                {
                                    index: true,
                                    element: <ProjectRequestList/>
                                },
                                {
                                    path: 'new',
                                    element: <RequestProject/>
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'humint',
                    element: <Hument/>,
                    children: [
                        {
                            index: true,
                            element: <Humints/>
                        },
                        {
                            path: 'new',
                            element: <HumentNew/>
                        },
                        {
                            path: 'new/:id',
                            element: <HumentRequest/>
                        },
                        {
                            path: 'request/:id',
                            element: <HumentRequestView/>
                        }
                    ]
                },
                {
                    path: 'users',
                    element: <Users/>,
                    children: [
                        {
                            index: true,
                            element: <UsersList/>
                        }
                    ]
                },
                {
                    path: 'categories',
                    element: <Categories/>,
                    children: [
                        {
                            index: true,
                            element: <CategoriesList/>,
                        },
                        {
                            path: 'view/:id',
                            element: <CategoryView/>,
                        },
                        {
                            path: 'view/:id',
                            element: <CategoryView/>,
                        },
                        {
                            path: 'chapter/task',
                            element: <FoamFields/>,
                            path: 'chapter',
                            element: <NewChapter/>,
                        }
                    ]
                },
            ]
        }
    ]
};

export default AdminConfig;