import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {
    useCompleteTaskMutation,
    usePauseTaskMutation,
    useResumeTaskMutation,
    useStartTaskMutation
} from "../../../../../../../services/taskApi";
import {FiEdit2, FiTrash2} from "react-icons/fi";

const Chapter = ({ data, tasksByChapter, setTasksByChapter, getInitials, isFinalizedLocal, editMode, formatTime, refetchProgress, setActiveChapterId, setShowTaskForm }) => {

    const { user } = useSelector((state) => state.auth);

    const [startTask] = useStartTaskMutation();
    const [pauseTask] = usePauseTaskMutation();
    const [resumeTask] = useResumeTaskMutation();
    const [completeTask] = useCompleteTaskMutation();

    const getStatus = (task) => {
        if (task.completed) return "done";
        if (task.analyst) return "inprogress";
        return "unassigned";
    };

    const handleStart = async (taskId, chapterId) => {
        try {
            const res = await startTask(taskId).unwrap();
            refetchProgress();
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
            refetchProgress();

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
            refetchProgress();
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
            refetchProgress();
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

    return (
        <>
            { data?.length > 0 &&

                data.map((item,index) => (

                    <div className="task-container">
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
                                    <div className="col col-number">{ index + 1 }.{i + 1}.</div>

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
                                    {/* Actions */}
                                    <div className="col col-actions">
                                        {isFinalizedLocal ? (
                                            <span className="disabled-text"></span>
                                        ) : !editMode ? (
                                            <span className="disabled-text"></span>
                                        ) : (
                                            <>
                                                {task.completed ? (
                                                    <>
                                                        {/* Edit and Delete buttons - Only for admin and manager */}
                                                        {(user?.role === "admin" || user?.role === "manager") && (
                                                            <span className="btnActionBoth">
                                <FiEdit2 className="icon edit" />
                                <FiTrash2 className="icon delete" />
                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Start/Resume/Pause/Done buttons - For admin, manager and analyst */}
                                                        {(user?.role === "admin" || user?.role === "manager" || user?.role === "analyst") && (
                                                            <>
                                                                {!task.analyst ? (
                                                                    <button
                                                                        className="btn start"
                                                                        onClick={() => handleStart(task._id, item._id)}
                                                                    >
                                                                        Start
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        {task.isPaused ? (
                                                                            <button
                                                                                className="btn start"
                                                                                onClick={() => handleResume(task._id, item._id)}
                                                                            >
                                                                                Resume
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn stop"
                                                                                onClick={() => handlePause(task._id, item._id)}
                                                                            >
                                                                                Pause
                                                                            </button>
                                                                        )}

                                                                        <button
                                                                            className="btn done"
                                                                            onClick={() => handleComplete(task._id, item._id)}
                                                                        >
                                                                            Done
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}

                                                        {/* Edit and Delete buttons - Only for admin and manager */}
                                                        {(user?.role === "admin" || user?.role === "manager") && (
                                                            <span className="btnActionBoth">
                                <FiEdit2 className="icon edit" />
                                <FiTrash2 className="icon delete" />
                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}


                            {/* Add new task */}
                            <div className="add-row">
                                {editMode && !isFinalizedLocal && (user?.role === "admin" || user?.role === "manager") && (
                                    <button
                                        className="add-btn"
                                        onClick={() => {
                                            setActiveChapterId(item._id);
                                            setShowTaskForm(true);
                                        }}
                                    >
                                        + Adauga punct nou in acest capitol
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                ))}
        </>
    )

}

export default Chapter;