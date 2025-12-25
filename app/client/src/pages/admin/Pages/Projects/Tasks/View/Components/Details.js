import React from 'react';
import { useGetCreateProjectByIdQuery } from "../../../../../../../services/projectApi";
import {useGetTaskByIdQuery,useGetChapterByIdQuery} from "../../../../../../../services/taskApi";

const Details = ({projectId, taskId}) => {
    const { data:projectData}=useGetCreateProjectByIdQuery(projectId,{
        skip:!projectId
    })
    const { data:taskData } = useGetTaskByIdQuery(taskId,{
        skip:!taskId
    })
    const task=taskData?.data || [];
    const chapterID=task.chapterId;
    const { data:chapterData }=useGetChapterByIdQuery(chapterID,{
        skip:!chapterID
    })
    const project=projectData?.data || [];
    return (
        <>
        <div>
            project : {project.projectName}
        </div>
            <div>
                task : {task.name}
            </div>
        </>
    );
};

export default Details;