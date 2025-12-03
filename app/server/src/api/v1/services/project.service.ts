import ProjectRequest from "../models/projectRequest.model";

export const createProject = async (data: any) => {
    return await ProjectRequest.create(data);
};

export const getAllProjects = async () => {
    return ProjectRequest.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
};

export const getProjectById = async (id: string) => {
    return ProjectRequest.findById(id)
        .populate("createdBy", "name email role")
        .populate("responsibleAnalyst","name" )
        .populate("assignedAnalysts","name" );
};

export const updateProject = async (id: string, data: any) => {
    return ProjectRequest.findByIdAndUpdate(id, data, { new: true });
};

export const updateProjectStatus = async (id: string, status: string) => {
    return ProjectRequest.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteProject = async (id: string) => {
    return ProjectRequest.findByIdAndDelete(id);
};
