import React from "react";
import {toast} from "react-toastify";
import { useGetCreateProjectByIdQuery } from "../../../../../../../services/projectApi";
import {
    useGetTaskQuery,
    useGetChapterByIdQuery,useUpdateTaskDataMutation, useStartTaskMutation, usePauseTaskMutation, useResumeTaskMutation, useCompleteTaskMutation
} from "../../../../../../../services/taskApi";
import "./Detail.css";

const Details = ({ projectId, taskId, formValues }) => {

    const { data: projectData } = useGetCreateProjectByIdQuery(projectId, {
        skip: !projectId
    });

    const { data: taskData,refetch } = useGetTaskQuery(taskId, {
        skip: !taskId
    });

    const task = taskData?.data;
    console.log(task)

    const chapterName = task?.chapterId?.name;

    const [startTask, { isLoading: isStarting }] = useStartTaskMutation();
    const [pauseTask, { isLoading: isPausing }] = usePauseTaskMutation();
    const [resumeTask, { isLoading: isResuming }] = useResumeTaskMutation();
    const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();
    const [updateTaskData, { isLoading: isSavingData }] = useUpdateTaskDataMutation();

    const isAnyLoading =
        isStarting ||
        isPausing ||
        isResuming ||
        isCompleting ||
        isSavingData;


    const project = projectData?.data;

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h 0m";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);

        return `${h}h ${m}m`;
    };



    const handleStart = async () => {
        try {
            await startTask(taskId).unwrap();
            toast.success("Task pornit");
            refetch();
        } catch {
            toast.error("Pornirea a eșuat");
        }
    };

    const handlePause = async () => {
        try {
            await pauseTask(taskId).unwrap();
            toast.success("Task pus pe pauză");
            refetch();
        } catch {
            toast.error("Pauza a eșuat");
        }
    };

    const handleResume = async () => {
        try {
            await resumeTask(taskId).unwrap();
            toast.success("Task reluat");
            refetch();
        } catch {
            toast.error("Reluarea a eșuat");
        }
    };

    const handleDone = async () => {
        const hasEmptyField = Object.values(formValues || {}).some(
            value => !value || value.toString().trim() === ""
        );

        if (hasEmptyField) {
            toast.error("Vă rugăm să completați toate câmpurile înainte de finalizarea task-ului");
            return;
        }

        try {
            // 1️⃣ Save form data
            await updateTaskData({
                id: taskId,
                data: formValues,
            }).unwrap();

            // 2️⃣ Complete task
            await completeTask(taskId).unwrap();

            // 🔥 IMPORTANT: refetch AFTER complete
            await refetch();

            toast.success("Task finalizat cu succes");
        } catch (err) {
            toast.error("A apărut o eroare");
        }
    };







    const isCompleted = task?.completed;
    const isPaused = task?.isPaused;
    const isStarted = !!task?.analyst; // analyst assign ho gaya = started

    console.log(isCompleted)
    console.log(isPaused)
    console.log(isStarted)

    return (
        <div className="details-wrapper">
            {/* LEFT INFO */}
            <div className="details-left">

                <p className="status-line">
                    <strong>Status proiect:</strong>{" "}
                    <span className="status-active">În derulare</span>
                </p>

                <div className="meta-info">
                    <p>
                        <strong>Proiect:</strong> {project?.projectName || "-"}
                    </p>
                    <p>
                        <strong>Capitol:</strong> {task?.chapterId?.name || "-"}
                    </p>
                    <p>
                        <strong>Task:</strong> {task?.name || "-"}
                    </p>
                </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div>
                <div className="task-actions2">

                    {/* 1️⃣ ONLY START (never started before) */}
                    {!isCompleted && !isStarted && (
                        <button
                            className={`btn start ${isStarting ? "loading" : ""}`}
                            onClick={handleStart}
                            disabled={isAnyLoading}
                        >
                            <span className="btn-spinner" />
                            <span className="btn-text">Start</span>
                        </button>

                    )}

                    {/* 2️⃣ STARTED + RUNNING */}
                    {!isCompleted && isStarted && !isPaused && (
                        <>
                            <button
                                className={`btn stop ${isPausing ? "loadingPause" : ""}`}
                                onClick={handlePause}
                                disabled={isAnyLoading}
                            >
                                {isPausing ? (
                                    <>
                                        <span className="btn-spinner" />
                                        <span className="btn-text">Pause...</span>
                                    </>
                                ) : (
                                    "Pause"
                                )}
                            </button>

                            <button
                                className={`btn done ${isSavingData || isCompleting ? "loading" : ""}`}
                                onClick={handleDone}
                                disabled={isAnyLoading}
                            >
                                <span className="btn-spinner" />
                                <span className="btn-text">Done</span>
                            </button>

                        </>
                    )}

                    {/* 3️⃣ STARTED + PAUSED */}
                    {!isCompleted && isStarted && isPaused && (
                        <>
                            <button
                                className={`btn start ${isResuming ? "loading" : ""}`}
                                onClick={handleResume}
                                disabled={isAnyLoading}
                            >
                                {isResuming ? (
                                    <>
                                        <span className="btn-spinner" />
                                        <span className="btn-text">Resume...</span>
                                    </>
                                ) : (
                                    "Resume"
                                )}
                            </button>

                            <button
                                className={`btn done ${isSavingData || isCompleting ? "loading" : ""}`}
                                onClick={handleDone}
                                disabled={isAnyLoading}
                            >
                                <span className="btn-spinner" />
                                <span className="btn-text">Done</span>
                            </button>
                        </>
                    )}

                </div>

                <div className="details-right">

                <p className="time-title">REZUMAT TIMP LUCRU</p>

                    <p className="time-info">
                        Timp total lucrat:
                        <strong> {formatTime(task?.totalSeconds)} </strong> ·
                        Estimare rămas:
                        <strong> 00h 00m</strong>
                    </p>


                </div>
            </div>
        </div>
    );
};

export default Details;
