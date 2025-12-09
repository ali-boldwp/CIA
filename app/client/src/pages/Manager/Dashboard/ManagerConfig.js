import ManagerDashboard from "./";

const  ManagerConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin' , 'manager' ],
    routes: [
        {
            path: '/',
            element:  <ManagerDashboard/>
        }
    ]
};

export default  ManagerConfig;