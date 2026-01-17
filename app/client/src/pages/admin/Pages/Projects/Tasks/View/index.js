import Layout from "../../../../../../layouts"
import {useParams} from "react-router-dom";
import {useGetCreateProjectByIdQuery} from "../../../../../../services/projectApi";

import TaskView from "./Components/TaskView";
import Header from "../../../../Components/Header";
import ProjectHeader from "../../../../../Components/Project/Components/HeaderTask"
import GeneralInformation from "./Components/Pages/societatea-abc/GeneralInformation";
import IstoricSocietate from "./Components/Pages/societatea-abc/IstoricSocietate";
import ParteneriContractuali from "./Components/Pages/societatea-abc/ParteneriContractuali";
import DatoriiSiInscrieri from "./Components/Pages/societatea-abc/DatoriiSiInscrieri";
import AchizitiiSEAP from "./Components/Pages/societatea-abc/AchizitiiSEAP";
import ProprietateIntelectuala from "./Components/Pages/societatea-abc/ProprietateIntelectuala";
import LitigiiSocietate from "./Components/Pages/societatea-abc/LitigiiSocietate";
import ParticipatiiSocietate from "./Components/Pages/societatea-abc/ParticipatiiSocietate";
import Controversesi from "./Components/Pages/societatea-abc/Controversesi";
import DateFinanciare from "./Components/Pages/societatea-abc/DateFinanciare";

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
                ):taskName === "DatoriiSiInscrieri" ?(
                     <DatoriiSiInscrieri/>
                ):taskName === "AchizitiiSEAP" ? (
                    <AchizitiiSEAP/>
                ):taskName === "ParteneriContractuali" ? (
                    <ParteneriContractuali/>
                ):taskName === "ProprietateIntelectuala" ? (
                    <ProprietateIntelectuala/>
                ):taskName === "LitigiiSocietate" ? (
                    <LitigiiSocietate/>
                ):taskName === "ParticipatiiSocietate" ? (
                    <ParticipatiiSocietate/>
                ):taskName === "Controversesi" ? (
                    <Controversesi/>
                ):taskName === "DateFinanciare" ? (
                    <DateFinanciare/>
                ):null




                // <TaskView/>

            }
        />
    );

}

export default ViewTask;