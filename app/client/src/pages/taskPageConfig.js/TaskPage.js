import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { useGetProjectRequestByIdQuery, useCreateChapterMutation } from "../../services/projectApi";
import "./TaskPage.css";

const TaskPage = () => {
    const { id: projectId } = useParams();

    const { data, isLoading, isError } = useGetProjectRequestByIdQuery(projectId, {
        skip: !projectId,
    });

    const [tasks, setTasks] = useState([]);
    const [showChapterInput, setShowChapterInput] = useState(false);
    const [chapterName, setChapterName] = useState("");

    // ✅ RTK mutation hook
    const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation();

    useEffect(() => {
        if (data && data.data && data.data.tasks) {
            setTasks(
                data.data.tasks.map((t, index) => ({
                    id: t.id || index + 1,
                    title: t.title || `Task ${index + 1}`,
                    status: t.status || "Assigned",
                    checked: t.checked || false,
                }))
            );
        }
    }, [data]);

    const getInitials = (fullName) => {
        if (!fullName) return "";
        const names = fullName.split(" ");
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

    const handleAddChapter = async () => {
        if (!chapterName.trim()) return alert("Please enter a chapter name");

        try {
            await createChapter({ name: chapterName, projectId }).unwrap();
            alert("Chapter added successfully!");
            setChapterName("");
            setShowChapterInput(false);
        } catch (error) {
            console.error(error);
            alert("Failed to add chapter");
        }
    };

    if (!projectId) return <p>No project selected.</p>;
    if (isLoading) return <p>Loading project tasks...</p>;
    if (isError) return <p>Error fetching project data!</p>;

    const project = data.data;

    return (
        <div className="task-container">
            {/* HEADER */}
            <div className="task-header flex-between">
                <div className="flex-column text-white">
                    <button className="task-btn italic">TASK INDIVIDUAL</button>
                    <p className="fs-24 semibold m-10">Project: {project.projectName || "N/A"}</p>
                </div>

                <div className="header-right flex-column text-white">
                    <button className="task-btn text-gray">
                        Responsible Analyst: {project.responsibleAnalyst?.name || "N/A"}
                    </button>
                    <p className="fs-14 m-10 min-w-300 text-center">
                        Other Analysts:{" "}
                        {project.assignedAnalysts?.length > 0
                            ? project.assignedAnalysts.map((a) => getInitials(a.name)).join(", ")
                            : "N/A"}
                    </p>
                </div>
            </div>

            {/* TASK TABLE */}
            <div className="task-table-box">
                <table className="task-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Task Title</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={task.checked}
                                    onChange={() =>
                                        setTasks(
                                            tasks.map((t) =>
                                                t.id === task.id ? { ...t, checked: !t.checked } : t
                                            )
                                        )
                                    }
                                />
                            </td>
                            <td>{task.title}</td>
                            <td>
                  <span
                      className={`status-badge ${task.status.replace(" ", "").toLowerCase()}`}
                  >
                    {task.status}
                  </span>
                            </td>
                            <td>
                                <BiTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add Chapter Section */}
            {!showChapterInput ? (
                <button className="add-chapter-btn" onClick={() => setShowChapterInput(true)}>
                    + Add New Chapter
                </button>
            ) : (
                <div className="chapter-input-container">
                    <input
                        type="text"
                        className="chapter-input"
                        value={chapterName}
                        placeholder="Enter chapter name"
                        onChange={(e) => setChapterName(e.target.value)}
                    />
                    <button
                        className="submit-chapter-btn"
                        onClick={handleAddChapter}
                        disabled={isCreating}
                    >
                        {isCreating ? "Adding..." : "Add"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskPage;
