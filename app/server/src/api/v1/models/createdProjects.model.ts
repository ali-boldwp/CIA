import { Schema, model, Document, Types } from "mongoose";

export interface ICreatedProject extends Document {
    projectName: string;
    projectSubject: string;
    reportType: string;
    entityType: string;
    deadline: Date;
    priority: string;
    deliverableLanguage: string;
    projectDescription: string;

    responsibleAnalyst?: Types.ObjectId;
    assignedAnalysts?: Types.ObjectId[];

    clientName: string;
    clientContactPerson: string;
    clientPosition?: string;

    clientEmail: string;
    clientPhone: string;

    contractNumber?: string;
    annexNumber?: string;

    servicesRequested?: string[];
    projectPrice: string;
    currency: string;

    contractInfo?: string;
    referenceRequest?: string;
    internalNotes?: string;

    files?: string[];  

    createdBy: Types.ObjectId;
    fromRequestId?: Types.ObjectId;
}

const createdProjectSchema = new Schema<ICreatedProject>(
    {
        projectName: { type: String, required: true },
        projectSubject: { type: String, required: true },
        reportType: { type: String, required: true },
        entityType: { type: String, required: true },
        deadline: { type: Date, required: true },

        priority: { type: String, required: true },
        deliverableLanguage: { type: String, required: true },

        projectDescription: { type: String, required: true },

        responsibleAnalyst: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },

        assignedAnalysts: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: false
            }
        ],

        clientName: { type: String, required: true },
        clientContactPerson: { type: String, required: true },
        clientPosition: { type: String },

        clientEmail: { type: String, required: true },
        clientPhone: { type: String, required: true },

        contractNumber: { type: String },
        annexNumber: { type: String },

        servicesRequested: [{ type: String }],
        projectPrice: { type: String, required: true },
        currency: { type: String, default: "EUR" },

        contractInfo: { type: String },
        referenceRequest: { type: String },
        internalNotes: { type: String },

        files: [{ type: String }],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fromRequestId: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest"
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
);

const CreatedProject = model<ICreatedProject>("CreatedProject", createdProjectSchema);

export default CreatedProject;
