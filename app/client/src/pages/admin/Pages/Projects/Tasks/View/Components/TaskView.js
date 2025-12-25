import React from 'react';
import {useParams} from "react-router-dom";
import Details from './Details'
import TaskFieldForm from "./TaskFieldForm";

const TaskView = () => {
    const {id:projectId,taskId}=useParams();


    return (
        <div>
        <Details projectId={projectId} taskId={taskId} />
        <TaskFieldForm taskId={taskId} />
        </div>
    );
};

export default TaskView;