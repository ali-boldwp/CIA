import Chapter ,{ IChapter } from "../models/chapter.model";
import Task from "../models/task.model";


export const createChapter = async (data: Partial<IChapter>) => {
    return await Chapter.create(data);
};

export const getAllChapter = async () => {
    return await Chapter.find();
};

export const updateChapter = async (id: string, data: Partial<IChapter>) => {
    return await Chapter.findByIdAndUpdate(id, data, { new: true });
};
export const getChapterById = async (chapterId: string) => {
    return await Chapter.findById(chapterId);
};

export const getChapterByProjectId = async (projectId: string) => {
    return Chapter.find({ projectId })
        .populate("projectId")
        .lean();
};
