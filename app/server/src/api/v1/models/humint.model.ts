import { Schema, model, Document } from "mongoose";

export interface IHumint extends Document {
    isLinkedToProject: boolean;
    projectId?: Schema.Types.ObjectId;

    humintSubject?: string;
    entityType?: string;
    responsible: string;
    deadline: Date;
    priority: "Normal" | "High" | "Urgent" | "Confidential";

    createProjectFromRequest: boolean;
    notifyManager: boolean;

    briefObjective?: string;
    keyQuestions?: string;
    targets?: string;
    locations?: string;
    restrictions?: string;

    managerFeedback?: string;
    managerId?: string;

    createdBy: string;

    status:
        | "Draft"
        | "Pending"
        | "Clarification"
        | "Approved"
        | "Rejected"
        | "Completed";

    createdAt: Date;
    updatedAt: Date;
}

const humintSchema = new Schema<IHumint>(
    {
        isLinkedToProject: {
            type: Boolean,
            default: false,
        },

        projectId: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest",
            default: null,
        },

        humintSubject: String,
        entityType: String,

        responsible: {
            type: String,
            required: true,
        },

        deadline: {
            type: Date,
            required: true,
        },

        priority: {
            type: String,
            enum: ["Normal", "High", "Urgent", "Confidential"],
            default: "Normal",
        },

        createProjectFromRequest: {
            type: Boolean,
            default: false,
        },

        notifyManager: {
            type: Boolean,
            default: false,
        },

        briefObjective: String,
        keyQuestions: String,
        targets: String,
        locations: String,
        restrictions: String,

        managerFeedback: String,
        managerId: String,

        createdBy: {
            type: String,

        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Pending",
                "Clarification",
                "Approved",
                "Rejected",
                "Completed",
            ],
            default: "Draft",
        },
    },
    { timestamps: true }
);

const Humint = model<IHumint>("Humint", humintSchema);

export default Humint;
