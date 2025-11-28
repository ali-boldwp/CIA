import ProjectRequest from "../models/projectRequest.model";

/**
 * CREATE a new project request
 */
export const createProject = async (data: any) => {
    const project = await ProjectRequest.create(data);
    return project;
};

/**
 * GET all project requests
 */
export const getAllProjects = async () => {
    return ProjectRequest.find()
        .populate("projectRequestedBy", "name email role")
        .populate("projectCreatedBy", "name email role")
        .sort({ createdAt: -1 });
};

/**
 * GET single project by ID
 */
export const getProjectById = async (id: string) => {
    return ProjectRequest.findById(id)
        .populate("projectRequestedBy", "name email role")
        .populate("projectCreatedBy", "name email role");
};

/**
 * UPDATE entire project request
 */
export const updateProject = async (id: string, data: any) => {
    return ProjectRequest.findByIdAndUpdate(id, data, {
        new: true
    });
};

/**
 * UPDATE only project status
 */
export const updateProjectStatus = async (id: string, status: string) => {
    return ProjectRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

/**
 * DELETE project request
 */
export const deleteProject = async (id: string) => {
    return ProjectRequest.findByIdAndDelete(id);
};
