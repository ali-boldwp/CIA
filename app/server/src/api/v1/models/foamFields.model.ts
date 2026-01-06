import {Schema, model, Document, Types} from "mongoose";

export interface IColumn {
    name: string;
    slug: string;
    type: string;
}

export interface IFoamFields extends Document {
    name: string;
    type: string;
    slug: string;
    index: number;
    task: Types.ObjectId;
    columns?: IColumn[];
}

const ColumnSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true },
        type: { type: String, required: true },
    },
    { _id: true }
);

const foamFieldsSchema = new Schema<IFoamFields>(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String },
        slug: { type: String },
        index: { type: Number, default: 0 },
        task: {
            type: Schema.Types.ObjectId,
            ref: "TaskTemplate",
        },
        columns: {
            type: [ColumnSchema],
            default: undefined,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

foamFieldsSchema.pre("save", function (next) {

    // ❌ Non-table → no columns
    if (this.type !== "table") {
        this.columns = undefined;
        return next();
    }

    // ✅ Table field → ensure columns array exists
    if (!this.columns) {
        this.columns = [];
    }

    // 🔐 Duplicate slug protection
    if (this.columns.length) {
        const slugs = this.columns.map(c => c.slug);
        if (new Set(slugs).size !== slugs.length) {
            return next(
                new Error("Duplicate column slug detected")
            );
        }
    }

    next();
});



const FoamFields = model<IFoamFields>("FoamFields", foamFieldsSchema);

export default FoamFields;
