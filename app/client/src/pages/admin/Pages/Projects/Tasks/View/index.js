import Layout from "../../../../../../layouts"
import {useParams} from "react-router-dom";
import {useGetCreateProjectByIdQuery} from "../../../../../../services/projectApi";

import TaskView from "./Components/TaskView";
import Header from "../../../../Components/Header";
import ProjectHeader from "../../../../../Components/Project/Components/HeaderTask"
import GeneralInformation from "./Components/Pages/societatea-abc/GeneralInformation";
import IstoricSocietate from "./Components/Pages/societatea-abc/IstoricSocietate";
import ParteneriContractuali from "./Components/Pages/societatea-abc/ParteneriContractuali";

const ViewTask = () => {

    const { id: projectId ,taskName} = useParams();

    const { data: projectData, isLoading, isError } = useGetCreateProjectByIdQuery( projectId );
    console.log(projectData?.data)
    return (
        <Layout
            loading={ isLoading && isLoading }
            header={
                {
                    search: false,
                    back: true,
                    title: <ProjectHeader data={ projectData } />,
                    content: <Header />
                }
            }
            content={
                taskName === "GeneralInformation" ? (
                    <GeneralInformation />
                ) : taskName === "IstoricSocietate" ? (
                    <IstoricSocietate />
                ):taskName === "ParteneriContractuali" ? (
                    <ParteneriContractuali/>
                ) : null


                // <TaskView/>

            }
        />
    );

}

export default ViewTask;