import ProjectDetails, { IProjectDetails } from "../models/projectDetails.model";

export const createProjectDetails = async (data: Partial<IProjectDetails>) => {
    return await ProjectDetails.create(data);
};

export const getAllProjectDetails = async () => {
    return await ProjectDetails.find().sort({ createdAt: -1 });
};

export const getProjectDetailsById = async (id: string) => {
    return await ProjectDetails.findById(id);
};

export const updateProjectDetails = async (id: string, data: Partial<IProjectDetails>) => {
    const project = await ProjectDetails.findById(id);
    if (!project) throw new Error("Project not found");

    Object.assign(project, data);
    await project.save();
    return project;
};

export const deleteProjectDetails = async (id: string) => {
    return await ProjectDetails.findByIdAndDelete(id);
};

// COST PAGE SPECIFIC UPDATE
export const updateProjectCosts = async (id: string, data: Partial<IProjectDetails>) => {
    const project = await ProjectDetails.findById(id);
    if (!project) throw new Error("Project not found");

    if (data.fixedCosts !== undefined) project.fixedCosts = data.fixedCosts;
    if (data.osintCosts !== undefined) project.osintCosts = data.osintCosts;
    if (data.employeeCostItems) project.employeeCostItems = data.employeeCostItems;
    if (data.humintCostItems) project.humintCostItems = data.humintCostItems;
    if (data.projectPrice !== undefined) project.projectPrice = data.projectPrice;

    await project.save();
    return project;
};
