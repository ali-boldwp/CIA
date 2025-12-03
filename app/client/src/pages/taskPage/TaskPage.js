// src/pages/TaskPage/TaskPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {

    useCreateChapterMutation,
    useGetTasksByChapterIdQuery, useGetCreateProjectByIdQuery, useGetChapterByIdQuery,
} from "../../services/projectApi";
import "./TaskPage.css";

import ChapterCreation from "./components/ChapterCreation";


const TaskPage = () => {
    const { id: projectId } = useParams();

    const {data:chapter}=useGetChapterByIdQuery(projectId, {
        skip: !projectId,
    });
    const chapterData=chapter?.data || [];

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
    const allTasks = [
        { number: "1.", title: "Profil general", bold: true, checked: true, status: "Auto", statusClass: "auto", analyst: "AP - 0h45m", analystColor: "analyst-blue" },

        { number: "1.1.", title: "Informatii generale", checked: true, status: "Done", statusClass: "done", analyst: "BI - 1h30m", analystColor: "analyst-purple" },

        { number: "1.2.", title: "Studii", checked: true, status: "Done", statusClass: "done", analyst: "CM - 0h20m", analystColor: "analyst-green" },

        { number: "1.3.", title: "Experienta profesionala", checked: false, status: "In progress", statusClass: "progress", analyst: "AP - 0h00m", analystColor: "analyst-blue" },

        { number: "2.", title: "Relatii de familie", checked: false, status: "Assigned", statusClass: "assigned", analyst: "BI - 0h00m", analystColor: "analyst-purple" },

        { number: "3.", title: "Afaceri si structuri de proprietate", bold: true, checked: false, status: "Auto", statusClass: "auto", analyst: "CM - 0h00m", analystColor: "analyst-green" },

        { number: "3.1.", title: "Implicarea in afaceri", checked: false, status: "Assigned", statusClass: "assigned", analyst: "CM - 0h00m", analystColor: "analyst-green" },

        { number: "3.2.", title: "Bunuri si proprietati", checked: false, status: "Assigned", statusClass: "assigned", analyst: "CM - 0h00m", analystColor: "analyst-green" },

        { number: "3.3.", title: "Datorii, credite si insolvilabilitate personala", checked: false, status: "Assigned", statusClass: "assigned", analyst: "CM - 0h00m", analystColor: "analyst-green" },

        { number: "5.", title: "Proprietate intelectuala / Marci OSIM", checked: true, status: "Done", statusClass: "done", analyst: "BI - 0h00m", analystColor: "analyst-purple" },
    ];
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
                    <div className="edit-row">
                        <span className="edit-label">Mod editare:</span>
                        <div className="toggle-switch">
                            <span className="toggle-on">ON</span>
                            <span className="toggle-off">OFF</span>
                        </div>
                    </div>

                    <div className="time-box">

                        <p className="time-title">REZUMAT TIMP LUCRU</p>

                        <p className="time-info">
                            Timp total lucrat: <strong>3h 05m</strong> · Estimare ramas: <strong>2h 15m</strong>
                        </p>

                        <p className="analyst-times">
                            AP - 1h35m | BI - 1h30m | CM - 0h20m | DR - 0h00m
                        </p>

                    </div>


                </div>

            </div>


            <div className="legend-actions-wrapper">

                {/* LEFT SIDE — LEGEND */}
                <div className="legend-box">
                    <p className="legend-title">LEGEND ANALISTI</p>

                    <div className="legend-grid">
                        <div className="firstButton">
                        <div className="legend-item">
                            <span className="doted blue"></span>
                            <span className="legend-text">AP - Alina Popescu (Responsabil)</span>
                        </div>

                        <div className="legend-item">
                            <span className="doted purple"></span>
                            <span className="legend-text">BI - Bica Iulia</span>
                        </div>
                        </div>
                        <div className="secButton">
                        <div className="legend-item">
                            <span className="doted green"></span>
                            <span className="legend-text">CM - Craciun Marian</span>
                        </div>

                        <div className="legend-item">
                            <span className="doted red"></span>
                            <span className="legend-text">DR - Dica Raluca</span>
                        </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — ACTION BUTTONS */}
                <div className="actions-box">

                    <button className="btn save">Salveaza progres</button>

                    <button className="btn notes">Cauta in Notes App</button>

                    <div className="humint-wrapper">
                        <button className="btn humint">Solicita HUMINT</button>
                        <span className="approval-badge">necesită aprobare</span>
                    </div>

                    <div className="export-dropdown">
                        <button className="btn export">Exporta raport ▾</button>

                        <div className="dropdown-menu">
                            <button className="dropdown-item">Export Word</button>
                            <button className="dropdown-item">Export PDF</button>
                        </div>
                    </div>

                </div>

            </div>

            {chapterData?.length > 0 &&
                chapterData.map((item) => (


            <div className="chapter-wrapper">


                <div className="chapter-title-row">
                    <span className="chapter-label">CAPITOL 1</span>
                    <br/>
                    <div className="chapter-name">
                        {item.name}
                        <button className="edit-title-btn">Edit titlu</button>
                    </div>

                </div>

                {/* Table Header */}
                <div className="task-table-header">
                    <span>#</span>
                    <span>Descriere task</span>
                    <span>Status</span>
                    <span>Analist / timp</span>
                    <span>Acțiuni</span>
                </div>

                {/* Tasks */}
                {allTasks.map((task, i) => (
                    <div className="task-row" key={i}>

                        {/* Number */}
                        <div className="col number">{task.number}</div>

                        {/* Task Name */}
                        <div className="col description">
                            <input type="checkbox" defaultChecked={task.checked} />
                            <span className={task.bold ? "bold" : ""}>{task.title}</span>
                        </div>

                        {/* Status */}
                        <div className="col status">
                            <span className={`status-pill ${task.statusClass}`}>{task.status}</span>
                        </div>

                        {/* Analyst */}
                        <div className="col analyst">
            <span className={`analyst-pill ${task.analystColor}`}>
              {task.analyst}
            </span>
                        </div>

                        {/* Actions */}
                        <div className="col actions">
                            <FiEdit2 className="icon edit" />
                            <FiTrash2 className="icon delete" />
                        </div>

                    </div>
                ))}

                {/* Add new task */}
                <div className="add-row">
                    <button className="add-btn">+ Adauga punct nou in acest capitol</button>
                </div>
            </div>
            ))}



            <ChapterCreation projectId={projectId} createChapter={createChapter} />

        </div>
    );
};

export default TaskPage;
