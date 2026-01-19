import Layout from "../../../../../../layouts"
import {useParams} from "react-router-dom";
import {useGetCreateProjectByIdQuery} from "../../../../../../services/projectApi";

import Header from "../../../../Components/Header";
import ProjectHeader from "../../../../../Components/Project/Components/HeaderTask"
import GeneralInformation from "./Components/Pages/societatea-abc/GeneralInformation";
import IstoricSocietate from "./Components/Pages/societatea-abc/IstoricSocietate";
import Details from "./Components/Details";
import ParteneriContractuali from "./Components/Pages/societatea-abc/ParteneriContractuali";
import DatoriiSiInscrieri from "./Components/Pages/societatea-abc/DatoriiSiInscrieri";
import AchizitiiSEAP from "./Components/Pages/societatea-abc/AchizitiiSEAP";
import ProprietateIntelectuala from "./Components/Pages/societatea-abc/ProprietateIntelectuala";
import LitigiiSocietate from "./Components/Pages/societatea-abc/LitigiiSocietate";
import ParticipatiiSocietate from "./Components/Pages/societatea-abc/ParticipatiiSocietate";
import Controversesi from "./Components/Pages/societatea-abc/Controversesi";
import DateFinanciare from "./Components/Pages/societatea-abc/DateFinanciare";
import {useGetTaskQuery} from "../../../../../../services/taskApi";
import {useEffect, useRef, useState} from "react";

const ViewTask = () => {

    const { id: projectId, taskId, taskName } = useParams();

    const { data: projectData, isLoading } =
        useGetCreateProjectByIdQuery(projectId)
    const { data: taskData } = useGetTaskQuery(taskId);
    const task = taskData?.data;
    const isStarted = !!task?.analyst;
    const taskComponents = {
        GeneralInformation,
        IstoricSocietate,
        DatoriiSiInscrieri,
        AchizitiiSEAP,
        ParteneriContractuali,
        ProprietateIntelectuala,
        LitigiiSocietate,
        ParticipatiiSocietate,
        Controversesi,
        DateFinanciare,
    };

    const [formValues, setFormValues] = useState({});
    const hasLoadedTaskData = useRef(false);

    const SelectedComponent = taskComponents[taskName];

    useEffect(() => {
        hasLoadedTaskData.current = false;
        setFormValues({});
    }, [taskId]);

    useEffect(() => {
        if (!task?.data || hasLoadedTaskData.current) return;

        setFormValues(task.data || {});
        hasLoadedTaskData.current = true;
    }, [task?.data]);

    return (
        <Layout
            loading={isLoading}
            header={{
                search: false,
                back: true,
                title: <ProjectHeader data={projectData} />,
                content: <Header />
            }}
            content={
                <>
                    {/* ✅ COMMON DETAILS (ALWAYS) */}
                    <Details
                        projectId={projectId}
                        taskId={taskId}
                        formValues={formValues}
                    />

                    {/* ✅ SLUG BASED PAGE */}
                    {  SelectedComponent && isStarted ? (
                        <SelectedComponent
                            taskId={taskId}
                            formValues={formValues}
                            setFormValues={setFormValues}
                        />
                    ) : null}
                </>
            }
        />
    );
};


export default ViewTask;
