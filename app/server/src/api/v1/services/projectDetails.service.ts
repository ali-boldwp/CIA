import ProjectDetails, { IProjectDetails } from "../models/projectDetails.model";

// Create new ProjectDetails entry
export const createProjectDetails = async (data: Partial<IProjectDetails>) => {
    return await ProjectDetails.create(data);
};

// Get all projects with full details
export const getAllProjectDetails = async () => {
    return await ProjectDetails.find().sort({ createdAt: -1 });
};

// Get a single project by ID
export const getProjectDetailsById = async (id: string) => {
    return await ProjectDetails.findById(id);
};

// Update project details + auto recalc margin
export const updateProjectDetails = async (id: string, data: Partial<IProjectDetails>) => {
    return await ProjectDetails.findByIdAndUpdate(id, data, { new: true });
};

// Delete project
export const deleteProjectDetails = async (id: string) => {
    return await ProjectDetails.findByIdAndDelete(id);
};
