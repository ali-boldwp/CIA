import { Schema, model, Document } from "mongoose";

export interface IAnalystExpanse extends Document {
    analystId?: Schema.Types.ObjectId;
    projectId: Schema.Types.ObjectId;
    totalSecands?: number;
}

const analystExpanseSchema = new Schema<IAnalystExpanse>(
    {
        analystId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        projectId: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest",
            default: null,
        },

        totalSecands: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ⭐ Virtual Field: Convert seconds → hours
analystExpanseSchema.virtual("totalHours").get(function () {
    if (!this.totalSecands) return 0;
    return this.totalSecands / 3600; // convert seconds to hours
});

const AnalystExpanse = model<IAnalystExpanse>("AnalystExpanse", analystExpanseSchema);
export default AnalystExpanse;
