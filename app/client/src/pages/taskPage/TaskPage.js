// src/pages/TaskPage/TaskPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {

    useCreateChapterMutation,
    useGetTasksByChapterIdQuery, useGetCreateProjectByIdQuery, useGetChapterByIdQuery, useCreateTaskMutation,
} from "../../services/projectApi";
import "./TaskPage.css";

import ChapterCreation from "./components/ChapterCreation";
import {toast} from "react-toastify";


const TaskPage = () => {
    const { id: projectId } = useParams();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [activeChapterId, setActiveChapterId] = useState(null);

    const [tasksByChapter, setTasksByChapter] = useState({});

    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();

    const {data:chapter}=useGetChapterByIdQuery(projectId, {
        skip: !projectId,
    });
    const chapterData=chapter?.data || [];

    // Fetch project info


    const { data: projectData, isLoading, isError } = useGetCreateProjectByIdQuery(projectId);
    const project = projectData?.data;

    const [createChapter] = useCreateChapterMutation();


    useEffect(() => {
        const fetchAll = async () => {
            let result = {};

            for (const ch of chapterData) {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/task/${ch._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const json = await res.json();

                result[ch._id] = json.data || [];
            }

            setTasksByChapter(result);
        };

        if (chapterData.length > 0) {
            fetchAll();
        }
    }, [chapterData]);


    const handleCreateTask = async (chapterId) => {
        if (!newTaskName.trim()) return;

        try {
            const response = await createTask({
                name: newTaskName,
                chapterId,
            }).unwrap();

            // Add task to UI immediately
            setTasksByChapter((prev) => ({
                ...prev,
                [chapterId]: [...(prev[chapterId] || []), response.data],
            }));

            // Close form
            setShowTaskForm(false);
            setNewTaskName("");
            toast.success("Task adăugat cu succes!");
        } catch (error) {
            toast.error("Eroare la adăugarea taskului!");
        }
    };




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
                chapterData.map((item,index) => (


            <div className="chapter-wrapper">


                <div className="chapter-title-row">
                    <span className="chapter-label">CAPITOL {index + 1}</span>
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
                {tasksByChapter[item._id]?.map((task, i) => (
                    <div  className={`task-row ${i % 2 === 0 ? "row-white" : "row-gray"}`} key={i}>

                        {/* Number */}
                        <div className="col number">{i+1}</div>

                        {/* Task Name */}
                        <div className="col description">
                            <input type="checkbox" defaultChecked={task.completed} />
                            <span className={task.bold ? "bold" : ""}>{task.name}</span>
                        </div>

                        {/* Status */}
                        <div className="col status">
                            <span className={`status-pill ${task.completed ? "done" : "assigned"}`}>
                {task.completed ? "Done" : "Assigned"}
            </span>
                        </div>

                        {/* Analyst */}
                        <div className="col analyst">
            <span className={`analyst-pill ${task.analystColor}`}>
              {task.assignedAnalyst?.name || "Unassigned"}
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
                    <button
                        className="add-btn"
                        onClick={() => {
                            setActiveChapterId(item._id);
                            setShowTaskForm(true);
                        }}
                    >
                        + Adauga punct nou in acest capitol
                    </button>
                </div>
            </div>
            ))}
            {/* BOTTOM TASK FORM */}
            {showTaskForm && (
                <div className="task-form-container">
                    <div className="task-form">
                        <h3>Adauga Task Nou</h3>

                        <input
                            type="text"
                            className="task-input"
                            placeholder="Introdu numele taskului"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />

                        <div className="task-form-buttons">
                            <button
                                className="task-cancel-btn"
                                onClick={() => {
                                    setShowTaskForm(false);
                                    setNewTaskName("");
                                }}
                            >
                                Anuleaza
                            </button>

                            <button
                                className="task-submit-btn"
                                onClick={() => handleCreateTask(activeChapterId)}
                            >
                                Adauga
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <ChapterCreation projectId={projectId} createChapter={createChapter} />

        </div>
    );
};

export default TaskPage;
