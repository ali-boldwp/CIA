import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Details from './Details';
import TaskFieldForm from "./TaskFieldForm";

const TaskView = () => {
    const { id: projectId, taskId } = useParams();


    const [formValues, setFormValues] = useState({});

    return (
        <div>
            <Details
                projectId={projectId}
                taskId={taskId}
                formValues={formValues}
            />

            <TaskFieldForm
                taskId={taskId}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        </div>
    );
};

export default TaskView;
