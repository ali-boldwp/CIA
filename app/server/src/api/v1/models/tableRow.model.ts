import { Schema, model, Types } from "mongoose";

export interface ITableRow {
    field: Types.ObjectId;   // FoamField (table)
    task: Types.ObjectId;    // Task (new47)
    data: Record<string, any>; // columnSlug → value
}

const tableRowSchema = new Schema<ITableRow>(
    {
        field: {
            type: Schema.Types.ObjectId,
            ref: "FoamFields",
            required: true,
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "TaskTemplate",
            required: true,
        },
        data: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<ITableRow>("TableRow", tableRowSchema);
