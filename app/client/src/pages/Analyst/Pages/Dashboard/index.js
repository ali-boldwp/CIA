import Layout from "../../../../layouts";
import View from "./View";
import Header from "../../Components/Header"

import {useGetAnalystsQuery} from "../../../../services/userApi";
import {
    useGetProjectsQuery,
    useGetAnalystsProjectProgressQuery,
} from "../../../../services/projectApi";
import { useGetAllHumintsQuery } from "../../../../services/humintApi";


const Dashboard = () => {

    const { data: analyst, isLoading:  analystIsLoading } = useGetAnalystsQuery();
    const { data: projectData, isLoading, isError } = useGetProjectsQuery();
    const { data: humintData, isHumintLoading, isHumintError } = useGetAllHumintsQuery();
    const { data: analystProgressBar } = useGetAnalystsProjectProgressQuery();


    return (
        <Layout
            loading={ analystIsLoading || isLoading }
            header={{
                content: <Header />
            }}
            content={ <View analyst={ analyst } projectData={ projectData } humintData = { humintData } analystProgressBar={analystProgressBar} /> }
        />
    );

}

export default Dashboard;