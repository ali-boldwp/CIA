import { Schema, model, Document, Types } from "mongoose";

export interface IRequested extends Document {

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
    surname: string;


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

    fromRequestId?: Types.ObjectId;

    status: "draft" | "requested" | "approved" | "finished" | "cancelled";
}

const requestSchema = new Schema<IRequested>(
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
        surname: {
            type:String,
        },

        contractInfo: String,
        referenceRequest: String,
        internalNotes: String,

        files: {
            type: [String],
            default: []
        },


        fromRequestId: {
            type: Schema.Types.ObjectId,
            ref: "User"
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

const Requested = model<IRequested>("Requested", requestSchema);

export default Requested;
