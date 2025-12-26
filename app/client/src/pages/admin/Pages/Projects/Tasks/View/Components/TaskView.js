import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useGetTaskQuery } from "../../../../../../../services/taskApi";
import Details from './Details';
import TaskFieldForm from "./TaskFieldForm";

const TaskView = () => {
    const { id: projectId, taskId } = useParams();

    const { data: taskData } = useGetTaskQuery(taskId, {
        skip: !taskId
    });
    const task = taskData?.data;
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
                taskData={task?.data}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        </div>
    );
};

export default TaskView;
