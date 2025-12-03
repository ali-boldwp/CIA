import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { useGetProjectRequestByIdQuery } from "../../services/projectApi";
import "./TaskPage.css";

const TaskPage = () => {
    // Get projectId from URL
    const { id: projectId } = useParams();

    // Fetch project data by ID
    const { data, isLoading, isError } = useGetProjectRequestByIdQuery(projectId, {
        skip: !projectId,
    });

    // Local state for tasks
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (data && data.tasks) {
            setTasks(
                data.tasks.map((t, index) => ({
                    id: t.id || index + 1,
                    title: t.title || `Task ${index + 1}`,
                    status: t.status || "Assigned",
                    checked: t.checked || false,
                }))
            );
        }
    }, [data]);

    const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

    if (!projectId) return <p>No project selected.</p>;
    if (isLoading) return <p>Loading project tasks...</p>;
    if (isError) return <p>Error fetching project data!</p>;

    return (
        <div className="task-container">
            {/* HEADER */}
            <div className="header flex-between">
                <div className="flex-column text-white">
                    <button className="p-10 semibold rounded-20 border-none italic">
                        TASK INDIVIDUAL
                    </button>
                    <p className="fs-24 semibold m-10">
                        Proiect: {data?.data.projectName || "N/A"}
                    </p>
                </div>

                <div className="header-right flex-column text-white">
                    <button className="p-10 semibold rounded-20 border-none text-gray min-w-300">
                        Responsabil proiect: {data?.responsibleAnalyst || "N/A"}
                    </button>
                    <p className="fs-14 m-10 min-w-300 text-center">
                        Alti analisti asignati:{" "}
                        {data?.assignedAnalysts?.length > 0
                            ? data.assignedAnalysts.join(", ")
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
                                <BiTrash
                                    className="delete-icon"
                                    onClick={() => deleteTask(task.id)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskPage;
