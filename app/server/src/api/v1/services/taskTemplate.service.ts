import TaskTemplate, { ITaskTemplate } from "../models/taskTemplate.model";
import ChapterTemplate from "../models/chapterTemplate.model";

// CREATE TASK TEMPLATE
export const createTaskTemplate = async (data: Partial<ITaskTemplate>) => {
    if (!data?.chapter) throw new Error("chapter is required");

    // ✅ chapter ke current tasks count se next index
    const chapter = await ChapterTemplate
        .findById(data.chapter)
        .select("tasks");

    if (!chapter) throw new Error("ChapterTemplate not found");

    const nextIndex = chapter?.tasks?.length || 0;

    const task = await TaskTemplate.create({
        ...data,
        index: nextIndex,
    });

    await ChapterTemplate.findByIdAndUpdate(
        data.chapter,
        { $push: { tasks: task._id } }
    );

    return task;
};

// UPDATE TASK TEMPLATE
export const updateTaskTemplate = async (
    id: string,
    data: Partial<ITaskTemplate>
) => {
    const existing = await TaskTemplate.findById(id);
    if (!existing) throw new Error("TaskTemplate not found");

    // ✅ chapter change handling
    if (data.chapter && existing.chapter.toString() !== data.chapter.toString()) {
        await ChapterTemplate.findByIdAndUpdate(
            existing.chapter,
            { $pull: { tasks: existing._id } }
        );

        await ChapterTemplate.findByIdAndUpdate(
            data.chapter,
            { $push: { tasks: existing._id } }
        );
    }

    return TaskTemplate.findByIdAndUpdate(id, data, { new: true });
};

// DELETE TASK TEMPLATE
export const deleteTaskTemplate = async (id: string) => {
    const task = await TaskTemplate.findById(id);
    if (!task) throw new Error("TaskTemplate not found");

    await ChapterTemplate.findByIdAndUpdate(
        task.chapter,
        { $pull: { tasks: task._id } }
    );

    await task.deleteOne();
    return { success: true };
};

// GET TASK TEMPLATES BY CHAPTER ID
export const getTaskTemplatesByChapterId = async (chapterId: string) => {
    return TaskTemplate.find({ chapter: chapterId })
        .sort({ index: 1 })
        .lean();
};
