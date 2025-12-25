import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCreateProjectByIdQuery } from "../../../../../../../services/projectApi";
import { useGetChapterByIdQuery } from "../../../../../../../services/taskApi";
import Details from "./Details";
import TaskFieldForm from "./TaskFieldForm";

const TaskView = () => {
    const { id: projectId, taskId } = useParams();

    const [task, setTask] = useState(null);
    const [loadingTask, setLoadingTask] = useState(true);

    // ✅ Project (RTK OK)
    const { data: projectData } = useGetCreateProjectByIdQuery(projectId, {
        skip: !projectId
    });

    // ✅ Fetch TASK manually (NO RTK)
    useEffect(() => {
        if (!taskId) return;

        const fetchTask = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/task/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                const json = await res.json();
                setTask(json.data);
            } catch (e) {
                console.error("Task fetch failed", e);
            } finally {
                setLoadingTask(false);
            }
        };

        fetchTask();
    }, [taskId]);

    // ✅ Chapter (RTK OK)
    const chapterId = task?.chapterId;
    const { data: chapterData } = useGetChapterByIdQuery(chapterId, {
        skip: !chapterId
    });

    if (loadingTask) return <p>Loading task...</p>;

    return (
        <div>
            <Details
                project={projectData?.data}
                chapter={chapterData?.data}
                task={task}
                setTask={setTask}   // 👈 important
            />

            <TaskFieldForm taskId={taskId} />
        </div>
    );
};

export default TaskView;
