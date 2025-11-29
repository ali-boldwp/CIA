import Task, { ITask } from "../models/task.model";

export const createTask = async (data: Partial<ITask>) => {
    return await Task.create(data);
};

export const getAllTasks = async () => {
    return await Task.find().sort({ createdAt: -1 });
};

export const getTaskById = async (id: string) => {
    return await Task.findById(id);
};

export const updateTask = async (id: string, data: Partial<ITask>) => {
    const task = await Task.findById(id);
    if (!task) throw new Error("Task not found");

    Object.assign(task, data);
    await task.save();
    return task;
};

export const finalizeTask = async (id: string) => {
    const task = await Task.findById(id);
    if (!task) throw new Error("Task not found");

    task.status = "Completed";
    task.finalizedAt = new Date();
    await task.save();
    return task;
};

export const deleteTask = async (id: string) => {
    return await Task.findByIdAndDelete(id);
};

export const getTasksByProjectId = async (projectId: string) => {
    return await Task.find({ projectId }).sort({ createdAt: -1 });
};

