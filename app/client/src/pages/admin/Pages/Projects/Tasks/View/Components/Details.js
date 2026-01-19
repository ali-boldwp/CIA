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

    const [startTask] = useStartTaskMutation();
    const [pauseTask] = usePauseTaskMutation();
    const [resumeTask] = useResumeTaskMutation();
    const [updateTaskData] = useUpdateTaskDataMutation();
    const [completeTask] = useCompleteTaskMutation();

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
            // ✅ STEP 1: SAVE FORM DATA
            await updateTaskData({
                id: taskId,
                data: formValues,   // 🔥 YAHI FORM DATA JAYEGA
            }).unwrap();
            refetch();

            // ✅ STEP 2: COMPLETE TASK
            await completeTask(taskId).unwrap();

            toast.success("Task finalizat cu succes, iar datele au fost salvate");
        } catch (err) {
            toast.error("A apărut o eroare la trimiterea datelor");
        }
    };


    const handleSaveSection = async () => {
        try {
            // ✅ Only save formValues, do NOT complete task
            await updateTaskData({
                id: taskId,
                data: formValues,  // current section data
            }).unwrap();

            toast.success("Sectiunea salvata cu succes!");
            refetch(); // refresh task data if needed
        } catch (err) {
            toast.error("Eroare la salvarea sectiunii");
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
                        <button className="btn start" onClick={handleStart}>
                            Start
                        </button>
                    )}

                    {/* 2️⃣ STARTED + RUNNING */}
                    {!isCompleted && isStarted && !isPaused && (
                        <>
                            <button className="btn stop" onClick={handlePause}>
                                Pause
                            </button>

                            <button className="btn done" onClick={handleDone}>
                                Done
                            </button>
                        </>
                    )}

                    {/* 3️⃣ STARTED + PAUSED */}
                    {!isCompleted && isStarted && isPaused && (
                        <>
                            <button className="btn start" onClick={handleResume}>
                                Resume
                            </button>

                            <button className="btn done" onClick={handleDone}>
                                Done
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
