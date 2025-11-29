import { Schema, model, Document } from "mongoose";

export interface IProjectDetails extends Document {
    // BASIC PROJECT DETAILS
    projectName: string;
    projectSubject: string;
    reportType: string;
    entityType: string;
    priority: string;
    language: string;
    description?: string;
    actions: string[];

    // TIMELINE
    createdAtRequest: Date;
    projectStart: Date;
    deadline: Date;
    status: "In progress" | "Completed" | "Pending" | "On Hold";

    // ATTACHMENTS
    attachments: {
        fileName: string;
        size: string;
        url: string;
    }[];

    // TEAM
    responsible: string;
    assignedAnalysts: string[];

    // CLIENT & CONTRACT
    clientName: string;
    contactPerson: string;
    contactRole?: string;
    contactEmail: string;
    contactPhone: string;

    contractNumber: string;
    annexNumber?: string;

    projectPrice: number;
    currency: string;

    confidentialContractInfo?: string;
    supplementaryRequest?: string;
    internalNotes?: string;

    // FINANCIAL COSTS
    fixedCosts: number;
    osintCosts: number;
    employeeCosts: number;
    humintCosts: number;
    humintCostTaxes: number;

    totalCosts: number;

    // MARGIN
    marginAmount: number;
    marginPercent: number;
}

const projectDetailsSchema = new Schema<IProjectDetails>(
    {
        projectName: { type: String, required: true },
        projectSubject: { type: String, required: true },
        reportType: { type: String, required: true },
        entityType: { type: String, required: true },
        priority: { type: String, default: "Normal" },
        language: { type: String, default: "Română" },
        description: String,
        actions: [{ type: String }],

        createdAtRequest: Date,
        projectStart: Date,
        deadline: Date,
        status: {
            type: String,
            enum: ["In progress", "Completed", "Pending", "On Hold"],
            default: "In progress"
        },

        attachments: [
            {
                fileName: String,
                size: String,
                url: String
            }
        ],

        responsible: { type: String, required: true },
        assignedAnalysts: [{ type: String }],

        clientName: { type: String, required: true },
        contactPerson: { type: String, required: true },
        contactRole: String,

        contactEmail: { type: String, required: true },
        contactPhone: { type: String, required: true },

        contractNumber: { type: String, required: true },
        annexNumber: String,

        projectPrice: { type: Number, required: true },
        currency: { type: String, default: "EUR" },

        confidentialContractInfo: String,
        supplementaryRequest: String,
        internalNotes: String,

        fixedCosts: { type: Number, default: 0 },
        osintCosts: { type: Number, default: 0 },
        employeeCosts: { type: Number, default: 0 },
        humintCosts: { type: Number, default: 0 },
        humintCostTaxes: { type: Number, default: 0 },

        totalCosts: { type: Number, default: 0 },

        marginAmount: { type: Number, default: 0 },
        marginPercent: { type: Number, default: 0 }
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

// AUTO CALCULATION
projectDetailsSchema.pre("save", function (next) {
    const humintTotal = (this.humintCosts || 0) + (this.humintCostTaxes || 0);

    this.totalCosts =
        (this.fixedCosts || 0) +
        (this.osintCosts || 0) +
        (this.employeeCosts || 0) +
        humintTotal;

    if (this.projectPrice) {
        this.marginAmount = this.projectPrice - this.totalCosts;
        this.marginPercent = Number(
            ((this.marginAmount / this.projectPrice) * 100).toFixed(2)
        );
    }

    next();
});

const ProjectDetails = model<IProjectDetails>("ProjectDetails", projectDetailsSchema);
export default ProjectDetails;
