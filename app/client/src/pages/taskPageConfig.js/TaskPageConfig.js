import TaskPage from "./TaskPage";

const TaskPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },

    routes: [
        {
            path: '/project/:id/tasks',
            element: <TaskPage />
        }
    ]
};

export default TaskPageConfig;