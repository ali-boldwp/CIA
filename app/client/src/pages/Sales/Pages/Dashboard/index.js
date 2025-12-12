import Layout from "../../../../layouts"
import View from "./View";
import {useGetProjectsQuery, useGetSalesRequestedProjectsQuery} from "../../../../services/projectApi";
import { useGetAnalystsQuery } from "../../../../services/analystApi";

const Dashboard = () => {

    const { data: approve, isLoading } = useGetProjectsQuery();
    const { data: analystsData, isLoading: analystsLoading } = useGetAnalystsQuery();
    const {
        data: requestedData,
        isLoading: requestedLoading
    } = useGetSalesRequestedProjectsQuery({ page: 1, limit: 50 });


    return (
        <Layout
            loading={ isLoading || analystsLoading }
            content={ <View approve={ approve } analystsData={ analystsData } requested={requestedData} /> }
        />
    )

}

export default  Dashboard;