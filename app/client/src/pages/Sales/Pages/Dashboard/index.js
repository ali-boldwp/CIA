import Layout from "../../../../layouts"
import View from "./View";
import { useGetProjectsQuery,useGetAllRequestedProjectsQuery } from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/userApi";

import Header from "../../Components/Header"

const Dashboard = () => {

    const { data: approve, isLoading } = useGetProjectsQuery();
    const { data: analystsData, isLoading: analystsLoading } = useGetAnalystsQuery();
    const { data:requested } = useGetAllRequestedProjectsQuery();

    return (
        <Layout
            loading={ isLoading || analystsLoading }
            header={{
                content: <Header />
            }}
            content={ <View approve={ approve } analystsData={ analystsData } requested={requested} /> }
        />
    )

}

export default  Dashboard;