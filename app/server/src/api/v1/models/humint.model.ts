import { Schema, model, Document } from "mongoose";

export interface IHumint extends Document {
    name: string;
    status: "Pending" | "Processing" | "Approved" | "Completed";
}

const humintSchema = new Schema<IHumint>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Approved", "Completed"],
            default: "Pending",
            required: true
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

const Humint = model<IHumint>("Humint", humintSchema);

export default Humint;
