import {Schema, model, Document, Types} from "mongoose";

export interface ITaskTemplate extends Document {
    name: string;
    content:string;
    index:number;
    chapter:Types.ObjectId;
    foamFields: Types.ObjectId[];
}

const taskTemplateSchema = new Schema<ITaskTemplate>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type : String,
        },

        index: {
            type: Number,
            default: 0
        },

        chapter: {
            type: Schema.Types.ObjectId,
            ref: "ChapterTemplate",

        },
        foamFields: {
            type: [Schema.Types.ObjectId],
            ref: "FoamFields",
            default: []
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

const TaskTemplate = model<ITaskTemplate>("TaskTemplate", taskTemplateSchema);

export default TaskTemplate;
