import React from "react";
import {toast} from "react-toastify";
import { useGetCreateProjectByIdQuery } from "../../../../../../../services/projectApi";
import {
    useGetTaskByIdQuery,
    useGetChapterByIdQuery, useStartTaskMutation, usePauseTaskMutation, useResumeTaskMutation, useCompleteTaskMutation
} from "../../../../../../../services/taskApi";
import "./Detail.css";

const Details = ({ projectId, taskId }) => {
    const { data: projectData } = useGetCreateProjectByIdQuery(projectId, {
        skip: !projectId
    });

    const { data: taskData } = useGetTaskByIdQuery(taskId, {
        skip: !taskId
    });

    const task = taskData?.data;
    console.log(task)
    const chapterId = task?.chapterId;

    const { data: chapterData } = useGetChapterByIdQuery(chapterId, {
        skip: !chapterId
    });
    const [startTask] = useStartTaskMutation();
    const [pauseTask] = usePauseTaskMutation();
    const [resumeTask] = useResumeTaskMutation();
    const [completeTask] = useCompleteTaskMutation();

    const project = projectData?.data;
    const chapter = chapterData?.data;

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h00m";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m.toString().padStart(2, "0")}m`;
    };

    const handleStart = async () => {
        try {
            await startTask(taskId).unwrap();
            toast.success("Task pornit");
        } catch {
            toast.error("Pornirea a eșuat");
        }
    };

    const handlePause = async () => {
        try {
            await pauseTask(taskId).unwrap();
            toast.success("Task pus pe pauză");
        } catch {
            toast.error("Pauza a eșuat");
        }
    };

    const handleResume = async () => {
        try {
            await resumeTask(taskId).unwrap();
            toast.success("Task reluat");
        } catch {
            toast.error("Reluarea a eșuat");
        }
    };

    const handleDone = async () => {
        try {
            await completeTask(taskId).unwrap();
            toast.success("Task finalizat");
        } catch {
            toast.error("Finalizarea a eșuat");
        }
    };

    const isCompleted = task?.completed;
    const isPaused = task?.isPaused;
    const isRunning = task?.analyst && !task?.isPaused;
    console.log(isCompleted)
    console.log(isPaused)
    console.log(isRunning)

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
                        <strong>Capitol:</strong> {chapter?.name || "-"}
                    </p>
                    <p>
                        <strong>Task:</strong> {task?.name || "-"}
                    </p>
                </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div>
                <div className="task-actions2">

                    {!isCompleted && !isRunning && !isPaused && (
                        <button className="btn start" onClick={handleStart}>
                            Start
                        </button>
                    )}

                    {isRunning && (
                        <button className="btn stop" onClick={handlePause}>
                            Pause
                        </button>
                    )}

                    {isPaused && (
                        <button className="btn start" onClick={handleResume}>
                            Resume
                        </button>
                    )}

                    {!isCompleted && (
                        <button className="btn done" onClick={handleDone}>
                            Done
                        </button>
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

                <p className="analyst-times">-</p>
            </div>
            </div>
        </div>
    );
};

export default Details;
