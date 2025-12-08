import Layout from "../SalesLayout";
import {Outlet} from "react-router-dom";

const Pages = () => {

    return (
        <Layout>
            <Outlet />
        </Layout>
    );

}

export default Pages;