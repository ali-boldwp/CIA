// src/pages/TaskPage/TaskPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    useGetProjectRequestByIdQuery,
    useCreateChapterMutation,
    useGetTasksByChapterIdQuery,
} from "../../services/projectApi";
import "./TaskPage.css";
import TaskTable from "./components/TaskTable";
import ChapterCreation from "./components/ChapterCreation";
import TaskCreation from "./components/TaskCreation";

const TaskPage = () => {
    const { id: projectId } = useParams();

    // Fetch project info
    const { data: projectData, isLoading, isError } = useGetProjectRequestByIdQuery(projectId);
    const project = projectData?.data;

    const [createChapter] = useCreateChapterMutation();

    // Hardcoded Chapter ID
    const hardcodedChapterId = "69303f67c161bd9b5bac8d7d";

    // Tasks
    const { data: taskData } = useGetTasksByChapterIdQuery(hardcodedChapterId);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (taskData?.data) {
            setTasks(
                taskData.data.map((t) => ({
                    id: t._id,
                    title: t.name,
                    status: t.completed ? "Completed" : "Assigned",
                    checked: t.completed,
                }))
            );
        }
    }, [taskData]);

    if (!projectId) return <p>No project selected.</p>;
    if (isLoading) return <p>Loading project data...</p>;
    if (isError) return <p>Error fetching project data!</p>;

    return (
        <div className="task-container">
                <div className="task-header flex-between">
                    <div className="flex-column text-white">
                        <button className="task-btn italic">TASK INDIVIDUAL</button>
                        <p className="fs-24 semibold m-10">Project: {project?.projectName || "N/A"}</p>
                    </div>

                    <div className="header-right flex-column text-white">
                        <button className="task-btn text-gray">
                            Responsible Analyst: {project?.responsibleAnalyst?.name || "N/A"}
                        </button>
                        <p className="fs-14 m-10 min-w-300 text-center">
                            Other Analysts:{" "}
                            {project?.assignedAnalysts?.length > 0
                                ? project.assignedAnalysts.map((a) => a.name[0].toUpperCase()).join(", ")
                                : "N/A"}
                        </p>
                    </div>

            </div>

            <TaskTable tasks={tasks} setTasks={setTasks} />
            <ChapterCreation projectId={projectId} createChapter={createChapter} />
            <TaskCreation chapterId={hardcodedChapterId} addTaskToState={(task) => setTasks((prev) => [...prev, task])} />
        </div>
    );
};

export default TaskPage;
