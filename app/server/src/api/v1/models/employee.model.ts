import { Schema, model, Document } from "mongoose";

export interface IEmployee extends Document {
    name: string;
    jobRole: string;
    hiringDate: Date;

    salaryGross: number;
    bonusMonthly: number;
    bonusProject: number;

    notes?: string;
}

const employeeSchema = new Schema<IEmployee>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        jobRole: {
            type: String,
            required: true,
            trim: true
        },

        hiringDate: {
            type: Date,
            required: true
        },

        salaryGross: {
            type: Number,
            required: true
        },

        bonusMonthly: {
            type: Number,
            default: 0
        },

        bonusProject: {
            type: Number,
            default: 0
        },

        notes: {
            type: String
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

const Employee = model<IEmployee>("Employee", employeeSchema);

export default Employee;
