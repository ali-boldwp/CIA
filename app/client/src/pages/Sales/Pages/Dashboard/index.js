import Layout from "../../../../layouts"
import View from "./View";
import { useGetProjectsQuery } from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/analystApi";

const Dashboard = () => {

    const { data: approve, isLoading } = useGetProjectsQuery();
    const { data: analystsData, isLoading: analystsLoading } = useGetAnalystsQuery();


    return (
        <Layout
            loading={ isLoading || analystsLoading }
            content={ <View approve={ approve } analystsData={ analystsData } /> }
        />
    )

}

export default  Dashboard;