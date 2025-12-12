import Layout from "../../../../../layouts"
import {useParams} from "react-router-dom";
import {useGetCreateProjectByIdQuery} from "../../../../../services/projectApi";

import ProjectTasks from "./Tasks";
import Header from "../../../Components/Header";
import ProjectHeader from "../../../../Components/Project/Components/HeaderTask"

const Tasks = () => {

    const { id: projectId } = useParams();

    const { data: projectData, isLoading, isError } = useGetCreateProjectByIdQuery( projectId );

    return (
        <Layout
            loading={ isLoading && isLoading }
            header={
                {
                    search: false,
                    back: true,
                    title: <ProjectHeader data={ projectData } />,
                    content: <Header createProject={ false } />
                }
            }
            content={
                <ProjectTasks
                    projectData={ projectData }
                />
            }
        />
    );

}

export default Tasks;