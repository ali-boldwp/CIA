import TaskPage from "./TaskPage";

const TaskPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'user' , 'manager'  ],

    routes: [
        {
            path: '/task-page',
            element: <TaskPage />
        }
    ]
};

export default TaskPageConfig;