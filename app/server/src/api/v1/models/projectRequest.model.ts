import { Schema, model, Document, Types } from "mongoose";
import {boolean} from "joi";

export interface IProjectRequest extends Document {

    projectName: string;
    projectSubject: string;
    reportType: string;
    entityType: string;
    priority: string;
    deliverableLanguage: string[];
    projectDescription: string;

    clientName: string;
    clientContactPerson: string;
    clientEmail: string;
    clientPhone: string;

    projectPrice: number;
    fixPrice:number;
    tesaPrice:number;
    osintPrice:number;
    tehnicaPrice:number;
    otherPrice:number;


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

    surname?: string,
    humintId : Types.ObjectId;
    groupChatId: Types.ObjectId;
    isEditable?:boolean;

    fromRequestId?: Types.ObjectId;
    createdBy?: Types.ObjectId;

    status: "draft" | "requested" | "approved" | "finished" | "cancelled" | "revision" | "observation";
}

const projectRequestSchema = new Schema<IProjectRequest>(
    {
        // REQUIRED FIELDS (common to both models)
        projectName: { type: String, required: false },
        projectSubject: { type: String, required: false },
        reportType: { type: String, required: false },
        entityType: { type: String, required: false },
        priority: { type: String, required: false },
        deliverableLanguage: {
            type: [String],
            default: []
        },
        projectDescription: { type: String, required: false },

        clientName: { type: String, required: false },
        clientContactPerson: { type: String, required: false },
        clientEmail: { type: String, required: false },
        clientPhone: { type: String, required: false },

        projectPrice: { type: Number, required: false , select : false , default:0 },
        fixPrice:{ type: Number, required: false , select : false , default:0},
        tesaPrice:{ type: Number, required: false , select : false , default:0},
        osintPrice:{ type: Number, required: false , select : false , default:0},
        tehnicaPrice:{ type: Number, required: false , select : false , default:0},
        otherPrice:{ type: Number, required: false , select : false , default:0 },

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

        surname: {
          type: String,
        },

        groupChatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            default: null
        },

        isEditable : {
            type: Boolean,
            default:true
        },


        humintId: {
            type: Schema.Types.ObjectId,
            ref: "Humint",
        },

        fromRequestId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        status: {
            type: String,
            enum: ["draft" , "requested" , "approved" , "finished" , "cancelled" , "revision" , "observation"],
            default: "requested"
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },

    }
);

projectRequestSchema.virtual("totalCheltuieli").get(function () {
    return (
        (this.fixPrice || 0) +
        (this.tesaPrice || 0) +
        (this.osintPrice || 0) +
        (this.tehnicaPrice || 0) +
        (this.otherPrice || 0)
    );
});


projectRequestSchema.virtual("profit").get(function () {
    return Number(
        ((this.projectPrice || 0) - (this as any).totalCheltuieli).toFixed(2)
    );
});


projectRequestSchema.virtual("profitPercentage").get(function () {
    const price = this.projectPrice || 0;
    if (price === 0) return 0;

    return Number((((this as any).profit / price) * 100).toFixed(1));
});

const ProjectRequest = model<IProjectRequest>("ProjectRequest", projectRequestSchema);

export default ProjectRequest;
