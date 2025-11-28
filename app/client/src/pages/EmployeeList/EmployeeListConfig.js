import ManagerDashboard from "./";
import EmployeeList from "./";

const  EmployeeListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: [ 'admin', 'user' ],
    routes: [
        {
            path: '/employeeList',
            element:  <EmployeeList/>
        }
    ]
};

export default  EmployeeListConfig;