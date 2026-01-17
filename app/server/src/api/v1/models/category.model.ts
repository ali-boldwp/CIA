import {Schema, model, Document, Types} from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    status:
        | "active"
        | "suspended";

    chapters:Types.ObjectId[];
    title: string;
    content: string;
    index:number;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: false,
        },
        chapters: {
            type : [Schema.Types.ObjectId],
            ref : "ChapterTemplate",
            default: [],
        },
        index: {
            type: Number,
            default: 0
        },
        title : {
            type:String,
            required : false,
        },
        content : {
            type : String,
            required : false,
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
