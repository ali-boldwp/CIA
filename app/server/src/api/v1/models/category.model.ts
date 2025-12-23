import {Schema, model, Document, Types} from "mongoose";

export interface ICategory extends Document {
    name: string;
    status:
        | "active"
        | "suspended";

}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        status : {
            type : String,
            enum: [
                "active",
                "suspended",
            ],
            default: "active",
        },

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

const Category = model<ICategory>("Category", categorySchema);

export default Category;
