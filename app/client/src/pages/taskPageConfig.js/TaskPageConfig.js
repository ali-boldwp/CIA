import TaskPage from "./TaskPage";

const TaskPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/task-page',
            element: <TaskPage />
        }
    ]
};

export default TaskPageConfig;