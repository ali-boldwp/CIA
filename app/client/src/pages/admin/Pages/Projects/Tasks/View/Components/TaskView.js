import React from 'react';
import {useParams} from "react-router-dom";
import Details from './Details'

const TaskView = () => {
    const {id:projectId}=useParams();
    const {taskId}=useParams()
    return (
        <div>
        <Details projectId={projectId} taskId={taskId} />
        </div>
    );
};

export default TaskView;