import Humint, { IHumint } from "../models/humint.model";

export const createHumint = async (data: Partial<IHumint>) => {
    return await Humint.create(data);
};

export const getAllHumints = async (filters: any = {}) => {
    const humints = await Humint.find(filters)
        .populate({
            path: "projectId",
            select: "projectName projectSubject reportType responsibleAnalyst",
            model: "ProjectRequest"
        })
        .populate({
            path: "responsible",
            select: "name email role",
            model: "User"
        })
        .populate({
            path: "createdBy",
            select: "name email role",
            model: "User"
        })
        .sort({ createdAt: -1 });

    // ----- Attach derived project fields -----
    return humints.map((h: any) => {
        const obj = h.toObject();

        if (h.isLinkedToProject && h.projectId) {
            obj.projectName = h.projectId.projectName;
            obj.reportType = h.projectId.reportType;

            // Responsible analyst from project
            obj.projectResponsible =
                h.projectId.responsibleAnalyst?.name ||
                h.projectId.responsibleAnalyst ||
                "N/A";
        } else {
            // Independent HUMINT request
            obj.projectName = h.humintSubject || "Independent Request";
            obj.reportType = h.reportType || "HUMINT";

            // Responsible analyst populated from User
            obj.projectResponsible = h.responsible?.name || "N/A";
        }

        return obj;
    });
};

export const getHumintById = async (id: string) => {
    return await Humint.findById(id)
        .populate("projectId")
        .populate("responsible", "name email role")
        .populate("createdBy", "name email role");
};

export const updateHumint = async (id: string, data: Partial<IHumint>) => {
    return await Humint.findByIdAndUpdate(id, data, { new: true });
};


// WORKFLOW ACTIONS
export const submitHumint = async (id: string) => {
    return await Humint.findByIdAndUpdate(id, { status: "Requested" }, { new: true });
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
        { status: "Rejected", managerFeedback: feedback, managerId },
        { new: true }
    );
};

export const clarificationHumint = async (id: string, feedback: string, managerId: string) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Clarification", managerFeedback: feedback, managerId },
        { new: true }
    );
};

export const completeHumint = async (id: string) => {
    return await Humint.findByIdAndUpdate(id, { status: "Completed" }, { new: true });
};

export const deleteHumint = async (id: string) => {
    return await Humint.findByIdAndDelete(id);
};
