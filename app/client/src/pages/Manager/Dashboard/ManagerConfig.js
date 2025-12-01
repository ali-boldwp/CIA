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
            path: '/manager/dashboard',
            element:  <ManagerDashboard/>
        }
    ]
};

export default  ManagerConfig;