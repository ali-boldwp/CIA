import Messenger from "./Messenger"

const ProjectDetailConfig = {
    settings: {
        layout: {
            config: {}
        }
    },


    routes: [
        {
            path: '/messenger',
            element: <Messenger />
        },
        {
            path: '/messenger/:ID',
            element: <Messenger />
        }
    ]
};

export default ProjectDetailConfig;