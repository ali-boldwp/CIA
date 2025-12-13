import { Schema, model, Document } from "mongoose";

export interface IHumint extends Document {
    isLinkedToProject: boolean;
    projectId?: Schema.Types.ObjectId;

    humintSubject?: string;
    reportType?: string;
    responsible: Schema.Types.ObjectId;
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

    createdBy: Schema.Types.ObjectId;

    status:
        | "Draft"
        | "Requested"
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
        reportType: String,

        responsible: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
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
            type: Schema.Types.ObjectId,
            ref:'User'

        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Requested",
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
