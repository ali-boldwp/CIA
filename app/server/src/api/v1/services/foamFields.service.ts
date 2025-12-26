import FoamFields, { IFoamFields } from "../models/foamFields.model";
import TaskTemplate from "../models/taskTemplate.model";

// CREATE
export const createFoamField = async (data: Partial<IFoamFields>) => {
    if (!data.task || !data.name) {
        throw new Error("Task and field name are required");
    }

    const name = data.name.trim();

    const existingField = await FoamFields.findOne({
        task: data.task,
        name,
    });

    if (existingField) {
        throw new Error(
            `This field cannot be created because a field with the same slug (name) already exists in this task.`
        );
    }

    const task = await TaskTemplate
        .findById(data.task)
        .select("foamFields");

    const nextIndex = task?.foamFields?.length || 0;

    const field = await FoamFields.create({
        ...data,
        name,
        index: nextIndex,
    });

    await TaskTemplate.findByIdAndUpdate(
        data.task,
        { $push: { foamFields: field._id } }
    );

    return field;
};




// UPDATE
export const updateFoamField = async (id: string, data: Partial<IFoamFields>) => {
    const existing = await FoamFields.findById(id);
    if (!existing) throw new Error("FoamField not found");

    // task change case
    if (data.task && existing.task.toString() !== data.task.toString()) {
        await TaskTemplate.findByIdAndUpdate(
            existing.task,
            { $pull: { foamFields: existing._id } }
        );

        await TaskTemplate.findByIdAndUpdate(
            data.task,
            { $push: { foamFields: existing._id } }
        );
    }

    return FoamFields.findByIdAndUpdate(id, data, { new: true });
};

// DELETE
export const deleteFoamField = async (id: string) => {
    const field = await FoamFields.findById(id);
    if (!field) throw new Error("FoamField not found");

    await TaskTemplate.findByIdAndUpdate(
        field.task,
        { $pull: { foamFields: field._id } }
    );

    await field.deleteOne();
    return { success: true };
};

// GET BY TASK ID
export const getFoamFieldsByTaskId = async (taskId: string) => {
    return FoamFields.find({ task: taskId })
        .sort({ index: 1 })
        .lean();
};
