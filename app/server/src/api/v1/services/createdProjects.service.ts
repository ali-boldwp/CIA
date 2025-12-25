import projectRequest from "../models/projectRequest.model";
import AnalystExpanse from "../models/analystExpanse.model";
import Category from "../models/category.model";
import Chapter from "../models/chapter.model";
import Task from "../models/task.model";
import FoamFields from "../models/foamFields.model";


export const createProject = async (data: any) => {
    return await projectRequest.create(data);
};


export const cloneTemplatesToProject = async (
    categoryId: string,
    projectId: string
) => {
    const category = await Category.findById(categoryId)
        .populate({
            path: "chapters",
            populate: {
                path: "tasks",
                populate: { path: "foamFields" }
            }
        })
        .lean();

    if (!category?.chapters?.length) return;

    for (const chapterTemplate of category.chapters) {

        const projectChapter = await Chapter.create({
            name: chapterTemplate.name,
            projectId
        });

        if (!chapterTemplate.tasks?.length) continue;

        for (const taskTemplate of chapterTemplate.tasks) {

            const projectTask = await Task.create({
                name: taskTemplate.name,
                content: taskTemplate.content,
                chapterId: projectChapter._id,
                completed: false
            });

            if (!taskTemplate.foamFields?.length) continue;

            const fields = taskTemplate.foamFields.map((f: any) => ({
                name: f.name,
                type: f.type,
                slug: f.slug,
                task: projectTask._id
            }));

            await FoamFields.insertMany(fields);
        }
    }
};

export const getAllProjects = async (query = {}, options = {}) => {
    const { skip = 0, limit = 0 } = options;

    let q = projectRequest.find(query)
        .select("+projectPrice")
        .populate("responsibleAnalyst", "name email role color")
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
        .populate("responsibleAnalyst", "name email role color")
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

    // -------------------------------
    // EMPLOYEE COST (ANGAJATI)
    // -------------------------------
    const RON_TO_EUR = 0.20;

    const analystExpanses = await AnalystExpanse
        .find({ projectId })
        .populate("analystId", "costPerHour");

    let cheltuieliAngajati = 0;

    for (const exp of analystExpanses) {
        const seconds = exp.totalSecands || 0;
        const hours = seconds / 3600;

        const costPerHourLei = exp.analystId?.costPerHour || 0;
        const costPerHourEur = costPerHourLei * RON_TO_EUR;

        cheltuieliAngajati += hours * costPerHourEur;
    }

    cheltuieliAngajati = Number(cheltuieliAngajati.toFixed(2));

    // -------------------------------
    // OTHER COSTS
    // -------------------------------
    const cheltuieliTESA = project.tesaPrice || 0;
    const cheltuieliOSINT = project.osintPrice || 0;
    const supraveghereTehnica = project.tehnicaPrice || 0;
    const cheltuieliFixe = project.fixPrice || 0;
    const alteCheltuieli = project.otherPrice || 0;

    // -------------------------------
    // TOTAL CHELTUIELI
    // -------------------------------
    const totalCheltuieli =
        cheltuieliAngajati +
        cheltuieliTESA +
        cheltuieliOSINT +
        supraveghereTehnica +
        cheltuieliFixe +
        alteCheltuieli;

    // -------------------------------
    // PROFIT
    // -------------------------------
    const pretProject = project.projectPrice || 0;
    const profit = pretProject - totalCheltuieli;

    const profitPercentage =
        pretProject > 0
            ? Number(((profit / pretProject) * 100).toFixed(2))
            : 0;

    return {
        currency: project.currency,

        cheltuieliAngajati,
        cheltuieliTESA,
        cheltuieliOSINT,
        supraveghereTehnica,
        cheltuieliFixe,
        alteCheltuieli,

        totalCheltuieli,
        pretProject,

        profit,
        profitPercentage,
    };
};
