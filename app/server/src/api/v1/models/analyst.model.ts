import { Schema, model, Document } from "mongoose";

export interface IAnalyst extends Document {
    name: string;
    analystRole: "Head of Investigations" | "Intelligence Analyst" | "HUMINT Detective";
    monthlySalary: number;
    hoursPerMonth: number;
    hoursPerDay: number;
    bonus?: number;
    hiringDate: Date;
    notes?: string;
    costPerHour: number;
    costPerDay: number;
}

const analystSchema = new Schema<IAnalyst>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        analystRole: {
            type: String,
            enum: [
                "Head of Investigations",
                "Intelligence Analyst",
                "HUMINT Detective"
            ],
            default: "Intelligence Analyst",
            required: true
        },

        monthlySalary: {
            type: Number,
            required: true
        },

        hoursPerMonth: {
            type: Number,
            required: true
        },

        hoursPerDay: {
            type: Number,
            required: true
        },

        bonus: {
            type: Number,
            default: 0
        },

        hiringDate: {
            type: Date,
            required: true
        },

        notes: {
            type: String,
            trim: true
        },

        costPerHour: Number,
        costPerDay: Number
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

analystSchema.pre("save", function (next) {
    if (this.monthlySalary && this.hoursPerMonth) {
        this.costPerHour = this.monthlySalary / this.hoursPerMonth;
    }

    if (this.costPerHour && this.hoursPerDay) {
        this.costPerDay = this.costPerHour * this.hoursPerDay;
    }

    next();
});

const Analyst = model<IAnalyst>("Analyst", analystSchema);
export default Analyst;
