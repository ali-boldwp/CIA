import Requested from "../models/requested.model";

export const createProject = async (data: any) => {
    return await Requested.create(data);
};

export const getAllRequestedProjects = async ( query = {} ) => {
    return Requested.find( query )
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role")
        .sort({ createdAt: -1 });
};

export const getRequestedProjectById = async (id: string) => {
    return Requested.findById(id)
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role");
};

export const updateProject = async (id: string, data: any) => {
    return Requested.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProject = async (id: string) => {
    return Requested.findByIdAndDelete(id);
};
