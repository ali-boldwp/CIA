// src/pages/TaskPage/TaskPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {

    useCreateChapterMutation,
    useGetTasksByChapterIdQuery, useGetCreateProjectByIdQuery,
} from "../../services/projectApi";
import "./TaskPage.css";

import ChapterCreation from "./components/ChapterCreation";


const TaskPage = () => {
    const { id: projectId } = useParams();

    // Fetch project info
    const { data: projectData, isLoading, isError } = useGetCreateProjectByIdQuery(projectId);
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

            <div className="top-wrapper">

                {/* LEFT SIDE */}
                <div className="left-side">

                    <div className="control-box">
                        <p className="label">CONTROL PROJECT</p>
                        <p className="status-text">
                            Status proiect: <strong>În derulare</strong>
                        </p>

                        <div className="buttons-row">
                            <button className="btn start">▶ Start</button>
                            <button className="btn pause">⏸ Pauză</button>
                            <button className="btn finalize">✔ Finalizează</button>
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    <div className="overview-box">
                        <p className="label">OVERVIEW PROJECT</p>
                        <p className="progress-title">Progres general</p>

                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: "54%" }}></div>
                        </div>

                        <p className="progress-info">6 / 11 taskuri finalizate (54%)</p>
                    </div>

                </div>

                {/* RIGHT SIDE – TIME BOX */}
                <div className="right-side">
                    <div className="time-box">

                        <p className="time-title">REZUMAT TIMP LUCRU</p>

                        <p className="time-info">
                            Timp total lucrat: <strong>3h 05m</strong> · Estimare ramas: <strong>2h 15m</strong>
                        </p>

                        <p className="analyst-times">
                            AP - 1h35m | BI - 1h30m | CM - 0h20m | DR - 0h00m
                        </p>

                    </div>

                    <div className="edit-row">
                        <span className="edit-label">Mod editare:</span>
                        <div className="toggle-switch">
                            <span className="toggle-on">ON</span>
                            <span className="toggle-off">OFF</span>
                        </div>
                    </div>
                </div>

            </div>

            <ChapterCreation projectId={projectId} createChapter={createChapter} />

        </div>
    );
};

export default TaskPage;
