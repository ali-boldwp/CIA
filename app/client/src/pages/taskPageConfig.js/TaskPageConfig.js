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
            path: '/project/:id/tasks',
            element: <TaskPage />
        }
    ]
};

export default TaskPageConfig;