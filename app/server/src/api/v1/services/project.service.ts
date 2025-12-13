import projectRequest from "../models/projectRequest.model";
import Requested from "../models/requested.model";

export const createProject = async (data: any) => {
    return await projectRequest.create(data);
};

export const getAllProjects = async ( query = {} ) => {
    return Requested.find( query )
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role")
        .sort({ createdAt: -1 });
};

export const getProjectById = async (id: string) => {
    return projectRequest.findById(id)
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role");
};

export const updateProject = async (id: string, data: any) => {
    return projectRequest
        .findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
};


export const deleteProject = async (id: string) => {
    return projectRequest.findByIdAndDelete(id);
};

export async function countProjects(filter = {}) {
    // count how many documents match `filter`
    const total = await projectRequest.countDocuments(filter).exec();
    return total;
}