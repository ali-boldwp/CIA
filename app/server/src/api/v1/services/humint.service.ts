import Humint, { IHumint } from "../models/humint.model";

export const createHumint = async (data: Partial<IHumint>) => {
    return await Humint.create(data);
};

export const getAllHumints = async () => {
    return await Humint.find().sort({ createdAt: -1 });
};

export const getHumintById = async (id: string) => {
    return await Humint.findById(id);
};

export const updateHumint = async (id: string, data: Partial<IHumint>) => {
    return await Humint.findByIdAndUpdate(id, data, { new: true });
};

export const updateHumintStatus = async (id: string, status: string) => {
    return await Humint.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteHumint = async (id: string) => {
    return await Humint.findByIdAndDelete(id);
};
