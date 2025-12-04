// src/pages/TaskPage/TaskTable.js
import React from "react";
import { BiTrash, BiEdit } from "react-icons/bi";

const TaskTable = ({ tasks, setTasks }) => {
    const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

    const toggleTaskStatus = (id) =>
        setTasks(
            tasks.map((t) =>
                t.id === id
                    ? {
                        ...t,
                        checked: !t.checked,
                        status: t.checked ? "In progress" : "Done",
                    }
                    : t
            )
        );

    return (
        <div className="task-table-box">
            <table className="task-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Descriere task</th>
                    <th>Status</th>
                    <th>Analist / timp</th>
                    <th>Actiuni</th>
                </tr>
                </thead>

                <tbody>
                {tasks.map((task, index) => (
                    <tr key={task.id}>
                        {/* Numbering */}
                        <td className="index-number">{index + 1}</td>

                        {/* Checkbox + Task name */}
                        <td className={`task-name ${task.level === 1 ? "parent-row" : "child-row"}`}>
                            {task.level !== 1 && (
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={task.checked}
                                    onChange={() => toggleTaskStatus(task.id)}
                                />
                            )}
                            <span className="task-label">{task.title}</span>
                        </td>

                        {/* Status Badge */}
                        <td>
                                <span className={`status-badge ${task.status.toLowerCase().replace(" ", "")}`}>
                                    {task.status}
                                </span>
                        </td>

                        {/* Analyst Badge */}
                        <td>
                            <span className="analyst-badge">{task.analyst}</span>
                        </td>

                        {/* Action Icons */}
                        <td>
                            <BiEdit className="edit-icon" />
                            <BiTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
