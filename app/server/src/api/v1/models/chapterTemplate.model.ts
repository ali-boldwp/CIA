import {Schema, model, Document, Types} from "mongoose";

export interface IChapterTemplate extends Document {
    name: string;
    content:string;
    category:Types.ObjectId;
    tasks: Types.ObjectId[];
}

const chapterTemplateSchema = new Schema<IChapterTemplate>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type : String,
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",

        },
        tasks : {
            type : [Schema.Types.ObjectId],
            ref : "TaskTemplate",
            default: []
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

const ChapterTemplate = model<IChapterTemplate>("ChapterTemplate", chapterTemplateSchema);

export default ChapterTemplate;
