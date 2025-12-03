import Chapter ,{ IChapter } from "../models/chapter.model";

export const createChapter = async (data: Partial<IChapter>) => {
    return await Chapter.create(data);
};

export const getAllChapter = async () => {
    return await Chapter.find().sort({ createdAt: -1 });
};

export const updateChapter = async (id: string, data: Partial<IChapter>) => {
    return await Chapter.findByIdAndUpdate(id, data, { new: true });
};