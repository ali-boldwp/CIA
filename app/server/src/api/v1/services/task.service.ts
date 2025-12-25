import Task, { ITask } from "../models/task.model";
import Chapter from "../models/chapter.model";
import AnalystExpanse from "../models/analystExpanse.model";

export const createTask = async (data: Partial<ITask>) => {
    return await Task.create(data);
};

export const getAllTasks = async () => {
    return await Task.find();
};

export const getTaskById = async (chapterId: string) => {
    return await Task.find({ chapterId }).populate("analyst");
};

export const getTask = async (taskId: string) => {
    return await Task.findById(taskId);
};

export const getProjectIdByTaskId = async (taskId: string) => {
    // Step 1: Find Task
    const task = await Task.findById(taskId).select("chapterId");
    if (!task) throw new Error("Task not found");

    // Step 2: Find Chapter
    const chapter = await Chapter.findById(task.chapterId).populate("projectId").select("projectId");
    if (!chapter) throw new Error("Chapter not found");

    // Step 3: Return projectId
    return chapter.projectId;
};


export const addTimeToAnalystExpanse = async (analystId, projectId, diffSeconds) => {
    let record = await AnalystExpanse.findOne({ analystId, projectId });

    if (record) {
        record.totalSecands += diffSeconds;
        await record.save();
        return record;
    }

    record = new AnalystExpanse({
        analystId,
        projectId,
        totalSecands: diffSeconds
    });

    await record.save();
    return record;
};


export const updateTask = async (id: string, name: string) => {
    const task = await Task.findById(id);
    if (!task) throw new Error("Task not found");

    task.name = name;
    await task.save();

    return task;
};


export const deleteTask = async (id: string) => {
    const task = await Task.findByIdAndDelete(id);
    return task;
};


//
// export const finalizeTask = async (id: string) => {
//     const task = await Task.findById(id);
//     if (!task) throw new Error("Task not found");
//
//     task.status = "Completed";
//     task.finalizedAt = new Date();
//     await task.save();
//     return task;
// };
//

//
// export const getTasksByProjectId = async (projectId: string) => {
//     return await Task.find({ projectId }).sort({ createdAt: -1 });
// };
//
