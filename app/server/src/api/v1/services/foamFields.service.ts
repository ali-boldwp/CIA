import FoamFields, { IFoamFields , IColumn } from "../models/foamFields.model";
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
            `Field with name "${name}" already exists in this task`
        );
    }

    const task = await TaskTemplate
        .findById(data.task)
        .select("foamFields");

    const nextIndex = task?.foamFields?.length || 0;

    const fieldPayload: Partial<IFoamFields> = {
        ...data,
        name,
        index: nextIndex,
    };

    // ✅ table fields start with empty columns
    if (data.type === "table") {
        fieldPayload.columns = [];
    } else {
        fieldPayload.columns = undefined;
    }

    const field = await FoamFields.create(fieldPayload);

    await TaskTemplate.findByIdAndUpdate(
        data.task,
        { $push: { foamFields: field._id } }
    );

    return field;
};





// UPDATE
export const updateFoamField = async (
    id: string,
    data: Partial<IFoamFields>
) => {
    const existing = await FoamFields.findById(id);
    if (!existing) throw new Error("FoamField not found");

    // 🔁 task change handling
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

    // 🔐 column safety
    if (data.type && data.type !== "table") {
        data.columns = undefined;
    }

    // 🔎 duplicate column slug check
    if (data.columns?.length) {
        const slugs = data.columns.map(c => c.slug);
        const unique = new Set(slugs);
        if (unique.size !== slugs.length) {
            throw new Error("Duplicate column slug detected");
        }
    }

    return FoamFields.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
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


export const getTableColumns = async (fieldId: string) => {
    const field = await FoamFields.findById(fieldId)
        .select("type columns")
        .lean();

    if (!field) {
        throw new Error("FoamField not found");
    }

    if (field.type !== "table") {
        throw new Error(
            "Only table fields have columns"
        );
    }

    return field.columns || [];
};



export const addTableColumn = async (
    fieldId: string,
    column: IColumn
) => {
    const field = await FoamFields.findById(fieldId);
    if (!field) throw new Error("FoamField not found");

    if (field.type !== "table") {
        throw new Error("Columns can only be added to table fields");
    }

    // ✅ FIX: ensure columns array exists
    if (!field.columns) {
        field.columns = [];
    }

    const exists = field.columns.some(
        (c) => c.slug === column.slug
    );

    if (exists) {
        throw new Error(
            `Column with slug "${column.slug}" already exists`
        );
    }

    field.columns.push(column);
    await field.save();

    return field;
};


export const updateTableColumn = async (
    fieldId: string,
    columnId: string,
    data: Partial<IColumn>
) => {
    const field = await FoamFields.findById(fieldId);
    if (!field) throw new Error("FoamField not found");

    // 🔐 only table fields
    if (field.type !== "table") {
        throw new Error("Only table fields can have columns");
    }

    const column = field.columns?.id(columnId);
    if (!column) {
        throw new Error("Column not found");
    }

    // 🔎 duplicate slug protection
    if (data.slug) {
        const exists = field.columns?.some(
            (c) =>
                c.slug === data.slug &&
                c._id.toString() !== columnId
        );

        if (exists) {
            throw new Error(
                `Column with slug "${data.slug}" already exists`
            );
        }
    }

    // ✅ update allowed fields
    if (data.name !== undefined) column.name = data.name;
    if (data.slug !== undefined) column.slug = data.slug;
    if (data.type !== undefined) column.type = data.type;

    await field.save();
    return field;
};

export const deleteTableColumn = async (fieldId: string, columnId: string) => {
    const field = await FoamFields.findById(fieldId);
    if (!field) throw new Error("FoamField not found");

    if (field.type !== "table") {
        throw new Error("Only table fields can have columns");
    }

    const column = field.columns?.id(columnId);
    if (!column) {
        throw new Error("Column not found");
    }

    column.deleteOne(); // remove subdocument
    await field.save();

    return field;
};
