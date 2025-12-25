import Layout from "../../../../../../layouts"
import {useParams} from "react-router-dom";
import {useGetCreateProjectByIdQuery} from "../../../../../../services/projectApi";

import TaskView from "./Components/TaskView";
import Header from "../../../../Components/Header";
import ProjectHeader from "../../../../../Components/Project/Components/HeaderTask"

const ViewTask = () => {

    const { id: projectId } = useParams();

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
                <TaskView/>
            }
        />
    );

}

export default ViewTask;