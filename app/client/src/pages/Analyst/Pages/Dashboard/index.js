import Layout from "../../../../layouts";
import View from "./View";
import Header from "../../Components/Header"

import {useGetAnalystsQuery} from "../../../../services/userApi";
import {useGetProjectsQuery} from "../../../../services/projectApi";

const Dashboard = () => {

    const { data: analyst, isLoading:  analystIsLoading } = useGetAnalystsQuery();
    const { data: projectData, isLoading, isError } = useGetProjectsQuery();

    return (
        <Layout
            loading={ analystIsLoading || isLoading }
            header={{
                content: <Header />
            }}
            content={ <View analyst={ analyst } projectData={ projectData } /> }
        />
    );

}

export default Dashboard;