import "./TaskPage.css"

import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    useCreateChapterMutation,
    useCreateTaskMutation,
    useGetChapterByIdQuery,
    useGetCreateProjectByIdQuery,
    useStartTaskMutation,
    usePauseTaskMutation,
    useResumeTaskMutation,
    useCompleteTaskMutation,
    useGetAnalystsProgressQuery,
} from "../../../../../services/projectApi";
import {toast} from "react-toastify";
import {FiEdit2, FiTrash2} from "react-icons/fi";
import ChapterCreation from "../../../../taskPage/components/ChapterCreation";
import ReviewPopUp from "./Popup/ReviewPop/ReviewPopUp";
import EditingPopUp from "./Popup/EditingPopUp/EditingPopUp";



const ProjectTasks = () => {

    const { id: projectId } = useParams();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [activeChapterId, setActiveChapterId] = useState(null);

    const [tasksByChapter, setTasksByChapter] = useState({});
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [showEditingPopup, setShowEditingPopup] = useState(false);

    const [startTask] = useStartTaskMutation();
    const [pauseTask] = usePauseTaskMutation();
    const [resumeTask] = useResumeTaskMutation();
    const [completeTask] = useCompleteTaskMutation();

    const { data: analystsProgress } = useGetAnalystsProgressQuery();
    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();

    const {data:chapter}=useGetChapterByIdQuery(projectId, {
        skip: !projectId,
    });
    const chapterData=chapter?.data || [];


    const legendColors = ["blue", "purple", "green", "red", "yellow", "pink"];

    // Fetch project info


    const { data: projectData, isLoading, isError } = useGetCreateProjectByIdQuery(projectId);
    const project = projectData?.data;

    const [createChapter] = useCreateChapterMutation();


    const analystId = project?.responsibleAnalyst?._id;
    const current = analystsProgress?.data?.find(
        (a) => a.analystId === analystId
    );
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


    const responsible = project?.responsibleAnalyst;
    const assigned = project?.assignedAnalysts || [];


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
            toast("Task adăugat cu succes!");
        } catch (error) {
            toast.error("Eroare la adăugarea taskului!");
        }
    };
    const navigate=useNavigate();

    const goBack = () => {
        navigate("/");
    };

    const handleStart = async (taskId, chapterId) => {
        try {
            const res = await startTask(taskId).unwrap();

            // UI update — analyst assign hua
            setTasksByChapter((prev) => ({
                ...prev,
                [chapterId]: prev[chapterId].map(t =>
                    t._id === taskId ? { ...t, analyst: res.task.analyst } : t
                )
            }));

            toast.success("Task started!");
        } catch (error) {
            toast.error("Failed to start task");
        }
    };

    const handlePause = async (taskId, chapterId) => {
        try {
            const res = await pauseTask(taskId).unwrap();

            setTasksByChapter(prev => ({
                ...prev,
                [chapterId]: prev[chapterId].map(t =>
                    t._id === taskId
                        ? { ...t, isPaused: true, lastStartTimestamp: undefined }
                        : t
                )
            }));

            toast("Task paused");
        } catch (e) {
            toast.error("Pause failed");
        }
    };

    const handleResume = async (taskId, chapterId) => {
        try {
            const res = await resumeTask(taskId).unwrap();

            setTasksByChapter(prev => ({
                ...prev,
                [chapterId]: prev[chapterId].map(t =>
                    t._id === taskId
                        ? { ...t, isPaused: false, lastStartTimestamp: Date.now() }
                        : t
                )
            }));

            toast("Task resumed");
        } catch (e) {
            toast.error("Resume failed");
        }
    };

    const handleComplete = async (taskId, chapterId) => {
        try {
            const res = await completeTask(taskId).unwrap();

            setTasksByChapter(prev => ({
                ...prev,
                [chapterId]: prev[chapterId].map(t =>
                    t._id === taskId
                        ? { ...t, completed: true, isPaused: false, lastStartTimestamp: undefined }
                        : t
                )
            }));

            toast.success("Task completed!");
        } catch (e) {
            toast.error("Complete failed");
        }
    };

    const progress = current?.progress || 0;
    const totalTasks = current?.totalTasks || 0;
    const completedTasks = current?.completedTasks || 0;

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h00m";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);

        return `${h}h ${m.toString().padStart(2, "0")}m`;
    };

    const getInitials = (name) => {
        if (!name) return "";

        const parts = name.trim().split(" ");

        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[parts.length - 1]?.charAt(0).toUpperCase() || "";

        return first + last;  // AP, BI, CM etc.
    };

    let totalWorkedSeconds = 0;
    let analystWorkMap = {};

    chapterData.forEach(ch => {
        const chapterTasks = tasksByChapter[ch._id] || [];

        chapterTasks.forEach(task => {
            totalWorkedSeconds += task.totalSeconds || 0;

            if (task.analyst?._id) {
                const id = task.analyst._id.toString();

                if (!analystWorkMap[id]) analystWorkMap[id] = 0;

                analystWorkMap[id] += task.totalSeconds || 0;
            }
        });
    });

    const allTasks = Object.values(tasksByChapter).flat();

    const analystTimes = Object.entries(analystWorkMap)
        .map(([analystId, sec]) => {
            const taskAnalyst = allTasks.find(
                t => t.analyst?._id?.toString() === analystId
            )?.analyst;

            if (!taskAnalyst) return null;

            return `${getInitials(taskAnalyst.name)} - ${formatTime(sec)}`;
        })
        .filter(Boolean);


    const getStatus = (task) => {
        if (task.completed) return "done";
        if (task.analyst) return "inprogress";
        return "unassigned";
    };



    if (!projectId) return <p>No project selected.</p>;
    if (isLoading) return <p>Loading project data...</p>;
    if (isError) return <p>Error fetching project data!</p>;

    return (
        <div className="task-container">
            <button className="backBtnHumint" onClick={goBack}>
                <span className="backBtnIconHumint">⟵</span>
                Înapoi la Dashboard
            </button>
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
                            <button className="btn finalize">✔ Finalizează</button>
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    <div className="overview-box">
                        <p className="label">OVERVIEW PROJECT</p>
                        <p className="progress-title">Progres general</p>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="progress-info">
                            {completedTasks} / {totalTasks} taskuri finalizate ({progress}%)
                        </p>
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
                            Timp total lucrat:
                            <strong> {formatTime(totalWorkedSeconds)} </strong>
                            · Estimare ramas:
                            <strong> 00h 00m</strong>
                        </p>

                        <p className="analyst-times">
                            {analystTimes.length ? analystTimes.join(" | ") : "-"}
                        </p>


                    </div>
                </div>


            </div>


            <div className="legend-actions-wrapper">

                {/* LEFT SIDE — LEGEND */}
                <div className="legend-box">
                    <p className="legend-title">LEGEND ANALISTI</p>

                    <div className="legend-grid">

                        {/* Responsible Analyst First */}
                        <div className="firstButton">
                            {responsible && (
                                <div className="legend-item">
                                    <span className="doted blue"></span>
                                    <span className="legend-text">
                        {getInitials(responsible.name)} - {responsible.name}
                                        (Responsabil)
                    </span>
                                </div>
                            )}
                        </div>

                        {/* Assigned Analysts */}

                            {assigned.length > 0 ? (
                                assigned.map((a, i) => (
                                    <div className="legend-item" key={a._id}>
                                        <span className={`doted ${legendColors[i + 1] || "green"}`}></span>

                                        <span className="legend-text">
                            {getInitials(a.name)} - {a.name}

                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="fs-12 text-gray">Niciun analist asignat</p>
                            )}


                    </div>
                </div>


                {/* RIGHT SIDE — ACTION BUTTONS */}
                <div className="actions-box">

                    <button
                        className="project-btn save"
                        onClick={() => setShowEditingPopup(true)}
                    >
                        Salveaza progres
                    </button>


                    <button
                        className="project-btn"
                        onClick={() => setShowReviewPopup(true)}
                    >
                        Cauta in Notes App
                    </button>


                    <div className="humint-wrapper">
                        <span className="approval-badge">necesită aprobare</span>

                        <Link to={`/humintRequest-Page/${projectId}`} className="project-btn">Solicita HUMINT</Link>
                    </div>

                    <div className="export-dropdown">
                        <button className="project-btn">Exporta raport ▾</button>

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
                            <div className="task-row new-task-row" key={task._id}>

                                {/* # Number */}
                                <div className="col col-number">{i + 1}.</div>

                                {/* Checkbox + Title */}
                                <div className="col col-title">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        disabled={task.completed}
                                        onChange={() => {}}
                                    />

                                    <span className="task-text">
        {task.name}
    </span>
                                </div>


                                {/* Status Pill */}
                                <div className="col col-status">
                                <span className={`status-pill ${getStatus(task)}`}>
                                    {getStatus(task).toUpperCase()}
                                </span>

                                </div>

                                {/* Analyst + Time */}
                                <div className="col col-analyst">
                                    <div className="col-analyst2">
                                    <span className="analyst-dot" />

                                        <span className="analyst-label">
                                            {getInitials(task.analyst?.name)} • {formatTime(task.totalSeconds)}

                                        </span>

                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col col-actions">

                                    {/* 🔥 If task is completed → hide ALL buttons */}
                                    {task.completed ? (
                                        <>
                                           <span className="btnActionBoth">
                                            <FiEdit2 className="icon edit" />
                                            <FiTrash2 className="icon delete" />
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {/* No analyst = START button */}
                                            {!task.analyst ? (
                                                <button className="btn start"
                                                        onClick={() => handleStart(task._id, item._id)}>
                                                    Start
                                                </button>
                                            ) : (
                                                <>
                                                    {/* If paused → show Resume */}
                                                    {task.isPaused ? (
                                                        <button className="btn start"
                                                                onClick={() => handleResume(task._id, item._id)}>
                                                            Resume
                                                        </button>
                                                    ) : (
                                                        /* If running → show Pause */
                                                        <button className="btn stop"
                                                                onClick={() => handlePause(task._id, item._id)}>
                                                            Pause
                                                        </button>
                                                    )}

                                                    {/* DONE button show only if not completed */}
                                                    <button className="btn done"
                                                            onClick={() => handleComplete(task._id, item._id)}>
                                                        Done
                                                    </button>
                                                </>
                                            )}
                                            <span className="btnActionBoth">
                                            <FiEdit2 className="icon edit" />
                                            <FiTrash2 className="icon delete" />
                                            </span>
                                        </>
                                    )}

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


            {showReviewPopup && (
                <ReviewPopUp onClose={() => setShowReviewPopup(false)} />
            )}

            {showEditingPopup && (
                <EditingPopUp onClose={() => setShowEditingPopup(false)} />
            )}

            <ChapterCreation projectId={projectId} createChapter={createChapter} />

        </div>
    );

}

export default ProjectTasks;