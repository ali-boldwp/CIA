import CreatedProject from "../models/createdProjects.model";

export const createProject = async (data: any) => {
    return await CreatedProject.create(data);
};

export const getAllProjects = async () => {
    return CreatedProject.find()
        .populate("createdBy", "name email role")
        .populate("responsibleAnalyst", "name email")
        .populate("assignedAnalysts", "name email")
        .sort({ createdAt: -1 });
};

export const getProjectById = async (id: string) => {
    return CreatedProject.findById(id)
        .populate("createdBy", "name email role")
        .populate("responsibleAnalyst", "name email")
        .populate("assignedAnalysts", "name email");
};

export const updateProject = async (id: string, data: any) => {
    return CreatedProject.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProject = async (id: string) => {
    return CreatedProject.findByIdAndDelete(id);
};
