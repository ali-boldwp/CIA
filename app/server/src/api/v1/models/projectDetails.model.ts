import { Schema, model, Document } from "mongoose";

export interface IEmployeeCostItem {
    analyst: string;
    role: string;
    days?: number;
    hours: number;
    hourlyRate: number;
    dayCost?: number;
    total: number;
}

export interface IHumintCostItem {
    date: Date;
    description: string;
    utility: number;
    cash: number;
    other: number;
    baseCost: number;
    taxPercent: number;
    totalWithTaxes: number;
}

export interface IProjectDetails extends Document {
    projectName: string;
    projectSubject: string;
    reportType: string;
    entityType: string;
    priority: string;
    language: string;
    description?: string;
    actions: string[];

    createdAtRequest: Date;
    projectStart: Date;
    deadline: Date;
    status: "In progress" | "Completed" | "Pending" | "On Hold";

    attachments: {
        fileName: string;
        size: string;
        url: string;
    }[];

    responsible: string;
    assignedAnalysts: string[];

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

    employeeCostItems: IEmployeeCostItem[];
    humintCostItems: IHumintCostItem[];

    fixedCosts: number;
    osintCosts: number;
    employeeCosts: number;
    humintCosts: number;
    humintCostTaxes: number;

    totalCosts: number;
    marginAmount: number;
    marginPercent: number;
}

const employeeCostItemSchema = new Schema<IEmployeeCostItem>(
    {
        analyst: String,
        role: String,
        days: Number,
        hours: Number,
        hourlyRate: Number,
        dayCost: Number,
        total: Number
    },
    { _id: false }
);

const humintCostItemSchema = new Schema<IHumintCostItem>(
    {
        date: Date,
        description: String,
        utility: Number,
        cash: Number,
        other: Number,
        baseCost: Number,
        taxPercent: Number,
        totalWithTaxes: Number
    },
    { _id: false }
);

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

        employeeCostItems: [employeeCostItemSchema],
        humintCostItems: [humintCostItemSchema],

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

// AUTO CALC
projectDetailsSchema.pre("save", function (next) {
    const self: any = this;

    self.employeeCosts = (self.employeeCostItems || []).reduce(
        (sum: number, item: IEmployeeCostItem) => sum + (item.total || 0),
        0
    );

    let base = 0;
    let taxes = 0;

    (self.humintCostItems || []).forEach((item: IHumintCostItem) => {
        const b = item.baseCost || 0;
        const t = (item.totalWithTaxes || 0) - b;
        base += b;
        taxes += t;
    });

    self.humintCosts = base;
    self.humintCostTaxes = taxes;

    self.totalCosts =
        (self.fixedCosts || 0) +
        (self.osintCosts || 0) +
        (self.employeeCosts || 0) +
        self.humintCosts +
        self.humintCostTaxes;

    if (self.projectPrice) {
        self.marginAmount = self.projectPrice - self.totalCosts;
        self.marginPercent = Number(
            ((self.marginAmount / self.projectPrice) * 100).toFixed(2)
        );
    }

    next();
});

const ProjectDetails = model<IProjectDetails>("ProjectDetails", projectDetailsSchema);
export default ProjectDetails;
