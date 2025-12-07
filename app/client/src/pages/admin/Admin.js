import Layout from "./AdminLayout";
import {Outlet} from "react-router-dom";

const Admin = () => {

    return (
        <Layout>
            <Outlet />
        </Layout>
    );

}

export default Admin;