import Humint, { IHumint } from "../models/humint.model";
import { Role } from "../../../constants/roles";

export const createHumint = async (data: Partial<IHumint>) => {
    return await Humint.create(data);
};

export const getAllHumints = async (filters: any = {}, user: any) => {
    const query: any = { ...filters };

    if (user?.role === Role.ANALYST) {
        query.$or = [{ responsible: user.id }, { createdBy: user.id }];
    }

    const humints = await Humint.find(query)
        .populate({
            path: "projectId",
            select: "projectName projectSubject reportType responsibleAnalyst",
            model: "ProjectRequest",
            populate: {
                path: "responsibleAnalyst",
                select: "name email",
            },
        })
        .populate({
            path: "responsible",
            select: "name email role",
            model: "User",
        })
        .populate({
            path: "createdBy",
            select: "name email role",
            model: "User",
        })
        .sort({ createdAt: -1 });

    return humints.map((h: any) => {
        const obj = h.toObject();

        if (h.isLinkedToProject && h.projectId) {
            obj.projectName = h.projectId.projectName;
            obj.reportType = h.projectId.reportType;
            obj.projectResponsible = h.projectId.responsibleAnalyst?.name || "N/A";
        } else {
            obj.projectName = h.humintSubject || "Independent Request";
            obj.reportType = h.reportType || "HUMINT";
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
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Requested" },
        { new: true }
    );
};

// ✅ managerId optional (frontend may not send it)
export const approveHumint = async (id: string, managerId?: string) => {
    const update: any = { status: "Approved" };
    if (managerId) update.managerId = managerId;

    return await Humint.findByIdAndUpdate(id, update, { new: true });
};

// ✅ Sent status (Predat HUMINT) — managerId optional
export const sentHumint = async (id: string, managerId?: string) => {
    const update: any = { status: "Sent" };
    if (managerId) update.managerId = managerId;

    return await Humint.findByIdAndUpdate(id, update, { new: true });
};

export const rejectHumint = async (
    id: string,
    feedback: string,
    managerId: string
) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Rejected", managerFeedback: feedback, managerId },
        { new: true }
    );
};

// ✅ If old clarification endpoint is still used, force it to Sent to match frontend
export const clarificationHumint = async (
    id: string,
    feedback: string,
    managerId: string
) => {
    return await Humint.findByIdAndUpdate(
        id,
        { status: "Sent", managerFeedback: feedback, managerId },
        { new: true }
    );
};

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
