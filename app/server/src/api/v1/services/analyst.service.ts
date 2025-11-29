import Analyst, { IAnalyst } from "../models/analyst.model";

export const createAnalyst = async (data: Partial<IAnalyst>) => {
    return await Analyst.create(data);
};

export const getAllAnalysts = async () => {
    return await Analyst.find().sort({ createdAt: -1 });
};

export const getAnalystById = async (id: string) => {
    return await Analyst.findById(id);
};

export const updateAnalyst = async (id: string, data: Partial<IAnalyst>) => {
    return await Analyst.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAnalyst = async (id: string) => {
    return await Analyst.findByIdAndDelete(id);
};
