import projectRequest from "../models/projectRequest.model";

export const createProject = async (data: any) => {
    return await projectRequest.create(data);
};

export const getAllProjects = async (query = {}, options = {}) => {
    const { skip = 0, limit = 0 } = options;

    let q = projectRequest.find(query)
        .select("+projectPrice")
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role")
        .populate("humintId")
        .sort({ createdAt: -1 });

    if (skip) {
        q = q.skip(skip);
    }
    if (limit) {
        q = q.limit(limit);
    }

    return q.exec();  // execute the query and return a Promise
};

export const getProjectById = async (id: string) => {
    return projectRequest.findById(id)
        .select("+projectPrice")
        .populate("responsibleAnalyst", "name email role")
        .populate("assignedAnalysts", "name email role")
        .populate("humintId");
};

export const updateProject = async (id: string, data: any) => {
    return projectRequest.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProject = async (id: string) => {
    return projectRequest.findByIdAndDelete(id);
};

export async function countProjects(filter = {}) {
    // count how many documents match `filter`
    const total = await projectRequest.countDocuments(filter).exec();
    return total;
}


export const getProjectFinancialSummary = async (projectId: string) => {
    const project = await projectRequest.findById(projectId).select(
        "+projectPrice +fixPrice +tesaPrice +osintPrice +tehnicaPrice +otherPrice currency"
    );

    if (!project) {
        throw new Error("Project not found");
    }

    return {
        currency: project.currency,

        cheltuieliTESA: project.tesaPrice,
        cheltuieliOSINT: project.osintPrice,
        supraveghereTehnica: project.tehnicaPrice,
        cheltuieliFixe: project.fixPrice,
        alteCheltuieli: project.otherPrice,

        totalCheltuieli: project.totalCheltuieli,
        pretProject: project.projectPrice,

        profit: project.profit,
        profitPercentage: project.profitPercentage
    };
};