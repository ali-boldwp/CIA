import Humint, { IHumint } from "../models/humint.model";

export const createHumint = async (data: Partial<IHumint>) => {
    return await Humint.create(data);
};

export const getAllHumints = async (filters: any = {}) => {
    return await Humint.find(filters)
        .populate("projectId")
        .sort({ createdAt: -1 });
};

export const getHumintById = async (id: string) => {
    return await Humint.findById(id).populate("projectId");
};

export const updateHumint = async (id: string, data: Partial<IHumint>) => {
    return await Humint.findByIdAndUpdate(id, data, { new: true });
};

// ------------------------------
// WORKFLOW ACTIONS BASED ON UI
// ------------------------------
export const submitHumint = async (id: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Pending" },
        { new: true }
    );
};

export const approveHumint = async (id: string, managerId: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Approved", managerId },
        { new: true }
    );
};

export const rejectHumint = async (id: string, feedback: string, managerId: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        {
            status: "Rejected",
            managerFeedback: feedback,
            managerId,
        },
        { new: true }
    );
};

export const clarificationHumint = async (id: string, feedback: string, managerId: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        {
            status: "Clarification",
            managerFeedback: feedback,
            managerId,
        },
        { new: true }
    );
};

// Mark Completed after collection finished
export const completeHumint = async (id: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Completed" },
        { new: true }
    );
};

export const deleteHumint = async (id: string) => {
    return await Humint.findByIdAndDelete(id);
};
