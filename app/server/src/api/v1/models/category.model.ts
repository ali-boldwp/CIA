import {Schema, model, Document, Types} from "mongoose";

export interface ICategory extends Document {
    name: string;

}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
