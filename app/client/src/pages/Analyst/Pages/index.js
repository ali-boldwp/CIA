import Layout from "../AnalystLayout";
import {Outlet} from "react-router-dom";

const Pages = () => {

    return (
        <Layout>
            <Outlet />
        </Layout>
    );

}

export default Pages;