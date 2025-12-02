import { Schema, model, Document, Types } from "mongoose";

export interface IProjectRequest extends Document {

    projectName: string;
    projectSubject: string;
    reportType: string;
    entityType: string;
    priority: string;
    deliverableLanguage: string;
    projectDescription: string;

    clientName: string;
    clientContactPerson: string;
    clientEmail: string;
    clientPhone: string;

    projectPrice: number;
    currency: string;


    deadline?: Date;
    clientPosition?: string;
    responsibleAnalyst?: Types.ObjectId;
    assignedAnalysts?: Types.ObjectId[];
    contractNumber?: string;
    annexNumber?: string;

    servicesRequested?: string[];
    contractInfo?: string;
    referenceRequest?: string;
    internalNotes?: string;

    files?: string[];

    createdBy: Types.ObjectId;
    fromRequestId?: Types.ObjectId;

    status: "draft" | "requested" | "approved" | "finished" | "cancelled";
}

const projectRequestSchema = new Schema<IProjectRequest>(
    {
        // REQUIRED FIELDS (common to both models)
        projectName: { type: String, required: false },
        projectSubject: { type: String, required: false },
        reportType: { type: String, required: false },
        entityType: { type: String, required: false },
        priority: { type: String, required: false },
        deliverableLanguage: { type: String, required: false },
        projectDescription: { type: String, required: false },

        clientName: { type: String, required: false },
        clientContactPerson: { type: String, required: false },
        clientEmail: { type: String, required: false },
        clientPhone: { type: String, required: false },

        projectPrice: { type: Number, required: false },
        currency: { type: String, default: "EUR" },

        // OPTIONAL FIELDS
        deadline: { type: Date },
        clientPosition: String,

        responsibleAnalyst: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        assignedAnalysts: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        contractNumber: String,
        annexNumber: String,

        servicesRequested: {
            type: [String],
            default: []
        },

        contractInfo: String,
        referenceRequest: String,
        internalNotes: String,

        files: {
            type: [String],
            default: []
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        fromRequestId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },

        status: {
            type: String,
            enum: ["draft" , "requested" , "approved" , "finished" , "cancelled"],
            default: "requested"
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.__v;
                return ret;
            }
        }
    }
);

const ProjectRequest = model<IProjectRequest>("ProjectRequest", projectRequestSchema);

export default ProjectRequest;
