import { Schema, model, Document, Types } from "mongoose";

export interface IProjectRequest extends Document {
    name: string;
    email: string;
    phone: string;
    contactPerson: string;
    position?: string;

    contractNumber: string;
    contractDone: boolean;

    annexNumber: string;
    annexDone: boolean;

    projectSubject: string;
    additionalInfo?: string;

    entityType: string;
    deadline: Date;

    category: string;
    projectPrice: string;

    priority: "Normal" | "Urgent" | "Confidențial" | "Bench Task";   // 🔥 updated type
    deliverableLanguage: "Romanian" | "English";

    preferredAnalyst?: string;                    // 🔥 was Types.ObjectId
    selectedAnalysts?: Types.ObjectId[];
    wantedServices?: string[];
    referenceRequest?: string;

    projectDescription: string;
    internalNotes?: string;

    files: string[];

    projectRequestedBy: Types.ObjectId;
    projectCreatedBy: Types.ObjectId;
    status: "draft" | "requested" | "approved" | "finished" | "cancelled";
}

const projectRequestSchema = new Schema<IProjectRequest>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },

        contactPerson: { type: String, required: true },
        position: { type: String },

        contractNumber: { type: String },
        contractDone: { type: Boolean, default: false },

        annexNumber: { type: String },
        annexDone: { type: Boolean, default: false },

        projectSubject: { type: String, required: true },
        additionalInfo: { type: String },

        entityType: { type: String, required: true },
        deadline: { type: Date, required: true },

        category: { type: String, required: true },
        projectPrice: { type: String, required: true },

        priority: {
            type: String,
            enum: ["Normal", "Urgent", "Confidențial", "Bench Task"],   // 🔥 "Confidențial" FE se match
            default: "Normal"
        },

        deliverableLanguage: {
            type: String,
            enum: ["Romanian", "English"],
            default: "Romanian",
        },

        // 🔥 ab yeh sirf string hai, FE se "Analist B" direct store ho jayega
        preferredAnalyst: {
            type: String,
            required: false
        },

        // future me agar IDs bhejni ho to FE se ObjectId bhej sakte ho
        selectedAnalysts: [
            { type: Schema.Types.ObjectId, ref: "User", required: false }
        ],

        wantedServices: [{ type: String, default: [] }],

        referenceRequest: { type: String },

        projectDescription: { type: String, required: true },
        internalNotes: { type: String },

        files: [{ type: String, default: [] }],

        projectRequestedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        projectCreatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "requested", "approved", "finished", "cancelled"],
            default: "draft"
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

const ProjectRequest = model<IProjectRequest>("ProjectRequest", projectRequestSchema);

export default ProjectRequest;
