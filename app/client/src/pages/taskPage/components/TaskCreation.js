// src/pages/TaskPage/TaskCreation.js
import React, { useState } from "react";
import {useCreateTaskMutation} from "../../../services/projectApi";
const TaskCreation = ({ chapterId, addTaskToState }) => {
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [taskName, setTaskName] = useState("");

    // RTK Query mutation
    const [createTask, { isLoading }] = useCreateTaskMutation();

    const handleAddTask = async () => {
        if (!taskName.trim()) return alert("Enter task name");

        try {
            const response = await createTask({
                name: taskName,
                chapterId,
            }).unwrap();

            // Update state in parent
            addTaskToState({
                id: response.data._id,
                title: response.data.name,
                status: response.data.completed ? "Completed" : "Assigned",
                checked: response.data.completed,
            });

            setTaskName("");
            setShowTaskInput(false);
        } catch (error) {
            console.error(error);
            alert("Failed to add task");
        }
    };

    return !showTaskInput ? (
        <button className="add-chapter-btn" onClick={() => setShowTaskInput(true)}>
            + Add New Task
        </button>
    ) : (
        <div className="chapter-input-container">
            <input
                type="text"
                className="chapter-input"
                value={taskName}
                placeholder="Enter task name"
                onChange={(e) => setTaskName(e.target.value)}
            />
            <button className="submit-chapter-btn" onClick={handleAddTask} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Task"}
            </button>
        </div>
    );
};

export default TaskCreation;
