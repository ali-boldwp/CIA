import { Schema, model, Document } from "mongoose";

export interface IHumintExpanse extends Document {
    project : Schema.Types.ObjectId;
    date: Date;
    description: string;
    utility: number;     
    cost: number;
    currency: string;
    taxPercent: number;
    taxIncludedCost: number;
    total: number;
    createdBy: Schema.Types.ObjectId;
}

const humintSchema = new Schema<IHumintExpanse>(
    {

        project: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectRequest',
            required: true
        },
        date: { type: Date, required: true },
        description: { type: String, required: true },
        utility: { type: Number, min: 1, max: 5, required: true },

        cost: { type: Number, required: true },
        currency: { type: String, enum: ["EUR", "RON", "USD"], default: "EUR" },

        taxPercent: { type: Number, default: 0 },
        taxIncludedCost: { type: Number, required: true },

        total: { type: Number, required: true },

        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default model<IHumintExpanse>("HumintExpanse", humintSchema);
